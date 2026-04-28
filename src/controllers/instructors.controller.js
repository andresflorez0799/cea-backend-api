const instructorsService = require("../services/instructors.service");

async function listInstructors(req, res, next) {
  try {
    const instructors = await instructorsService.listInstructors();
    return res.json(instructors);
  } catch (error) {
    next(error);
  }
}

async function createInstructor(req, res, next) {
  try {
    const created = await instructorsService.createInstructor(req.body);
    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

async function updateInstructor(req, res, next) {
  try {
    const updated = await instructorsService.updateInstructor(Number(req.params.id), req.body);
    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function disableInstructor(req, res, next) {
  try {
    const updated = await instructorsService.disableInstructor(Number(req.params.id));
    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInstructors,
  createInstructor,
  updateInstructor,
  disableInstructor,
};
