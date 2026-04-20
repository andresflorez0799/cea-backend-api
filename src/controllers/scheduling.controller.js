const resourcesService = require("../services/resources.service");

async function getResources(req, res, next) {
  try {
    const result = await resourcesService.getSchedulingResources();
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getResources,
};