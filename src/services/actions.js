// Small actions of five minutes or less. They are suggestions, never tasks:
// dismissing one shows no message and does not change the weekly count.
export const ACTIONS = [
  {
    id: 'breathe',
    title: 'Slow breathing',
    minutes: 2,
    reason: 'A short pause can take the edge off a busy day.',
    steps: [
      'Sit comfortably and relax your shoulders.',
      'Breathe in through your nose for 4 seconds.',
      'Breathe out slowly for 6 seconds.',
      'Keep going at your own pace until the timer ends.',
    ],
  },
  {
    id: 'walk',
    title: 'Short walk',
    minutes: 5,
    reason: 'A few minutes outside can lift how you feel.',
    steps: [
      'Stand up and put your shoes on.',
      'Walk outside or around the building.',
      'Notice three things you can see and two you can hear.',
      'Head back when the timer ends.',
    ],
  },
  {
    id: 'winddown',
    title: 'Five minute wind-down',
    minutes: 5,
    reason: 'Easing into bedtime can make sleep come more easily.',
    steps: [
      'Put your phone on charge, away from the bed.',
      'Dim the lights around you.',
      'Stretch your neck and shoulders slowly.',
      'Take a few slow breaths until the timer ends.',
    ],
  },
];

// Put the most relevant action first, based on the latest Check in (links the action to the user's own note).
export function orderedActions(latestCheckIn) {
  const list = [...ACTIONS];
  const prefer = latestCheckIn?.stress >= 4 ? 'breathe' : latestCheckIn?.energy <= 2 ? 'winddown' : 'walk';
  list.sort((a, b) => (a.id === prefer ? -1 : b.id === prefer ? 1 : 0));
  return list;
}
