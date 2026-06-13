function success(res, data, message = 'Success') {
  return res.json({ status: 'success', message, data });
}

function error(res, statusCode = 500, message = 'Internal Server Error') {
  return res.status(statusCode).json({ status: 'error', message });
}

module.exports = { success, error };
