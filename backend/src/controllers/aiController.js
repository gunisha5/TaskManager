const aiService = require("../services/ai.service");

const suggest = async (req, res, next) => {
  try {
    const data = await aiService.suggestFromTitle(req.body.title);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  suggest,
};
