import { useReducer, useCallback } from 'react';

export type ViewType = 'active' | 'archived' | 'all';

interface AppState {
  currentView: ViewType;
  selectedNoteId?: string;
  isCreating: boolean;
  isViewing: boolean;
  searchQuery: string;
  selectedTagIds: string[];
  showSuccessMessage: string | null;
  showDashboard: boolean;
}

type AppAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SELECT_NOTE'; payload: string }
  | { type: 'CREATE_NOTE' }
  | { type: 'EDIT_NOTE' }
  | { type: 'VIEW_NOTE'; payload: string }
  | { type: 'GO_HOME' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SELECTED_TAGS'; payload: string[] }
  | { type: 'SHOW_SUCCESS'; payload: string }
  | { type: 'CLEAR_SUCCESS' }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  currentView: 'active',
  selectedNoteId: undefined,
  isCreating: false,
  isViewing: false,
  searchQuery: '',
  selectedTagIds: [],
  showSuccessMessage: null,
  showDashboard: true,
};

function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...initialState,
        currentView: action.payload,
        showDashboard: true,
      };

    case 'SELECT_NOTE':
      return {
        ...state,
        selectedNoteId: action.payload,
        isCreating: false,
        isViewing: true,
        showDashboard: false,
      };

    case 'CREATE_NOTE':
      return {
        ...state,
        isCreating: true,
        selectedNoteId: undefined,
        isViewing: false,
        showDashboard: false,
      };

    case 'EDIT_NOTE':
      return {
        ...state,
        isViewing: false,
        isCreating: false,
      };

    case 'VIEW_NOTE':
      return {
        ...state,
        selectedNoteId: action.payload,
        isViewing: true,
        isCreating: false,
        showDashboard: false,
      };

    case 'GO_HOME':
      return {
        ...state,
        showDashboard: true,
        selectedNoteId: undefined,
        isCreating: false,
        isViewing: false,
        searchQuery: '',
        selectedTagIds: [],
      };

    case 'SET_SEARCH':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_SELECTED_TAGS':
      return {
        ...state,
        selectedTagIds: action.payload,
      };

    case 'SHOW_SUCCESS':
      return {
        ...state,
        showSuccessMessage: action.payload,
      };

    case 'CLEAR_SUCCESS':
      return {
        ...state,
        showSuccessMessage: null,
      };

    case 'RESET_STATE':
      return {
        ...state,
        selectedNoteId: undefined,
        isCreating: false,
        isViewing: false,
        searchQuery: '',
        selectedTagIds: [],
      };

    default:
      return state;
  }
}

/**
 * Hook optimizado para manejo de estado de la aplicación usando useReducer
 * Mejora performance y reduce re-renders innecesarios
 */
export const useAppState = () => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  // Actions memoizadas
  const handleViewChange = useCallback((view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const handleNewNote = useCallback(() => {
    dispatch({ type: 'CREATE_NOTE' });
  }, []);

  const handleNoteSelect = useCallback((noteId: string) => {
    dispatch({ type: 'SELECT_NOTE', payload: noteId });
  }, []);

  const handleGoHome = useCallback(() => {
    dispatch({ type: 'GO_HOME' });
  }, []);

  const handleEditNote = useCallback(() => {
    dispatch({ type: 'EDIT_NOTE' });
  }, []);

  const handleViewNote = useCallback((noteId: string) => {
    dispatch({ type: 'VIEW_NOTE', payload: noteId });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  }, []);

  const setSelectedTagIds = useCallback((tagIds: string[]) => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: tagIds });
  }, []);

  const displaySuccessMessage = useCallback((message: string) => {
    dispatch({ type: 'SHOW_SUCCESS', payload: message });
    setTimeout(() => dispatch({ type: 'CLEAR_SUCCESS' }), 3000);
  }, []);

  const clearSuccessMessage = useCallback(() => {
    dispatch({ type: 'CLEAR_SUCCESS' });
  }, []);

  const resetAppState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const setShowDashboard = useCallback((show: boolean) => {
    if (show) {
      dispatch({ type: 'GO_HOME' });
    }
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    handleViewChange,
    handleNewNote,
    handleNoteSelect,
    handleGoHome,
    handleEditNote,
    handleViewNote,
    displaySuccessMessage,
    clearSuccessMessage,
    setSearchQuery,
    setSelectedTagIds,
    setShowDashboard,
    resetAppState,
  };
};
