const bcrypt = require("bcrypt");
const { connection, createConnection } = require("../database");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, address } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !address ||
    !email ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connect = await createConnection();

    const [rows] = await connect.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const [rowsPhone] = await connect.execute(
      "SELECT * FROM users WHERE phoneNumber = ?",
      [phoneNumber]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (rowsPhone.length > 0) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    await connect.execute(
      "INSERT INTO users (firstName, lastName, email, password, phoneNumber, address) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, phoneNumber, address]
    );

    await connect.end();

    return res
      .status(201)
      .json({ success: true, message: "Register successfull" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    staffId,
    payPerHour,
    isVerified,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !address ||
    !email ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connect = await createConnection();

    const [rows] = await connect.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const [rowsPhone] = await connect.execute(
      "SELECT * FROM users WHERE phoneNumber = ?",
      [phoneNumber]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (rowsPhone.length > 0) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    await connect.execute(
      "INSERT INTO users (firstName, lastName, email, password, phoneNumber, address, staffId, payPerHour, isVerified) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?)",
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        phoneNumber,
        address,
        staffId,
        payPerHour,
        isVerified,
      ]
    );

    await connect.end();

    return res
      .status(201)
      .json({ success: true, message: "Staff added successfull" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email, and password are required" });
  }
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const userData = rows?.[0];
    if (email !== userData?.email) {
      return res
        .status(400)
        .send({ success: false, message: "Email not found" });
    }
    const comparePassword = await bcrypt.compareSync(
      password,
      userData?.password
    );
    if (comparePassword) {
      const data = {
        id: userData?.id,
        email: userData?.email,
        username: userData?.username,
      };
      const accessToken = jwt.sign(
        {
          user: data,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3000s" }
      );
      return res.status(200).json({
        success: true,
        data: { ...data, access: accessToken },
      });
    } else {
      return res
        .status(500)
        .send({ success: false, message: "Incorrect password" });
    }
  } catch (err) {
    console.error("Failed to login", err);
    return res.status(500).send({
      success: true,
      messege: "Failed to login",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT id, firstName, lastName, staffId, email, phoneNumber, address, storeId, payPerHour, days, shift FROM users"
    );
    const data = rows;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error retrieving users:", err);
    return res.status(500).send({
      success: true,
      messege: `Error retriving users`,
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [userId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    return res.status(200).send({
      success: true,
      messege: `User with ID ${userId} deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting data:", err);
    return res.status(500).send({
      success: true,
      messege: `Error deleting user`,
    });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    firstName,
    lastName,
    staffId,
    email,
    phoneNumber,
    address,
    payPerHour,
    shift,
    days,
    storeId,
    isVerified,
  } = req.body;
  const query =
    "UPDATE users SET firstName = ?, lastName = ?, staffId = ?, email = ?, phoneNumber = ?, address = ?, payPerHour = ?, shift = ?, days = ?, storeId = ?  WHERE id = ?";

  try {
    const [rows] = await connection.execute(
      "SELECT email, phoneNumber, staffId FROM users WHERE id = ?",
      [userId]
    );
    const userData = rows?.[0];
    const [result] = await connection.execute(query, [
      firstName,
      lastName,
      staffId ?? userData?.staffId,
      email ?? userData?.email,
      phoneNumber ?? userData?.phoneNumber,
      isVerified,
      address,
      payPerHour,
      shift,
      days,
      storeId,
      userId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }
    return res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating data:", err);
    return res.status(500).send("Error updating user");
  }
};

module.exports = {
  signUp,
  login,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
