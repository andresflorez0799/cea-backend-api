const authService = require("../services/auth.service");
const usersService = require("../services/users.service");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const result = await usersService.getCurrentUser(req.user.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  me,
};