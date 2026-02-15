import type { User } from '@/types/user.type';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UserState = User;

const initialState: UserState = {
  id: crypto.randomUUID(),
  name: '',
  favoriteTeams: [],
  location: '',
  isAdult18Plus: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; name: string; favoriteTeams?: string[]; location?: string; isAdult18Plus?: boolean }>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      if (action.payload.favoriteTeams) state.favoriteTeams = action.payload.favoriteTeams;
      if (action.payload.location) state.location = action.payload.location;
      if (action.payload.isAdult18Plus !== undefined) state.isAdult18Plus = action.payload.isAdult18Plus;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setFavoriteTeams: (state, action: PayloadAction<string[]>) => {
      state.favoriteTeams = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setIsAdult18Plus: (state, action: PayloadAction<boolean>) => {
      state.isAdult18Plus = action.payload;
    },
    resetUser: (state) => {
      state.id = crypto.randomUUID();
      state.name = '';
      state.favoriteTeams = [];
      state.location = '';
      state.isAdult18Plus = undefined;
    }
  }
});

export const { setUser, updateUserName, setFavoriteTeams, setLocation, setIsAdult18Plus, resetUser } = userSlice.actions;

export default userSlice.reducer;
