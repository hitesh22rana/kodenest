import React, { useState } from "react";
import styles from "./Login.module.scss";

import Button from "../../components/shared/Button/Button";

import { useDispatch } from "react-redux";
import { login } from "../../http/index";
import { setAuth } from "../../store/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });

    const onChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    async function submit() {
        try {
            const { data } = await login({
                email: userDetails?.email,
                password: userDetails?.password,
            });
            dispatch(setAuth(data));
        } catch (err) {}
    }

    return (
        <div className={styles.cardWrapper}>
            <div>
                <input
                    type="email"
                    name="email"
                    value={userDetails?.email}
                    onChange={onChange}
                />
                <input
                    type="password"
                    name="password"
                    value={userDetails?.password}
                    onChange={onChange}
                />
                <div className={styles.actionButtonWrap}>
                    <Button text="Next" onClick={submit} />
                </div>
            </div>
        </div>
    );
};

export default Login;
