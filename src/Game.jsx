import React, { useState, useEffect, useRef } from "react";
import Round from "./Round";
import { getRoundsByGameid, deleteGameByGameid } from "./utils/apis";
import NewGame from "./NewGame";
import ResultTable from "./ResultTable";
import { formatDate } from "./utils/dateutil";
import { ReactComponent as Gan } from './utils/icons/gan.svg';
import { ReactComponent as Baogao } from './utils/icons/baogao.svg';
import { ReactComponent as Shanchu } from './utils/icons/shanchu.svg';
import { ReactComponent as Dui } from './utils/icons/dui.svg';
import { ReactComponent as Cuo } from './utils/icons/cuo.svg';

const Game = ({ game, getAllGamesByStreamid }) => {
    const scrollToDetails = useRef(null);
    const [showRounds, setShowRounds] = useState(false);
    const [showDeleteGame, setShowDeleteGame] = useState(false);
    const [showNewRounds, setShowNewRounds] = useState(false);
    const [rounds, setRounds] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const tableContent = "game";
    useEffect(() => {
        getRounds();
    }, []);
    const scrollToElement = () => {
        if (scrollToDetails.current) {
            scrollToDetails.current.scrollIntoView({ behavior: 'smooth' })
        }
      };
    const getRounds = async () => {
        await getRoundsByGameid(game.game_id)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("获取列表失败:", response.data.message);
                } else {
                    setRounds(response.data);
                }
            })
            .catch((error) => console.error("获取列表失败:", error.message));
    };

    const toggleRounds = () => {
        if (showRounds === false) {
            getRounds();
        }
        setShowRounds(!showRounds);
        setShowNewRounds(false);
        setShowDetails(false);
    };

    const toggleNewRounds = () => {
        setShowNewRounds(!showNewRounds);
    };

    const deleteGame = async (gameid) => {
        await deleteGameByGameid(gameid)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("获取列表失败:", response.data.message);
                } else {
                    getAllGamesByStreamid(game.stream_id);
                }
            })
            .catch((error) => console.error("获取列表失败:", error.message));
    };

    const toggleshowDetails = () => {
        setShowDetails(!showDetails);
        setShowRounds(false);
    };

    return (
        <div ref={scrollToDetails} className="p-4 border-b border-gray-300">
            <button
                className="font-bold text-blue-600 hover:text-blue-800"
                onClick={toggleRounds}
            >
                棋局：{formatDate(new Date(new Date(game.game_time).getTime()),"hh:mm:ss")}
            </button>

            {showDeleteGame ? (
                <>
                    <button
                        className="outline outline-2 outline-red-300 hover:outline-red-600 py-1 px-2 rounded ml-5"
                        onClick={() => deleteGame(game.game_id)}
                    >
                        <Dui className="h-5 w-5"/>
                    </button>
                    <button
                        className="outline outline-2 outline-gray-500 hover:outline-gray-700 py-1 px-2 rounded ml-4"
                        onClick={() => setShowDeleteGame(false)}
                    >
                        <Cuo className="h-5 w-5"/>
                    </button>
                </>
            ) : (
                <>
                    <button
                        className="outline outline-2 outline-red-500 hover:outline-red-700 py-1 px-1 rounded ml-5"
                        onClick={() => setShowDeleteGame(true)}
                    >
                        <Shanchu className="h-5 w-5"/>
                    </button>
                    <button
                        className="px-1 py-2 rounded outline outline-2 outline-indigo-500 hover:outline-indigo-700s ml-4"
                        onClick={toggleshowDetails}
                    >
                        <Baogao className="h-7 w-7"/>
                    </button>
                </>
            )}

            <div>
                {showRounds && (
                    <button
                        className="bg-blue-400 hover:bg-blue-500 py-1 px-2 rounded mt-4"
                        onClick={toggleNewRounds}
                    >
                        <Gan className="h-7 w-7"/>
                    </button>
                )}
                {(showNewRounds && showRounds) && (
                    <div>
                        <NewGame
                            game_id={game.game_id}
                            getRounds={getRounds}
                            toggleNewRounds={toggleNewRounds}
                            scrollToDetails={scrollToElement}
                        />
                    </div>
                )}

                {showRounds &&
                    rounds.map((round) => (
                        <Round
                            key={round.round_id}
                            round={round}
                            getRounds={getRounds}
                        />
                    ))}
            </div>

            {showDetails && (
                <div className="col-span-6 text-center py-1">
                    <ResultTable
                        tableContent={tableContent}
                        id={game.game_id}
                    />
                </div>
            )}
        </div>
    );
};

export default Game;
