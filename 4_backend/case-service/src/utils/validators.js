function validateCasePayload(payload) {
  return payload && typeof payload.title === 'string' && payload.title.length > 0;
}

module.exports = { validateCasePayload };
