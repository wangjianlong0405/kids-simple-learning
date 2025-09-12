import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    card: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme = {
  primary: '#667eea',
  secondary: '#764ba2',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  text: '#1f2937',
  card: '#ffffff',
};

const darkTheme = {
  primary: '#4f46e5',
  secondary: '#7c3aed',
  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
  text: '#f9fafb',
  card: '#374151',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('kids-english-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('kids-english-theme', newTheme);
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      <div 
        className={`min-h-screen transition-all duration-300 ${
          theme === 'dark' ? 'dark' : ''
        }`}
        style={{ background: colors.background }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
