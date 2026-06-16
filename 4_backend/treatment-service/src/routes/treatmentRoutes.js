const express = require('express');
const Treatment = require('../models/Treatment');

const router = express.Router();

const VALID_CROPS = ['tomato', 'banana_plantain'];
const VALID_LANGS = ['en', 'fr'];

// Helper to extract language-specific fields
function localizeTreatment(treatment, lang = 'en') {
  const t = treatment.toObject();
  return {
    _id: t._id,
    cropType: t.cropType,
    diseaseName: t.diseaseName,
    scientificName: t.scientificName,
    urgency: t.urgency,
    urgencyLabel: t.urgencyLabel?.[lang] || t.urgencyLabel?.en,
    cultural: t.cultural?.[lang] || t.cultural?.en || [],
    biological: t.biological?.[lang] || t.biological?.en || [],
    chemical: t.chemical?.[lang] || t.chemical?.en || [],
    precautions: t.precautions?.[lang] || t.precautions?.en || [],
  };
}

// Get treatment by crop and disease
router.get('/:cropType/:diseaseName', async (req, res) => {
  try {
    const { cropType, diseaseName } = req.params;
    const lang = req.query.lang || 'en';

    if (!VALID_CROPS.includes(cropType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid crop type. Must be: ${VALID_CROPS.join(' or ')}`,
      });
    }

    if (!VALID_LANGS.includes(lang)) {
      return res.status(400).json({
        success: false,
        message: `Invalid language. Must be: ${VALID_LANGS.join(' or ')}`,
      });
    }

    if (!diseaseName || diseaseName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Disease name is required',
      });
    }

    const treatment = await Treatment.findOne({
      cropType,
      diseaseName: { $regex: new RegExp(`^${diseaseName}$`, 'i') },
    });

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: `Treatment not found for ${diseaseName} in ${cropType}`,
        suggestion: 'Try the list endpoint to see available treatments',
      });
    }

    const localized = localizeTreatment(treatment, lang);

    res.json({ success: true, data: { treatment: localized } });
  } catch (error) {
    console.error('Treatment lookup error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching treatment' });
  }
});

// Get all treatments
router.get('/', async (req, res) => {
  try {
    const { cropType, lang } = req.query;
    const filter = {};
    const language = lang || 'en';

    if (cropType) {
      if (!VALID_CROPS.includes(cropType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid crop type. Must be: ${VALID_CROPS.join(' or ')}`,
        });
      }
      filter.cropType = cropType;
    }

    const treatments = await Treatment.find(filter).sort({ cropType: 1, diseaseName: 1 });

    if (treatments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No treatments found',
        suggestion: 'Run the seed script to populate treatment data',
      });
    }

    const localized = treatments.map(t => localizeTreatment(t, language));

    res.json({
      success: true,
      data: { treatments: localized, count: localized.length },
    });
  } catch (error) {
    console.error('Treatment list error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching treatments' });
  }
});

module.exports = router;