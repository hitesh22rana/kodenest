import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Login.module.scss";
import validator from "validator";

import DoneIcon from "@mui/icons-material/Done";

import BackNavigation from "../../components/shared/BackNavigation/BackNavigation";
import Alerts from "../../components/shared/Alerts/Alerts";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

import { login, forgot } from "../../http/index";
import { setAuth } from "../../store/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState(true);
    const [showForgotScreen, setShowForgotScreen] = useState(false);

    const [isAlert, setIsAlert] = useState(false);
    const [isSeverity, setIsSeverity] = useState("");
    const [message, setMessage] = useState("");

    const [isReset, setIsReset] = useState(false);

    const onChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    async function submit() {
        if (!userDetails?.email || !userDetails?.password) {
            setMessage("Invalid Credentials");
            setIsSeverity("error");
            setIsAlert(true);
            return;
        }

        if (!validator.isEmail(userDetails?.email)) {
            setMessage("Invalid Credentials");
            setIsSeverity("error");
            setIsAlert(true);
            return;
        }

        try {
            const { data } = await login({
                email: userDetails?.email,
                password: userDetails?.password,
                toRemember: checked,
            });
            dispatch(setAuth(data));
        } catch (err) {
            setMessage(err.response.data.message);
            setIsSeverity("error");
            setIsAlert(true);
        }
    }

    async function resetPassword() {
        if (!userDetails?.email) {
            setMessage("Invalid Credentials");
            setIsSeverity("error");
            setIsAlert(true);
            return;
        }

        try {
            const { data } = await forgot({ email: userDetails?.email });

            setTimeout(() => {
                setMessage(data.message);
                setIsSeverity("success");
                setIsAlert(true);
                setIsReset((prev) => !prev);
            }, 1000);
        } catch (err) {
            setMessage(err.response.data.message);
            setIsSeverity("error");
            setIsAlert(true);
        }
    }

    function afterReset() {
        setIsReset((prev) => !prev);
        setShowForgotScreen((prev) => !prev);
    }

    return (
        <>
            {isAlert && (
                <Alerts
                    message={message}
                    isAlert={isAlert}
                    setIsAlert={setIsAlert}
                    severity={isSeverity}
                />
            )}

            <BackNavigation linkTo={showForgotScreen ? "/authenticate" : "/"} />

            {isReset ? (
                <Card
                    title="Hurray! 🤩"
                    subtitle={`Reset Password Link has been sent to ${userDetails?.email}`}
                >
                    <Button onClick={afterReset} text="Login" />
                </Card>
            ) : showForgotScreen ? (
                <div className={styles.cardWrapper}>
                    <Card
                        title="Reset your password"
                        subtitle="Enter your email to Reset your password"
                    >
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
                            <Button onClick={resetPassword} text="Log in" />
                        </div>
                    </Card>
                    <div className={styles.bottomLink}>
                        <span>Don't have an account?</span>
                        <Link to="/authenticate">Sign Up</Link>
                    </div>
                </div>
            ) : (
                <div className={styles.cardWrapper}>
                    <Card
                        title="Log in"
                        subtitle="Login to manage your account"
                    >
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
                                <img
                                    src="/images/formPassword.png"
                                    alt="mail"
                                />
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
                            <div className={styles.checkBox}>
                                <div
                                    className={styles.check}
                                    style={
                                        !checked
                                            ? { backgroundColor: "#fff" }
                                            : {}
                                    }
                                    onClick={() => setChecked(!checked)}
                                >
                                    {checked && (
                                        <DoneIcon
                                            sx={{
                                                height: "10px",
                                                width: "10px",
                                                position: "absolute",
                                                top: "1px",
                                                left: "2px",
                                            }}
                                        />
                                    )}
                                </div>
                                <span onClick={() => setChecked(!checked)}>
                                    Remember me
                                </span>
                            </div>
                            <Button onClick={submit} text="Log in" />
                        </div>
                    </Card>
                    <div className={styles.bottomLink}>
                        <span>Don't have an account?</span>
                        <Link to="/authenticate">Sign Up</Link>
                    </div>
                    <Link onClick={() => setShowForgotScreen((prev) => !prev)}>
                        Forgot password?
                    </Link>
                </div>
            )}
        </>
    );
};

export default Login;
