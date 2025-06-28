import { combineReducers, configureStore, type AnyAction } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice"
import hostReducer from "./slices/hostSlice"
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","admin","host"],
};


const appReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  host: hostReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: AnyAction) => {
  if(action.type === "auth/logout") {
    state = undefined
  }
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
