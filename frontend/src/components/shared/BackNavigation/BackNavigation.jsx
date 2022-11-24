import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import styles from "./BackNavigation.module.scss";

const BackNavigation = ({ linkTo = "/" }) => {
    return (
        <nav>
            <Link to={linkTo} className={styles.menu}>
                <ArrowBackIcon />
                <span>Back To Main</span>
            </Link>
        </nav>
    );
};

export default BackNavigation;
