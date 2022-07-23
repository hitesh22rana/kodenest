import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuth: false,
    user: null,
    otp: {
        email: '',
        password: '',
        hash: '',
    },
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { user } = action.payload;
            state.user = user;
            if (user === null) {
                state.isAuth = false;
            } else {
                state.isAuth = true;
            }
        },
        setOtp: (state, action) => {
            const { email, password, hash } = action.payload;
            state.otp.email = email;
            state.otp.password = password;
            state.otp.hash = hash;
        },
    },
});

export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;