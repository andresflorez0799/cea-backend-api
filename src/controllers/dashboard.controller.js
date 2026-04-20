const dashboardService = require("../services/dashboard.service");

async function getDashboard(req, res, next) {
  try {
    const result = await dashboardService.getDashboard(req.user.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
};