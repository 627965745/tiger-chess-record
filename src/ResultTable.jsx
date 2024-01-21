import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useTable, useGlobalFilter } from "react-table";
import {
    getRoundInfo,
    getGameInfo,
    getStreamInfo,
    getRoundsByStreamidAndPlayerid,
} from "./utils/apis";
import { formatDate } from "./utils/dateutil";
Modal.setAppElement("#root");
const ResultTable = ({ tableContent, id }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [modalDetail, setModalDetail] = useState({
        player_name: "",
        stakes_won: "",
        rounds_win: "",
        rounds_lose: "",
        rounds_played: "",
    });
    const [playerRoundsIsOpen, setPlayerRoundsIsOpen] = useState(false);
    const [playerRounds, setPlayerRounds] = useState([
        { game_time: "", round_name: "", round_stakes: "", round_status: "" },
    ]);

    useEffect(() => {
        if (playerRoundsIsOpen) {
            document.body.classList.add("noScroll");
        } else {
            document.body.classList.remove("noScroll");
        }
    }, [playerRoundsIsOpen]);

    const handleNameClick = async (player) => {
        setModalDetail(player);
        const streamPlayer = {
            player_id: player.player_id,
            stream_id: id,
        };

        await getRoundsByStreamidAndPlayerid(streamPlayer).then((response) => {
            let data = response.data;
            if (data.status > 0) {
                console.error("unexpected:", data.message);
                return false;
            }
            setPlayerRoundsIsOpen(true);
            setPlayerRounds(data.data);
        });
    };

    useEffect(() => {
        fetchContentData();
    }, []);

    const fetchContentData = async () => {
        if (tableContent === "stream") {
            await getStreamInfo({stream_id: id}).then((response) => {
                let data = response.data;
                if (data.status > 0) {
                    console.error("unexpected:", data.message);
                    return true;
                }
                setData(data.data);
                setLoading(false);
            });
        } else if (tableContent === "game") {
            await getGameInfo({game_id: id}).then((response) => {
                let data = response.data;
                if (data.status > 0) {
                    console.error("unexpected:", data.message);
                    return true;
                }
                setData(data.data);
                setLoading(false);
            });
        } else if (tableContent === "round") {
            await getRoundInfo(id).then((response) => {
                let data = response.data;
                if (data.status > 0) {
                    console.error("unexpected:", data.message);
                    return true;
                }
                setLoading(true);
                setData(data.data);
                setLoading(false);
            });
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "名字",
                accessor: "player_name",
                width: 100,
                Cell: ({ cell, row }) => {
                    if (tableContent === "stream") {
                        return (
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    color: "blue",
                                }}
                                onClick={() => handleNameClick(row.original)}
                            >
                                {cell.value}
                            </button>
                        );
                    } else {
                        return <span>{cell.value}</span>;
                    }
                },
            },
            {
                Header: "总份",
                accessor: "stakes_won",
                width: 50,
            },
            ...(tableContent !== "round"
                ? [
                      {
                          Header: "参与次数",
                          accessor: "rounds_played",
                          //   width: 400,
                          Cell: ({ cell, row }) =>
                              `${cell.value}->赢${row.original.rounds_win}输${
                                  row.original.rounds_lose
                              }=${
                                  row.original.rounds_win -
                                  row.original.rounds_lose
                              }`,
                      },
                  ]
                : []),
        ],
        [data]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
    } = useTable({ columns, data }, useGlobalFilter);

    if (loading) {
        return <div>加载中...</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 justify-items-center">
            <Modal
                isOpen={playerRoundsIsOpen}
                onRequestClose={() => setPlayerRoundsIsOpen(false)}
                contentLabel="参与记录"
                style={{
                    overlay: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    content: {
                        position: "fixed",
                        width: "320px",
                        WebkitOverflowScrolling: "touch",
                        height: "100vh",
                        maxHeight: "98vh",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "6px",
                        padding: "10px",
                        overflow: "auto",
                    },
                }}
            >
                <div className="grid grid-flow-row justify-items-center items-center">
                    <div className="font-bold text-blue-600 hover:text-blue-800 ">
                        <p className="text-xl text-center mt-20">
                            参与记录
                            <button
                                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold text-base py-1 px-2 rounded -mb-1"
                                onClick={() => setPlayerRoundsIsOpen(false)}
                            >
                                关闭
                            </button>
                        </p>

                        <p className="mt-5 text-center">
                            {modalDetail.player_name} - 总计
                            {modalDetail.rounds_played}把 - 赢
                            {modalDetail.rounds_win}输{modalDetail.rounds_lose}
                        </p>
                        <p className="mt-2 text-center">
                            {parseInt(modalDetail.rounds_win) >
                            parseInt(modalDetail.rounds_lose)
                                ? `赢${
                                      parseInt(modalDetail.rounds_win) -
                                      parseInt(modalDetail.rounds_lose)
                                  }把 每把${playerRounds[0].round_stakes}份 赢${
                                      modalDetail.stakes_won
                                  }份`
                                : parseInt(modalDetail.rounds_win) <
                                  parseInt(modalDetail.rounds_lose)
                                ? `输${
                                      parseInt(modalDetail.rounds_lose) -
                                      parseInt(modalDetail.rounds_win)
                                  }把 每把${
                                      playerRounds[0].round_stakes
                                  }份 输${Math.abs(modalDetail.stakes_won)}份`
                                : "打平 "}
                        </p>
                    </div>

                    <div className="font-bold text-lg mt-5 mb-16">
                        {playerRounds.map((round) => (
                            <div className="">
                                <p>
                                    {formatDate(
                                        new Date(
                                            new Date(round.game_time).getTime()
                                        ),
                                        "hh:mm:ss"
                                    )}{" "}
                                    - {round.round_name} -{" "}
                                    {round.round_status === "强哥赢"
                                        ? "输"
                                        : round.round_status === "粉丝赢"
                                        ? "赢"
                                        : "未出"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            <div className="col-span-1 mt-2">
                <input
                    style={{ width: "200px" }}
                    value={searchInput}
                    className="border-2 border-blue-300 mx-1"
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        setGlobalFilter(e.target.value || undefined);
                    }}
                    placeholder="搜索名字，份数..."
                />
            </div>
            <div className="col-span-1">
                <table
                    {...getTableProps()}
                    style={{ border: "solid 1px blue", width: "320px" }}
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
                                            width: column.width,
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
                    <tfoot>
                        {footerGroups.map((footerGroup) => (
                            <tr {...footerGroup.getFooterGroupProps()}>
                                {footerGroup.headers.map((column, index) => (
                                    <td
                                        {...column.getFooterProps()}
                                        key={index}
                                    >
                                        {index === 0 ? "总计输赢:" : ""}
                                        {index === 1
                                            ? `${data.reduce(
                                                  (acc, round) =>
                                                      acc +
                                                      parseInt(
                                                          round.stakes_won
                                                      ),
                                                  0
                                              )}份`
                                            : ""}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ResultTable;
