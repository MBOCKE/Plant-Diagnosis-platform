import React from 'react';
import { useAuthStore } from '../store/authStore';

export type Lang = 'en' | 'fr';

export type TranslationKey =
  | 'diagnosis.title'
  | 'diagnosis.failed'
  | 'diagnosis.confidence'
  | 'diagnosis.alternativeTitle'
  | 'diagnosis.viewTreatmentPlan'
  | 'diagnosis.savedOffline.title'
  | 'diagnosis.savedOffline.body'
  | 'treatment.title'
  | 'treatment.saveTreatment'
  | 'treatment.disease'
  | 'treatment.urgency.treatSoon'
  | 'treatment.urgency.treatImmediately'
  | 'treatment.urgency.monitor'
  | 'treatment.sections.cultural'
  | 'treatment.sections.biological'
  | 'treatment.sections.chemical'
  | 'treatment.sections.safety'
  | 'history.title'
  | 'history.searchPlaceholder'
  | 'history.filter.all'
  | 'history.filter.tomato'
  | 'history.filter.banana'
  | 'history.detailsHeader'
  | 'history.block.diagnosis'
  | 'history.block.symptoms'
  | 'history.block.treatmentPlan'
  | 'history.block.followUpNotes'
  | 'history.block.scientificName'
  | 'history.block.model'
  | 'history.block.inferenceTime'
  | 'history.block.alternativeDiagnoses'
  | 'history.block.location'
  | 'history.block.status'
  | 'history.block.offlineCase'
  | 'history.block.section.alternative'
  | 'history.block.section.followUp'
  | 'camera.permissionRequired.title'
  | 'camera.permissionRequired.body'
  | 'camera.retake'
  | 'camera.diagnose'
  | 'camera.captureTitle'
  | 'camera.focusInstruction'
  | 'profile.language.title'
  | 'profile.language.english'
  | 'profile.language.french'
  | 'profile.language.hint'
  | 'profile.language.current'
  | 'profile.language.note'
  | 'profile.location.title'
  | 'profile.location.showLocation'
  | 'profile.location.hidden'
  | 'profile.location.notSet'
  | 'profile.location.note';

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en: {
    'diagnosis.title': 'Diagnosis',
    'diagnosis.failed': 'Failed to load diagnosis',
    'diagnosis.confidence': 'Confidence',
    'diagnosis.alternativeTitle': 'Alternative Possibilities',
    'diagnosis.viewTreatmentPlan': 'View Treatment Plan',
  'diagnosis.savedOffline.title': 'Saved Offline',
  'diagnosis.savedOffline.body': 'Your case will be diagnosed when internet is available.',

    'treatment.title': 'Treatment Info',
    'treatment.saveTreatment': 'Save Treatment',

    'treatment.disease': 'Disease',
    'treatment.urgency.treatSoon': 'Treat Soon',
    'treatment.urgency.treatImmediately': 'Treat Immediately',
    'treatment.urgency.monitor': 'Monitor',

    'treatment.sections.cultural': 'Cultural Practices',
    'treatment.sections.biological': 'Biological Controls',
    'treatment.sections.chemical': 'Chemical Options',
    'treatment.sections.safety': 'Safety Precautions',

    'history.title': 'My Cases',
    'history.searchPlaceholder': 'Search by disease / notes...',
    'history.filter.all': 'All',
    'history.filter.tomato': '🍅 Tomato',
    'history.filter.banana': '🍌 Banana',

    'history.detailsHeader': 'Every detail',
    'history.block.diagnosis': 'Diagnosis',
    'history.block.symptoms': 'Symptoms',
    'history.block.treatmentPlan': 'Treatment plan',
    'history.block.followUpNotes': 'Follow-up notes',

    'history.block.scientificName': 'Scientific name:',
    'history.block.model': 'Model:',
    'history.block.inferenceTime': 'Inference time:',
    'history.block.alternativeDiagnoses': 'Alternative diagnoses',
    'history.block.location': 'Location:',
    'history.block.status': 'Status:',
    'history.block.offlineCase': 'Offline case:',

    'history.block.section.alternative': 'Alternative diagnoses',
    'history.block.section.followUp': 'Follow-up notes',
    'camera.permissionRequired.title': 'Permission Required',
    'camera.permissionRequired.body': 'Camera access is needed',
    'camera.retake': 'Retake',
    'camera.diagnose': 'Diagnose Plant',
    'camera.captureTitle': 'Capture Plant Leaf',
    'camera.focusInstruction': 'Position the affected leaf in the center and tap to focus',
      'profile.language.title': 'Preferred Language',
      'profile.language.english': 'English',
      'profile.language.french': 'Français',
      'profile.language.hint': 'Your interface can display content in English.',
      'profile.language.current': 'Current:',
      'profile.language.note': 'Note: This demo UI keeps the selection locally. If you connect the backend preference update, we can persist it to your account.',
      'profile.location.title': 'My Location',
      'profile.location.showLocation': 'Show location',
      'profile.location.hidden': 'Location is hidden.',
      'profile.location.notSet': 'Location not set.',
      'profile.location.note': 'Location is displayed based on your account data. You can hide it anytime using the toggle.',
  },
  fr: {
    'diagnosis.title': 'Diagnostic',
    'diagnosis.failed': 'Impossible de charger le diagnostic',
    'diagnosis.confidence': 'Confiance',
    'diagnosis.alternativeTitle': 'Autres possibilités',
    'diagnosis.viewTreatmentPlan': 'Voir le plan de traitement',
  'diagnosis.savedOffline.title': 'Enregistré hors ligne',
  'diagnosis.savedOffline.body': "Votre cas sera diagnostiqué lorsque l'internet sera disponible.",

    'treatment.title': 'Informations sur le traitement',
    'treatment.saveTreatment': 'Enregistrer le traitement',

    'treatment.disease': 'Maladie',
    'treatment.urgency.treatSoon': 'Traiter bientôt',
    'treatment.urgency.treatImmediately': 'Traiter immédiatement',
    'treatment.urgency.monitor': 'Surveiller',

    'treatment.sections.cultural': 'Pratiques culturales',
    'treatment.sections.biological': 'Contrôles biologiques',
    'treatment.sections.chemical': 'Options chimiques',
    'treatment.sections.safety': 'Précautions de sécurité',

    'history.title': 'Mes cas',
    'history.searchPlaceholder': 'Rechercher maladie / notes...',
    'history.filter.all': 'Tous',
    'history.filter.tomato': '🍅 Tomate',
    'history.filter.banana': '🍌 Banane',

    'history.detailsHeader': 'Tous les détails',
    'history.block.diagnosis': 'Diagnostic',
    'history.block.symptoms': 'Symptômes',
    'history.block.treatmentPlan': 'Plan de traitement',
    'history.block.followUpNotes': 'Notes de suivi',

    'history.block.scientificName': 'Nom scientifique :',
    'history.block.model': 'Modèle :',
    'history.block.inferenceTime': 'Temps d’inférence :',
    'history.block.alternativeDiagnoses': 'Diagnostics alternatifs',
    'history.block.location': 'Localisation :',
    'history.block.status': 'Statut :',
    'history.block.offlineCase': 'Cas hors ligne :',

    'history.block.section.alternative': 'Diagnostics alternatifs',
    'history.block.section.followUp': 'Notes de suivi',
    'camera.permissionRequired.title': "Autorisation requise",
    'camera.permissionRequired.body': "L'accès à la caméra est nécessaire",
    'camera.retake': 'Reprendre',
    'camera.diagnose': "Diagnostiquer la plante",
    'camera.captureTitle': "Capturer la feuille de la plante",
    'camera.focusInstruction': "Placez la feuille affectée au centre et appuyez pour faire la mise au point",
      'profile.language.title': 'Langue préférée',
      'profile.language.english': 'English',
      'profile.language.french': 'Français',
      'profile.language.hint': "Votre interface peut afficher le contenu en français.",
      'profile.language.current': 'Actuel :',
      'profile.language.note': "Remarque : Cette interface de démonstration conserve la sélection localement. Si vous connectez la mise à jour des préférences backend, nous pourrons la persister à votre compte.",
      'profile.location.title': 'Ma localisation',
      'profile.location.showLocation': 'Afficher la localisation',
      'profile.location.hidden': 'La localisation est masquée.',
      'profile.location.notSet': "Localisation non définie.",
      'profile.location.note': "La localisation est affichée en fonction des données de votre compte. Vous pouvez la masquer à tout moment en utilisant l'interrupteur.",
  },
};

function getLangSafe(lang?: string | null): Lang {
  return lang === 'fr' ? 'fr' : 'en';
}

export function t(key: TranslationKey, lang: Lang): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function useI18n() {
  const { user } = useAuthStore();
  const lang = React.useMemo(() => getLangSafe(user?.preferredLanguage), [user?.preferredLanguage]);

  const translate = React.useCallback(
    (key: TranslationKey) => t(key, lang),
    [lang],
  );

  return { lang, t: translate };
}

