import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
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
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
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
          {
            borderColor: error
              ? COLORS.error
              : isDarkMode
              ? COLORS.darkGrey
              : COLORS.lightGrey,
            backgroundColor: isDarkMode ? COLORS.darkSurface : COLORS.white,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: isDarkMode ? COLORS.darkText : COLORS.text,
            },
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || (secureTextEntry && showPasswordToggle)) &&
              styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={
            isDarkMode ? COLORS.darkTextDisabled : COLORS.textDisabled
          }
          secureTextEntry={secureTextEntry && !isPasswordVisible}
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
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: COLORS.error,
            },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    marginBottom: SIZES.base / 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    height: 50,
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
  error: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    marginTop: SIZES.base / 2,
  },
});

export default Input; 