import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MoonStar } from '@/lib/icons/MoonStar';
import { Sun } from '@/lib/icons/Sun';
import { Pressable, View } from 'react-native';

export function ThemeToggle() {
  const { colorScheme, isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const getIcon = () => {
    if (colorScheme === 'system') {
      return isDarkColorScheme ? (
        <MoonStar className='text-secondary-foreground' size={18} strokeWidth={1.5} />
      ) : (
        <Sun className='text-secondary-foreground' size={18} strokeWidth={1.5} />
      );
    }
    return colorScheme === 'dark' ? (
      <MoonStar className='text-secondary-foreground' size={18} strokeWidth={1.5} />
    ) : (
      <Sun className='text-secondary-foreground' size={18} strokeWidth={1.5} />
    );
  };

  const getLabel = () => {
    switch (colorScheme) {
      case 'system': return 'Auto';
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      default: return 'Auto';
    }
  };

  return (
    <Pressable
      onPress={toggleColorScheme}
      className='h-12 px-3 rounded-xl bg-secondary border border-border items-center justify-center active:opacity-70 flex-row gap-2'
    >
      <View className='items-center justify-center'>
        {getIcon()}
      </View>
      <Text className='text-secondary-foreground text-sm font-medium'>
        {getLabel()}
      </Text>
    </Pressable>
  );
}
