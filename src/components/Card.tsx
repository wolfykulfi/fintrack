import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import useTheme from '../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: 'none' | 'light' | 'medium' | 'dark';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  shadow = 'medium',
}) => {
  const { isDarkMode } = useTheme();

  const getShadowStyle = () => {
    switch (shadow) {
      case 'none':
        return {};
      case 'light':
        return SHADOWS.light;
      case 'medium':
        return SHADOWS.medium;
      case 'dark':
        return SHADOWS.dark;
      default:
        return SHADOWS.medium;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? COLORS.darkCard : COLORS.card,
        },
        shadow !== 'none' && getShadowStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: SIZES.base,
  },
});

export default Card; 