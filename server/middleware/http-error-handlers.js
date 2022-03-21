exports.notFoundErrorHandler = (req, res, next) => {
    res.status(404).json({
      message: "Invalid route",
    });
  };
  
  exports.genericErrorHandler = (err, req, res, next) => {
    const { statusCode, message, data } = err;
    res.status(statusCode || 500).json({
      message,
      data,
    });
  };
  
