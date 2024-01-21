<?php
ini_set('session.gc_maxlifetime', 86400); // Set session lifetime to 24 hours
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Auth-Token, Origin, Application");
$fixedPassword = "Bwhjq777";
session_start();
$sessionLifetime = 86400; 
if (strtolower($_SERVER['REQUEST_METHOD']) == 'options') {
    exit;
}

if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $sessionLifetime) {
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
} else {
    $_SESSION['last_activity'] = time();
}

require_once 'config.php';
$requestUri = $_SERVER['REQUEST_URI'];
function safeQuery($conn, $sql, $paramTypes, ...$params) {
    $stmt = $conn->prepare($sql);
    if ($params) {
      $stmt->bind_param($paramTypes, ...$params);
    }
  
    if ($stmt->execute()) {
      if (strpos($sql, 'SELECT') !== false) {
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
      }
      return true;
    }
  
    return false;
}

function echoSelectQuery($result){
    if ($result !== false) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode(['message' => '获取游戏列表失败']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (strpos($requestUri, '/getPlayers') !== false) {
        $sql = "SELECT players.*, COALESCE(subquery.total_rounds_played, 0) AS total_rounds_played FROM players LEFT JOIN ( SELECT roundplayers.player_id, COUNT(DISTINCT rounds.round_id) AS total_rounds_played FROM roundplayers INNER JOIN rounds ON roundplayers.round_id = rounds.round_id INNER JOIN games ON rounds.game_id = games.game_id INNER JOIN stream ON games.stream_id = stream.stream_id WHERE stream.stream_id IN ( SELECT stream_id FROM ( SELECT stream_id, ROW_NUMBER() OVER (ORDER BY stream_time DESC) AS row_num FROM stream ) AS subquery WHERE row_num <= 10 ) GROUP BY roundplayers.player_id ) AS subquery ON players.player_id = subquery.player_id ORDER BY total_rounds_played DESC";
        $players = safeQuery($conn, $sql, '');
        echoSelectQuery($players);

    } elseif (strpos($requestUri, '/getconstrain') !== false) {
        $sql = "SHOW CREATE TABLE games";
        $streams = safeQuery($conn, $sql, '');
        echoSelectQuery($streams);

    } elseif (strpos($requestUri, '/getPlayerList') !== false) {
        $sql = "SELECT * FROM players";
        $streams = safeQuery($conn, $sql, '');
        echoSelectQuery($streams);

    } elseif (strpos($requestUri, '/getStreams') !== false) {
        $sql = "SELECT * FROM stream ORDER BY stream_time desc";
        $streams = safeQuery($conn, $sql, '');
        echoSelectQuery($streams);

    } elseif (strpos($requestUri, '/getRoundInfo') !== false) {
        $roundId = $_GET['roundid'];
        $sql = "SELECT players.player_name, SUM(CASE WHEN rounds.round_status = '强哥赢' THEN -roundplayers.round_stakes WHEN rounds.round_status = '粉丝赢' THEN roundplayers.round_stakes ELSE 0 END) AS stakes_won FROM players INNER JOIN roundplayers ON players.player_id = roundplayers.player_id INNER JOIN rounds ON roundplayers.round_id = rounds.round_id WHERE rounds.round_id = ? GROUP BY players.player_name";
        $paramTypes = "i";
        $games = safeQuery($conn, $sql, $paramTypes, $roundId);
        echoSelectQuery($games);
        
    } elseif (strpos($requestUri, '/getStreamTableInfo') !== false) {
        $streamId = $_GET['streamid'];
        $sql = "SELECT rounds.round_id, rounds.round_name, DATE_FORMAT(rounds.round_time, '%H:%i:%s')as round_time, GROUP_CONCAT(players.player_name ORDER BY players.player_name SEPARATOR ', ') AS player_names, SUM(CASE WHEN rounds.round_status = '强哥赢' THEN +roundplayers.round_stakes WHEN rounds.round_status = '粉丝赢' THEN -roundplayers.round_stakes ELSE 0 END) AS total_stakes FROM rounds INNER JOIN roundplayers ON rounds.round_id = roundplayers.round_id INNER JOIN players ON roundplayers.player_id = players.player_id INNER JOIN games ON rounds.game_id = games.game_id INNER JOIN stream ON games.stream_id = stream.stream_id WHERE stream.stream_id = ? GROUP BY rounds.round_id, rounds.round_name ORDER BY rounds.round_id";
        $paramTypes = "i";
        $streamTable = safeQuery($conn, $sql, $paramTypes, $streamId);
        echoSelectQuery($streamTable);
        
    } elseif (strpos($requestUri, '/getGameInfo') !== false) {
        $gameId = $_GET['gameid'];
        $sql = "SELECT players.player_id, players.player_name, SUM(CASE WHEN rounds.round_status = '强哥赢' THEN -roundplayers.round_stakes WHEN rounds.round_status = '粉丝赢' THEN roundplayers.round_stakes ELSE 0 END) AS stakes_won, SUM(CASE WHEN rounds.round_status = '粉丝赢' THEN +1 ELSE 0 END) AS rounds_win, SUM(CASE WHEN rounds.round_status = '强哥赢' THEN +1 ELSE 0 END) AS rounds_lose, COUNT(DISTINCT rounds.round_id) AS rounds_played FROM players INNER JOIN roundplayers ON players.player_id = roundplayers.player_id INNER JOIN rounds ON roundplayers.round_id = rounds.round_id WHERE rounds.game_id = ? GROUP BY players.player_name";
        $paramTypes = "i";
        $games = safeQuery($conn, $sql, $paramTypes, $gameId);
        echoSelectQuery($games);
        
    } elseif (strpos($requestUri, '/getStreamInfo') !== false) {
        $streamId = $_GET['streamid'];
        $sql = "SELECT players.player_id, players.player_name, SUM(CASE WHEN rounds.round_status = '强哥赢' THEN -roundplayers.round_stakes WHEN rounds.round_status = '粉丝赢' THEN roundplayers.round_stakes ELSE 0 END) AS stakes_won, SUM(CASE WHEN rounds.round_status = '粉丝赢' THEN +1 ELSE 0 END) AS rounds_win, SUM(CASE WHEN rounds.round_status = '强哥赢' THEN +1 ELSE 0 END) AS rounds_lose, COUNT(DISTINCT rounds.round_id) AS rounds_played FROM players INNER JOIN roundplayers ON players.player_id = roundplayers.player_id INNER JOIN rounds ON roundplayers.round_id = rounds.round_id INNER JOIN games ON rounds.game_id = games.game_id INNER JOIN stream ON games.stream_id = stream.stream_id WHERE stream.stream_id = ? GROUP BY players.player_name;";
        $paramTypes = "i";
        $streams = safeQuery($conn, $sql, $paramTypes, $streamId);
        echoSelectQuery($streams);
        
    } elseif (strpos($requestUri, '/getGamesByStreamid') !== false) {
        
        $streamId = $_GET['streamid'];
        $sql = "SELECT * FROM games WHERE stream_id = ? ORDER BY game_time desc";
        $paramTypes = "i";
        $games = safeQuery($conn, $sql, $paramTypes, $streamId);
        
        echoSelectQuery($games);

    }  elseif (strpos($requestUri, '/getRoundsByStreamidAndPlayerid') !== false) {
        $streamPlayer = $_GET['streamPlayer'];
        $playerId = $streamPlayer['player_id'];
        $streamId = $streamPlayer['stream_id'];
        $sql = "SELECT games.game_time, rounds.round_name, roundplayers.round_stakes, rounds.round_status FROM rounds INNER JOIN roundplayers ON rounds.round_id = roundplayers.round_id INNER JOIN games ON rounds.game_id = games.game_id INNER JOIN stream ON games.stream_id = stream.stream_id WHERE roundplayers.player_id = ? AND stream.stream_id = ? ORDER BY games.game_time";
        $paramTypes = "ii";
        $games = safeQuery($conn, $sql, $paramTypes, $playerId, $streamId);
        
        echoSelectQuery($games);

    } elseif (strpos($requestUri, '/getRoundsByGameid') !== false) {
        $gameId = $_GET['gameId'];
        $sql = "SELECT rounds.*, COUNT(roundplayers.player_id) AS num_players, SUM(players.player_stakes) AS total_stake, GROUP_CONCAT(players.player_id ORDER BY players.player_name SEPARATOR ', ') AS player_ids, GROUP_CONCAT(players.player_name ORDER BY players.player_name SEPARATOR ', ') AS player_names FROM rounds JOIN roundplayers ON rounds.round_id = roundplayers.round_id JOIN players ON roundplayers.player_id = players.player_id WHERE rounds.game_id = ? GROUP BY rounds.round_id ORDER BY rounds.round_time DESC";
        $paramTypes = "i";
        $roundsByid = safeQuery($conn, $sql, $paramTypes, $gameId);
        echoSelectQuery($roundsByid);
    } elseif (strpos($requestUri, '/checkSession') !== false) {
        if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
            echo json_encode(['authenticated' => true]);
        } else {
            echo json_encode(['authenticated' => false]);
            exit;
        }

    } else {
        http_response_code(404);
        echo json_encode(array("message" => "请求的 URL 不存在"));
        exit;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (strpos($requestUri, '/addPlayer') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
      
        $name = $input['player_name'];
        $stake = $input['player_stakes'];
      
        $sql = "INSERT INTO players (player_name, player_stakes) VALUES (?, ?)";
        $paramTypes = "si";
        $insertResult = safeQuery($conn, $sql, $paramTypes, $name, $stake);

        if ($insertResult) {
            $newPlayerId = $conn->insert_id;
            $newPlayer = ['player_id' => $newPlayerId, 'player_name' => $name, 'player_stake' => $stake];
            echo json_encode($newPlayer);
        } else {
            http_response_code(400);
            echo json_encode(['message' => '添加玩家失败']);
        }
    } elseif (strpos($requestUri, '/addRound') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        $date = new DateTime("now", new DateTimeZone('Asia/Hong_Kong'));
        $roundDate = $date->format('Y-m-d H:i:s');

        $gameId = $input['game_id'];
        $roundName = $input['round_name'];
        $players = $input['players'];
        $status = "未出";

        $sql = "INSERT INTO rounds (game_id, round_name, round_time, round_status) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('isss', $gameId, $roundName, $roundDate, $status);
        if ($stmt->execute()) {
            $roundId = $conn->insert_id;

            $sql = "INSERT INTO roundplayers (round_id, player_id, round_stakes) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql);

            foreach ($players as $player) {
                $playerId = $player['player_id'];
                $playerStake = $player['player_stakes'];
                $stmt->bind_param('iii', $roundId, $playerId, $playerStake);
                $stmt->execute();
            }

            echo json_encode(['message' => '添加成功']);
        } else {
            http_response_code(400);
            echo json_encode(['message' => '添加失败']);
        }

    } elseif (strpos($requestUri, '/addGameByStreamid') !== false) {
        $date = new DateTime("now", new DateTimeZone('Asia/Hong_Kong'));
        $gameDate = $date->format('Y-m-d H:i:s');
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
      
        $streamId = $input;

        $sql = "INSERT INTO games (game_time, stream_id) VALUES (?, ?)";
        $paramTypes = "si";
        $insertResult = safeQuery($conn, $sql, $paramTypes, $gameDate, $streamId);

        if ($insertResult) {
            $newgameId = $conn->insert_id;
            $newGame = ['game_id' => $newgameId, 'game_time' => $gameDate, 'stream_id' => $streamId];
            echo json_encode($newGame);
        } else {
            http_response_code(400);
            echo json_encode(['message' => '添加游戏失败']);
        }
    } elseif (strpos($requestUri, '/addStream') !== false) {
        $date = new DateTime("now", new DateTimeZone('Asia/Hong_Kong'));
        $streamDate = $date->format('Y-m-d H:i:s');

        $sql = "INSERT INTO stream (stream_time) VALUES (?)";
        $paramTypes = "s";
        $insertResult = safeQuery($conn, $sql, $paramTypes, $streamDate);

        if ($insertResult) {
            $newStreamId = $conn->insert_id;
            $newStream = ['stream_id' => $newStreamId, 'stream_time' => $streamDate];
            echo json_encode($newStream);
        } else {
            http_response_code(400);
            echo json_encode(['message' => '添加游戏失败']);
        }
    } elseif (strpos($requestUri, '/login') !== false) {
        
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (isset($input['password'])) {
            if ($input['password'] === $fixedPassword) {
                $_SESSION['authenticated'] = true;
                echo json_encode(['message' => 'Login successful']);
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'Invalid password']);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Password not provided']);
            exit;
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (strpos($requestUri, '/editPlayer') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        
        $id = $input['player_id'];
        $name = $input['player_name'];
        $stake = $input['player_stakes'];

        $sql = "UPDATE players SET player_name = ?, player_stakes = ? WHERE player_id = ?";
        $paramTypes = "sii";
        $updateResult = safeQuery($conn, $sql, $paramTypes, $name, $stake, $id);

        if ($updateResult) {
            echo json_encode(['message' => '更新成功']);
        } else {
            http_response_code(400);
            echo json_encode(['message' => '更新失败']);
        }
    } elseif (strpos($requestUri, '/editRoundStatus') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        echo json_encode($input);
        $roundstatus = $input['round_status'];
        $roundid = $input['round_id'];

        $sql = "UPDATE rounds SET round_status = ? WHERE round_id = ?";
        $paramTypes = "si";
        $updateResult = safeQuery($conn, $sql, $paramTypes, $roundstatus, $roundid);

        if ($updateResult) {
            echo json_encode(['message' => '更新成功']);
        } else {
            http_response_code(400);
            echo json_encode(['message' => '更新失败']);
        }
    } elseif (strpos($requestUri, '/editRound') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        $roundid = $input['round_id'];
    
        $sql = "DELETE FROM rounds WHERE round_id = ?";
        $paramTypes = "i";
        $deleteResult = safeQuery($conn, $sql, $paramTypes, $roundid);
    
        if ($deleteResult) {
            $roundDate = $input['round_time'];
            $gameId = $input['game_id'];
            $roundName = $input['round_name'];
            $players = $input['players'];
            $status = $input['round_status'];

            $sql = "INSERT INTO rounds (round_id, game_id, round_name, round_time, round_status) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('iisss',$roundid, $gameId, $roundName, $roundDate, $status);

            if ($stmt->execute()) {
    
                $sql = "INSERT INTO roundplayers (round_id, player_id, round_stakes) VALUES (?, ?, ?)";
                $stmt = $conn->prepare($sql);
    
                foreach ($players as $player) {
                    $playerId = $player['player_id'];
                    $playerStake = $player['player_stakes'];
                    $stmt->bind_param('iii', $roundid, $playerId, $playerStake);
                    $stmt->execute();
                }
    
                echo json_encode(['message' => '更新一轮成功']);
            } else {
                http_response_code(400);
                echo json_encode(['message' => '更新一轮失败']);
            }

        } else {
            http_response_code(400);
            echo json_encode(['message' => '删除一轮失败']);
        }

        
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "请求的 URL 不存在"));
        exit;
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (strpos($requestUri, '/deletePlayerByPlayerid') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        $playerId = $_GET['playerid'];
        
    
        $sql = "DELETE FROM players WHERE player_id = ?";
        $paramTypes = "i";
        $deleteResult = safeQuery($conn, $sql, $paramTypes, $playerId);
    
        if ($deleteResult) {
        echo json_encode(['message' => '玩家删除成功']);

        } else {
        http_response_code(400);
        echo json_encode(['message' => '删除玩家失败']);
        }
    } elseif (strpos($requestUri, '/deleteGameByGameid') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        $gameid = $_GET['gameid'];
    
        $sql = "DELETE FROM games WHERE game_id = ?";
        $paramTypes = "i";
        $deleteResult = safeQuery($conn, $sql, $paramTypes, $gameid);
    
        if ($deleteResult) {
            echo json_encode(['message' => '对局删除成功']);

        } else {
            http_response_code(400);
            echo json_encode(['message' => '删除对局失败']);
        }
    } elseif (strpos($requestUri, '/deleteRoundByRoundid') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        $roundid = $_GET['roundid'];
    
        $sql = "DELETE FROM rounds WHERE round_id = ?";
        $paramTypes = "i";
        $deleteResult = safeQuery($conn, $sql, $paramTypes, $roundid);
    
        if ($deleteResult) {
            echo json_encode(['message' => '一轮删除成功']);

        } else {
            http_response_code(400);
            echo json_encode(['message' => '删除一轮失败']);
        }
    } elseif (strpos($requestUri, '/deleteStreamByStreamid') !== false) {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        $streamid = $_GET['streamid'];
    
        $sql = "DELETE FROM stream WHERE stream_id = ?";
        $paramTypes = "i";
        $deleteResult = safeQuery($conn, $sql, $paramTypes, $streamid);
    
        if ($deleteResult) {
        echo json_encode(['message' => '直播删除成功']);

        } else {
        http_response_code(400);
        echo json_encode(['message' => '删除直播失败']);
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "请求的 URL 不存在"));
        exit;
    }
    
} else {
    http_response_code(404);
    echo json_encode(array("message" => "请求的 URL 不存在"));
    exit;
}

$conn->close();
?>