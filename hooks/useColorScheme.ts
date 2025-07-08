import * as SecureStore from 'expo-secure-store';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ColorSchemePreference = 'system' | 'light' | 'dark';

const COLOR_SCHEME_KEY = 'color-scheme-preference';

export function useColorScheme() {
  const { colorScheme: nativewindScheme, setColorScheme: setNativewindScheme } = useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const [userPreference, setUserPreference] = useState<ColorSchemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load saved preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await SecureStore.getItemAsync(COLOR_SCHEME_KEY);
        if (saved && ['system', 'light', 'dark'].includes(saved)) {
          setUserPreference(saved as ColorSchemePreference);
        }
      } catch (error) {
        console.warn('Failed to load color scheme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPreference();
  }, []);
  
  // Determine effective color scheme based on user preference
  const effectiveColorScheme = userPreference === 'system' ? systemColorScheme : userPreference;
  
  // Update NativeWind when effective scheme changes
  useEffect(() => {
    if (isLoaded && effectiveColorScheme && effectiveColorScheme !== nativewindScheme) {
      setNativewindScheme(effectiveColorScheme);
    }
  }, [effectiveColorScheme, nativewindScheme, setNativewindScheme, isLoaded]);
  
  const setColorScheme = async (preference: ColorSchemePreference) => {
    setUserPreference(preference);
    try {
      await SecureStore.setItemAsync(COLOR_SCHEME_KEY, preference);
    } catch (error) {
      console.warn('Failed to save color scheme preference:', error);
    }
    
    // Reset to system mode by setting system, or set specific mode
    if (preference === 'system') {
      setNativewindScheme('system');
    } else {
      setNativewindScheme(preference);
    }
  };
  
  const toggleColorScheme = () => {
    const modes: ColorSchemePreference[] = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(userPreference);
    const nextIndex = (currentIndex + 1) % modes.length;
    setColorScheme(modes[nextIndex]);
  };
  
  return {
    colorScheme: userPreference,
    effectiveColorScheme: effectiveColorScheme ?? 'dark',
    isDarkColorScheme: effectiveColorScheme === 'dark',
    isSystemMode: userPreference === 'system',
    isLoaded,
    setColorScheme,
    toggleColorScheme,
  };
}