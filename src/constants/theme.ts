import { DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const COLORS = {
  // Primary colors
  primary: '#6200ee',
  primaryDark: '#3700b3',
  primaryLight: '#bb86fc',
  
  // Secondary colors
  secondary: '#03dac6',
  secondaryDark: '#018786',
  secondaryLight: '#66fff9',
  
  // Accent colors
  accent: '#ff4081',
  accentDark: '#c51162',
  accentLight: '#ff80ab',
  
  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  grey: '#9e9e9e',
  lightGrey: '#e0e0e0',
  darkGrey: '#616161',
  
  // Background colors
  background: '#f5f5f5',
  card: '#ffffff',
  surface: '#ffffff',
  
  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#9e9e9e',
  
  // Dark theme colors
  darkBackground: '#121212',
  darkCard: '#1e1e1e',
  darkSurface: '#1e1e1e',
  darkText: '#ffffff',
  darkTextSecondary: '#b0b0b0',
  darkTextDisabled: '#6e6e6e',
  
  // Category colors
  food: '#ff5722',
  transportation: '#2196f3',
  shopping: '#e91e63',
  entertainment: '#9c27b0',
  housing: '#3f51b5',
  utilities: '#00bcd4',
  healthcare: '#4caf50',
  personalCare: '#8bc34a',
  education: '#ffc107',
  travel: '#795548',
  income: '#4caf50',
  investments: '#009688',
  other: '#9e9e9e',
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: 'normal' as 'normal',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: 'bold' as 'bold',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300' as '300',
  },
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 8,
  padding: 16,
  margin: 16,
  
  // Font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,
  
  // App dimensions
  width: '100%',
  height: '100%',
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 6,
  },
};

// Custom Light Theme
export const LightTheme = {
  ...DefaultTheme,
  ...MD3LightTheme,
  colors: {
    ...DefaultTheme.colors,
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.lightGrey,
    notification: COLORS.accent,
    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
    info: COLORS.info,
  },
};

// Custom Dark Theme
export const DarkTheme = {
  ...NavigationDarkTheme,
  ...MD3DarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...MD3DarkTheme.colors,
    primary: COLORS.primaryLight,
    background: COLORS.darkBackground,
    card: COLORS.darkCard,
    text: COLORS.darkText,
    border: COLORS.darkGrey,
    notification: COLORS.accentLight,
    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
    info: COLORS.info,
  },
};

export default {
  COLORS,
  FONTS,
  SIZES,
  SHADOWS,
  LightTheme,
  DarkTheme,
}; 