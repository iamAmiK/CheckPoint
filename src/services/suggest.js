// "AI" rating suggestions. In this beta it is a small, transparent keyword model so
// every suggestion can be traced back to the exact words the user said (the phrases).
// It only suggests a rating when it finds evidence; otherwise it returns null and the
// Review screen shows a plain tap scale instead (error prevention).

const LEXICON = {
  mood: {
    up: ['happy', 'good', 'great', 'excited', 'proud', 'relaxed', 'calm', 'cheerful', 'enjoyed', 'fine'],
    down: ['sad', 'down', 'low', 'awful', 'lonely', 'upset', 'miserable', 'crying', 'hopeless', 'terrible'],
  },
  stress: {
    up: ['stressed', 'overwhelmed', 'anxious', 'worried', 'panic', 'deadline', 'exam', 'pressure', 'swamped', 'nervous'],
    down: ['relaxed', 'calm', 'chilled', 'peaceful', 'easy', 'unwind'],
  },
  energy: {
    up: ['energised', 'energized', 'energetic', 'motivated', 'active', 'awake', 'productive'],
    down: ['tired', 'exhausted', 'drained', 'sleepy', 'flat', 'fatigued', 'wiped'],
  },
};

// Phrases that should trigger the calm support prompt after saving.
const DISTRESS = ['hopeless', "can't cope", 'cannot cope', 'no point', 'give up', 'hurt myself', 'disappear', "can't go on"];

const NEGATIONS = ['not', "isn't", "wasn't", 'never', 'no'];

const clamp = (n) => Math.max(1, Math.min(5, n));

// Find lexicon words in the text. A negation directly before a word flips its direction.
function findHits(words, list, sign) {
  const hits = [];
  words.forEach((w, i) => {
    if (list.includes(w)) {
      const negated = i > 0 && NEGATIONS.includes(words[i - 1]);
      hits.push({ phrase: negated ? `${words[i - 1]} ${w}` : w, sign: negated ? -sign : sign });
    }
  });
  return hits;
}

export function suggestRatings(text) {
  const words = (text || '').toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);
  const result = {};
  for (const metric of Object.keys(LEXICON)) {
    const hits = [
      ...findHits(words, LEXICON[metric].up, 1),
      ...findHits(words, LEXICON[metric].down, -1),
    ];
    if (hits.length === 0) {
      result[metric] = null; // not enough evidence: do not guess
    } else {
      const score = hits.reduce((s, h) => s + h.sign, 0);
      // 3 is neutral; each net hit moves the suggestion by 1 up to a max of 2 steps
      const value = clamp(3 + Math.max(-2, Math.min(2, score)));
      result[metric] = { value, phrases: [...new Set(hits.map((h) => h.phrase))] };
    }
  }
  return result;
}

export function showsDistress(text) {
  const t = (text || '').toLowerCase();
  return DISTRESS.some((p) => t.includes(p));
}
