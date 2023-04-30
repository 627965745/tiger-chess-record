import React, { useState, useEffect, useMemo } from "react";
import { useTable, useGlobalFilter } from "react-table";
import { getRoundInfo, getGameInfo, getStreamInfo } from "./utils/apis";
const ResultTable = ({ tableContent, id }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        fetchContentData();
    }, []);

    const fetchContentData = async () => {
        if (tableContent === "stream") {
            await getStreamInfo(id)
                .then((response) => {
                    if (response.status !== 200) {
                        console.error(
                            "获取本局信息失败:",
                            response.data.message
                        );
                    } else {
                        setData(response.data);
                        setLoading(false);
                        
                    }
                })
                .catch((error) =>
                    console.error("获取本局信息失败:", error.message)
                );
        } else if (tableContent === "game") {
            await getGameInfo(id)
                .then((response) => {
                    if (response.status !== 200) {
                        console.error(
                            "获取游戏信息失败:",
                            response.data.message
                        );
                    } else {
                        setData(response.data);
                        setLoading(false);
                    }
                })
                .catch((error) =>
                    console.error("获取游戏信息失败:", error.message)
                );
        } else if (tableContent === "round") {
            await getRoundInfo(id)
                .then((response) => {
                    if (response.status !== 200) {
                        console.error(
                            "获取直播信息失败:",
                            response.data.message
                        );
                    } else {
                        setLoading(true);
                        setData(response.data);
                        setLoading(false);
                    }
                })
                .catch((error) =>
                    console.error("获取直播信息失败:", error.message)
                );
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "名字",
                accessor: "player_name",
                width: 350,
            },
            {
                Header: "总份",
                accessor: "stakes_won",
            },
            ...(tableContent !== "round"
                ? [
                      {
                          Header: "参与次数",
                          accessor: "rounds_played",
                          width: 400,
                          Cell: ({ cell, row }) => `${cell.value}->赢${row.original.rounds_win}输${row.original.rounds_lose}=${row.original.rounds_win-row.original.rounds_lose}`,
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
            <div className="col-span-1">
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
                    style={{ border: "solid 1px blue", width: "300px" }}
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
                                        {index === 0
                                            ? "总计输赢:"
                                            : ""}
                                        {index === 1
                                            ? `${data.reduce((acc, round) => acc + parseInt(round.stakes_won), 0)}份`
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
