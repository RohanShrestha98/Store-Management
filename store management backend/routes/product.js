const express = require("express");
const router = express.Router();
const productControler = require("../controllers/product");
const createUserValidateToken = require("../middleware/createUserValidateToken");

router.use(createUserValidateToken);
router.get("/", productControler.getProduct);
router.post("/create", productControler.createProduct);
// router.patch("/update/:id", productControler.updateCategory);
router.delete("/delete/:id", productControler.deleteProduct);

module.exports = router;
