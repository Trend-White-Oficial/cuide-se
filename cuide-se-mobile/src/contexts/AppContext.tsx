import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Filter } from '../types';

interface AppState {
  filter: Filter;
  darkMode: boolean;
  language: string;
}

type Action =
  | { type: 'SET_FILTER'; payload: Filter }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LANGUAGE'; payload: string };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const initialState: AppState = {
  filter: {},
  darkMode: false,
  language: 'pt-BR',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Actions creators
export const setFilter = (filter: Filter): Action => ({
  type: 'SET_FILTER',
  payload: filter,
});

export const toggleDarkMode = (): Action => ({
  type: 'TOGGLE_DARK_MODE',
});

export const setLanguage = (language: string): Action => ({
  type: 'SET_LANGUAGE',
  payload: language,
}); 