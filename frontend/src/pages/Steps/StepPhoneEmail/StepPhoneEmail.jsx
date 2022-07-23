import React from "react";
import Email from "./Email/Email";
import styles from "./StepPhoneEmail.module.scss";

const StepPhoneEmail = ({ onNext }) => {
    return (
        <>
            <div className={styles.cardWrapper}>
                <Email onNext={onNext} />
            </div>
        </>
    );
};

export default StepPhoneEmail;
