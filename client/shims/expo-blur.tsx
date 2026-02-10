import React from 'react';
import { View, ViewProps } from 'react-native';

export interface BlurViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children?: React.ReactNode;
}

export const BlurView: React.FC<BlurViewProps> = ({
  intensity = 50,
  tint = 'default',
  style,
  children,
  ...props
}) => {
  const blurStyle = {
    backdropFilter: `blur(${intensity / 10}px)`,
    WebkitBackdropFilter: `blur(${intensity / 10}px)`,
    backgroundColor:
      tint === 'light'
        ? 'rgba(255, 255, 255, 0.7)'
        : tint === 'dark'
        ? 'rgba(0, 0, 0, 0.7)'
        : 'rgba(128, 128, 128, 0.5)',
  };

  return (
    <View {...props} style={[style, blurStyle]}>
      {children}
    </View>
  );
};
