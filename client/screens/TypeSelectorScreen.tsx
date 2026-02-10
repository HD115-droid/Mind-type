import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemedText } from '@/components/ThemedText';
import { TypeBadge } from '@/components/TypeBadge';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { MBTIType, mbtiPersonalities } from '@/data/mbtiTypes';
import { Spacing } from '@/constants/theme';

type RootStackParamList = {
  Main: undefined;
};

const ALL_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

export default function TypeSelectorScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUserMBTI, setHasCompletedTest, userMBTI } = useApp();

  const [selectedType, setSelectedType] = useState<MBTIType | null>(userMBTI);

  const handleSelectType = (type: MBTIType) => {
    setSelectedType(type);
  };

  const handleConfirm = async () => {
    if (selectedType) {
      await setUserMBTI(selectedType);
      await setHasCompletedTest(true);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    }
  };

  const renderType = ({ item }: { item: MBTIType }) => {
    const personality = mbtiPersonalities.find(p => p.type === item);
    return (
      <View style={styles.typeItem}>
        <TypeBadge 
          type={item} 
          size="medium" 
          selected={selectedType === item}
          onPress={() => handleSelectType(item)}
        />
        {personality ? (
          <ThemedText type="small" style={[styles.roleName, { color: theme.textSecondary }]}>
            {personality.roleName}
          </ThemedText>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={ALL_TYPES}
        renderItem={renderType}
        keyExtractor={(item) => item}
        numColumns={4}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: headerHeight + Spacing.xl, paddingBottom: insets.bottom + 100 },
        ]}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="h3" style={styles.title}>Select Your Type</ThemedText>
            <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
              Choose the personality type that best describes you
            </ThemedText>
          </View>
        }
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg, backgroundColor: theme.backgroundRoot }]}>
        <Button 
          onPress={handleConfirm} 
          disabled={!selectedType}
          testID="button-confirm-selected"
        >
          Confirm Selection
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  typeItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  roleName: {
    fontSize: 10,
    textAlign: 'center',
    maxWidth: 70,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});
