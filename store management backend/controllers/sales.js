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
      [sales, req?.user?.storeId ?? 3340, req.user?.firstName]
    );

    await connect.end();

    return statusHandeler(res, 201, true, "Product sold successfully");
  } catch (error) {
    console.error("Error:", error);
    return statusHandeler(res, 500, false, "Internal Server error");
  }
};

const getSales = async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT * FROM sales ${
        req?.user?.storeId ? "WHERE storeNumber = ?" : ""
      } ORDER BY createdAt DESC`,
      [req?.user?.storeId]
    );

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
      const key = `${item?.barCode}-${item?.createdBy}-${item?.createdAt}-${item?.storeNumber}`;

      if (mergedMap?.has(key)) {
        const existing = mergedMap?.get(key);
        mergedMap?.set(key, {
          ...existing,
          quantity: existing?.quantity + 1,
          total: existing?.total + item?.sellingPrice,
        });
      } else {
        mergedMap?.set(key, { ...item });
      }
    });

    const mergedSales = Array.from(mergedMap.values());

    return res.status(200).json({ success: true, data: mergedSales });
  } catch (err) {
    console.error("Error retrieving sales:", err);
    statusHandeler(res, 500, false, "Error retrieving sales");
  }
};

const getProductForUser = async (req, res) => {
  const storeNumber = req.params.id;

  try {
    const [rows] = await connection.query(
      "SELECT id, images, offer, name, categoryId, createdBy, vendor, barCode, quantity, sellingPrice FROM product where storeNumber = ? ORDER BY createdAt DESC ",
      [storeNumber]
    );
    const data = rows;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error retrieving product:", err);
    statusHandeler(res, 500, false, "Error retrieving product");
  }
};

const getProductByBarcode = async (req, res) => {
  const { barCode, storeNumber, addProduct, limit = 1 } = req.query;

  const isAddProduct = addProduct === "true";

  try {
    const [rows] = await connection.query(
      `SELECT ${
        isAddProduct
          ? "*"
          : "id, images, offer, name, categoryId, createdBy, vendor, barCode, quantity, sellingPrice"
      } FROM product 
       WHERE barCode = ? AND storeNumber = ? 
       ORDER BY createdAt DESC 
       LIMIT ${limit}`,
      [barCode, storeNumber]
    );

    return res.status(200).json({ success: true, data: rows || null });
  } catch (err) {
    console.error("Error retrieving product:", err);
    statusHandeler(res, 400, false, err);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM product WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        messege: `Product not found`,
      });
    }
    statusHandeler(
      res,
      200,
      true,
      `Category with ID ${id} deleted successfully`
    );
  } catch (err) {
    statusHandeler(res, 500, false, "Error deleting Category");
  }
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name, brands, tags } = req.body;
  const query =
    "UPDATE category SET name = ?, brands = ?, tags = ? WHERE id = ?";

  try {
    const [rows] = await connection.query(
      "SELECT * FROM category WHERE id = ?",
      [id]
    );
    const data = rows?.[0];
    const [result] = await connection.execute(query, [
      name ?? data?.name,
      tags ?? data?.tags,
      brands ?? data?.brands,
      id,
    ]);

    if (result.affectedRows === 0) {
      return statusHandeler(res, 404, false, "Category not found");
    }

    statusHandeler(
      res,
      200,
      true,
      `${name ?? data?.name} updated successfully`
    );
  } catch (err) {
    statusHandeler(res, 500, false, "Error updating category");
  }
};

module.exports = {
  getProductForUser,
  getProductByBarcode,
  createSales,
  getSales,
  updateCategory,
  deleteProduct,
};
