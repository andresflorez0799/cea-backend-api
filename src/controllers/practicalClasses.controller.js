const practicalClassesService = require("../services/practicalClasses.service");

async function getPracticalClasses(req, res, next) {
  try {
    const result = await practicalClassesService.getPracticalClasses(req.user.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function createPracticalClass(req, res, next) {
  try {
    const result = await practicalClassesService.createPracticalClass(req.user.id, req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPracticalClasses,
  createPracticalClass,
};