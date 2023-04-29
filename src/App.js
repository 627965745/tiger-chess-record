import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pk from "./pk";
import PlayerTable from "./PlayerTable";

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path="/" element={<Pk />} />
                    <Route exact path="/players" element={<PlayerTable />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
