import React from 'react';
import { Text, TextProps } from 'react-native';

interface IconProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
}

const createIconSet = (glyphMap: any, fontFamily: string) => {
  const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style, ...props }) => {
    return (
      <Text
        {...props}
        style={[
          {
            fontSize: size,
            color,
            fontFamily,
          },
          style,
        ]}
      >
        {glyphMap[name] || '?'}
      </Text>
    );
  };
  return Icon;
};

export default createIconSet;
export { createIconSet };

export const Ionicons = createIconSet({}, 'Ionicons');
export const MaterialIcons = createIconSet({}, 'MaterialIcons');
export const MaterialCommunityIcons = createIconSet({}, 'MaterialCommunityIcons');
export const FontAwesome = createIconSet({}, 'FontAwesome');
export const FontAwesome5 = createIconSet({}, 'FontAwesome5');
export const Feather = createIconSet({}, 'Feather');
export const Entypo = createIconSet({}, 'Entypo');
export const AntDesign = createIconSet({}, 'AntDesign');
export const SimpleLineIcons = createIconSet({}, 'SimpleLineIcons');
export const Octicons = createIconSet({}, 'Octicons');
export const Foundation = createIconSet({}, 'Foundation');
export const EvilIcons = createIconSet({}, 'EvilIcons');
export const Zocial = createIconSet({}, 'Zocial');
