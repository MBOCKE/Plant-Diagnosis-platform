function log(message, level = 'info') {
  console[level](`[case-service] ${message}`);
}

module.exports = { log };
