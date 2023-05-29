import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { getStreamTableInfo } from "./utils/apis";

const ResultLineTable = ({ id }) => {
    const [loading, setLoading] = useState(true);
    const [markPoints, setMarkPoints] = useState([]);
    const [tableData, setTableData] = useState([
        { round_name: "", round_time: "", player_names: "", total_stakes: 0 },
    ]);

    const getTableInfo = async (id) => {
        await getStreamTableInfo(id)
            .then((response) => {
                if (response.status !== 200) {
                    console.error("获取折线图失败:", response.data.message);
                } else {
                    let runningTotal = 0;
                    const dataWithAddingStakes = response.data.map((item) => {
                        runningTotal += parseInt(item.total_stakes);
                        return { ...item, total_stakes: runningTotal };
                    });
                    setTableData(dataWithAddingStakes);
                    let points = [];
                    for (let i = 1; i < response.data.length; i++) {
                        if (
                            (response.data[i - 1].total_stakes < 0 &&
                                response.data[i].total_stakes > 0) ||
                            (response.data[i - 1].total_stakes > 0 &&
                                response.data[i].total_stakes < 0)
                        ) {
                            points.push(i - 1);
                        }
                    }
                    setMarkPoints(points);
                    setLoading(false);
                }
            })
            .catch((error) => console.error("获取折线图失败:", error.message));
    };

    const getOption = () => ({
        xAxis: {
            type: "category",
            data: tableData.map((item) => item.round_time),
            axisLabel: {
                interval: 1,
                rotate: -90,
                padding: [0,0,0,10]
            },
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                data: tableData.map((item) => item.total_stakes),
                type: "line",
                smooth: true,
                areaStyle: {},
                label: {
                    show: true,
                    align: "center",
                    position: [0,-20],
                    formatter: (params) => {
                        if (markPoints.includes(params.dataIndex)) {
                            if(params.data<0) {
                                return "\n\n\n" + params.data;
                            } else {
                                return params.data;
                            }
                            
                        } else {
                            return "";
                        }
                    },
                },
            },
        ],
        visualMap: {
            show: false,
            pieces: [
                {
                    gt: 0,
                    lte: 500,
                    color: "#22c55e",
                },
                {
                    lt: 0,
                    gt: -500,
                    color: "#ef4444",
                },
            ],
            outOfRange: {
                color: "#999",
            },
        },
        tooltip: {
            trigger: "axis",
            formatter: function (params) {
                const roundData = tableData[params[0].dataIndex];
                return `<div style="width: auto;">
              内容: ${roundData.round_name}<br/>
              时间: ${roundData.round_time}<br/>
              累计: ${roundData.total_stakes}
              </div>`;
            },
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
            right: "10%",
        },

        animationDuration: 400,
    });

    useEffect(() => {
        getTableInfo(id);
    }, []);

    if (loading) {
        return <div>加载中...</div>;
    }
    return (
        <ReactECharts
            option={getOption()}
            style={{ height: "400px", width: `${window.innerWidth - 40}px` }}
        />
    );
};

export default ResultLineTable;
