// Walks the other priority features: insights, sleep insights, rhythm, voice flow, small action, data controls.
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

const press = async (name) => fireEvent.press(await screen.findByRole('button', { name }));
const tab = async (name) => fireEvent.press(await screen.findByLabelText(`${name} tab`));

beforeEach(async () => {
  await AsyncStorage.clear();
});

test('insights: empty state, then demo data shows headline, basis and Not right', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await tab('Insights');
  expect(await screen.findByText('7 more days needed')).toBeTruthy();
  await press('Load demo data to preview');
  expect(await screen.findByText(/On nights under 6 hours, your stress was higher/)).toBeTruthy();
  expect(screen.getByText(/^Based on \d+ Check ins and \d+ nights of sleep$/)).toBeTruthy();
  expect(screen.getByText('This shows a pattern, not a cause.')).toBeTruthy();
  await press('Not right');
  expect(await screen.findByText(/hidden this insight/)).toBeTruthy();
  await press('Undo');
  await fireEvent.press(await screen.findByRole('tab', { name: 'Last 7 days' }));
  expect(await screen.findByLabelText(/^Mood chart\. Mood: \d+ days with data, average [\d.]+ out of 5\.$/)).toBeTruthy();
});

test('sleep insights wording is a pattern, not a cause', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await tab('Insights');
  await press('Load demo data to preview');
  await fireEvent.press(await screen.findByLabelText(/Sleep and mood/));
  expect(await screen.findByText(/your mood was lower/)).toBeTruthy();
  expect(screen.getByText(/pattern, not a cause/)).toBeTruthy();
  await press('How we worked this out');
  expect(await screen.findByText(/split the days/)).toBeTruthy();
});

test('rhythm: rest day counts, no streak wording', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await tab('Rhythm');
  expect(await screen.findByText('0 of 7 days')).toBeTruthy();
  await press('Mark today as a rest day');
  expect(await screen.findByText('1 of 7 days')).toBeTruthy();
  expect(screen.getByText('Rest days count.')).toBeTruthy();
  expect(screen.queryByText(/streak/i)).toBeNull();
});

test('voice flow: record, stop, transcribe, review', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await tab('Home');
  await press('Record a note');
  expect(await screen.findByText('Recording')).toBeTruthy();
  await press('Stop recording');
  expect(await screen.findByText('Suggested ratings', {}, { timeout: 4000 })).toBeTruthy();
});

test('small action: dismiss is silent and offers the next one', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await tab('Home');
  await press('Not today');
  expect(screen.queryByText(/missed|failed|sorry/i)).toBeNull();
  await press('Not today');
  await press('Not today');
  expect(await screen.findByText('That is enough for today.')).toBeTruthy();
});

test('data controls: Delete data is 2 taps from More and needs confirmation', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await tab('More');
  expect(await screen.findByText('Your data')).toBeTruthy();
  await fireEvent.press(await screen.findByLabelText(/Delete my data/));
  expect(await screen.findByText('Delete all your data?')).toBeTruthy();
  await press('Delete everything');
  expect(await screen.findByText('Your data has been deleted')).toBeTruthy();
});

test('health: add by hand saves, skip shows nothing', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await tab('More');
  await fireEvent.press(await screen.findByLabelText(/Health connections/));
  await press('Save');
  expect(await screen.findByText('Saved to your record.')).toBeTruthy();
  await press('Skip for now');
  expect(await screen.findByText('Your data')).toBeTruthy();
});

test('More has no version text', async () => {
  await render(<App />);
  await press('Skip setup for now');
  await fireEvent.press(await screen.findByLabelText('More tab'));
  expect(await screen.findByText('Your data')).toBeTruthy();
  expect(screen.queryByText(/beta 1/i)).toBeNull();
});
