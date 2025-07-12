import { Dimensions } from 'react-native';

export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

export const getResponsiveWidth = (percentage: number, maxWidth?: number) => {
  const { width } = getScreenDimensions();
  const calculatedWidth = width * (percentage / 100);
  return maxWidth ? Math.min(calculatedWidth, maxWidth) : calculatedWidth;
};

export const getResponsiveHeight = (percentage: number, maxHeight?: number) => {
  const { height } = getScreenDimensions();
  const calculatedHeight = height * (percentage / 100);
  return maxHeight ? Math.min(calculatedHeight, maxHeight) : calculatedHeight;
};

export const isTablet = () => {
  const { width } = getScreenDimensions();
  return width >= 768;
};

export const isSmallPhone = () => {
  const { width } = getScreenDimensions();
  return width < 375;
};

export const getDrawerWidth = () => {
  return getResponsiveWidth(85, 400);
};

export const getModalWidth = () => {
  return getResponsiveWidth(90, 500);
};

export const getCardWidth = (columns: number = 2, padding: number = 16) => {
  const { width } = getScreenDimensions();
  const totalPadding = padding * (columns + 1);
  return (width - totalPadding) / columns;
}; 