import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: '',
    popUp: false,
};

export const privateRoomSlice = createSlice({
    name: 'privateRoom',
    initialState,
    reducers: {
        setTokenValue: (state, action) => {
            state.token = action.payload
        },

        setPopUp: (state, action) => {
            state.popUp = action.payload
        }
    },
});

export const { setTokenValue, setPopUp } = privateRoomSlice.actions;

export default privateRoomSlice.reducer;