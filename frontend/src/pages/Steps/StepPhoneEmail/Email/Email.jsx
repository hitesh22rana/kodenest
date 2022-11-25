import { useState } from "react";
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

        // Email Validation
        if (!validator.isEmail(userDetails?.email)) {
            setAlertMessage("Enter a valid email!");
            setIsAlert(true);
            return;
        }

        // Password Validation
        if (userDetails?.password !== userDetails?.confirmPassword) {
            setAlertMessage("Enter a valid password!");
            setIsAlert(true);
            return;
        }

        if (userDetails?.password) {
            let password = userDetails?.password;

            const uppercaseRegExp = /(?=.*?[A-Z])/;
            const lowercaseRegExp = /(?=.*?[a-z])/;
            const digitsRegExp = /(?=.*?[0-9])/;
            const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
            const minLengthRegExp = /.{8,}/;

            const uppercasePassword = uppercaseRegExp.test(password);
            const lowercasePassword = lowercaseRegExp.test(password);
            const digitsPassword = digitsRegExp.test(password);
            const specialCharPassword = specialCharRegExp.test(password);
            const minLengthPassword = minLengthRegExp.test(password);

            let errMsg = "";
            if (password.includes(" ")) {
                errMsg = "Password can't contain spaces!";
            } else if (!uppercasePassword) {
                errMsg =
                    "Password must contain at least one uppercase character!";
            } else if (!lowercasePassword) {
                errMsg =
                    "Password must contain at least one lowercase character!";
            } else if (!digitsPassword) {
                errMsg = "Password must contain at least one digit!";
            } else if (!specialCharPassword) {
                errMsg =
                    "Password must contain at least one special character!";
            } else if (!minLengthPassword) {
                errMsg = "Password must contain minumum 8 characters!";
            } else {
                errMsg = "";
            }

            if (errMsg) {
                setAlertMessage(errMsg);
                setIsAlert(true);
                return;
            }
        }

        setIsAlert(false);

        try {
            const { data } = await sendOtp({
                email: userDetails?.email.trim(),
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
                            minLength={8}
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
                            minLength={8}
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
