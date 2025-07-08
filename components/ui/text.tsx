import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import { Text as RNText } from 'react-native';

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof RNText> & {
  ref?: React.RefObject<RNText>;
  asChild?: boolean;
}) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  
  // Map font weight classes to Geist font families
  const getFontFamily = (className?: string) => {
    if (!className) return 'Geist_400Regular';
    
    if (className.includes('font-thin')) return 'Geist_100Thin';
    if (className.includes('font-medium')) return 'Geist_500Medium';
    if (className.includes('font-semibold')) return 'Geist_600SemiBold';
    if (className.includes('font-bold')) return 'Geist_700Bold';
    if (className.includes('font-extrabold')) return 'Geist_800ExtraBold';
    if (className.includes('font-black')) return 'Geist_900Black';
    
    return 'Geist_400Regular';
  };

  const combinedClassName = cn('text-base text-foreground web:select-text', textClass, className);
  const fontFamily = getFontFamily(combinedClassName);
  
  return (
    <Component
      style={{ fontFamily }}
      className={combinedClassName}
      {...props}
    />
  );
}

export { Text, TextClassContext };
