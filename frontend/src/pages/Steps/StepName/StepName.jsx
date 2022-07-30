import React, { useState } from "react";
import styles from "./StepName.module.scss";

import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import Alerts from "../../../components/shared/Alerts/Alerts";

import { useDispatch } from "react-redux";
import { setName } from "../../../store/activateSlice";

const StepName = ({ onNext }) => {
    const dispatch = useDispatch();
    const [fullname, setFullname] = useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [message, setMessage] = useState("");

    function nextStep() {
        if (!fullname) {
            setIsAlert(false);
            setMessage("Please enter a valid name!");
            setIsAlert(true);
            return;
        }

        if (fullname.trim().length < 5 || fullname.trim().length > 20) {
            setIsAlert(false);
            setMessage("Username must be between 5-20 characters!");
            setIsAlert(true);
            return;
        }

        setIsAlert(false);
        dispatch(setName(fullname.trim()));
        onNext();
    }

    return (
        <>
            {isAlert && (
                <Alerts
                    message={message}
                    isAlert={isAlert}
                    setIsAlert={setIsAlert}
                />
            )}

            <div className={styles.cardWrapper}>
                <Card
                    title="What should we call you? 🤓"
                    subtitle="We use real names at KodeNest!"
                >
                    <div className={styles.inputWrapper}>
                        <div>
                            <img src="/images/Usericon.png" alt="user" />
                            <input
                                type="text"
                                name="name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                placeholder="Enter name"
                            />
                        </div>
                    </div>
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={nextStep} text="Next" />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default StepName;
