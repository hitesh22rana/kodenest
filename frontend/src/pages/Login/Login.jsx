import React, { useState } from "react";
import styles from "./Login.module.scss";

import BackNavigation from "../../components/shared/BackNavigation/BackNavigation";
import Alerts from "../../components/shared/Alerts/Alerts";

import { useDispatch } from "react-redux";
import { login } from "../../http/index";
import { setAuth } from "../../store/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });
    const [isAlert, setIsAlert] = useState(false);
    const [visible, setVisible] = useState(false);

    const onChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    async function submit() {
        try {
            setIsAlert(false);
            const { data } = await login({
                email: userDetails?.email,
                password: userDetails?.password,
            });
            dispatch(setAuth(data));
        } catch (err) {
            setIsAlert(true);
        }
    }

    return (
        <>
            {isAlert && (
                <Alerts
                    message={"Invalid Credentials"}
                    isAlert={isAlert}
                    setIsAlert={setIsAlert}
                />
            )}
            <BackNavigation />
            <div className={styles.formWrapper}>
                <h2>Log in</h2>
                <h4>Login to manage your account</h4>

                <div className={styles.inputWrapper}>
                    <div>
                        <img src="/images/formMail.png" alt="mail" />
                        <input
                            type="email"
                            name="email"
                            value={userDetails?.email}
                            onChange={onChange}
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <img src="/images/formPassword.png" alt="mail" />
                        {visible ? (
                            <img
                                className={styles.passwordImgVisible}
                                src="/images/visible.png"
                                alt="visible"
                                onClick={() => setVisible(!visible)}
                            />
                        ) : (
                            <img
                                className={styles.passwordImgHidden}
                                src="/images/hide.png"
                                alt="hidden"
                                onClick={() => setVisible(!visible)}
                            />
                        )}
                        <input
                            type={visible ? "text" : "password"}
                            name="password"
                            value={userDetails?.password}
                            onChange={onChange}
                            placeholder="Enter password"
                        />
                    </div>
                    <button onClick={submit}>Log in</button>
                </div>
            </div>
        </>
    );
};

export default Login;
