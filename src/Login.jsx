import React, { useState } from "react";
import { login } from "./utils/apis";

const Login = ({ onLogin }) => {
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const handleSubmit = async (e) => {
        await login(password).then((response) => {
            let data = response.data;
            if (data.status > 0) {
                setLoginError(data.message);
                return true;
            }
            onLogin();
        });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-200">
            <div className="self-center">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="password" className="font-bold">
                        密码:
                        <input
                            className="border-2 border-blue-300 mx-1"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        type="submit"
                    >
                        登录
                    </button>
                </form>
                <p className="text-red-500 text-center">{loginError}</p>
            </div>
        </div>
    );
};

export default Login;
