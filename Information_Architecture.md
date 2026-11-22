# CheckPoint Beta: Information Architecture Principles

---

## 1. Structure and navigation patterns

- **Tabbed view** with five tabs: Home, Insights, Check in (centre), Rhythm, More. This stays inside Miller's 7 ± 2.
- **Hub and spoke** for Check in: the hub offers speak or type, and the spokes (record, type, review, saved) are full screens with no tab bar, so the user can focus.
- **Bento box** Home: four cards (Check in, Body, This week, Small action) that are also shortcuts. They never rank or score the user.
- **Filtered view** for Insights (7 or 30 days), with Sleep insights one level deeper. Nothing goes more than two levels deep.
- **Hierarchy** in More: Help, **Your data**, Settings, Beta tools.

### Code examples

- The five tabs are defined in one `TABS` list in `App.js`, with the core task, Check in, in the centre.
- "Need help?" (`NeedHelpLink`) is the `headerRight` of every tab, so it is always in the same place.
- Spoke and detail screens (Record, TypeNote, Review, Saved, SleepInsights, SmallAction, Support, Privacy, DeleteData, HealthConnections, Account, Notifications) sit in a stack above the tabs, so the Check in flow has no tab bar.
- Setup sits outside the tabs as a short linear flow that is completed or skipped once. After setup, the app lands on Check in so the first note is ready to record.

---

## 2. Flow of content

**Capture → review → one shared data layer → Home, Insights, Rhythm and Small action.**

- All Check ins, sleep and activity are stored once, in `store/AppContext.js`, and every screen reads the same records. This is the "shared data layer" in the IA.
- Sleep and activity are entered once (by hand or connected), and every screen reads the same record, so nothing is entered twice.
- Data stays on the device (AsyncStorage).
- Insights are calculated from real records, the week updates from Check ins, and Delete really removes data.

---

## 3. Tap budget from the test plan

| Task | Budget |
|---|---|
| Record the first note | 1 tap from Home |
| Reach Support | 1 tap from any tab |
| Delete my data | 2 taps from any tab (More, then Delete my data) |

---

## 4. Information architecture decisions that came from testing

| Round two finding | IA change |
|---|---|
| HF9 (High): 1 of 5 failed in both rounds, looking under Account for Delete data. | More now has a "Your data" group with Privacy, **Export my data** and **Delete my data** directly in it. Privacy also shows Export and Delete. Account has a short "Looking to export or delete your data?" shortcut. |
| HF11 (High, trust): 2 of 5 could not find where audio deletion is explained, because it appeared on one setup screen only. | A "How your voice is used" card now appears on the first Check in screen and on Privacy, so the information sits where people look for it. |
| HF3, HF4, HF5, HF10 (Low): a hint or wrong turn each. | A one-time tip on first use of Review, Health connections, Insights and Sleep insights. The "Based on…" line moved directly under the headline. The data note link now reads "How we worked this out". |
| C1 (round one): Help hard to find. | "Need help?" on every tab, in the same place. |
| C6 (round one): Connect vs by hand unclear. | "Connect" and "Add by hand" now sit side by side on one screen. |

---

## 5. Usability principles that shape the structure

| Principle | Example in the beta |
|---|---|
| Visibility of system status | Recording and transcribing states, "N more days needed" before insights, "Saved" screen. |
| User control and freedom | Edit or remove any rating, edit the transcript, "Not right" with Undo, silent skip and dismiss. |
| Match with the real world | Plain words, days out of seven, no streaks, no clinical terms, pattern wording instead of cause. |
| Recognition over recall | Labelled tabs, "Need help?" on every tab, prompt chips on Check in. |
| Fitts's Law | Large targets. Stop, Save and Support call buttons are big and near the thumb. |
| Hick's Law | One main action per screen. |
| Consistency | The same tab bar and "Need help?" link in the same place (WCAG 3.2.3, 3.2.6). |
