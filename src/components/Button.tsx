import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, Animated, View } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
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
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  elevation?: boolean;
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
  iconPosition = 'left',
  fullWidth = false,
  elevation = true,
}) => {
  const { isDarkMode } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyles = () => {
    let buttonStyle: ViewStyle = {};
    let textStyleVariant: TextStyle = {};

    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: COLORS.primary,
          ...(elevation && !disabled ? SHADOWS.medium : {}),
        };
        textStyleVariant = {
          color: COLORS.white,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: COLORS.secondary,
          ...(elevation && !disabled ? SHADOWS.medium : {}),
        };
        textStyleVariant = {
          color: COLORS.black,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
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
          borderRadius: SIZES.radius - 4,
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
          borderRadius: SIZES.radius,
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
          borderRadius: SIZES.radius,
        };
        textStyleVariant = {
          ...textStyleVariant,
          ...FONTS.bold,
          fontSize: SIZES.body1,
        };
        break;
    }

    // Full width style
    if (fullWidth) {
      buttonStyle = {
        ...buttonStyle,
        width: '100%',
      };
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
    <Animated.View
      style={{
        transform: [{ scale: animatedValue }],
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <TouchableOpacity
        style={[styles.button, buttonStyle, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.white}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
            <Text style={[
              styles.text, 
              textStyleVariant, 
              icon && iconPosition === 'left' ? styles.textWithIcon : null, 
              textStyle
            ]}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
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
  iconLeft: {
    marginRight: SIZES.base,
  },
  iconRight: {
    marginLeft: SIZES.base,
  },
});

export default Button; 