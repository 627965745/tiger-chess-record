import React, { useState, useEffect } from "react";
import Round from "./Round";
import { getRoundsByGameid, deleteGameByGameid } from "./utils/apis";
import NewGame from "./NewGame";
import ResultTable from "./ResultTable";

const Game = ({ game, getAllGamesByStreamid }) => {
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return fmt;
    };
    const [showRounds, setShowRounds] = useState(false);
    const [showDeleteGame, setShowDeleteGame] = useState(false);
    const [showNewRounds, setShowNewRounds] = useState(false);
    const [rounds, setRounds] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const tableContent = "game";
    useEffect(() => {
        getRounds();
    }, []);

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
        // let oldTime = (new Date(game.game_time)).getTime();
        // let curTime = new Date(oldTime).format("yyyy-MM-dd");
        setShowRounds(!showRounds);
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
        <div className="p-4 border-b border-gray-300">
            <button
                className="font-bold text-blue-600 hover:text-blue-800"
                onClick={toggleRounds}
            >
                棋局时间：{" "}
                {new Date(new Date(game.game_time).getTime()).format(
                    "hh:mm:ss"
                )}
            </button>

            {showDeleteGame ? (
                <>
                    <button
                        className="bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-5 text-xs"
                        onClick={() => deleteGame(game.game_id)}
                    >
                        确定
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded ml-5 text-xs"
                        onClick={() => setShowDeleteGame(false)}
                    >
                        不了
                    </button>
                </>
            ) : (
                <>
                    <button
                        className="bg-red-800 hover:bg-red-900 text-white font-bold py-1 px-2 rounded ml-5 text-xs"
                        onClick={() => setShowDeleteGame(true)}
                    >
                        删除
                    </button>
                    <button
                        className="text-white font-bold px-3 py-3 rounded bg-indigo-500 ml-4"
                        onClick={toggleshowDetails}
                    >
                        报告
                    </button>
                </>
            )}



            {showRounds && (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={toggleNewRounds}
                    >
                        干
                    </button>
                    <div className={!showNewRounds ? "hidden" : undefined}>
                        <NewGame
                            game_id={game.game_id}
                            getRounds={getRounds}
                            toggleNewRounds={toggleNewRounds}
                        />
                    </div>

                    {rounds.map((round) => (
                        <Round
                            key={round.round_id}
                            round={round}
                            getRounds={getRounds}
                        />
                    ))}
                </div>
            )}

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
