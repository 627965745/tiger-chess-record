import React, { useState, useRef } from "react";
import { editRoundStatus, deleteRoundByRoundid } from "./utils/apis";
import ResultTable from "./ResultTable";
import NewGame from "./NewGame";

const Round = ({ round, getRounds }) => {
    const scrollToDetails = useRef(null);
    const [showPlayers, setShowPlayers] = useState(false);
    const [showStatusOption, setShowStatusOption] = useState(false);
    const [showDeleteRound, setShowDeleteRound] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const tableContent = "round";

    const togglePlayers = () => {
        setShowDetails(false);
        setShowPlayers(!showPlayers);
    };

    const toggleRoundStatus = () => {
        setShowDetails(false);
        setShowStatusOption(!showStatusOption);
    };

    const scrollToElement = () => {
        if (scrollToDetails.current) {
          const elementPosition = scrollToDetails.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const middleOffset = (viewportHeight - elementPosition.height) / 2;
          const scrollToPosition = elementPosition.top + window.pageYOffset - middleOffset;
    
          window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
        }
      };

    const changeRoundStatus = async (e) => {
        
        if (e.target.innerText !== round.round_status) {
            const updateRoundStatus = {
                round_id: round.round_id,
                round_status: e.target.innerText,
            };
            await editRoundStatus(updateRoundStatus)
                .then((response) => {
                    if (response.status !== 200) {
                        console.error("更新失败:", response.data.message);
                    } else {
                        setShowStatusOption(!showStatusOption);
                        round.round_status = e.target.innerText;
                    }
                })
                .catch((error) => console.error("更新失败:", error.message));
        } else {
            setShowStatusOption(!showStatusOption);
        }
    };

    const deleteRound = async (roundid) => {
        await deleteRoundByRoundid(roundid)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("删除一局失败:", response.data.message);
                } else {
                    getRounds();
                }
            })
            .catch((error) => console.error("删除一局失败:", error.message));
    };

    return (
        <div className="grid grid-cols-6 gap-4 pl-4 py-2 mt-2">
            <div className="col-span-1 text-center py-1">
                {showStatusOption ? (
                    <>
                        <button
                            className="text-white font-bold px-1 py-1 rounded bg-red-600"
                            onClick={changeRoundStatus}
                        >
                            强哥赢
                        </button>
                        <button
                            className="text-white font-bold px-1 py-1 rounded bg-green-600"
                            onClick={changeRoundStatus}
                        >
                            粉丝赢
                        </button>
                        <button
                            className="text-white font-bold px-1 py-1 rounded bg-gray-600"
                            onClick={changeRoundStatus}
                        >
                            未出
                        </button>
                    </>
                ) : (
                    <button
                        className={`text-white font-bold px-2 py-1 rounded ${
                            round.round_status === "强哥赢"
                                ? "bg-red-600"
                                : round.round_status === "粉丝赢"
                                ? "bg-green-600"
                                : "bg-gray-600"
                        }`}
                        onClick={toggleRoundStatus}
                    >
                        {round.round_status}
                    </button>
                )}
            </div>
            <div ref={scrollToDetails} className="col-span-4 text-center">
                <button
                    className="text-gray-600 hover:text-gray-800 py-1 font-bold"
                    onClick={togglePlayers}
                >
                    {round.round_name} - 共{round.num_players}
                    人{round.total_stake}份 - {round.player_names}
                </button>
            </div>
            <div className="col-span-1 text-center">
                {showDeleteRound ? (
                    <>
                        <button
                            className="bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-2 m-1 rounded text-s"
                            onClick={() => deleteRound(round.round_id)}
                        >
                            确定
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 m-1 rounded text-s"
                            onClick={() => setShowDeleteRound(false)}
                        >
                            不了
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-red-800 hover:bg-red-900 text-white font-bold py-1 px-2 rounded m-1 text-xs"
                        onClick={() => setShowDeleteRound(true)}
                    >
                        删除
                    </button>
                )}
                <button
                    className="text-white font-bold px-3 py-3 rounded bg-indigo-500"
                    onClick={() => {setShowDetails(!showDetails);setShowPlayers(false);}}
                >
                    报告
                </button>
            </div>
            {showDetails && (
                <div className="col-span-6 text-center py-1">
                    <ResultTable tableContent = {tableContent} id={round.round_id}/>
                </div>
            )}
            {showPlayers && (
                
                <div className="col-span-6 text-center py-1">
                    <div className=""><p>再次点击可取消修改</p></div>
                    <NewGame
                            game_id={round.game_id}
                            getRounds={getRounds}
                            setShowPlayers={setShowPlayers}
                            round={round}
                            scrollToDetails={scrollToElement}
                        />
                </div>
            )}
        </div>
    );
};

export default Round;
