import React, { useState, useEffect } from "react";
import Game from "./Game";
import {
    getGamesByStreamid,
    deleteStreamByStreamid,
    addGameByStreamid,
} from "./utils/apis";
import ResultTable from "./ResultTable";

const Stream = ({ stream, getAllStreams }) => {
    const [showGames, setShowGames] = useState(false);
    const [showDeleteStream, setShowDeleteStream] = useState(false);
    const [showNewGames, setShowNewGames] = useState(false);
    const [games, setGames] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const tableContent = "stream";

    useEffect(() => {
        getAllGamesByStreamid(stream.stream_id);
    }, []);

    const getAllGamesByStreamid = async (stream_id) => {
        const response = await getGamesByStreamid(stream_id)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("更新失败:", response.data.message);
                } else {
                    setGames(response.data);
                    // setLoading(false);
                }
            })
            .catch((error) => console.error("更新失败:", error.message));
    };

    const toggleGames = () => {
        if (showGames === false) {getAllGamesByStreamid(stream.stream_id)}
        setShowGames(!showGames);
        setShowDetails(false);
    };

    const addNewGame = async () => {
        await addGameByStreamid(stream.stream_id)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("更新失败:", response.data.message);
                } else {
                    getAllGamesByStreamid(stream.stream_id);
                }
            })
            .catch((error) => console.error("更新失败:", error.message));
    };

    const deleteStream = async (streamid) => {
        await deleteStreamByStreamid(streamid)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("更新失败:", response.data.message);
                } else {
                    getAllStreams();
                }
            })
            .catch((error) => console.error("更新失败:", error.message));
    };

    const toggleshowDetails = () => {
        setShowDetails(!showDetails);
        setShowGames(false);
    };

    return (
        <div className="p-4 border-b border-gray-300">
            <button
                className="font-bold text-blue-600 hover:text-blue-800"
                onClick={toggleGames}
            >
                直播时间： {stream.stream_time}
            </button>

            {showDeleteStream ? (
                <>
                    <button
                        className="bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-5 text-xs"
                        onClick={() => deleteStream(stream.stream_id)}
                    >
                        确定
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded ml-5 text-xs"
                        onClick={() => setShowDeleteStream(false)}
                    >
                        不了
                    </button>
                </>
            ) : (
                <>
                    <button
                        className="bg-red-800 hover:bg-red-900 text-white font-bold py-1 px-2 rounded ml-5 text-xs"
                        onClick={() => setShowDeleteStream(true)}
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

            {showGames && (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => addNewGame()}
                    >
                        新的一局棋
                    </button>

                    {games.map((game) => (
                        <div
                            key={game.game_id}
                            className="box-border border-4 border-gray-200 my-2"
                        >
                            <Game
                                game={game}
                                getAllGamesByStreamid={getAllGamesByStreamid}
                            />
                        </div>
                    ))}
                </div>
            )}

            {showDetails && (
                <div className="col-span-6 text-center py-1">
                    <ResultTable
                        tableContent={tableContent}
                        id={stream.stream_id}
                    />
                </div>
            )}
        </div>
    );
};

export default Stream;
