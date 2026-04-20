const theoryClassesService = require("../services/theoryClasses.service");

async function getTheoryClasses(req, res, next) {
  try {
    const result = await theoryClassesService.getTheoryClasses();
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTheoryClasses,
};