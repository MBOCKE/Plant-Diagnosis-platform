module.exports = {
  services: {
    auth: process.env.AUTH_URL || 'http://localhost:4001',
    inference: process.env.INFERENCE_URL || 'http://localhost:4002'
  }
};
