// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import eventSlice from './slice/eventSlice';

const store = configureStore({
    reducer: {
        event: eventSlice
    },
});

export default store;
