import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import useTheme from '../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { isDarkMode } = useTheme();

  const getButtonStyles = () => {
    let buttonStyle: ViewStyle = {};
    let textStyleVariant: TextStyle = {};

    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: COLORS.primary,
        };
        textStyleVariant = {
          color: COLORS.white,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: COLORS.secondary,
        };
        textStyleVariant = {
          color: COLORS.black,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDarkMode ? COLORS.primaryLight : COLORS.primary,
        };
        textStyleVariant = {
          color: isDarkMode ? COLORS.primaryLight : COLORS.primary,
        };
        break;
      case 'text':
        buttonStyle = {
          backgroundColor: 'transparent',
        };
        textStyleVariant = {
          color: isDarkMode ? COLORS.primaryLight : COLORS.primary,
        };
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SIZES.base,
          paddingHorizontal: SIZES.padding,
        };
        textStyleVariant = {
          ...textStyleVariant,
          ...FONTS.medium,
          fontSize: SIZES.body3,
        };
        break;
      case 'medium':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SIZES.base * 1.5,
          paddingHorizontal: SIZES.padding,
        };
        textStyleVariant = {
          ...textStyleVariant,
          ...FONTS.medium,
          fontSize: SIZES.body2,
        };
        break;
      case 'large':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SIZES.base * 2,
          paddingHorizontal: SIZES.padding * 1.5,
        };
        textStyleVariant = {
          ...textStyleVariant,
          ...FONTS.bold,
          fontSize: SIZES.body1,
        };
        break;
    }

    // Disabled style
    if (disabled) {
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: variant === 'outline' || variant === 'text' ? 'transparent' : COLORS.lightGrey,
        borderColor: variant === 'outline' ? COLORS.lightGrey : buttonStyle.borderColor,
        opacity: 0.7,
      };
      textStyleVariant = {
        ...textStyleVariant,
        color: variant === 'outline' || variant === 'text' ? COLORS.textDisabled : COLORS.textSecondary,
      };
    }

    return { buttonStyle, textStyleVariant };
  };

  const { buttonStyle, textStyleVariant } = getButtonStyles();

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[styles.text, textStyleVariant, icon && styles.textWithIcon, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: SIZES.base,
  },
});

export default Button; 