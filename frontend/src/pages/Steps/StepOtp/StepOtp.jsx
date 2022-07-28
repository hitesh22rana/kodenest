import React, { useState } from "react";
import styles from "./StepOtp.module.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import OTPInput, { ResendOTP } from "otp-input-react";

import BackNavigation from "../../../components/shared/BackNavigation/BackNavigation";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import Alerts from "../../../components/shared/Alerts/Alerts";

import { verifyOtp } from "../../../http";
import { setAuth, setOtp as setOtpRedux } from "../../../store/authSlice";
import { sendOtp } from "../../../http";

// Resend button
const renderButton = (buttonProps) => {
    return (
        <>
            {buttonProps.remainingTime !== 0 ? (
                <span
                    style={{ cursor: "disabled" }}
                    className={styles.resendtext}
                >
                    Haven’t received OTP? Resend OTP in{" "}
                    <span>{buttonProps?.remainingTime}</span> seconds
                </span>
            ) : (
                <span className={styles.resendtext}>
                    Didn’t receive OTP?
                    <span
                        onClick={buttonProps.onClick}
                        style={{ cursor: "pointer" }}
                    >
                        Resend OTP
                    </span>
                </span>
            )}
        </>
    );
};

const renderTime = () => React.Fragment;

const StepOtp = () => {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const { email, password, hash } = useSelector((state) => state.auth.otp);
    const [isAlert, setIsAlert] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");

    async function submit() {
        if (!otp || !email || !password || !hash) {
            setAlertMessage("Please enter a valid OTP!");
            setIsAlert(true);
            return;
        }

        setIsAlert(false);
        try {
            const { data } = await verifyOtp({ otp, email, password, hash });
            dispatch(setAuth(data));
        } catch (err) {
            setOtp("");
            setAlertMessage(err?.response?.data?.message);
            setIsAlert(true);
        }
    }

    async function resendOTP() {
        setIsAlert(false);
        try {
            const { data } = await sendOtp({
                email: email,
            });
            dispatch(
                setOtpRedux({
                    email: data?.email,
                    password: password,
                    hash: data?.hash,
                })
            );
        } catch (err) {
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
            <BackNavigation />
            <div className={styles.cardWrapper}>
                <Card
                    title="Enter OTP"
                    subtitle="A six-digit verification code has been sent to you email."
                >
                    <span style={{ fontWeight: "lighter", fontSize: "0.7em" }}>
                        Please check it.
                    </span>
                    <div className={styles.otpInputContainer}>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            autoFocus={true}
                            OTPLength={6}
                            otpType="number"
                            disabled={false}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "5px",
                                marginTop: "40px",
                            }}
                            inputStyles={{
                                maxWidth: "43px",
                                minWidth: "30px",
                                minHeight: "40px",
                                maxHeight: "32px",
                                width: "100%",
                                height: "100%",
                                outline: "none",
                                borderRadius: "4px",
                                background: "none",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "1em",
                            }}
                            inputClassName={styles.otpInputValue}
                        />
                    </div>
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} text="Verify" />
                    </div>
                </Card>
                <ResendOTP
                    className={styles.resendButton}
                    maxTime={120}
                    onResendClick={resendOTP}
                    renderButton={renderButton}
                    renderTime={renderTime}
                />
            </div>
        </>
    );
};

export default StepOtp;
