import React from "react";
import styles from "./StepPhoneEmail.module.scss";
import BackNavigation from "../../../components/shared/BackNavigation/BackNavigation";
import Email from "./Email/Email";

const StepPhoneEmail = ({ onNext }) => {
    return (
        <>
            <div className={styles.cardWrapper}>
                <BackNavigation />
                <Email onNext={onNext} />
            </div>
        </>
    );
};

export default StepPhoneEmail;
