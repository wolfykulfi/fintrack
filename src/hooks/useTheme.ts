import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme, setTheme } from '../store/slices/themeSlice';
import { LightTheme, DarkTheme } from '../constants/theme';

export const useTheme = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const dispatch = useDispatch();

  const theme = isDarkMode ? DarkTheme : LightTheme;

  const toggleThemeMode = () => {
    dispatch(toggleTheme());
  };

  const setThemeMode = (isDark: boolean) => {
    dispatch(setTheme(isDark));
  };

  return {
    theme,
    isDarkMode,
    toggleThemeMode,
    setThemeMode,
  };
};

export default useTheme; 