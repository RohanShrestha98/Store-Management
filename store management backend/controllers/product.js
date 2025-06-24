const { connection, createConnection } = require("../database");
const { nullCheckHandler } = require("../helper/nullCheckHandler");
const { requiredFieldHandler } = require("../helper/requiredFieldHandler");
const { statusHandeler } = require("../helper/statusHandler");
const { getSales } = require("./sales");

const createProduct = async (req, res) => {
  const {
    name,
    costPrice,
    sellingPrice,
    quantity,
    tax,
    offer,
    vendor,
    description,
    categoryId,
    brand,
    storeNumber,
    barCode,
    specification,
  } = req.body;

  const uploadedFiles = req.files || [];
  const images = uploadedFiles.map((file) => {
    return `http://localhost:3001/uploads/${encodeURIComponent(file.filename)}`;
  });

  const requiredFields = {
    name,
    costPrice,
    sellingPrice,
    quantity,
    vendor,
    description,
    categoryId,
    storeNumber,
    barCode,
    specification,
  };
  requiredFieldHandler(res, requiredFields);

  const categoryError = await nullCheckHandler(
    res,
    "category",
    "id",
    categoryId
  );
  if (categoryError)
    return statusHandeler(res, 400, false, `Category not found`);

  const storeError = await nullCheckHandler(
    res,
    "store",
    "storeNumber",
    storeNumber
  );
  if (storeError) return statusHandeler(res, 400, false, `Store not found`);

  try {
    const connect = await createConnection();

    await connect.execute(
      "INSERT INTO product (name, costPrice, sellingPrice, quantity, tax, offer, vendor, description, categoryId, brand, storeNumber, barCode, specification, images, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        costPrice,
        sellingPrice,
        quantity,
        tax ?? 0,
        offer ?? 0,
        vendor,
        description,
        categoryId,
        brand ?? "No brand",
        storeNumber,
        barCode,
        specification,
        JSON.stringify(images),
        req.user?.id,
      ]
    );

    await connect.end();

    return statusHandeler(res, 201, true, "Product created successfully");
  } catch (error) {
    console.error("Error:", error);
    return statusHandeler(res, 500, false, "Internal Server error");
  }
};

const getProduct = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM product where createdBy = ? ORDER BY createdAt DESC ",
      [req?.user?.id]
    );
    const data = rows;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error retrieving product:", err);
    statusHandeler(res, 500, false, "Error retrieving product");
  }
};

const getProductForUser = async (req, res) => {
  const storeNumber = req.params.id;

  const [salesRows] = await connection.query(
    "SELECT * FROM sales WHERE storeNumber = ? ORDER BY createdAt DESC",
    [storeNumber]
  );

  const flatSales = salesRows?.flatMap((record) => {
    const { createdBy, createdAt, storeNumber, sales } = record;
    const parsedSales = typeof sales === "string" ? JSON.parse(sales) : sales;

    return parsedSales?.map((sale) => ({
      ...sale,
      createdBy,
      createdAt,
      storeNumber,
      quantity: 1,
    }));
  });

  const mergedMap = new Map();

  flatSales?.forEach((item) => {
    const key = `${item?.barCode}-${item?.storeNumber}`;

    if (mergedMap.has(key)) {
      const existing = mergedMap?.get(key);
      mergedMap?.set(key, {
        ...existing,
        quantity: existing?.quantity + 1,
      });
    } else {
      mergedMap.set(key, { ...item });
    }
  });

  const mergedSales = Array.from(mergedMap.values());

  try {
    const [productRows] = await connection.query(
      "SELECT id, images, offer, name, categoryId, createdBy, vendor, barCode, quantity, sellingPrice FROM product WHERE storeNumber = ? ORDER BY createdAt DESC",
      [storeNumber]
    );

    const updatedProducts = productRows.map((product) => {
      const saleMatch = mergedSales?.find(
        (sale) =>
          sale?.barCode === product?.barCode &&
          sale?.storeNumber === storeNumber
      );

      const adjustedQuantity = product?.quantity - (saleMatch?.quantity || 0);

      return {
        ...product,
        quantity: adjustedQuantity < 0 ? 0 : adjustedQuantity,
      };
    });
    const filteredProducts = updatedProducts.filter(
      (item) => item.quantity > 0
    );

    return res.status(200).json({ success: true, data: filteredProducts });
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
  createProduct,
  getProduct,
  updateCategory,
  deleteProduct,
};
