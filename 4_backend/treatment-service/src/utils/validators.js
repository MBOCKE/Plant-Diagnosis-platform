function validateTreatmentPayload(payload) {
  return payload && typeof payload.name === 'string' && payload.name.length > 0;
}

module.exports = { validateTreatmentPayload };
