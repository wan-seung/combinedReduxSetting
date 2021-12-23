import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice'
import {api} from '../features/auth/auth'
import logger from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import {setupListeners} from '@reduxjs/toolkit/query'
import {pokemonApi} from '../services/pokemon'
// import { myCustomApiService } from './api';

// const rootReducer = combineReducers({
//   users : usersReducer,
//   posts : postsReducer
// })

const rootReducer = combineReducers({
  counter: counterReducer,
  [pokemonApi.reducerPath] : pokemonApi.reducer,
  [api.reducerPath] : api.reducer,
  auth: authReducer
});

// persist를 위한 기본 세팅
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// 두번째 인자에 combine된 리듀서 넣기
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // 바로 하단 middleware처럼 array 형태로 저장 가능하지만 추가적으로 middleware 적용시 custom해야함
  // middleware: [thunk, logger],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // thunk: {
      //   extraArgument: myCustomApiService,
      // },

      // toolkit에서 제공하는 thunk
      thunk: true,
      // redux-persist 설정
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // redux-logger 설정
    }).concat(logger).concat(pokemonApi.middleware),
  //devTools prod에서만 사용안하고 나머지 사용
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch)

// 새로고침해도 스토어상의 값들 유지하는거 내보내기
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
