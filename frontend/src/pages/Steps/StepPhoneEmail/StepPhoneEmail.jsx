import styles from "./StepPhoneEmail.module.scss";
import BackNavigation from "../../../components/shared/BackNavigation/BackNavigation";
import Email from "./Email/Email";

const StepPhoneEmail = ({ onNext }) => {
    return (
        <>
            <BackNavigation />
            <div className={styles.cardWrapper}>
                <Email onNext={onNext} />
            </div>
        </>
    );
};

export default StepPhoneEmail;
