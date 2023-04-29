CREATE TABLE Stream (
  stream_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  stream_time DATETIME
);

CREATE TABLE Games (
  game_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  game_time DATETIME,
  stream_id INTEGER,
  FOREIGN KEY (stream_id) REFERENCES Stream(stream_id) ON DELETE CASCADE
);

CREATE TABLE Players (
  player_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  player_name TEXT,
  player_stakes INTEGER DEFAULT 0
);

CREATE TABLE Rounds (
  round_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  game_id INTEGER,
  round_name TEXT,
  round_time DATETIME,
  round_status TEXT NULL,
  FOREIGN KEY (game_id) REFERENCES Games(game_id) ON DELETE CASCADE
);

CREATE TABLE RoundPlayers (
  round_id INTEGER,
  player_id INTEGER,
  round_stakes INTEGER,
  PRIMARY KEY (round_id, player_id),
  FOREIGN KEY (round_id) REFERENCES Rounds(round_id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE
);



INSERT INTO players (player_id, player_name, player_stakes) VALUES (NULL, '鬼哥', '1')
UPDATE players SET player_stakes = '1' WHERE players.player_id = 1;