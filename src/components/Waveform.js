import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, AccessibilityInfo, StyleSheet } from 'react-native';
import { colors } from '../theme';

const BARS = 24;

// Live waveform for the recording screen (C3: clear recording status).
// Falls back to still bars when the device asks to reduce motion.
export default function Waveform({ active }) {
  const vals = useRef(Array.from({ length: BARS }, () => new Animated.Value(0.3))).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    if (!active || reduceMotion) return undefined;
    const loops = vals.map((v, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: 350 + (i % 5) * 90, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.2, duration: 350 + (i % 7) * 70, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      );
      loop.start();
      return loop;
    });
    return () => loops.forEach((l) => l.stop());
  }, [active, reduceMotion, vals]);

  return (
    <View style={styles.row} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {vals.map((v, i) => (
        <Animated.View key={i} style={[styles.bar, { transform: [{ scaleY: active ? v : 0.2 }] }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 70 },
  bar: { width: 5, height: 60, borderRadius: 3, backgroundColor: colors.primary, marginHorizontal: 2 },
});
