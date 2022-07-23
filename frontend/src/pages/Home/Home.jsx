import React from "react";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/Button/Button";

const Home = () => {
    const navigate = useNavigate();

    function startRegister() {
        navigate("/authenticate");
    }

    return (
        <section>
            <div className={styles.wrapper}>
                <div className={styles.leftWrapper}>
                    <h1>Welcome to KodeNest!</h1>
                    <p className={styles.text}>
                        We’re working hard to get KodeNest ready for everyone!
                        While we wrap up the finishing touches, we’re adding
                        people gradually to make sure nothing breaks.
                    </p>
                    <div>
                        <Button onClick={startRegister} text="Let's Go" />
                    </div>
                </div>
                <div className={styles.rightWrapper}>
                    <img src="/images/hero.png" alt="hero" />
                </div>
            </div>
        </section>
    );
};

export default Home;
