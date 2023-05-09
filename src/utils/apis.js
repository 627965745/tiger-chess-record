import axios from "axios";

axios.defaults.baseURL = "http://localhost/api/index.php";
axios.defaults.withCredentials = true;
const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  }
};


const options = {
	headers: {"content-type": "application/json"}
}

export const login = (password) => axios.post('/login', { password } );

export const checkSession = () => axios.get("/checkSession");

export const getPlayers = () => axios.get("/getPlayers");

export const getStreams = () => axios.get("/getStreams");

export const getGamesByStreamid = (streamid) => axios.get('/getGamesByStreamid', { params: { streamid } });

export const getRoundsByGameid = (gameId) => axios.get('/getRoundsByGameid', { params: { gameId } });

export const getStreamInfo = (streamid) => axios.get('/getStreamInfo', { params: { streamid } });

export const getGameInfo = (gameid) => axios.get('/getGameInfo', { params: { gameid } });

export const getRoundInfo = (roundid) => axios.get('/getRoundInfo', { params: { roundid } });

export const addGameByStreamid = (streamid) => axios.post("/addGameByStreamid", streamid);

export const addPlayer = (player) => axios.post('/addPlayer', player);

export const addStream = () => axios.post('/addStream');

export const addRound = (roundDetail) => axios.post('/addRound', roundDetail);

export const editRound = (roundDetail) => axios.put('/editRound', roundDetail);

export const editPlayer = (player) => axios.put('/editPlayer', player);

export const editRoundStatus = (status) => axios.put('/editRoundStatus', status);

export const deletePlayerByPlayerid = (playerid) => axios.delete('/deletePlayerByPlayerid', { params: { playerid } });

export const deleteGameByGameid = (gameid) => axios.delete('/deleteGameByGameid', { params: { gameid } });

export const deleteRoundByRoundid = (roundid) => axios.delete('/deleteRoundByRoundid', { params: { roundid } });

export const deleteStreamByStreamid = (streamid) => axios.delete('/deleteStreamByStreamid', { params: { streamid } });

