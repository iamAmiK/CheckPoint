// Beta stand-in for speech-to-text. A real build would send the recording to a
// transcription service here and then delete the audio. Keeping it behind one function
// means only this file changes when real voice processing is added.
const SAMPLES = [
  'I felt really stressed after my lecture today. I have a deadline coming up and I am a bit tired, but the walk home helped.',
  'Today was pretty good. I felt calm and relaxed, and I got a lot done in the library.',
  'I am feeling low and exhausted. I did not sleep much and everything feels like too much right now.',
];
let next = 0;

export function transcribe() {
  const text = SAMPLES[next % SAMPLES.length];
  next += 1;
  return new Promise((resolve) => setTimeout(() => resolve(text), 1500));
}
