import React, { useState } from "react";
import styles from "../StepPhoneEmail.module.scss";
import validator from "validator";

import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import Alerts from "../../../../components/shared/Alerts/Alerts";

import { sendOtp } from "../../../../http";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";

const Email = ({ onNext }) => {
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const dispatch = useDispatch();
    const [isAlert, setIsAlert] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");

    const onChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    async function submit() {
        if (!userDetails?.email) {
            setAlertMessage("Enter a valid email!");
            setIsAlert(true);
            return;
        }

        if (!validator.isEmail(userDetails?.email)) {
            setAlertMessage("Enter a valid email!");
            setIsAlert(true);
            return;
        }

        if (!userDetails?.password || !userDetails?.confirmPassword) {
            setAlertMessage("Enter a valid password!");
            setIsAlert(true);
            return;
        }

        if (userDetails?.password !== userDetails?.confirmPassword) {
            setAlertMessage("Password doesn't match with Confirm Password!");
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
            <Card title="Enter your Email Address" icon="mail-white">
                <TextInput
                    fullwidth={"false"}
                    type="email"
                    name="email"
                    value={userDetails?.email}
                    onChange={onChange}
                />
                <TextInput
                    fullwidth={"false"}
                    type="password"
                    name="password"
                    value={userDetails?.password}
                    onChange={onChange}
                />
                <TextInput
                    fullwidth={"false"}
                    type="password"
                    name="confirmPassword"
                    value={userDetails?.confirmPassword}
                    onChange={onChange}
                />
                <div>
                    <div className={styles.actionButtonWrap}>
                        <Button text="Next" onClick={submit} />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your number, you’re agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </div>
            </Card>
        </>
    );
};

export default Email;
