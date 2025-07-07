import { useColorScheme } from '@/hooks/useColorScheme';
import { MoonStar } from '@/lib/icons/MoonStar';
import { Sun } from '@/lib/icons/Sun';
import { Pressable, View } from 'react-native';

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    // setAndroidNavigationBar(newTheme);
  }

  return (
    <Pressable
      onPress={toggleColorScheme}
      className='h-10 w-10 rounded-full bg-secondary border border-border items-center justify-center active:opacity-70'
    >
      <View className='items-center justify-center'>
        {isDarkColorScheme ? (
          <MoonStar className='text-secondary-foreground' size={20} strokeWidth={1.5} />
        ) : (
          <Sun className='text-secondary-foreground' size={20} strokeWidth={1.5} />
        )}
      </View>
    </Pressable>
  );
}
