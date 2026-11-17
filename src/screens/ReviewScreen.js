import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Screen, Card, Caption, Body } from '../components/Layout';
import Button from '../components/Button';
import RatingRow from '../components/RatingRow';
import Tip from '../components/Tip';
import { useApp } from '../store/AppContext';
import { suggestRatings, showsDistress } from '../services/suggest';
import { METRIC_KEYS } from '../data/metrics';
import { toKey } from '../utils/dates';
import { colors, radius, type } from '../theme';

// Turn AI suggestions into editable rating entries. No evidence = no guess (value null).
const toEntries = (text) => {
  const s = suggestRatings(text);
  const out = {};
  METRIC_KEYS.forEach((k) => {
    out[k] = s[k]
      ? { value: s[k].value, source: 'ai', phrases: s[k].phrases }
      : { value: null, source: null, phrases: [] };
  });
  return out;
};

// Review Check in (C2). The AI only suggests. The user can fix the transcript, change or remove
// every rating, and nothing is saved until they press Save (error prevention, user control).
export default function ReviewScreen({ navigation, route }) {
  const { dispatch } = useApp();
  const { source } = route.params;
  const [text, setText] = useState(route.params.text);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(route.params.text);
  const [ratings, setRatings] = useState(() => toEntries(route.params.text));
  const [updated, setUpdated] = useState(false);

  const update = (k, patch) => setRatings((r) => ({ ...r, [k]: { ...r[k], ...patch } }));

  // If the transcript is wrong, fixing it re-reads the words and refreshes the suggestions
  const applyEdit = () => {
    setText(draft.trim());
    setRatings(toEntries(draft));
    setEditing(false);
    setUpdated(true);
  };

  const save = () => {
    const now = new Date();
    const phrases = {};
    METRIC_KEYS.forEach((k) => { phrases[k] = ratings[k].phrases; });
    dispatch({
      type: 'ADD_CHECKIN',
      checkIn: {
        id: `ci-${now.getTime()}`,
        date: toKey(now),
        createdAt: now.toISOString(),
        text,
        mood: ratings.mood.value,
        stress: ratings.stress.value,
        energy: ratings.energy.value,
        phrases,
        source,
      },
    });
    navigation.replace('Saved', { distress: showsDistress(text) });
  };

  return (
    <Screen>
      <Tip id="review" text="CheckPoint only suggests ratings. Tap Edit on any rating to change it, or Remove to leave it out." />

      <Card>
        <Text style={type.h3}>Your note</Text>
        {editing ? (
          <>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Edit your note"
              style={styles.input}
            />
            <Button title="Done editing" onPress={applyEdit} disabled={draft.trim().length === 0} />
          </>
        ) : (
          <>
            <Body style={{ marginVertical: 8 }}>{text}</Body>
            <Button title="Edit text" variant="ghost" icon="pencil" onPress={() => { setDraft(text); setEditing(true); }} />
          </>
        )}
        {updated && !editing && <Caption accessibilityLiveRegion="polite">Suggestions updated from your edited note.</Caption>}
      </Card>

      <Card>
        <Text style={type.h3}>Suggested ratings</Text>
        <Caption>These are suggestions from your words, not facts about you.</Caption>
        {METRIC_KEYS.map((k) => (
          <RatingRow
            key={`${k}-${text}`}
            metric={k}
            entry={ratings[k]}
            onChange={(v) => update(k, { value: v, source: 'user', removed: false })}
            onRemove={() => update(k, { value: null, source: null, phrases: [], removed: true })}
          />
        ))}
      </Card>

      <Button title="Save check in" onPress={save} disabled={editing} hint="Saves this note and the ratings you chose" />
      <Button title="Discard" variant="ghost" onPress={() => navigation.popToTop()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginVertical: 8,
  },
});
