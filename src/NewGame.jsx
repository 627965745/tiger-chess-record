import React, { useState, useEffect } from "react";

const { getPlayers, addRound } = require("./utils/apis");

const NewGame = ({game_id, getRounds, toggleNewRounds}) => {
    const [players, setPlayers] = useState([]);
    const [totalStake, setTotalStake] = useState(0);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [filterPlayer, setFilterPlayer] = useState("");
    const [gameName, setGameName] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getAllPlayers();
    }, []);

    const getAllPlayers = () => {
        getPlayers()
            .then((response) => {
                if (response.status !== 200) {
                    console.error("获取玩家列表失败:", response.data.message);
                } else {
                    setPlayers(response.data);
                    setAvailablePlayers(response.data);
                    setSelectedPlayers([]);
                    setTotalStake(0)
                    setGameName("")
                    setLoading(false);
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
        const filteredPlayers = players.filter((player) =>
                player.player_name.includes(e.target.value)
            ).filter((player) => !selectedPlayers.includes(player));
        if (e.target.value.length > 0) {
            setAvailablePlayers(filteredPlayers);
        } else {
            setAvailablePlayers(
                players.filter((player) => !selectedPlayers.includes(player))
            );
        }
    };



    const addNewRound = async (e) => {
        const newRoundDetail = {game_id : game_id, round_name : gameName, players: selectedPlayers}
        await addRound(newRoundDetail).then((response) => {
            if (response.status !== 200) {
                console.error("获取玩家列表失败:", response.data.message);
            } else {
                getRounds();
                setAvailablePlayers(players);
                setSelectedPlayers([]);
                setTotalStake(0);
                setGameName("");
                toggleNewRounds();
                
            }
        })
        .catch((error) =>
            console.error("获取物品玩家失败:", error.message)
        );
    }


    if (loading) {
        return <div>加载中...</div>;
    }
    return (
        <div className="grid grid-cols-4 gap-4 justify-items-center">
            <div className="col-span-4 mt-2">
                    <label htmlFor="filter-input" className="font-bold">输入内容：</label>
                    <input
                        type="text"
                        id="filter-input"
                        className="border-2 border-blue-300 mx-1"
                        value={gameName}
                        onChange={(e)=>{setGameName(e.target.value)}}
                        placeholder="蓝40，绿39..."
                    />
                </div>
            <div className="bg-blue-200 p-1 mb-1 rounded col-span-4 mx-5">
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
            <div className="bg-green-200 p-4 mt-4 rounded col-span-4 mx-5">
                <h2 className="mb-4">已选玩家（点击玩家取消参与）</h2>

                {selectedPlayers.map((player) => (
                    <button
                        key={player.player_id}
                        className="bg-green-500 p-2 m-2 rounded text-white cursor-pointer"
                        onClick={() => removePlayer(player)}
                    >
                        {player.player_name} {player.player_stakes}份
                    </button>
                ))}
                <div>
                    {selectedPlayers.length}人{totalStake}份
                </div>
            </div>
            <div className="col-span-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={addNewRound}>
                    
                    提交
                </button>
            </div>
        </div>
    );
};

export default NewGame;
