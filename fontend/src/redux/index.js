import { createStore } from 'redux';
import { isPC } from '../utils/utils';

// Action
export function changePlatform(text) {
  return {
    type: 'PLATFORM',
    text,
  };
}

let INITIAL_PLATFORM = '';
if (isPC()) {
  INITIAL_PLATFORM = sessionStorage.getItem('platform')
    ? sessionStorage.getItem('platform')
    : 'Android';
} else {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    INITIAL_PLATFORM = 'IOS';
  } else {
    INITIAL_PLATFORM = 'Android';
  }
}

// Reducer
function counter(state = { platform: INITIAL_PLATFORM }, action) {
  switch (action.type) {
    case 'PLATFORM':
      sessionStorage.setItem('platform', action.text);
      return { platform: action.text };
    default:
      return state;
  }
}

// Store
export const store = createStore(counter);
