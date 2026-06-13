function log(message, level = 'info') {
  console[level](`[treatment-service] ${message}`);
}

module.exports = { log };
