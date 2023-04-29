const newPlayer = () => {
    const handleAddPlayer = (event) => {
        event.preventDefault();
        addPlayer({ name: newPlayerName, stake: newPlayerStake })
            .then((response) => {
                if (response.data.message) {
                    console.error("添加玩家失败:", response.data.message);
                } else {
                    setPlayers((prevState) => [...prevState, response.data]);
                    setAvailablePlayers((prevState) => [
                        ...prevState,
                        response.data,
                    ]);
                }
            })
            .catch((error) => console.error("添加玩家失败:", error.message));
        setNewPlayerName("");
        setNewPlayerStake(1);
    };
}

