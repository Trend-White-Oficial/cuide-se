type Theme = 'light' | 'dark';
export declare const useTheme: () => {
    theme: Theme;
    isLoading: boolean;
    toggleTheme: () => Promise<void>;
    setTheme: (newTheme: Theme) => Promise<void>;
    loadTheme: () => Promise<void>;
};
export {};
