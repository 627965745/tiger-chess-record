import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pk from "./pk";
import PlayerTable from "./PlayerTable";
import Login from "./Login";
import React, { useState, useEffect } from "react";
import { checkSession } from "./utils/apis";

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const checkAuthStatus = async () => {
        await checkSession()
            .then((response) => {
                setAuthenticated(response.data.authenticated);
                setLoading(false);
            })
            .catch((error) => {
                console.error("请先登录", error.message);
            });
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);
    if (loading) {
        return <div>登录中...</div>;
      }

    if (!authenticated) {
        return <Login onLogin={() => setAuthenticated(true)} />;
    }
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path="/" element={<Pk />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/players" element={<PlayerTable />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
