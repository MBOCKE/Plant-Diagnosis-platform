# TODO - Offline Mode UI integration (PlantDiagnosisApp54)

- [ ] 1) Create `src/store/networkStore.ts` (zustand store) compatible with app usage.
- [ ] 2) Create `src/components/OfflineBanner.tsx`.
- [ ] 3) Create `src/components/OfflineModal.tsx`.
- [ ] 4) Integrate `OfflineBanner` into `app/(tabs)/index.tsx` (Home screen) and call `checkConnection()` on mount.
- [ ] 5) Integrate `OfflineModal` into `app/diagnosis.tsx`:
  - [ ] show modal when user navigates to Diagnosis while offline
  - [ ] wire actions to either `router.back()` (Try Again) or allow offline flow (Continue Offline)
  - [ ] show pending sync count when queue has items
- [ ] 6) Run TypeScript check / app build (as available).

