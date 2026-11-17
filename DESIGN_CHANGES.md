# CheckPoint Beta: Design and Changes After Usability Testing

COMP4511 Deliverable 4 (Beta coded version) · Amitabh Kumar (z5480896)

This beta is a React Native (Expo) build of CheckPoint. It builds on the Figma Hi-Fi prototype and applies the changes proposed after round two testing. It covers the three priority features from the user story map:

1. **Check in loop** (Level 1): speak or type a note, review and edit the AI suggestions, save.
2. **Insights** (Level 2): stress insight, trends, and Sleep insights, with 7 and 30 day views.
3. **Weekly rhythm** (Level 2): days out of seven, rest days, welcome back, reminder choice.

Supporting screens: Welcome and Setup, Home, Support, Privacy, Your data (export and delete), Health connections, Small action, Account and Notifications.

---

## 1. Changes made from round two testing

Round two left two High issues and four Low issues (Table 7), and the "Proposed changes for beta" table listed four changes. All four are in this build.

| # | Round two finding | Change in the beta | Where in the code |
|---|---|---|---|
| 1 (High, trust) | HF11: 2 of 5 could not find where audio deletion is explained ("I assumed it kept the recording"). It was only on one setup screen. | A **"How your voice is used"** card now shows on the first Check in screen and on Privacy. It says in four plain lines: you speak or type, AI makes text and suggestions, audio is deleted once it is text, notes stay on this phone. | `components/VoiceInfoCard.js`, used in `CheckInScreen` and `PrivacyScreen` |
| 2 (High) | HF9: 1 of 5 failed in both rounds, looking under Account for Delete data. | More now has a group called **"Your data"** with Privacy, **Export my data** and **Delete my data** directly in it (2 taps from any tab: More, then Delete my data). Privacy also shows Export and Delete. Account has a short "Looking to export or delete your data?" shortcut for anyone who goes there first. | `MoreScreen`, `PrivacyScreen`, `AccountScreen` |
| 3 (Low) | HF3, HF4, HF5, HF10: one hint or wrong turn each (edit icon, connect vs by hand, "based on" line, data note). | A **one-time tip** on first use of Review, Health connections, Insights and Sleep insights. "Edit" is now a text button with an icon (not an icon alone). The "Based on…" line is bold teal body text directly under the headline. The data note link now reads **"How we worked this out"**. | `components/Tip.js`, `RatingRow`, `InsightsScreen`, `SleepInsightsScreen` |
| 4 (Low) | HF9 and HF11 ease ratings (5.4) were under the 5.5 target. | Not a code change: both tasks need re-testing with the new labels (see section 6). | n/a |

The accessibility fixes from the round two review are also kept: caption text darkened to 4.8:1 or better (`theme.js`, muted text is about 6.4:1 on the background) and every control at least 44 x 44 pt (`MIN_TARGET`, buttons are 48 high, rating buttons 52).

### Round one fixes that are carried through (C1 to C6)

| Change | In the beta |
|---|---|
| C1 "Need help?" on every tab | `NeedHelpLink` is the `headerRight` of every tab, always in the same place. Support is 1 tap from any tab. |
| C2 AI ratings read as facts | Each rating is labelled **"Suggested by CheckPoint"** (or "Edited by you"), shows the user's own words, and has labelled Edit and Remove buttons. |
| C3 Unsure if recording | Recording screen shows a text status ("Recording"), a timer, a live waveform and a large Stop button. Status changes are announced to screen readers. |
| C4 "Not right" and basis | "Not right" is a labelled button on the insight, with an Undo. Each insight has a "Based on N Check ins and N nights of sleep" line. |
| C5 Sleep read as a cause | Wording is "On nights under 6 hours, your mood was lower", plus "This shows a pattern, not a cause." |
| C6 Connect vs by hand, rest days | "Connect" and "Add by hand" sit side by side on one screen. "Rest days count." is shown under the week, and rest days can be marked. |

---

## 2. How the beta builds on the Hi-Fi prototype

- **Same screens, order and wording** as the Figma prototype, so earlier research and test results still apply.
- **Design system carried into code:** `src/theme.js` holds the colours (calm teal, neutral greys, one soft accent), one system typeface with set sizes, and the 8 pt spacing grid. Shared components (`Button`, `Card`, `ListRow`, `RatingRow`, `WeekDots`, charts) mirror the Figma components, so a change in one place updates every screen.
- **What a prototype could not do, now working:** data is saved on the device, ratings are computed from the note, insights are calculated from real records, the week updates from Check ins, and Delete really removes data.

---

## 3. Information architecture

