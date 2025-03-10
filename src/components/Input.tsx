import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  TextInputProps, 
  ViewStyle, 
  TextStyle,
  Animated,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import useTheme from '../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  floatingLabel?: boolean;
  helperText?: string;
  success?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  secureTextEntry = false,
  showPasswordToggle = false,
  floatingLabel = false,
  helperText,
  success = false,
  variant = 'outlined',
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(animatedLabelValue, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const getBorderColor = () => {
    if (error) return COLORS.error;
    if (success) return COLORS.success;
    if (isFocused) return isDarkMode ? COLORS.primaryLight : COLORS.primary;
    return isDarkMode ? COLORS.darkGrey : COLORS.lightGrey;
  };

  const getBackgroundColor = () => {
    if (variant === 'filled') {
      return isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
    }
    return isDarkMode ? COLORS.darkSurface : COLORS.white;
  };

  const getInputContainerStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: getBorderColor(),
          borderRadius: SIZES.radius,
          backgroundColor: getBackgroundColor(),
        };
      case 'filled':
        return {
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: getBorderColor(),
          borderRadius: SIZES.radius,
          backgroundColor: getBackgroundColor(),
        };
      case 'underlined':
        return {
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: getBorderColor(),
          borderRadius: 0,
          backgroundColor: 'transparent',
        };
      default:
        return {
          borderWidth: 1,
          borderColor: getBorderColor(),
          borderRadius: SIZES.radius,
          backgroundColor: getBackgroundColor(),
        };
    }
  };

  const labelTop = animatedLabelValue.interpolate({
    inputRange: [0, 1],
    outputRange: [floatingLabel ? 14 : 0, -10],
  });

  const labelFontSize = animatedLabelValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SIZES.body3, SIZES.body4],
  });

  const labelLeft = animatedLabelValue.interpolate({
    inputRange: [0, 1],
    outputRange: [leftIcon ? SIZES.padding + 24 : SIZES.padding, SIZES.base],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && !floatingLabel && (
        <Text
          style={[
            styles.label,
            {
              color: isDarkMode ? COLORS.darkTextSecondary : COLORS.textSecondary,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          getInputContainerStyle(),
          isFocused && variant !== 'underlined' && SHADOWS.light,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        {floatingLabel && label && (
          <Animated.Text
            style={[
              styles.floatingLabel,
              {
                top: labelTop,
                fontSize: labelFontSize,
                left: labelLeft,
                color: isFocused 
                  ? isDarkMode ? COLORS.primaryLight : COLORS.primary
                  : isDarkMode ? COLORS.darkTextSecondary : COLORS.textSecondary,
                backgroundColor: variant === 'outlined' ? (isDarkMode ? COLORS.darkSurface : COLORS.white) : 'transparent',
                paddingHorizontal: variant === 'outlined' ? 4 : 0,
              },
              labelStyle,
            ]}
          >
            {label}
          </Animated.Text>
        )}
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: isDarkMode ? COLORS.darkText : COLORS.text,
              paddingTop: floatingLabel ? SIZES.base : 0,
            },
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || (secureTextEntry && showPasswordToggle)) ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={
            isDarkMode ? COLORS.darkTextDisabled : COLORS.textDisabled
          }
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          {...props}
        />
        
        {secureTextEntry && showPasswordToggle && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={isDarkMode ? COLORS.darkTextSecondary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? COLORS.error : isDarkMode ? COLORS.darkTextSecondary : COLORS.textSecondary,
            },
            error && styles.error,
            errorStyle,
          ]}
        >
          {error || helperText}
        </Text>
      )}
      
      {success && !error && !helperText && (
        <Text
          style={[
            styles.helperText,
            {
              color: COLORS.success,
            },
          ]}
        >
          Valid
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
    position: 'relative',
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    marginBottom: SIZES.base / 2,
  },
  floatingLabel: {
    position: 'absolute',
    ...FONTS.medium,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SIZES.padding,
    ...FONTS.regular,
    fontSize: SIZES.body2,
  },
  inputWithLeftIcon: {
    paddingLeft: SIZES.base,
  },
  inputWithRightIcon: {
    paddingRight: SIZES.base,
  },
  leftIcon: {
    paddingLeft: SIZES.padding,
  },
  rightIcon: {
    paddingRight: SIZES.padding,
  },
  helperText: {
    ...FONTS.regular,
    fontSize: SIZES.body4,
    marginTop: SIZES.base / 2,
  },
  error: {
    color: COLORS.error,
  },
});

export default Input; 