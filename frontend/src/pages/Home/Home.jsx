import React from "react";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";

import Navigation from "../../components/shared/Navigation/Navigation";

const Home = () => {
    const navigate = useNavigate();

    function startRegister() {
        navigate("/authenticate");
    }

    return (
        <>
            <Navigation />
            <section>
                <div className={styles.wrapper}>
                    <div className={styles.leftWrapper}>
                        <h1>Welcome to KodeNest!</h1>
                        <p className={styles.text}>
                            We’re working hard to get KodeNest ready for
                            everyone! While we wrap up the finishing touches,
                            we’re adding people gradually to make sure nothing
                            breaks.
                        </p>
                        <div>
                            <button onClick={startRegister}>
                                <span>Let's Go</span>
                                <span>👉</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.rightWrapper}>
                        <img src="/images/hero.png" alt="hero" />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
