/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    destructive: '#FF0000',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#007AFF',
    secondary: '#6E6E73',
  },
  dark: {
    text: '#ECEDEE',
    primary: '#007AFF',
    secondary: '#6E6E73',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    destructive: '#FF0000',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const NAV_THEME = {
  light: {
    text: '#242c40',
    background: '#d0d7e9',
    tint: '#0a7ea4',
    icon: '#8fa3b2',
    tabIconDefault: '#8fa3b2',
    tabIconSelected: '#0a7ea4',
    primary: '#007AFF',
    secondary: '#6E6E73',
  },
  dark: {
    text: '#d0d7e9',
    background: '#151a2d',
    tint: '#0a7ea4',
    icon: '#4a6a92',
    tabIconDefault: '#4a6a92',
    tabIconSelected: '#0a7ea4',
    primary: '#0A84FF',
    secondary: '#8E8E93',
  },
};
