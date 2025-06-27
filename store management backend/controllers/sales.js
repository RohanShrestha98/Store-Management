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
  const {
    page = 1,
    pageSize = 10,
    date,
    storeNumber,
    searchText = "",
  } = req.query;

  const limit = parseInt(pageSize);
  const currentPage = parseInt(page);
  const offset = (currentPage - 1) * limit;
  const isAdmin = req?.user?.role !== "Staff";

  const targetDate = date || new Date().toISOString().split("T")[0];

  try {
    let whereClause = "";
    let salesParams = [];
    if (isAdmin && storeNumber) {
      whereClause = "WHERE storeNumber = ? ";
      salesParams = [storeNumber];
    } else if (isAdmin) {
      whereClause = "";
      salesParams = [];
    } else if (storeNumber) {
      whereClause = "WHERE storeNumber = ? AND DATE(createdAt) = ?";
      salesParams = [storeNumber, targetDate];
    } else {
      whereClause = "WHERE storeNumber = ? AND DATE(createdAt) = ?";
      salesParams = [req?.user?.storeNumber, targetDate];
    }

    const salesQuery = `
      SELECT * FROM sales 
      ${whereClause}
      ORDER BY createdAt DESC
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

    const filteredSales = searchText
      ? flatSales.filter(
          (item) =>
            item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.barCode?.toLowerCase().includes(searchText.toLowerCase())
        )
      : flatSales;

    // Merge similar sales
    const mergedMap = new Map();
    filteredSales?.forEach((item) => {
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

    // Apply pagination on the final merged list
    const total = mergedSales.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedData = mergedSales.slice(offset, offset + limit);

    return res.status(200).json({
      success: true,
      data: paginatedData,
      pagenation: {
        total,
        page: currentPage,
        pageSize: limit,
        totalPages,
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
