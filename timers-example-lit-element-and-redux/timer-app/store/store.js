// Import redux store logic
import { createStore } from 'redux';

// Import main app reducer
import { timerAppReducer } from './reducer.js';

// Create and export store so it can be imported and shared by app elements
export const store = createStore(timerAppReducer);
