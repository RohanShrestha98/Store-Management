const express = require("express");
const router = express.Router();
const categoryControler = require("../controllers/category");
const createUserValidateToken = require("../middleware/createUserValidateToken");

router.use(createUserValidateToken);
router.get("/", categoryControler.getCategory);
router.post(
  "/create",
  //   categoryControler.uploadDocument,
  categoryControler.createCategory
);
router.patch("/update/:id", categoryControler.updateCategory);
router.delete("/delete/:id", categoryControler.deleteCategory);

module.exports = router;
