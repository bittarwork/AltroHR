const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getSystemStats } = require("../controllers/SystemStatsController");

// GET /api/system-stats - الحصول على إحصائيات النظام العامة
router.get("/", auth, getSystemStats);

module.exports = router; 