// Smoke test of the main journey through the real app: setup -> type a note -> review -> save -> Home.
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';

const press = async (name) => {
  const el = await screen.findByRole('button', { name });
  await fireEvent.press(el);
};

test('setup, type a check in, review and save', async () => {
  await render(<App />);
  // Skip setup on the first screen: lands on Check in tab
  await press('Skip setup for now');
  expect(await screen.findByText('Speak a note')).toBeTruthy();
  expect(screen.getByText('How your voice is used')).toBeTruthy();

  await press('Type instead');
  const input = await screen.findByLabelText('Your note');
  await fireEvent.changeText(input, 'I felt stressed about my deadline and tired');
  await press('Continue');

  expect(await screen.findByText('Suggested ratings')).toBeTruthy();
  expect(screen.getAllByText('Suggested by CheckPoint').length).toBeGreaterThanOrEqual(2);
  await press('Save check in');
  expect(await screen.findByText('Saved')).toBeTruthy();
  await press('Back to Home');
  expect(await screen.findByText('Record a note')).toBeTruthy();
  expect(screen.getByText('1 of 7')).toBeTruthy();
});

test('Need help? is reachable from every tab', async () => {
  await render(<App />);
  // Already onboarded in this run (state persisted by the mock store): visit each tab
  for (const tab of ['Home tab', 'Insights tab', 'Rhythm tab', 'More tab']) {
    const t = await screen.findByLabelText(tab);
    await fireEvent.press(t);
    expect(await screen.findByLabelText('Need help? Open Support')).toBeTruthy();
  }
});

test('welcome screen: brand, three promises, 4 steps at most, skip on every step', async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  await (AsyncStorage.default || AsyncStorage).clear();
  await render(<App />);
  expect(await screen.findByText('A little space to check in with you.')).toBeTruthy();
  expect(screen.getAllByLabelText('CheckPoint').length).toBeGreaterThan(0);
  ['Voice-first', 'Private', 'Supportive'].forEach((t) => expect(screen.getByText(t)).toBeTruthy());
  // Walk all steps: each one still offers Skip, and the last one is step 4
  for (let i = 1; i < 4; i += 1) {
    expect(screen.getByRole('button', { name: 'Skip setup for now' })).toBeTruthy();
    await press(i === 1 ? 'Get started' : 'Next');
    expect(await screen.findByText(`${i + 1} of 4`)).toBeTruthy();
  }
  await press('Finish');
  expect(await screen.findByText('Speak a note')).toBeTruthy();
});

test('first launch starts on setup, not Home; later launches skip it', async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const store = AsyncStorage.default || AsyncStorage;
  await store.clear();
  const first = await render(<App />);
  expect(await screen.findByText('A little space to check in with you.')).toBeTruthy();
  expect(screen.queryByText('Record a note')).toBeNull();
  await press('Skip setup for now');
  expect(await screen.findByText('Speak a note')).toBeTruthy();
  first.unmount();
  // Relaunch with the saved data: setup is not shown again
  await render(<App />);
  expect(await screen.findByLabelText('Home tab')).toBeTruthy();
  expect(screen.queryByText('A little space to check in with you.')).toBeNull();
});
