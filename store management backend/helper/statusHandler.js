const statusHandeler = (res, statusCode, success, messege, key) => {
  return res
    .status(statusCode)
    .json({ success: success, [key ?? "messege"]: messege });
};

module.exports = {
  statusHandeler,
};
