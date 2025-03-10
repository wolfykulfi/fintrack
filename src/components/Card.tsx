import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import useTheme from '../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: 'none' | 'light' | 'medium' | 'dark';
  onPress?: () => void;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  shadow = 'medium',
  onPress,
  borderColor,
  borderWidth,
  borderRadius,
  padding,
  margin,
  backgroundColor,
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

  const cardStyle = {
    backgroundColor: backgroundColor || (isDarkMode ? COLORS.darkCard : COLORS.card),
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: borderRadius !== undefined ? borderRadius : SIZES.radius,
    padding: padding !== undefined ? padding : SIZES.padding,
    margin: margin !== undefined ? margin : SIZES.base,
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        cardStyle,
        shadow !== 'none' && getShadowStyle(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: SIZES.base,
    overflow: 'hidden',
  },
});

export default Card; 