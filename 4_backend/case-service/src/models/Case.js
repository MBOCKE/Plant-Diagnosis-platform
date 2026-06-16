const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropType: {
      type: String,
      required: true,
      enum: ['tomato', 'banana_plantain'],
    },
    imageUri: {
      type: String,
      required: true,
    },
    symptomsDescription: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    status: {
      type: String,
      enum: ['pending', 'diagnosed', 'failed', 'synced'],
      default: 'pending',
    },
    diagnosis: {
      primaryDiagnosis: {
        disease: String,
        scientificName: String,
        confidence: Number,
      },
      alternativeDiagnoses: [{
        disease: String,
        confidence: Number,
      }],
      modelUsed: String,
      inferenceTimeMs: Number,
    },
    treatment: {
      urgency: String,
      urgencyLabel: String,
      cultural: [String],
      biological: [String],
      chemical: [String],
      precautions: [String],
    },
    followUpNotes: {
      type: String,
      maxlength: 1000,
    },
    isOfflineCase: {
      type: Boolean,
      default: false,
    },
    syncedAt: Date,
  },
  { timestamps: true }
);

caseSchema.index({ user: 1, createdAt: -1 });
caseSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Case', caseSchema);