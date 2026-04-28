const theoryClassesService = require("../services/theoryClasses.service");

async function getTheoryClasses(req, res, next) {
  try {
    const result = await theoryClassesService.getTheoryClasses(req.user?.role);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function createTheoryClass(req, res, next) {
  try {
    const result = await theoryClassesService.createTheoryClass(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateTheoryClass(req, res, next) {
  try {
    const result = await theoryClassesService.updateTheoryClass(Number(req.params.id), req.body);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function disableTheoryClass(req, res, next) {
  try {
    const result = await theoryClassesService.disableTheoryClass(Number(req.params.id));
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTheoryClasses,
  createTheoryClass,
  updateTheoryClass,
  disableTheoryClass,
};
