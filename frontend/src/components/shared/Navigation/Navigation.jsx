import { useState } from "react";
import styles from "./Navigation.module.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../http";
import { setAuth } from "../../../store/authSlice";

import LogoutModal from "../../LogoutModal/LogoutModal";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navigation = () => {
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [showUserNavigation, setShowUserNavigation] = useState(false);

    async function confirmLogout() {
        try {
            const { data } = await logout();
            dispatch(setAuth(data));
        } catch (err) {}
    }

    function logoutConfirmation() {
        setShowModal((prev) => !prev);
        setShowUserNavigation((prev) => !prev);
    }

    return (
        <div className={styles.wrapper}>
            <nav className={styles.navBar}>
                {isAuth ? (
                    <div className={styles.kodenestNav}>
                        <img src="/images/logo.png" alt="logo" />
                        <span>KodeNest</span>
                    </div>
                ) : (
                    <Link to="/">
                        <img src="/images/logo.png" alt="logo" />
                        <span>KodeNest</span>
                    </Link>
                )}
                <div className={styles.navRight}>
                    {isAuth ? (
                        <div className={styles.navRoom}>
                            <div className={styles.navUser}>
                                <div>
                                    <img
                                        src={
                                            user.avatar
                                                ? user?.avatar
                                                : "/images/defaultAvatar.png"
                                        }
                                        alt="avatar"
                                    />
                                </div>
                            </div>
                            <button
                                className={styles.button}
                                onClick={() =>
                                    setShowUserNavigation((prev) => !prev)
                                }
                            >
                                <ExpandLessIcon
                                    className={styles.userSettingsIcon}
                                    style={
                                        showUserNavigation
                                            ? { transform: "rotate(180deg)" }
                                            : { transform: "rotate(0deg)" }
                                    }
                                />
                            </button>
                            {showUserNavigation && (
                                <>
                                    <div
                                        className={styles.modalBackDrop}
                                        onClick={() =>
                                            setShowUserNavigation(
                                                (prev) => !prev
                                            )
                                        }
                                    ></div>
                                    <div className={styles.userMenu}>
                                        <div>
                                            <img
                                                src={
                                                    user.avatar
                                                        ? user?.avatar
                                                        : "/images/defaultAvatar.png"
                                                }
                                                alt="avatar"
                                            />
                                            <span>{user?.name}</span>
                                        </div>
                                        <div>
                                            <button>
                                                <AccountCircleIcon
                                                    className={styles.userIcons}
                                                />
                                                Profile
                                            </button>
                                            <button
                                                onClick={logoutConfirmation}
                                            >
                                                <LogoutIcon
                                                    className={styles.userIcons}
                                                />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={styles.navOutside}>
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
                        </div>
                    )}
                </div>
            </nav>
            {showModal && (
                <LogoutModal
                    onClose={() => setShowModal((prev) => !prev)}
                    confirmLogout={confirmLogout}
                />
            )}
        </div>
    );
};

export default Navigation;
