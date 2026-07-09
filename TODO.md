# TODO - Low confidence flow & history filtering

- [ ] Update inference-service threshold from 50% to 45% (app.py)
- [ ] When confidence is below threshold, stop creating a case in backend (PlantDiagnosisApp54/app/diagnosis.tsx)
- [ ] Add a dedicated UI on low-confidence: two buttons (Green: Retake, White w/ green text: Exit -> home). Ensure no Treatment screen is shown.
- [ ] Ensure low-confidence cases never appear in History/Recent: mark them as archived at creation time OR do not create them at all.
- [ ] Confirm History screen filtering uses archived/isArchived; verify case creation gating is sufficient.
- [ ] Run quick lint/type check (frontend) and minimal backend smoke checks.

