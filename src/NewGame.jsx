import React, { useState, useEffect } from "react";

const { getPlayers, addRound, editRound } = require("./utils/apis");

const NewGame = ({
    game_id,
    getRounds,
    toggleNewRounds,
    round,
    setShowPlayers,
    scrollToDetails,
}) => {
    const [players, setPlayers] = useState([]);
    const [totalStake, setTotalStake] = useState(0);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [currentPlayers, setcurrentPlayers] = useState([]);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [filterPlayer, setFilterPlayer] = useState("");
    const [gameName, setGameName] = useState("");
    const [loading, setLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    useEffect(() => {
        getAllPlayers();
        if (round !== undefined) {
            setGameName(round.round_name);
            setcurrentPlayers(
                round.player_ids.split(", ").map((num) => parseInt(num.trim()))
            );
        }
    }, []);

    useEffect(() => {
        if (round !== undefined) {
            setAvailablePlayers(
                players.filter(
                    (player) => !currentPlayers.includes(player.player_id)
                )
            );
            setSelectedPlayers(
                players.filter((player) =>
                    currentPlayers.includes(player.player_id)
                )
            );
            setLoading(false);
            setTotalStake(parseInt(round.total_stake));
        } else {
            setAvailablePlayers(players);
            setSelectedPlayers([]);
            setTotalStake(0);
            setGameName("");
            setLoading(false);
        }
    }, [players]);

    const getAllPlayers = () => {
        getPlayers()
            .then((response) => {
                if (response.status !== 200) {
                    console.error("获取玩家列表失败:", response.data.message);
                } else {
                    setPlayers(response.data);
                }
            })
            .catch((error) =>
                console.error("获取物品玩家失败:", error.message)
            );
    };

    const selectPlayer = (player) => {
        setSelectedPlayers((prevState) => [...prevState, player]);
        setAvailablePlayers(
            players.filter((player) => !selectedPlayers.includes(player))
        );
        setAvailablePlayers((prevState) =>
            prevState.filter((p) => p.player_id !== player.player_id)
        );
        setTotalStake(
            (prevState) => prevState + parseInt(player.player_stakes)
        );
        setFilterPlayer("");
    };

    const removePlayer = (player) => {
        setSelectedPlayers((prevState) =>
            prevState.filter((p) => p.player_id !== player.player_id)
        );
        setAvailablePlayers((prevState) => [...prevState, player]);
        setTotalStake((prevState) => prevState - player.player_stakes);
    };

    const handleFilterChange = (e) => {
        setFilterPlayer(e.target.value);
        const filteredPlayers = players
            .filter((player) => player.player_name.includes(e.target.value))
            .filter((player) => !selectedPlayers.includes(player));
        if (e.target.value.length > 0) {
            setAvailablePlayers(filteredPlayers);
        } else {
            setAvailablePlayers(
                players.filter((player) => !selectedPlayers.includes(player))
            );
        }
    };

    const addGameName = (e) => {
        setGameName(gameName + e.target.innerText);
    };

    const addNewRound = async (e) => {
        const newRoundDetail = {
            game_id: game_id,
            round_name: gameName,
            players: selectedPlayers,
        };
        await addRound(newRoundDetail)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("添加失败:", response.data.message);
                } else {
                    getRounds();
                    setAvailablePlayers(players);
                    setSelectedPlayers([]);
                    setTotalStake(0);
                    setGameName("");
                    toggleNewRounds();
                }
            })
            .catch((error) => console.error("添加失败:", error.message));
    };

    const editCurrentRound = async (e) => {
        const newRoundDetail = {
            game_id: game_id,
            round_id: round.round_id,
            round_name: gameName,
            players: selectedPlayers,
            round_status: round.round_status,
        };
        await editRound(newRoundDetail)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("修改失败:", response.data.message);
                } else {
                    scrollToDetails();
                    setShowPlayers(false);
                    getRounds();
                    setAvailablePlayers(players);
                    setSelectedPlayers([]);
                    setTotalStake(0);
                    setGameName("");
                    
                }
            })
            .catch((error) => console.error("修改失败:", error.message));
    };

    if (loading) {
        return <div>加载中...</div>;
    }
    return (
        <div className="grid grid-cols-4 gap-4 justify-items-center">
            <div className="col-span-4 mt-2">
                <button
                    className="bg-blue-500 py-1 px-2 m-1 cursor-pointer rounded text-white "
                    onClick={addGameName}
                >
                    蓝
                </button>
                <button
                    className="bg-orange-500 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    橙
                </button>
                <button
                    className="bg-green-500 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    绿
                </button>
                <button
                    className="bg-purple-500 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    紫
                </button>
                <button
                    className="bg-indigo-600 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    40
                </button>
                <button
                    className="bg-indigo-500 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    39
                </button>
                <button
                    className="bg-indigo-400 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    38
                </button>
                <button
                    className="bg-indigo-300 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    37
                </button>
                <button
                    className="bg-pink-500 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    双
                </button>
                <button
                    className="bg-red-600 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    炸
                </button>
                <button
                    className="bg-yellow-800 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    雷
                </button>
                <button
                    className="bg-yellow-500 py-1 px-2 m-1 cursor-pointer rounded text-white"
                    onClick={addGameName}
                >
                    兵
                </button>
            </div>
            <div className="col-span-4">
                <label htmlFor="filter-input" className="font-bold">
                    内容：
                </label>
                <input
                    type="text"
                    id="filter-input"
                    className="border-2 border-blue-300 mx-1 w-1/2"
                    value={gameName}
                    onChange={(e) => {
                        setGameName(e.target.value);
                    }}
                    placeholder="蓝40，绿39..."
                />
                <button
                    className="bg-red-500 py-1 px-2 cursor-pointer rounded text-white"
                    onClick={() => {
                        setGameName("");
                    }}
                >
                    X
                </button>
            </div>
            <div className="bg-blue-200 p-1 mb-1 rounded col-span-4 mx-1">
                <h2 className="mb-1">玩家列表（点击参与的玩家）</h2>
                <div className="col-span-4 mb-2">
                    <label htmlFor="filter-input">搜索玩家：</label>
                    <input
                        type="text"
                        id="filter-input"
                        className="border-2 border-blue-500 mx-1"
                        value={filterPlayer}
                        onChange={handleFilterChange}
                        placeholder="输入名字..."
                    />
                </div>
                {availablePlayers.map((player) => (
                    <button
                        key={player.player_id}
                        className="bg-blue-500 p-1 m-1 cursor-pointer rounded text-white"
                        onClick={() => selectPlayer(player)}
                    >
                        {player.player_name} {player.player_stakes}
                    </button>
                ))}
            </div>
            <div className="bg-green-200 p-1 mt-4 rounded col-span-4 mx-1">
                <h2 className="mb-4">已选玩家（点击玩家取消参与）</h2>

                {selectedPlayers.map((player) => (
                    <button
                        key={player.player_id}
                        className="bg-green-500 p-1 m-1 rounded text-white cursor-pointer"
                        onClick={() => removePlayer(player)}
                    >
                        {player.player_name} {player.player_stakes}
                    </button>
                ))}
                <div>
                    {selectedPlayers.length}人{totalStake}份
                </div>
            </div>
            <div className="col-span-4">
                {round === undefined ? (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={addNewRound}
                    >
                        提交
                    </button>
                ) : (
                    <>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={() => {setShowPlayers(false);scrollToDetails()}}
                        >
                            取消
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={editCurrentRound}
                        >
                            确认修改
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewGame;
