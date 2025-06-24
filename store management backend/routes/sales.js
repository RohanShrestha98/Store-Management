const express = require("express");
const router = express.Router();
const salesControler = require("../controllers/sales");
const createUserValidateToken = require("../middleware/createUserValidateToken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const safeFilename = file.originalname.replace(/\s+/g, "_");
    cb(null, safeFilename);
  },
});
router.use(createUserValidateToken);
router.get("/store/:id", salesControler.getProductForUser);

const upload = multer({ storage: storage });

router.get("/", salesControler.getSales);
router.post("/create", salesControler.createSales);
// router.patch("/update/:id", salesControler.updateCategory);
router.delete("/delete/:id", salesControler.deleteProduct);
router.get("/bar-code/", salesControler.getProductByBarcode);

module.exports = router;
