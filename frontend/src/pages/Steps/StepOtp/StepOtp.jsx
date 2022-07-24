import React, { useState } from "react";
import styles from "./StepOtp.module.scss";

import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import Button from "../../../components/shared/Button/Button";
import Alerts from "../../../components/shared/Alerts/Alerts";

import { verifyOtp } from "../../../http";
import { useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useDispatch } from "react-redux";

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
            setAlertMessage("Invalid OTP!");
            setIsAlert(true);
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
            <div className={styles.cardWrapper}>
                <Card
                    title="Enter OTP"
                    subtitle="A six-digit verification code has been sent to you email.
                    Please check it."
                >
                    <TextInput
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} text="Next" />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your number, you’re agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </Card>
            </div>
        </>
    );
};

export default StepOtp;
