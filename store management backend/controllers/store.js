const { connection, createConnection } = require("../database");
const { requiredFieldHandler } = require("../helper/requiredFieldHandler");
const { statusHandeler } = require("../helper/statusHandler");

const createStore = async (req, res) => {
  const { name, address, storeNumber, open, close } = req.body;
  const requiredFields = { name, address, storeNumber, open, close };

  requiredFieldHandler(res, requiredFields);

  try {
    const connect = await createConnection();

    const [rows] = await connect.execute(
      "SELECT * FROM store WHERE storeNumber = ?",
      [storeNumber]
    );
    if (rows.length > 0) {
      return statusHandeler(res, 400, false, "Store number already exists");
    }

    await connect.execute(
      "INSERT INTO store (name, address, storeNumber, open, close) VALUES (?, ?, ?, ?, ?)",
      [name, address, storeNumber, open, close]
    );

    await connect.end();

    return statusHandeler(res, 201, true, "Store created successfully");
  } catch (error) {
    console.error("Error:", error);
    return statusHandeler(res, 500, false, "Internal Server error");
  }
};

const getStore = async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM store");
    const data = rows;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error retrieving store:", err);
    statusHandeler(res, 500, false, "Error retrieving store");
  }
};

const deleteStore = async (req, res) => {
  const storeId = req.params.id;
  const query = "DELETE FROM store WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [storeId]);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        messege: `Store not found`,
      });
    }
    statusHandeler(
      res,
      200,
      true,
      `Store with ID ${storeId} deleted successfully`
    );
  } catch (err) {
    statusHandeler(res, 500, false, "Error deleting Store");
  }
};

const updateStore = async (req, res) => {
  const storeId = req.params.id;
  const { name, address, storeNumber, open, close } = req.body;
  const query =
    "UPDATE store SET name = ?, address = ?, storeNumber = ?, open = ?, close = ? WHERE id = ?";

  try {
    const [rows] = await connection.query("SELECT * FROM store WHERE id = ?", [
      storeId,
    ]);
    const storeData = rows?.[0];
    const [result] = await connection.execute(query, [
      name ?? storeData?.name,
      address ?? storeData?.address,
      storeNumber ?? storeData?.storeNumber,
      open ?? storeData?.open,
      close ?? storeData?.close,
      storeId,
    ]);

    if (result.affectedRows === 0) {
      return statusHandeler(res, 404, false, "Store not found");
    }

    statusHandeler(
      res,
      200,
      true,
      `${name ?? storeData?.name} store updated successfully`
    );
  } catch (err) {
    statusHandeler(res, 500, false, "Error updating store");
  }
};

module.exports = {
  createStore,
  getStore,
  updateStore,
  deleteStore,
};
