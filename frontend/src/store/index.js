import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import activate from './activateSlice';
import privateRoom from './privateRoomSlice';

export const store = configureStore({
    reducer: {
        auth: auth,
        activate: activate,
        privateRoom: privateRoom
    },
    devTools: false,
});