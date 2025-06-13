const { connection, createConnection } = require("../database");
const { requiredFieldHandler } = require("../helper/requiredFieldHandler");
const { statusHandeler } = require("../helper/statusHandler");

const createVendor = async (req, res) => {
  const { name, address, storeName, products } = req.body;
  const requiredFields = { name, address, storeName };

  requiredFieldHandler(res, requiredFields);

  try {
    const connect = await createConnection();

    const [rows] = await connect.execute(
      "SELECT * FROM vendor WHERE name = ? AND address = ?",
      [name, address]
    );
    if (rows.length > 0) {
      return statusHandeler(res, 400, false, "Vendor already exists", "vendor");
    }

    await connect.execute(
      "INSERT INTO vendor (name, address, storeName, products, createdBy) VALUES (?, ?, ?, ?, ?)",
      [name, address, storeName, products, req.user.id]
    );

    await connect.end();

    return statusHandeler(res, 201, true, "Vendor created successfully");
  } catch (error) {
    console.error("Error:", error);
    return statusHandeler(res, 500, false, "Internal Server error");
  }
};

const getVendor = async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM vendor");
    const data = rows;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error retrieving vendor:", err);
    statusHandeler(res, 500, false, "Error retrieving vendor");
  }
};

const deleteVendor = async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM vendor WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        messege: `Vendor not found`,
      });
    }
    statusHandeler(res, 200, true, `Vendor deleted successfully`);
  } catch (err) {
    statusHandeler(res, 500, false, "Error deleting vendor");
  }
};

const updateVendor = async (req, res) => {
  const id = req.params.id;
  const { name, address, products, storeName } = req.body;
  const query =
    "UPDATE vendor SET name = ?, address = ?, products = ?, storeName = ?, createdBy = ? WHERE id = ?";

  try {
    const [rows] = await connection.query("SELECT * FROM vendor WHERE id = ?", [
      id,
    ]);
    const data = rows?.[0];
    const [result] = await connection.execute(query, [
      name ?? data?.name,
      address ?? data?.address,
      products ?? data?.products,
      storeName ?? data?.storeName,
      req.user.id,
      id,
    ]);

    if (result.affectedRows === 0) {
      return statusHandeler(res, 404, false, "Vendor not found");
    }

    statusHandeler(
      res,
      200,
      true,
      `${name ?? data?.name} vendor updated successfully`
    );
  } catch (err) {
    statusHandeler(res, 500, false, "Error updating vendor");
  }
};

module.exports = {
  createVendor,
  getVendor,
  updateVendor,
  deleteVendor,
};
