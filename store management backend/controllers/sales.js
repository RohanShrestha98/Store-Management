const { connection, createConnection } = require("../database");
const { requiredFieldHandler } = require("../helper/requiredFieldHandler");
const { statusHandeler } = require("../helper/statusHandler");

const createSales = async (req, res) => {
  const { sales } = req.body;

  const requiredFields = {
    sales,
  };
  if (requiredFieldHandler(res, requiredFields)) return;

  try {
    const connect = await createConnection();

    await connect.execute(
      "INSERT INTO sales (sales, storeNumber, createdBy) VALUES (?, ?, ?)",
      [sales, req?.user?.storeNumber ?? 3340, req.user?.firstName]
    );

    await connect.end();

    return statusHandeler(res, 201, true, "Product sold successfully");
  } catch (error) {
    console.error("Error:", error);
    return statusHandeler(res, 500, false, "Internal Server error");
  }
};

const getSales = async (req, res) => {
  const { page = 1, pageSize = 10, date } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);
  const storeNumber = req?.user?.storeNumber;
  const isAdmin = req?.user?.role !== "Staff";

  const targetDate = date || new Date().toISOString().split("T")[0];

  try {
    let whereClause = "";
    let countParams = [];
    let salesParams = [];

    if (isAdmin) {
      whereClause = "";
      countParams = [];
      salesParams = [limit, offset];
    } else if (storeNumber) {
      whereClause = "WHERE storeNumber = ? AND DATE(createdAt) = ?";
      countParams = [storeNumber, targetDate];
      salesParams = [storeNumber, targetDate, limit, offset];
    } else {
      whereClause = "WHERE DATE(createdAt) = ?";
      countParams = [targetDate];
      salesParams = [targetDate, limit, offset];
    }

    const countQuery = `SELECT COUNT(*) as total FROM sales ${whereClause}`;
    const [countRows] = await connection.query(countQuery, countParams);
    const total = countRows[0]?.total || 0;

    const salesQuery = `
      SELECT * FROM sales 
      ${whereClause}
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await connection.query(salesQuery, salesParams);

    const flatSales = rows?.flatMap((record) => {
      const { createdBy, createdAt, storeNumber, sales } = record;
      const parsedSales = typeof sales === "string" ? JSON.parse(sales) : sales;

      return parsedSales?.map((sale) => ({
        ...sale,
        createdBy,
        createdAt,
        storeNumber,
        quantity: 1,
        sellingPrice: parseFloat(sale?.sellingPrice),
        total: parseFloat(sale?.sellingPrice),
      }));
    });

    const mergedMap = new Map();
    flatSales?.forEach((item) => {
      const key = `${item?.barCode}-${item?.createdBy}-${item?.createdAt}-${item?.storeNumber}-${item?.sellingPrice}`;

      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key);
        mergedMap.set(key, {
          ...existing,
          quantity: existing.quantity + 1,
          total: existing.total + item.sellingPrice,
        });
      } else {
        mergedMap.set(key, { ...item });
      }
    });

    const mergedSales = Array.from(mergedMap.values());

    return res.status(200).json({
      success: true,
      data: mergedSales,
      pagenation: {
        total,
        page: parseInt(page),
        pageSize: limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    console.error("Error retrieving sales:", err);
    statusHandeler(res, 500, false, "Error retrieving sales");
  }
};

const deleteStore = async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM store WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        messege: `Store not found`,
      });
    }
    statusHandeler(res, 200, true, `Storedeleted successfully`);
  } catch (err) {
    statusHandeler(res, 500, false, "Error deleting store");
  }
};

module.exports = {
  createSales,
  getSales,
  deleteStore,
};
