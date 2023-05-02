import React, { useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import Stream from "./Stream";
import { getStreams, addStream } from "./utils/apis";

const Pk = () => {
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    let navigate  = useNavigate ();
    useEffect(() => {
        getAllStreams();
    }, []);

    const addNewStream = async () => {
        await addStream()
            .then((response) => {
                if (response.status !== 200) {
                    console.error("添加直播失败:", response.data.message);
                } else {
                    getAllStreams();
                }
            })
            .catch((error) => console.error("添加直播失败:", error.message));
    };

    const getAllStreams = async () => {
       await getStreams()
            .then((response) => {
                if (response.status !== 200) {
                    console.error("抓取直播失败:", response.data.message);
                } else {
                    setStreams(response.data);
                    setLoading(false);
                }
            })
            .catch((error) => console.error("抓取直播失败:", error.message));
    };
    if (loading) {
        return <div>加载中...</div>;
    }
    return (
        <div className="container mx-auto p-4 ">
            <div className="flex justify-between">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {navigate('/players')}}
            >
                玩家列表
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => addNewStream()}
            >
                新的一场直播
            </button>
            </div>
            {streams.map((stream) => (
                <div
                    key={stream.stream_id}
                    className="box-border border-4 border-gray-200 bg-gray-100 my-5"
                >
                    <Stream stream={stream} getAllStreams={getAllStreams} />
                </div>
            ))}
        </div>
    );
};

export default Pk;
