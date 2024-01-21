import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const login = (password) => axios.post('/login', { password } );

export const checkSession = () => axios.post("/checkSession");

export const getPlayers = () => axios.post("/getPlayers");

export const getPlayerList = () => axios.post("/getPlayerList");

export const getStreams = () => axios.post("/getStreams");

export const getRoundsByStreamidAndPlayerid = (streamPlayer) => axios.post('/getRoundsByStreamidAndPlayerid', streamPlayer);

export const getGamesByStreamid = (streamid) => axios.post('/getGamesByStreamid', streamid);

export const getRoundsByGameid = (gameId) => axios.post('/getRoundsByGameid', gameId);

export const getStreamInfo = (streamid) => axios.post('/getStreamInfo', streamid);

export const getStreamTableInfo = (streamid) => axios.post('/getStreamTableInfo', streamid);

export const getGameInfo = (gameid) => axios.post('/getGameInfo', gameid);

export const getRoundInfo = (roundid) => axios.post('/getRoundInfo', roundid);

export const addGameByStreamid = (streamid) => axios.post("/addGameByStreamid", streamid);

export const addPlayer = (player) => axios.post('/addPlayer', player);

export const addStream = () => axios.post('/addStream');

export const addRound = (roundDetail) => axios.post('/addRound', roundDetail);

export const editRound = (roundDetail) => axios.post('/editRound', roundDetail);

export const editPlayer = (player) => axios.post('/editPlayer', player);

export const editRoundStatus = (status) => axios.post('/editRoundStatus', status);

export const deletePlayerByPlayerid = (playerid) => axios.post('/deletePlayerByPlayerid', playerid);

export const deleteGameByGameid = (gameid) => axios.post('/deleteGameByGameid', gameid);

export const deleteRoundByRoundid = (roundid) => axios.post('/deleteRoundByRoundid', roundid);

export const deleteStreamByStreamid = (streamid) => axios.post('/deleteStreamByStreamid', streamid);

