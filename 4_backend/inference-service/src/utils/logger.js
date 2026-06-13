function log(message, level = 'info') {
  console[level](`[inference-service] ${message}`);
}

module.exports = { log };
