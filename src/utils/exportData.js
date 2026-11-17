import { Share } from 'react-native';

// Builds a plain JSON copy of everything the app holds and opens the system share sheet.
// Demo records are left out so the export only contains what the user entered.
export async function exportData(state) {
  const payload = {
    exportedAt: new Date().toISOString(),
    checkIns: state.checkIns.filter((c) => !c.demo),
    sleepHours: state.sleep,
    activityMinutes: state.activity,
    restDays: Object.keys(state.restDays),
  };
  try {
    await Share.share({ title: 'My CheckPoint data', message: JSON.stringify(payload, null, 2) });
  } catch (e) {
    // Sharing can fail or be cancelled; there is nothing to recover, so stay quiet.
  }
}
