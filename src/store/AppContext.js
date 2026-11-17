// One shared data layer for the whole app (the "shared data layer" in the IA).
// Check ins, sleep and activity are stored once and every screen reads the same records,
// so users never enter the same thing twice. Data stays on the device (AsyncStorage).
import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeSampleData } from '../data/sampleData';

const STORAGE_KEY = 'checkpoint-beta-v1';

const initialState = {
  loaded: false,
  settings: {
    onboarded: false,
    name: '',
    reminderOn: false,
    reminderHour: 18,
    seenTips: {}, // one-time tips already shown (beta change 3)
  },
  checkIns: [],
  sleep: {}, // { 'YYYY-MM-DD': hours }
  activity: {}, // { 'YYYY-MM-DD': minutes }
  restDays: {}, // { 'YYYY-MM-DD': true }
  actions: [], // [{ id, date, status: 'done' | 'dismissed' }]
  hiddenInsights: {}, // insights the user marked "Not right"
  healthConnected: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        ...action.payload,
        settings: { ...state.settings, ...(action.payload.settings || {}) },
        loaded: true,
      };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SEEN_TIP':
      return {
        ...state,
        settings: { ...state.settings, seenTips: { ...state.settings.seenTips, [action.id]: true } },
      };
    case 'ADD_CHECKIN':
      return { ...state, checkIns: [...state.checkIns, action.checkIn] };
    case 'SET_SLEEP':
      return { ...state, sleep: { ...state.sleep, [action.date]: action.hours } };
    case 'SET_ACTIVITY':
      return { ...state, activity: { ...state.activity, [action.date]: action.minutes } };
    case 'CONNECT_HEALTH':
      return {
        ...state,
        healthConnected: true,
        sleep: { ...action.sleep, ...state.sleep }, // never overwrite what the user entered
        activity: { ...action.activity, ...state.activity },
      };
    case 'TOGGLE_REST': {
      const next = { ...state.restDays };
      if (next[action.date]) delete next[action.date];
      else next[action.date] = true;
      return { ...state, restDays: next };
    }
    case 'ACTION_STATUS':
      return {
        ...state,
        actions: [
          ...state.actions.filter((a) => !(a.id === action.id && a.date === action.date)),
          { id: action.id, date: action.date, status: action.status },
        ],
      };
    case 'HIDE_INSIGHT':
      return { ...state, hiddenInsights: { ...state.hiddenInsights, [action.key]: true } };
    case 'SHOW_INSIGHT': {
      const next = { ...state.hiddenInsights };
      delete next[action.key];
      return { ...state, hiddenInsights: next };
    }
    case 'LOAD_DEMO': {
      const demo = makeSampleData();
      return {
        ...state,
        checkIns: [...demo.checkIns, ...state.checkIns.filter((c) => !c.demo)],
        sleep: { ...demo.sleep, ...state.sleep },
        activity: { ...demo.activity, ...state.activity },
      };
    }
    case 'DELETE_ALL':
      // Remove all personal data. Keep onboarding so the user is not sent back through setup.
      return {
        ...initialState,
        loaded: true,
        settings: { ...initialState.settings, onboarded: true, seenTips: state.settings.seenTips },
      };
    case 'RESET_ALL':
      return { ...initialState, loaded: true };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const justOnboarded = useRef(false); // lets setup finish on the Check in tab (HF1)

  // Load once on start
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        dispatch({ type: 'LOAD', payload: raw ? JSON.parse(raw) : {} });
      } catch (e) {
        dispatch({ type: 'LOAD', payload: {} }); // fall back to a fresh start rather than crash
      }
    })();
  }, []);

  // Save on every change after loading
  useEffect(() => {
    if (!state.loaded) return;
    const { loaded, ...toSave } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch, justOnboarded }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
