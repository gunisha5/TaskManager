const authService = require("../services/authService");

const signup = async (req, res, next) => {
  try {
    const data = await authService.signup(req.body);
    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  login,
};
