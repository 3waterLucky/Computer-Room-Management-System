CREATE TABLE users(
	userId BIGINT PRIMARY KEY NOT NULL UNIQUE CHECK(userId >= 1000000000 AND userId < 10000000000),
    username VARCHAR(20) NOT NULL,
    dep VARCHAR(30),
    password VARCHAR(20) NOT NULL,
    auth TINYINT NOT NULL DEFAULT 0
);

CREATE TABLE equipments(
	eId INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
    eType VARCHAR(10) NOT NULL,
    eStatus INT CHECK (eStatus >= 0 AND eStatus <= 2) NOT NULL,
    occupiedId BIGINT REFERENCES users(userId)
);

CREATE TABLE opPC(
	userId BIGINT REFERENCES users(userId),
    eId INT REFERENCES equipments(eId),
    startTime VARCHAR(30) NOT NULL,
    endTime VARCHAR(30),
    cost INT
);

-- 关闭安全更新模式
SET sql_safe_updates=0;

-- 定义触发器
-- 删除用户后将设备表中的占用id和设备状态复位
CREATE TRIGGER deleteUser
AFTER DELETE ON users
FOR EACH ROW
	UPDATE equipments SET eStatus=1, occupiedId=NULL WHERE occupiedId=OLD.userId;

-- 定义触发器
-- 当有人登记上机时，将对应机器标志为被占用
CREATE TRIGGER useComputer
AFTER INSERT ON opPC
FOR EACH ROW
	UPDATE equipments SET eStatus=0, occupiedId=NEW.userId WHERE eId=NEW.eId;