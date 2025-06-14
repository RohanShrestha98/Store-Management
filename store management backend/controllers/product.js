const { connection, createConnection } = require("../database");
const { nullCheckHandler } = require("../helper/nullCheckHandler");
const { requiredFieldHandler } = require("../helper/requiredFieldHandler");
const { statusHandeler } = require("../helper/statusHandler");

const createProduct = async (req, res) => {
  const {
    name,
    costPrice,
    sellingPrice,
    quantity,
    discountPercentage,
    offer,
    vendor,
    description,
    categoryId,
    brand,
    storeNumber,
    barCode,
    specification,
    images,
  } = req.body;

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
    images,
  };
  const requiredError = requiredFieldHandler(res, requiredFields);
  if (requiredError) return;

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
      "INSERT INTO product ( name, costPrice, sellingPrice, quantity, discountPercentage, offer, vendor,description, categoryId, brand, storeNumber, barCode, specification, images, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        costPrice,
        sellingPrice,
        quantity,
        discountPercentage,
        offer,
        vendor,
        description,
        categoryId,
        brand,
        storeNumber,
        barCode,
        specification,
        images,
        req.user.id,
      ]
    );

    await connect.end();

    return statusHandeler(res, 201, true, "Product created successfull");
  } catch (error) {
    console.error("Error:", error);
    return statusHandeler(res, 500, false, "Internal Server error");
  }
};

const getProduct = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM product where createdBy = ?",
      [req?.user?.id]
    );
    const data = rows;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error retrieving store:", err);
    statusHandeler(res, 500, false, "Error retrieving category");
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
  createProduct,
  getProduct,
  updateCategory,
  deleteProduct,
};
