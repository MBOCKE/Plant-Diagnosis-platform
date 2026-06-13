function log(message, level = 'info') {
  console[level](`[auth-service] ${message}`);
}

module.exports = { log };
