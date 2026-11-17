import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, MIN_TARGET } from '../theme';

// Beta/Hi-Fi change C1: "Need help?" sits in the top bar of every tab, in the same place,
// so Support is always one tap away (the test goal was 2 or fewer).
export default function NeedHelpLink() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate('Support')}
      accessibilityRole="button"
      accessibilityLabel="Need help? Open Support"
      style={styles.link}
    >
      <Ionicons name="heart-outline" size={18} color={colors.primaryDark} />
      <Text style={styles.text}>Need help?</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: MIN_TARGET, minWidth: MIN_TARGET, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  text: { color: colors.primaryDark, fontWeight: '600', fontSize: 15, marginLeft: 4 },
});
