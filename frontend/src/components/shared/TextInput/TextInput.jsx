import styles from "./TextInput.module.scss";

const TextInput = (props) => {
    return (
        <div>
            <input
                className={styles.input}
                style={{
                    width: props?.fullwidth === "true" ? "100%" : "",
                }}
                type="text"
                {...props}
            />
        </div>
    );
};

export default TextInput;
