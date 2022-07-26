import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../StepPhoneEmail.module.scss";
import { useDispatch } from "react-redux";
import validator from "validator";

import Alerts from "../../../../components/shared/Alerts/Alerts";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";

import { sendOtp } from "../../../../http";
import { setOtp } from "../../../../store/authSlice";

const Email = ({ onNext }) => {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isAlert, setIsAlert] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");
    const [visible, setVisible] = useState({
        passwordVisible: false,
        confirmPasswordVisible: false,
    });

    const onChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    async function submit() {
        if (
            !userDetails?.email ||
            !userDetails?.password ||
            !userDetails?.confirmPassword
        ) {
            setAlertMessage("All fields are required!");
            setIsAlert(true);
            return;
        }

        if (!validator.isEmail(userDetails?.email)) {
            setAlertMessage("Enter a valid email!");
            setIsAlert(true);
            return;
        }

        if (userDetails?.password !== userDetails?.confirmPassword) {
            setAlertMessage("Enter a valid password!");
            setIsAlert(true);
            return;
        }

        setIsAlert(false);

        try {
            const { data } = await sendOtp({
                email: userDetails?.email,
            });
            dispatch(
                setOtp({
                    email: data?.email,
                    password: userDetails?.password,
                    hash: data?.hash,
                })
            );
            onNext();
        } catch (err) {
            setUserDetails({
                email: "",
                password: "",
                confirmPassword: "",
            });
            setAlertMessage(err?.response?.data?.message);
            setIsAlert(true);
            return;
        }
    }

    return (
        <>
            {isAlert && (
                <Alerts
                    message={alertmessage}
                    isAlert={isAlert}
                    setIsAlert={setIsAlert}
                />
            )}

            <Card
                title="Sign Up"
                subtitle="Create your account and let the fun begin!"
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
                        <img src="/images/formPassword.png" alt="mail" />
                        {visible?.passwordVisible ? (
                            <img
                                className={styles.passwordImgVisible}
                                src="/images/visible.png"
                                alt="visible"
                                onClick={() =>
                                    setVisible({
                                        ...visible,
                                        passwordVisible:
                                            !visible?.passwordVisible,
                                    })
                                }
                            />
                        ) : (
                            <img
                                className={styles.passwordImgHidden}
                                src="/images/hide.png"
                                alt="hidden"
                                onClick={() =>
                                    setVisible({
                                        ...visible,
                                        passwordVisible:
                                            !visible?.passwordVisible,
                                    })
                                }
                            />
                        )}
                        <input
                            type={
                                visible?.passwordVisible ? "text" : "password"
                            }
                            name="password"
                            value={userDetails?.password}
                            onChange={onChange}
                            placeholder="Enter password"
                        />
                    </div>

                    <div>
                        <img src="/images/formConfirmPassword.png" alt="mail" />
                        {visible?.confirmPasswordVisible ? (
                            <img
                                className={styles.passwordImgVisible}
                                src="/images/visible.png"
                                alt="visible"
                                onClick={() =>
                                    setVisible({
                                        ...visible,
                                        confirmPasswordVisible:
                                            !visible?.confirmPasswordVisible,
                                    })
                                }
                            />
                        ) : (
                            <img
                                className={styles.passwordImgHidden}
                                src="/images/hide.png"
                                alt="hidden"
                                onClick={() =>
                                    setVisible({
                                        ...visible,
                                        confirmPasswordVisible:
                                            !visible?.confirmPasswordVisible,
                                    })
                                }
                            />
                        )}
                        <input
                            type={
                                visible?.confirmPasswordVisible
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            value={userDetails?.confirmPassword}
                            onChange={onChange}
                            placeholder="Confirm password"
                        />
                    </div>
                    <Button onClick={submit} text="Sign Up" />
                </div>
            </Card>
            <div className={styles.bottomLink}>
                <span>Already have an account?</span>
                <Link to="/login">Log in</Link>
            </div>
        </>
    );
};

export default Email;
