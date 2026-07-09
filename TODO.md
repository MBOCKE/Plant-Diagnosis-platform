# TODO

## Plan: Refine “Recent Diagnoses” card (Home screen)
- [ ] Update `5_frontend/PlantDiagnosisApp54/app/(tabs)/index.tsx` recent diagnosis row layout.
  - [ ] Replace left emoji mock with `<Image>` using `item.imageUri` (fallback to emoji if missing).
  - [ ] Make the image container flush to the extreme left of the row and match the full card height.
  - [ ] Ensure image has rounded corners and is clipped correctly.
  - [ ] Reorder text so sickness name is fully written under the urgency badge.
  - [ ] Place date horizontally under the sickness name.
- [ ] Verify compile/lint by running the frontend TypeScript/Expo build command (as available).

