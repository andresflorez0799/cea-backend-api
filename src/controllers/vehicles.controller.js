const vehiclesService = require("../services/vehicles.service");

async function listVehicles(req, res, next) {
  try {
    const vehicles = await vehiclesService.listVehicles();
    return res.json(vehicles);
  } catch (error) {
    next(error);
  }
}

async function createVehicle(req, res, next) {
  try {
    const created = await vehiclesService.createVehicle(req.body);
    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

async function updateVehicle(req, res, next) {
  try {
    const updated = await vehiclesService.updateVehicle(Number(req.params.id), req.body);
    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function disableVehicle(req, res, next) {
  try {
    const updated = await vehiclesService.disableVehicle(Number(req.params.id));
    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listVehicles,
  createVehicle,
  updateVehicle,
  disableVehicle,
};
