# CheckPoint (beta app)

Requirements: Node.js 20 or newer (tested with Node 22) and the latest Expo Go app (the project uses Expo SDK 58).
**The app is for iOS or Android (Expo Go or an emulator). The web version is not set up.**
First launch shows the setup flow. To see it again: More > Beta tools > Restart setup.


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
4. Many other pages are implemented too, some with hardcoded or just display text, but I tried to make as many interactive features in all pages as possible. For example, checking the different setting functionalities in More.


## Extra
1. The inclusive design .md file discusses the WCAG and other principles to ensure accessibility.
2. The information architecture principles.md file discusses the different IA's and gives code examples.
3. The Usability Testing data, results and analysis is all in the Design Diary for Week 9 with the Figma screenshots of where issues occurred, tables of recorded data and evidence of changes implemented into the beta application.
4. The reflection is also in the Design Diary as part of Week 10.
