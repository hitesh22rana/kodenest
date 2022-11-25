import "./App.css";

import Loading from "./components/shared/Loading/Loading";

import Home from "./pages/Home/Home";
import Authenticate from "./pages/Authenticate/Authenticate";
import Login from "./pages/Login/Login";
import Reset from "./pages/Login/Reset/Reset";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import Room from "./pages/Room/Room";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";

function App() {
    const { isLoading } = useLoadingWithRefresh();

    return isLoading ? (
        <Loading />
    ) : (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <GuestRoute>
                            <Home />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/authenticate"
                    element={
                        <GuestRoute>
                            <Authenticate />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/login/reset"
                    element={
                        <GuestRoute>
                            <Reset />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/login/reset/:token"
                    element={
                        <GuestRoute>
                            <Reset />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/activate"
                    element={
                        <SemiProtectedRoute>
                            <Activate />
                        </SemiProtectedRoute>
                    }
                />
                <Route
                    path="/rooms"
                    element={
                        <ProtectedRoute>
                            <Rooms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/room/:id"
                    element={
                        <ProtectedRoute>
                            <Room />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

const ProtectedRoute = ({ children }) => {
    const { user, isAuth } = useSelector((state) => state.auth);
    return !isAuth ? (
        <Navigate
            to={{
                pathname: "/",
            }}
        />
    ) : isAuth && !user?.activated ? (
        <Navigate
            to={{
                pathname: "/activate",
            }}
        />
    ) : (
        children
    );
};

const SemiProtectedRoute = ({ children }) => {
    const { user, isAuth } = useSelector((state) => state.auth);
    return !isAuth ? (
        <Navigate
            to={{
                pathname: "/",
            }}
        />
    ) : isAuth && !user?.activated ? (
        children
    ) : (
        <Navigate
            to={{
                pathname: "/rooms",
            }}
        />
    );
};

const GuestRoute = ({ children }) => {
    const { isAuth } = useSelector((state) => state.auth);
    return isAuth ? (
        <Navigate
            to={{
                pathname: "/rooms",
            }}
        />
    ) : (
        children
    );
};

export default App;
