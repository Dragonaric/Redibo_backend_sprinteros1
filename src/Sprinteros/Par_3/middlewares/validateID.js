
module.exports = (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID debe ser un número válido"
      });
    }
    next();
  };