import React, { useState, useEffect } from "react";
import Game from "./Game";
import {
    getGamesByStreamid,
    deleteStreamByStreamid,
    addGameByStreamid,
} from "./utils/apis";
import ResultTable from "./ResultTable";
import ResultLineTable from "./ResultLineTable";
import { formatDate } from "./utils/dateutil";
import { ReactComponent as Baogao } from "./utils/icons/baogao.svg";
import { ReactComponent as Shanchu } from "./utils/icons/shanchu.svg";
import { ReactComponent as Zhexiantu } from "./utils/icons/zhexiantu.svg";
import { ReactComponent as Dui } from "./utils/icons/dui.svg";
import { ReactComponent as Cuo } from "./utils/icons/cuo.svg";

const Stream = ({ stream, getAllStreams }) => {
    const [showGames, setShowGames] = useState(false);
    const [showDeleteStream, setShowDeleteStream] = useState(false);
    const [games, setGames] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const tableContent = "stream";

    useEffect(() => {
        if (showGames) {
            getAllGamesByStreamid(stream.stream_id);
        }
    }, [stream.stream_id]);

    const getAllGamesByStreamid = async (stream_id) => {
        await getGamesByStreamid({stream_id: stream_id})
            .then((response) => {
                let data = response.data;
                if (data.status > 0) {
                    console.error("unexpected:", data.message);
                    return true;
                }
                setGames(data.data);
            });
    };

    const toggleGames = () => {
        if (showGames === false) {
            getAllGamesByStreamid(stream.stream_id);
        }
        setShowGames(!showGames);
        setShowTable(false);
        setShowDetails(false);
    };

    const addNewGame = async () => {
        await addGameByStreamid(stream)
            .then((response) => {
                let data = response.data;
                if (data.status > 0) {
                    console.error("unexpected:", data.message);
                    return true;
                }
                getAllGamesByStreamid(stream.stream_id);
            });
    };

    const deleteStream = async (streamid) => {
        await deleteStreamByStreamid({stream_id: streamid})
            .then((response) => {
                let data = response.data;
                if (data.status > 0) {
                    console.error("unexpected:", data.message);
                    return true;
                }
                getAllStreams();
            });
    };

    const toggleshowDetails = () => {
        setShowTable(false);
        setShowDetails(!showDetails);
        setShowGames(false);
    };

    const toggleshowTable = () => {
        setShowDetails(false);
        setShowTable(!showTable);
        setShowGames(false);
    };

    return (
        <div className="p-2 border-b border-gray-300">
            <button
                className="font-bold text-blue-600 hover:text-blue-800"
                onClick={toggleGames}
            >
                直播：
                {formatDate(
                    new Date(new Date(stream.stream_time).getTime()),
                    "MM-dd hh:mm:ss"
                )}
                {}
            </button>

            {showDeleteStream ? (
                <>
                    <button
                        className="outline outline-2 outline-red-300 hover:outline-red-600 py-1 px-2 rounded ml-5"
                        onClick={() => deleteStream(stream.stream_id)}
                    >
                        <Dui className="h-5 w-5" />
                    </button>
                    <button
                        className="outline outline-2 outline-gray-500 hover:outline-gray-700 py-1 px-2 rounded ml-4"
                        onClick={() => setShowDeleteStream(false)}
                    >
                        <Cuo className="h-5 w-5" />
                    </button>
                </>
            ) : (
                <>
                    <button
                        className="outline outline-2 outline-red-500 hover:outline-red-700 py-1 px-1 rounded ml-3"
                        onClick={() => setShowDeleteStream(true)}
                    >
                        <Shanchu className="h-5 w-5" />
                    </button>
                    <button
                        className="px-1 py-2 rounded outline outline-2 outline-indigo-500 hover:outline-indigo-700 ml-3"
                        onClick={toggleshowDetails}
                    >
                        <Baogao className="h-7 w-7" />
                    </button>
                    <button
                        className="px-1 py-2 rounded outline outline-2 outline-indigo-500 hover:outline-indigo-700 ml-3"
                        onClick={toggleshowTable}
                    >
                        <Zhexiantu className="h-7 w-7" />
                    </button>
                </>
            )}

            {showGames && (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mt-4"
                        onClick={() => addNewGame()}
                    >
                        新一局
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

            {showTable && (
                <div className="col-span-6 text-center py-1">
                    <ResultLineTable
                        tableContent={tableContent}
                        id={stream.stream_id}
                    />
                </div>
            )}
        </div>
    );
};

export default Stream;