- **Tabbed view** with five tabs: Home, Insights, Check in (centre), Rhythm, More. It stays inside Miller's 7 ± 2.
- **Hub and spoke** for Check in: the hub offers speak or type; the spokes (record, type, review, saved) are full screens with no tab bar, so the user can focus.
- **Bento box** Home: four cards (Check in, Body, This week, Small action) that are also shortcuts. They never rank or score the user.
- **Filtered view** for Insights (7 or 30 days), with Sleep insights one level deeper. Nothing goes more than two levels deep.
- **Hierarchy** in More: Help, **Your data**, Settings, Beta tools.
- **Flow of content:** capture → review → one shared data layer (`store/AppContext.js`) → Home, Insights, Rhythm and Small action. Sleep and activity are entered once (by hand or connected) and every screen reads the same record, so nothing is entered twice.
- **Tap budget from the test plan:** first note 1 tap from Home, Support 1 tap from any tab, Delete data 2 taps from any tab (More, then Delete my data).

---

## 4. Usability principles (and where they show)

| Principle | Example in the beta |
|---|---|
| Visibility of system status | Recording and transcribing states, "N more days needed" before insights, "Saved" screen. |
| User control and freedom | Edit or remove any rating, edit the transcript, "Not right" with Undo, every skip and dismiss is silent. |
| Error prevention | The AI **does not guess** when there is no evidence (`services/suggest.js` returns nothing, and a tap scale appears). Nothing is saved until Save. Delete needs a confirmation screen where "Keep my data" is the main button. |
| Match with the real world | Plain words, days out of seven, no streaks, no clinical terms, pattern wording instead of cause. |
| Recognition over recall | Labelled tabs, "Need help?" on every tab, prompt chips on Check in. |
| Fitts's Law | Large targets; Stop, Save and Support call buttons are big and near the thumb. |
| Hick's Law | One main action per screen. |
| Safety | A calm Support prompt appears after saving **only** if the last three Check ins all had low mood, or the note shows serious distress. It never diagnoses or advises. |

---

## 5. Accessibility (WCAG 2.2)

| Feature | Criterion |
|---|---|
| Colours chosen for contrast: text at 4.5:1 or more, borders and chart marks at 3:1 or more | 1.4.3, 1.4.11 |
| Never colour alone: rating scale shows numbers and words, week dots use check, moon or empty ring, charts use bars and dots with a legend and missing-day dashes | 1.4.1 |
| Screen reader labels on every control, a text summary for every chart, header roles | 1.1.1, 1.3.1, 4.1.2 |
| Layouts use flexible heights, so large text does not clip | 1.4.4 |
| Targets of 44 pt or more, tap-only (no swipes or multi-finger gestures) | 2.5.8, 2.5.1 |
| Typing is a full alternative to speaking | Input modalities (2.1.1 intent) |
| Same tab bar and "Need help?" link in the same place | 3.2.3, 3.2.6 |
| Labelled inputs, plain wording, confirmation before delete | 3.3.2, 3.1.5, 3.3.4 |
| Live regions announce recording, saved and status messages | 4.1.3 |
| Waveform stops moving if the device has "reduce motion" on | Motion preference |

---

## 6. What is simulated, and what to re-test

This is a beta, so a few things are deliberately simple. They are labelled in the app where a tester could be misled.

| Area | Beta behaviour | To do before release |
|---|---|---|
| Voice | Recording and speech-to-text are **simulated** (`services/transcribe.js` returns a sample note). The Record screen says "Demo build". | Plug a real speech-to-text service into that one function, and ask for microphone permission at first use. |
| AI suggestions | A small keyword model, so every suggestion can be traced to the user's exact words. | Swap for a real model, keeping the "show the phrases" rule. |
| Connect health app | Imports 14 days of sample data and says so on screen. | Connect HealthKit / Health Connect. |
| Reminders | The choice is saved, but notifications are not sent yet. The card says so. | Schedule local notifications. |
| Support details | Lifeline, Beyond Blue and UNSW CAPS numbers, and a placeholder email (`hello@checkpoint.example`). | **Verify every number and replace the email** before any real use. |
| Storage | On-device only (AsyncStorage), no accounts. | Decide on backup and sync. |

**Re-test with 5 new participants:** HF9 (Delete data) and HF11 (how the AI uses my voice), the two tasks that missed target. Success means: Delete data in 3 taps or fewer, the voice explanation found without a hint, and ease ratings of 5.5 or more.

**Beta tools** (More): "Load demo data" adds 30 days of sample Check ins so testers can see Insights without waiting a week; "Restart setup" shows the welcome screens again.

---

## 7. Testing done on this build

- **Logic tests** (`npm test`, 7 tests): suggestions come with phrases, no evidence means no guess, negation, distress detection, date maths, insight wording and "not enough data" handling.
- **Screen tests** (jest, 9 tests): setup and skip, type then review then save, "Need help?" on every tab, voice flow, insights with Not right and Undo, Sleep insights wording, rest days and no "streak" wording, silent dismissal of small actions, delete confirmation, health by hand and skip.
- The app also bundles cleanly for Android with Metro. I have not run it on a physical device or emulator, so please do a quick pass on your phone with Expo Go.
