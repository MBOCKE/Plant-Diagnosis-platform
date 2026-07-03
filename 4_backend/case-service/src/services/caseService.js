const Case = require('../models/Case');

class CaseService {
  async getCases(userId, { page = 1, limit = 10, cropType, status, search, includeArchived = false } = {}) {
    const filter = { user: userId };
    if (!includeArchived) filter.isArchived = { $ne: true };
    if (cropType) filter.cropType = cropType;
    if (status) filter.status = status;

    // Search across disease name, symptoms, and crop type
    if (search) {
      filter.$or = [
        { 'diagnosis.primaryDiagnosis.disease': { $regex: search, $options: 'i' } },
        { symptomsDescription: { $regex: search, $options: 'i' } },
        { cropType: { $regex: search, $options: 'i' } },
        { followUpNotes: { $regex: search, $options: 'i' } },
      ];
    }

    const cases = await Case.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-diagnosis.allPredictions');

    const total = await Case.countDocuments(filter);

    return {
      cases,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    };
  }

  async getCase(userId, caseId) {
    return Case.findOne({ _id: caseId, user: userId });
  }

  async createCase(userId, caseData) {
    return Case.create({ ...caseData, user: userId });
  }

  async syncCases(userId, cases) {
    const synced = [];
    for (const data of cases) {
      const newCase = await Case.create({
        ...data,
        user: userId,
        isOfflineCase: true,
        syncedAt: new Date(),
        status: 'synced',
      });
      synced.push(newCase);
    }
    return synced;
  }

  async addNotes(userId, caseId, notes) {
    return Case.findOneAndUpdate(
      { _id: caseId, user: userId },
      { followUpNotes: notes },
      { new: true }
    );
  }

  async deleteCase(userId, caseId) {
    return Case.findOneAndUpdate(
      { _id: caseId, user: userId },
      { isArchived: true },
      { new: true }
    );
  }
}

module.exports = new CaseService();