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
                            Kodenest is a dynamic voice chat platform for
                            technocrats.
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
