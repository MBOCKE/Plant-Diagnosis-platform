# TODO - i18n (English/French) for PlantDiagnosisApp54

- [ ] 1. Add `src/i18n/i18n.ts` with translation dictionary (en/fr) + `t()` + hook `useI18n()` reading `user.preferredLanguage`.
- [ ] 2. Implement global language switching:
  - [ ] Update `src/components/ProfileLanguageModal.tsx` to change `user.preferredLanguage` in the zustand store immediately when toggled.
  - [ ] Ensure all screens re-render using `useI18n()`.
- [ ] 3. Replace hardcoded UI strings in PlantDiagnosisApp54 with `t()`:
  - [ ] `app/diagnosis.tsx`
  - [ ] `app/treatment.tsx`
  - [ ] `app/(tabs)/history.tsx`
  - [ ] `app/(tabs)/profile.tsx`
  - [ ] Core components: `src/components/Header.tsx`, `Badge.tsx`, `AppModal.tsx`, `LoadingSkeleton.tsx` (where they contain user-facing text).
- [ ] 4. Translate treatment UI labels and sections (urgency, cultural/biological/chemical/precautions headings) client-side using `preferredLanguage`.
- [ ] 5. Translate any remaining profile/Auth strings (`login.tsx`, `register.tsx`, About/Privacy modals) to en/fr.
- [ ] 6. Run TypeScript checks and manual QA:
  - [ ] Switch language in Profile → verify every tab updates immediately
  - [ ] Navigate to Diagnosis → Treatment → History to confirm translated labels
