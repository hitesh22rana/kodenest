import styles from "./Card.module.scss";

const Card = ({ title, subtitle, children }) => {
    return (
        <div className={styles.formWrapper}>
            <h2>{title}</h2>
            <span>{subtitle}</span>
            {children}
        </div>
    );
};

export default Card;
