import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stream from "./Stream";
import { getStreams, addStream } from "./utils/apis";

const Pk = () => {
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();
    useEffect(() => {
        getAllStreams();
    }, []);

    const addNewStream = async () => {
        await addStream().then((response) => {
            let data = response.data;
            if (data.status > 0) {
                console.error("unexpected:", data.message);
                return true;
            }
            getAllStreams();
        });
    };

    const getAllStreams = async () => {
        await getStreams().then((response) => {
            let data = response.data;
            if (data.status > 0) {
                console.error("unexpected:", data.message);
                return true;
            }
            setStreams(data.data);
            setLoading(false);
        });
    };
    if (loading) {
        return <div>加载中...</div>;
    }
    return (
        <div className="h-screen mx-auto p-4 ">
            <div className="flex justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        navigate("/players");
                    }}
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
                    className="box-border border-4 border-gray-200 bg-gray-100 my-5 mx-auto"
                >
                    <Stream stream={stream} getAllStreams={getAllStreams} />
                </div>
            ))}
        </div>
    );
};

export default Pk;
