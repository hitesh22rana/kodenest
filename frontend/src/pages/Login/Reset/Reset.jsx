import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./Reset.module.scss";

import Alerts from "../../../components/shared/Alerts/Alerts";
import BackNavigation from "../../../components/shared/BackNavigation/BackNavigation";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";

import { verifyLink, reset } from "../../../http";

const Reset = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const { data } = await verifyLink(token);
                setAlertMessage(data.message);
                setSeverity("success");
                setIsAlert(true);
            } catch (err) {
                setAlertMessage(err.response.data.message + " Redirecting!!");
                setSeverity("error");
                setIsAlert(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        };
        verifyToken();
    }, [token]);

    const [userDetails, setUserDetails] = useState({
        password: "",
        confirmPassword: "",
    });

    const [visible, setVisible] = useState({
        password: false,
        confirmPassword: false,
    });

    const [isAlert, setIsAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");

    const [isReset, setIsReset] = useState(false);

    const onChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    const onVisibilityChange = (event) => {
        setVisible({
            ...visible,
            [event.target.name]: !visible[event.target.name],
        });
    };

    async function submit() {
        if (!userDetails?.password || !userDetails?.confirmPassword) {
            setSeverity("error");
            setAlertMessage("All fields are required!");
            setIsAlert(true);
            return;
        }

        if (userDetails?.password !== userDetails?.confirmPassword) {
            setSeverity("error");
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
                setSeverity("error");
                setAlertMessage(errMsg);
                setIsAlert(true);
                return;
            }
        }

        try {
            const { data } = await reset({
                token: token,
                password: userDetails?.password,
            });

            setAlertMessage(data.message);
            setSeverity("success");
            setIsAlert(true);

            setTimeout(() => {
                setIsReset((prev) => !prev);
            }, 1000);
        } catch (err) {
            setAlertMessage(err.response.data.message);
            setSeverity("error");
            setIsAlert(true);
        }
    }

    function navigateToLoginPage() {
        navigate("/login");
    }

    return (
        <>
            {isAlert && (
                <Alerts
                    message={alertMessage}
                    isAlert={isAlert}
                    setIsAlert={setIsAlert}
                    severity={severity}
                />
            )}

            <BackNavigation linkTo="/login" />

            {isReset ? (
                <div className={styles.cardWrapper}>
                    <Card
                        title="Successful password reset!"
                        subtitle="You can now use your new password to login to your account 🙌"
                    >
                        <Button onClick={navigateToLoginPage} text="Log in" />
                    </Card>
                </div>
            ) : (
                <div className={styles.cardWrapper}>
                    <Card
                        title="Reset password"
                        subtitle="Reset password to manage your account"
                    >
                        <div className={styles.inputWrapper}>
                            <div>
                                <img
                                    src="/images/formPassword.png"
                                    alt="mail"
                                />
                                {visible.password ? (
                                    <img
                                        className={styles.passwordImgVisible}
                                        src="/images/visible.png"
                                        alt="visible"
                                        name="password"
                                        onClick={onVisibilityChange}
                                    />
                                ) : (
                                    <img
                                        className={styles.passwordImgHidden}
                                        src="/images/hide.png"
                                        alt="hidden"
                                        name="password"
                                        onClick={onVisibilityChange}
                                    />
                                )}
                                <input
                                    type={
                                        visible.password ? "text" : "password"
                                    }
                                    name="password"
                                    value={userDetails?.password}
                                    onChange={onChange}
                                    placeholder="Enter New password"
                                />
                            </div>

                            <div>
                                <img
                                    src="/images/formPassword.png"
                                    alt="mail"
                                />
                                {visible.confirmPassword ? (
                                    <img
                                        className={styles.passwordImgVisible}
                                        src="/images/visible.png"
                                        alt="visible"
                                        name="confirmPassword"
                                        onClick={onVisibilityChange}
                                    />
                                ) : (
                                    <img
                                        className={styles.passwordImgHidden}
                                        src="/images/hide.png"
                                        alt="hidden"
                                        name="confirmPassword"
                                        onClick={onVisibilityChange}
                                    />
                                )}
                                <input
                                    type={
                                        visible.confirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={userDetails?.confirmPassword}
                                    onChange={onChange}
                                    placeholder="Confirm New password"
                                />
                            </div>
                            <Button onClick={submit} text="Confirm Reset" />
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default Reset;
