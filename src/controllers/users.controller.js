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

module.exports = {
  changePassword,
};