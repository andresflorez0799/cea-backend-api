const usersService = require("../services/users.service");

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await usersService.changePassword(req.user.id, currentPassword, newPassword);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await usersService.listUsers();
    return res.json(users);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const created = await usersService.createUser(req.body);
    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const updated = await usersService.updateUser(Number(req.params.id), req.body);
    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function disableUser(req, res, next) {
  try {
    const updated = await usersService.disableUser(Number(req.params.id));
    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  changePassword,
  listUsers,
  createUser,
  updateUser,
  disableUser,
};
