import { createContext } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextProps {
  theme: Theme,
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextProps>(
  { theme: undefined!, setTheme: () => {} }
);
