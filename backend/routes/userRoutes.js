const express = require("express");
const router = express.Router();
const {registerUser , authUser , allUser} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUser);
router.route("/login").post(authUser);






 











module.exports = router;