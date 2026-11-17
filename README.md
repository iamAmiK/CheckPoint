# CheckPoint (beta)

React Native (Expo) beta of CheckPoint, a mobile app for 18 to 22 year olds to check in on stress, sleep and mood by speaking or typing a note. See **DESIGN_CHANGES.md** for the design decisions and what changed after usability testing.

## Run it

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (iOS or Android), or press `a` / `i` for an emulator.

## Tests

```bash
npm test      # logic tests (tsx) then screen tests (jest)
```

## Try the three priority features

1. **Check in:** finish or skip setup, tap *Record a note* (simulated voice) or *Type instead*, review the suggested ratings, save.
2. **Insights:** More > *Load demo data*, then open Insights and Sleep and mood.
3. **Rhythm:** open the Rhythm tab, mark a rest day, change the reminder.

## Project layout

```
App.js                  navigation (5 tabs + spoke screens above them)
src/theme.js            colours, spacing, type (design tokens)
src/store/              shared data layer, saved on the device
src/services/           suggestions, insights, small actions, transcription stub
src/components/         shared UI (Button, Card, RatingRow, charts, ...)
src/screens/            one file per screen
src/data/               rating wording, demo data
tests/                  logic and screen tests
```
