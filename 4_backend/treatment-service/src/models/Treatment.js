const mongoose = require('mongoose');

const localizedArraySchema = new mongoose.Schema({
  en: { type: [String], default: [] },
  fr: { type: [String], default: [] },
}, { _id: false });

const treatmentSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: true,
    enum: ['tomato', 'banana_plantain'],
  },
  diseaseName: {
    type: String,
    required: true,
  },
  scientificName: String,
  urgency: {
    type: String,
    required: true,
    enum: ['monitor', 'treat_soon', 'treat_immediately'],
  },
  urgencyLabel: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
  },
  cultural: localizedArraySchema,
  biological: localizedArraySchema,
  chemical: localizedArraySchema,
  precautions: localizedArraySchema,
}, {
  timestamps: true,
});

treatmentSchema.index({ cropType: 1, diseaseName: 1 });

module.exports = mongoose.model('Treatment', treatmentSchema);