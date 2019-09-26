function error(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({ error: err.message });
}

module.exports = error;
