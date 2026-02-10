import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface LinearGradientProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  style?: any;
  children?: React.ReactNode;
}

export const LinearGradient: React.FC<LinearGradientProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  locations,
  style,
  children,
}) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90;

  const gradientStops = colors.map((color, index) => {
    const location = locations ? locations[index] * 100 : (index / (colors.length - 1)) * 100;
    return `${color} ${location}%`;
  }).join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(${angle}deg, ${gradientStops})`,
  };

  return (
    <View style={[styles.container, gradientStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
