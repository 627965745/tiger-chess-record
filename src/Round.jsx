import React, { useState, useRef } from "react";
import { editRoundStatus, deleteRoundByRoundid } from "./utils/apis";
import ResultTable from "./ResultTable";
import NewGame from "./NewGame";
import { ReactComponent as Baogao } from "./utils/icons/baogao.svg";
import { ReactComponent as Shanchu } from "./utils/icons/shanchu.svg";
import { ReactComponent as Dui } from "./utils/icons/dui.svg";
import { ReactComponent as Cuo } from "./utils/icons/cuo.svg";
import { ReactComponent as Laohu } from "./utils/icons/laohu.svg";
import { ReactComponent as Fensi } from "./utils/icons/fensi.svg";
import { ReactComponent as Weichu } from "./utils/icons/weichu.svg";

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
            const elementPosition =
                scrollToDetails.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const middleOffset = (viewportHeight - elementPosition.height) / 2;
            const scrollToPosition =
                elementPosition.top + window.pageYOffset - middleOffset;

            window.scrollTo({ top: scrollToPosition, behavior: "smooth" });
        }
    };

    const changeRoundStatus = async (status) => {
        if (status !== round.round_status) {
            const updateRoundStatus = {
                round_id: round.round_id,
                round_status: status,
            };
            await editRoundStatus(updateRoundStatus).then((response) => {
                let data = response.data;
                if (data.status > 0) {
                    console.error("unexpected:", data.message);
                    return true;
                }
                setShowStatusOption(!showStatusOption);
                round.round_status = status;
            });
        } else {
            setShowStatusOption(!showStatusOption);
        }
    };

    const deleteRound = async (roundid) => {
        await deleteRoundByRoundid({round_id: roundid}).then((response) => {
            let data = response.data;
            if (data.status > 0) {
                console.error("unexpected:", data.message);
                return false;
            }
            getRounds();
        });
    };

    return (
        <div className="grid grid-cols-6 gap-4 py-2 mt-2">
            <div className="col-span-1 text-center py-1">
                {showStatusOption ? (
                    <>
                        <button
                            className="px-1 py-1 rounded bg-red-500 m-1"
                            onClick={() => changeRoundStatus("强哥赢")}
                        >
                            <Laohu className="h-8 w-8" />
                        </button>
                        <button
                            className="px-1 py-1 rounded bg-green-500 m-1"
                            onClick={() => changeRoundStatus("粉丝赢")}
                        >
                            <Fensi className="h-8 w-8" />
                        </button>
                        <button
                            className="px-1 py-1 rounded bg-gray-500 m-1"
                            onClick={() => changeRoundStatus("未出")}
                        >
                            <Weichu className="h-8 w-8" />
                        </button>
                    </>
                ) : (
                    <button
                        className={`px-1 py-1 mr-2 rounded ${
                            round.round_status === "强哥赢"
                                ? "bg-red-500"
                                : round.round_status === "粉丝赢"
                                ? "bg-green-500"
                                : "bg-gray-500"
                        }`}
                        onClick={toggleRoundStatus}
                    >
                        {round.round_status === "强哥赢" ? (
                            <Laohu className="h-9 w-9" />
                        ) : round.round_status === "粉丝赢" ? (
                            <Fensi className="h-9 w-9" />
                        ) : (
                            <Weichu className="h-9 w-9" />
                        )}
                    </button>
                )}
            </div>
            <div ref={scrollToDetails} className="col-span-4 text-center">
                <button
                    className="text-gray-600 hover:text-gray-800 py-1 ml-1 font-bold"
                    onClick={togglePlayers}
                >
                    {round.round_name} - 共{round.num_players}人
                    {round.total_stake}份 - {round.player_names}
                </button>
            </div>
            <div className="col-span-1 text-center">
                {showDeleteRound ? (
                    <>
                        <button
                            className="outline outline-2 outline-red-300 hover:outline-red-600 py-1 px-2 rounded m-1"
                            onClick={() => deleteRound(round.round_id)}
                        >
                            <Dui className="h-5 w-5" />
                        </button>
                        <button
                            className="outline outline-2 outline-gray-500 hover:outline-gray-700 py-1 px-2 rounded m-1"
                            onClick={() => setShowDeleteRound(false)}
                        >
                            <Cuo className="h-5 w-5" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="outline outline-2 outline-red-500 hover:outline-red-700 py-1 px-1 rounded m-1"
                            onClick={() => setShowDeleteRound(true)}
                        >
                            <Shanchu className="h-5 w-5" />
                        </button>
                        {/* <button
                        className="px-1 py-2 rounded bg-indigo-400"
                        onClick={() => {setShowDetails(!showDetails);setShowPlayers(false);}}
                    >
                        <Baogao className="h-7 w-7"/>
                    </button> */}
                    </>
                )}
            </div>
            {showDetails && (
                <div className="col-span-6 text-center py-1">
                    <ResultTable
                        tableContent={tableContent}
                        id={round.round_id}
                    />
                </div>
            )}
            {showPlayers && (
                <div className="col-span-6 text-center py-1">
                    <div className="">
                        <p>再次点击可取消修改</p>
                    </div>
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
