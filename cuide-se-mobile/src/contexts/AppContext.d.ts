import React, { ReactNode } from 'react';
import { Filter } from '../types';
interface AppState {
    filter: Filter;
    darkMode: boolean;
    language: string;
}
type Action = {
    type: 'SET_FILTER';
    payload: Filter;
} | {
    type: 'TOGGLE_DARK_MODE';
} | {
    type: 'SET_LANGUAGE';
    payload: string;
};
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}
export declare function AppProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useApp(): AppContextType;
export declare const setFilter: (filter: Filter) => Action;
export declare const toggleDarkMode: () => Action;
export declare const setLanguage: (language: string) => Action;
export {};
