import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/store/slices/counter.slice';
import userReducer from '@/store/slices/user.slice';
import { pokemonApi } from './apis/pokemon.api';
import { matchesApi } from './apis/matches.api';
import { setupListeners } from '@reduxjs/toolkit/query/react';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [matchesApi.reducerPath]: matchesApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    pokemonApi.middleware,
    matchesApi.middleware
  )
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
