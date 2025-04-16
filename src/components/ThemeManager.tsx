import type { ReactNode } from 'react';

import { useEffect } from 'react';

import { useTheme } from '../utils/Context/Theme/useTheme';

interface ThemeManagerProps {
  children: ReactNode;
}

const ThemeManager = ({ children }: ThemeManagerProps) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Применяем класс темной темы
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeManager;
