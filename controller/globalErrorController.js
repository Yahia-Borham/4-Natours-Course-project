const devenv = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    name: err.constructor.name,
    stack: err.stack,
  });
};

const globalErrorHandlere = (err, req, res, next) => {
  devenv(err, res);
};

module.exports = globalErrorHandlere;
