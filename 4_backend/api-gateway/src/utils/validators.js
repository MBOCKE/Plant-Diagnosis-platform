function validateProxyPayload(payload) {
  return payload && typeof payload.url === 'string';
}

module.exports = { validateProxyPayload };
