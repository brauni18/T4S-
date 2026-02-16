import type { User } from '@/types/user.type';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UserState = User;

const initialState: UserState = {
  id: crypto.randomUUID(),
  name: '',
  favoriteTeams: [],
  location: '',
  isAdult21Plus: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; name: string; favoriteTeams?: string[]; location?: string; isAdult21Plus?: boolean }>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      if (action.payload.favoriteTeams) state.favoriteTeams = action.payload.favoriteTeams;
      if (action.payload.location) state.location = action.payload.location;
      if (action.payload.isAdult21Plus !== undefined) state.isAdult21Plus = action.payload.isAdult21Plus;
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
    setIsAdult21Plus: (state, action: PayloadAction<boolean>) => {
      state.isAdult21Plus = action.payload;
    },
    resetUser: (state) => {
      state.id = crypto.randomUUID();
      state.name = '';
      state.favoriteTeams = [];
      state.location = '';
      state.isAdult21Plus = undefined;
    }
  }
});

export const { setUser, updateUserName, setFavoriteTeams, setLocation, setIsAdult21Plus, resetUser } = userSlice.actions;

export default userSlice.reducer;
