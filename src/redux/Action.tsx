// actions.ts
export const SET_THEME = 'SET_THEME';

interface SetThemeAction {
  type: typeof SET_THEME;
  payload: string;
}

export type ActionTypes = SetThemeAction;

export const setTheme = (theme: string): SetThemeAction => ({
  type: SET_THEME,
  payload: theme,
});
