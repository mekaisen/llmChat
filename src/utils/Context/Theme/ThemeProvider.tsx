import type { ReactNode } from 'react';

import { useMemo, useState } from 'react';

import type { Theme } from './ThemeContext';

import { ThemeContext } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode,
  defaultProfile: Theme
}

const ThemeProvider = ({ children, defaultProfile }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultProfile);
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext value={value}>{children}</ThemeContext>
  );
};
export default ThemeProvider;
