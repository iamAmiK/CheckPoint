# CheckPoint (beta app)

Requirements: Node.js 20 or newer (tested with Node 22) and the latest Expo Go app (the project uses Expo SDK 58).
**The app is for iOS or Android (Expo Go or an emulator). The web version is not set up.**
First launch shows the setup flow. To see it again: More > Beta tools > Restart setup.
To explore Insights straight away: More > Beta tools > Load demo data.

## Instructions

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (iOS or Android).

## Tests

```bash
npm test     
```

## Three priority features implemented

1. **Check in:** finish or skip setup, tap *Record a note* (simulated voice) or *Type instead*, review the suggested ratings, save.
2. **Insights:** More > *Load demo data*, then open Insights and Sleep and mood.
3. **Rhythm:** open the Rhythm tab, mark a rest day, change the reminder.
