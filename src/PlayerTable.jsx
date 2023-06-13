import React, { useState, useEffect, useMemo } from "react";
import { useNavigate  } from "react-router-dom";
import { useTable, useGlobalFilter } from "react-table";
import {
    getPlayerList,
    editPlayer,
    deletePlayerByPlayerid,
    addPlayer,
} from "./utils/apis";

const PlayersTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingPlayer, setAddingPlayer] = useState(false);
    let navigate  = useNavigate ();
    const [newPlayer, setNewPlayer] = useState({
        player_name: "",
        player_stakes: "2",
    });
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalData, setOriginalData] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const fetchData = async () => {
        await getPlayerList()
            .then((response) => {
                if (response.status !== 200) {
                    console.error("获取玩家列表失败:", response.data.message);
                } else {
                    setData(response.data);
                    setLoading(false);
                }
            })
            .catch((error) =>
                console.error("获取物品玩家失败:", error.message)
            );
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "player_id",
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: "名字",
                accessor: "player_name",
                Cell: ({ row }) => (
                    <>
                        {editingRowId === row.id ? (
                            <input
                                style={{ width: "100px" }}
                                defaultValue={row.values.player_name}
                                onChange={(e) => {
                                    const newData = [...data];
                                    newData[row.index].player_name =
                                        e.target.value;
                                    setData(newData);
                                }}
                            />
                        ) : (
                            row.values.player_name
                        )}
                    </>
                ),
            },
            {
                Header: "份数",
                accessor: "player_stakes",
                Cell: ({ row }) => (
                    <>
                        {editingRowId === row.id ? (
                            <input
                                style={{ width: "50px" }}
                                type="number"
                                defaultValue={row.values.player_stakes}
                                onChange={(e) => {
                                    const newData = [...data];
                                    newData[row.index].player_stakes =
                                        e.target.value;
                                    setData(newData);
                                }}
                            />
                        ) : (
                            row.values.player_stakes
                        )}
                    </>
                ),
            },
            {
                Header: "操作",
                Cell: ({ row }) => (
                    <div>
                        {editingRowId === row.id ? (
                            <>
                                <button
                                    className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    style={{ marginRight: "10px" }}
                                    onClick={() => updatePlayer(row)}
                                >
                                    确定
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => cancelEdit()}
                                >
                                    取消
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    style={{ marginRight: "10px" }}
                                    onClick={() => startEditing(row)}
                                >
                                    修改
                                </button>
                                <button
                                    className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => deletePlayer(row)}
                                >
                                    删除
                                </button>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [editingRowId, data]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
    } = useTable({ columns, data }, useGlobalFilter);

    const startEditing = (row) => {
        setEditingRowId(row.id);
        setOriginalData({ ...data[row.index] });
    };

    const updatePlayer = async (row) => {
        const playerToUpdate = data[row.index];
        await editPlayer(playerToUpdate)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("修改玩家失败:", response.data.message);
                } else {
                    fetchData();
                    setEditingRowId(null);
                }
            })
            .catch((error) => console.error("修改玩家失败:", error.message));
    };

    const cancelEdit = () => {
        const newData = [...data];
        newData[editingRowId] = originalData;
        setData(newData);
        setEditingRowId(null);
        setOriginalData(null);
    };

    const addNewPlayer = async () => {
        await addPlayer(newPlayer)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("添加玩家失败:", response.data.message);
                } else {
                    fetchData();
                    setNewPlayer({ player_name: "", player_stakes: "2" });
                    // setAddingPlayer(false);
                }
            })
            .catch((error) => console.error("添加玩家失败:", error.message));
    };

    const deletePlayer = async (row) => {
        await deletePlayerByPlayerid(row.values.player_id).then((response) => {
            if (response.status !== 200) {
                console.error("删除玩家失败:", response.data.message);
            } else {
                fetchData();
            }
        })
        .catch((error) => console.error("删除玩家失败:", error.message));
        
    };

    if (loading) {
        return <div>加载中...</div>;
    }

    return (
        <div className="grid grid-cols-4 gap-4 justify-items-center">
            <div className="col-span-4 mt-5">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {navigate('/')}}
            >
                直播列表
            </button>
            </div>
            <div className="col-span-4">
                {addingPlayer ? (
                    <div className=" mt-5">
                        <input
                            style={{ width: "100px" }}
                            className="border-2 border-blue-300"
                            placeholder="名字"
                            value={newPlayer.player_name}
                            onChange={(e) =>
                                setNewPlayer({
                                    ...newPlayer,
                                    player_name: e.target.value,
                                })
                            }
                        />
                        <input
                            style={{ width: "50px" }}
                            className="border-2 border-blue-300 mx-1"
                            type="number"
                            placeholder="份数"
                            value={newPlayer.player_stakes}
                            onChange={(e) =>
                                setNewPlayer({
                                    ...newPlayer,
                                    player_stakes: e.target.value,
                                })
                            }
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            style={{ marginRight: "10px" }}
                            onClick={() => addNewPlayer()}
                        >
                            确定
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setAddingPlayer(false)}
                        >
                            取消
                        </button>
                    </div>
                ) : (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setAddingPlayer(true)}
                    >
                        添加玩家
                    </button>
                )}
            </div>
            <div className="col-span-4">
                <input
                    style={{ width: "100px" }}
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        setGlobalFilter(e.target.value || undefined);
                    }}
                    placeholder="搜索名字，份数..."
                />
            </div>
            <div className="col-span-4">
                <table
                    {...getTableProps()}
                    style={{ border: "solid 1px blue" }}
                >
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps()}
                                        style={{
                                            borderBottom: "solid 3px red",
                                            background: "aliceblue",
                                            color: "black",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                style={{
                                                    padding: "10px",
                                                    border: "solid 1px gray",
                                                    background: "papayawhip",
                                                }}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayersTable;
