const multer = require("multer");
const { connection, createConnection } = require("../database");
const { statusHandeler } = require("../helper/statusHandler");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.name); // Keep original filename
  },
});

const upload = multer({ storage: storage });

const uploadDocument = upload.single("file");

const createCategory = async (req, res) => {
  const { name, tags, brands } = req.body;

  if (!name || !tags) {
    return statusHandeler(res, 400, false, "All fields are required");
  }

  try {
    const connect = await createConnection();

    const [rows] = await connect.execute(
      "SELECT * FROM category WHERE name = ?",
      [name]
    );
    if (rows.length > 0) {
      return statusHandeler(res, 400, false, "Category name already exists");
    }
    await connect.execute(
      "INSERT INTO category ( name, tags, brands) VALUES (?, ?, ?)",
      [name, tags, brands]
    );

    await connect.end();

    return statusHandeler(res, 201, true, "Category created successfully");
  } catch (error) {
    console.error("Error:", error);
    return statusHandeler(res, 500, false, "Internal Server error");
  }
};

const getCategory = async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM category");
    const data = rows;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error retrieving store:", err);
    statusHandeler(res, 500, false, "Error retrieving category");
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM category WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        messege: `Category not found`,
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
  createCategory,
  uploadDocument,
  getCategory,
  updateCategory,
  deleteCategory,
};
