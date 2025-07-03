import { combineReducers, configureStore, type AnyAction } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice"
import hostReducer from "./slices/hostSlice"
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["user","admin","host"],
// };

const authPersistConfig = {
  key: "auth",
  storage,
};

const adminPersistConfig = {
  key: "admin",
  storage,
};

const hostPersistConfig = {
  key: "host",
  storage,
};



const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  admin: persistReducer(adminPersistConfig, adminReducer),
  host: persistReducer(hostPersistConfig, hostReducer),
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: AnyAction) => {
  if(action.type === "auth/logout") {
    storage.removeItem("persist:auth"); 
    return appReducer({
    ...state, auth: undefined
  }, action)
  }
  return appReducer(state, action)
}

// const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: rootReducer,
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
