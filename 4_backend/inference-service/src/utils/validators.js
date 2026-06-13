function validateInferencePayload(payload) {
  return payload && typeof payload.crop === 'string' && typeof payload.imageData === 'string';
}

module.exports = { validateInferencePayload };
