import React from "react";
import styles from "./Navigation.module.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";

const Navigation = () => {
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((state) => state.auth);

    async function logoutUser() {
        try {
            const { data } = await logout();
            dispatch(setAuth(data));
        } catch (err) {}
    }

    return (
        <div className={styles.wrapper}>
            <nav className={styles.navBar}>
                <Link to="/">
                    <img src="/images/logo.png" alt="logo" />
                    <span>KodeNest</span>
                </Link>
                <div className={styles.navRight}>
                    {isAuth ? (
                        <>
                            <div className={styles.navUser}>
                                <Link to="/rooms">
                                    <img
                                        src={
                                            user.avatar
                                                ? user?.avatar
                                                : "/images/monkey-avatar.png"
                                        }
                                        alt="avatar"
                                    />
                                </Link>
                            </div>
                            <button
                                onClick={logoutUser}
                                className={styles.button}
                            >
                                <LogoutIcon className={styles.logoutIcon} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                className={styles.autheticate__buttons}
                                to="/authenticate"
                            >
                                <button>Sign Up</button>
                            </Link>
                            <Link
                                className={styles.autheticate__buttons}
                                to="/login"
                            >
                                <button>Log in</button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
