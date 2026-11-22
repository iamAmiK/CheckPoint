# CheckPoint Beta: Inclusive Design

---

## 1. Accessibility features (WCAG 2.2)

| Feature | Criterion |
|---|---|
| Colours chosen for contrast: text at 4.5:1 or more, borders and chart marks at 3:1 or more | 1.4.3, 1.4.11 |
| Never colour alone: the rating scale shows numbers and words, week dots use a check, moon or empty ring, and charts use bars and dots with a legend and dashes for missing days | 1.4.1 |
| Screen reader labels on every control, a text summary for every chart, header roles | 1.1.1, 1.3.1, 4.1.2 |
| Layouts use flexible heights, so large text does not clip | 1.4.4 |
| Targets of 44 pt or more, tap-only (no swipes or multi-finger gestures) | 2.5.8, 2.5.1 |
| Typing is a full alternative to speaking | Input modalities (2.1.1 intent) |
| Same tab bar and "Need help?" link in the same place | 3.2.3, 3.2.6 |
| Labelled inputs, plain wording, confirmation before delete | 3.3.2, 3.1.5, 3.3.4 |
| Live regions announce recording, saved and status messages | 4.1.3 |
| Waveform stops moving if the device has "reduce motion" on | Motion preference |

### Fixes kept from the round two accessibility review

- Caption text was darkened to 4.8:1 or better. In `theme.js`, muted text is about 5.2:1 on the background.
- Every control is at least 44 x 44 pt (`MIN_TARGET`). Buttons are 48 high and rating buttons are 52.

---

## 2. Colour and contrast in the visual identity

After the Hi-Fi round the brand look was updated, and the whole app follows it from one place, `src/theme.js`. No screen hard-codes a brand colour, so contrast can be checked and changed in one file.

| Token | Colour | Used for |
|---|---|---|
| `primary` | blue `#2563EB` | Main buttons, selected chips, chart bars, "Point" in the wordmark (white text on it is 5.2:1) |
| `primaryDark` | blue `#1D4ED8` | Links, ghost buttons, icons on white or tint (6.7:1 on white) |
| `primarySoft` | tint `#E8F0FE` | Selected toggles, soft cards, Support screen surface |
| `text` | navy `#14213D` | Headings and body text, "Check" in the wordmark (15:1 on the background) |
| `muted` | slate `#5B6B82` | Captions and helper text (5.2:1) |
| `accent` / `green` | purple `#5B3FA0`, green `#1F7A66` | Small accents only: tips and the welcome icons. They are never used alone to carry meaning. |

Contrast was re-checked for the new palette: all text pairs are 4.5:1 or better, and input borders and chart marks are 3.4:1 or better. The input border was darkened slightly for this.

---

## 3. Multiple ways to do the same task

- **Speak or type.** Typing is a full alternative to the (simulated) voice note, so nobody has to speak to use the app.
- **Connect or add by hand.** "Connect" and "Add by hand" sit side by side on the Health connections screen, so health data is optional and never required.
- **Charts have text.** Every chart has a text summary for screen readers and for people who prefer words to graphics. The Sleep and mood chart uses two different shapes (a bar and a dot) with a legend, so it does not rely on colour.
- **Skippable setup.** Setup is four screens or fewer, and "Skip setup for now" is on every step.

---

## 4. Plain language and calm, non-judgemental wording

| Choice | Example in the beta |
|---|---|
| Plain words, no clinical terms | Days out of seven instead of scores. Pattern wording instead of cause. |
| No pressure or streaks | Rest days count ("Rest days count." is shown under the week). Rhythm screens avoid the word "streak". |
| Patterns, not causes | "On nights under 6 hours, your mood was lower", plus "This shows a pattern, not a cause." |
| AI does not guess | When there is no evidence in the note, `services/suggest.js` returns nothing and a tap scale appears. |
| AI is labelled | Each rating reads "Suggested by CheckPoint" (or "Edited by you") and shows the user's own words. |
| Home never ranks or scores the user | The four Home cards are shortcuts only. |

---

## 5. Safety, control and trust

| Principle | Example in the beta |
|---|---|
| User control and freedom | Edit or remove any rating, edit the transcript, "Not right" with Undo, and every skip or dismiss is silent. |
| Error prevention | Nothing is saved until Save. Delete needs a confirmation screen where "Keep my data" is the main button. |
| Visibility of system status | Recording and transcribing states, "N more days needed" before insights, and a "Saved" screen. |
| Help is always available | "Need help?" is the header link on every tab, always in the same place. Support is 1 tap from any tab. |
| Safety prompt | A calm Support prompt appears after saving only if the last three Check ins all had low mood, or the note shows serious distress. It never diagnoses or advises. |
| Clear explanation of data use | A "How your voice is used" card on the first Check in screen and on Privacy says in four plain lines: you speak or type, AI makes text and suggestions, audio is deleted once it is text, and notes stay on this phone. |
| Easy to find data controls | The "Your data" group in More has Privacy, Export my data and Delete my data. Delete is 2 taps from any tab. |

---

## 6. Findings from testing that shaped inclusive design

| Round two finding | Change |
|---|---|
| HF11 (High, trust): 2 of 5 could not find where audio deletion is explained. | Added the "How your voice is used" card, so the explanation is not tied to a single setup screen. |
| HF9 (High): 1 of 5 looked under Account for Delete data. | Moved Export and Delete into a "Your data" group, with a shortcut on Account. |
| HF3, HF4, HF5, HF10 (Low): one hint or wrong turn each. | One-time tips, a text "Edit" button with an icon (not an icon alone), a bold "Based on…" line, and the clearer link text "How we worked this out". |


