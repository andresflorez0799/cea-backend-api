const resourcesService = require("../services/resources.service");

async function getResources(req, res, next) {
  try {
    const result = await resourcesService.getSchedulingResources();
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getAvailability(req, res, next) {
  try {
    const result = await resourcesService.getAvailableSchedulingOptions({
      date: req.query.date,
      time: req.query.time,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getResources,
  getAvailability,
};
