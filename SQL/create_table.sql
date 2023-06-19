-- 用户表
-- 用户ID，用户名，部门，密码，权限（1为管理员，0为普通用户）
CREATE TABLE users(
	userId BIGINT PRIMARY KEY NOT NULL UNIQUE CHECK(userId >= 1000000000 AND userId < 10000000000),
    username VARCHAR(20) NOT NULL,
    dep VARCHAR(30),
    password VARCHAR(20) NOT NULL,
    auth TINYINT NOT NULL DEFAULT 0
);

-- 设备表
-- 用户名，设备类型，设备状态，占用者ID
-- eStatus取值：0借出，1空闲， 2报废，3占用
CREATE TABLE equipments(
	eId INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
    eType VARCHAR(10) NOT NULL,
    eStatus INT CHECK (eStatus >= 0 AND eStatus <= 3) NOT NULL,
    occupiedId BIGINT REFERENCES users(userId)
);

-- 上机表
-- 用户ID，设备ID，开始时间，结束时间，消费
CREATE TABLE opPC(
	userId BIGINT REFERENCES users(userId),
    eId INT REFERENCES equipments(eId),
    startTime VARCHAR(30) NOT NULL,
    endTime VARCHAR(30),
    cost INT
);

-- 设备领用表
-- 用户ID，设备ID，借出时间，归还时间
CREATE TABLE borrow(
	userId BIGINT REFERENCES users(userId),
    eId INT REFERENCES equipments(eId),
    borrowTime VARCHAR(30) NOT NULL,
    returnTime VARCHAR(30)
);

-- 关闭安全更新模式，否则无法根据occupiedId更改设备状态
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
	UPDATE equipments SET eStatus=3, occupiedId=NEW.userId WHERE eId=NEW.eId;
    
-- 定义触发器
-- 当有人上机结束时，将对应机器标志为空闲
CREATE TRIGGER releaseCompuer
AFTER UPDATE ON opPC
FOR EACH ROW
	UPDATE equipments SET eStatus=1, occupiedId=NULL WHERE eId=OLD.eId;

-- 定义触发器
-- 当领用设备时，将equipments表的设备状态置0
CREATE TRIGGER borrowEquip
AFTER INSERT ON borrow
FOR EACH ROW
	UPDATE equipments SET eStatus=0, occupiedId=NEW.userId WHERE eId=NEW.eId;
    
-- 定义触发器
-- 当归还设备时，将equipments表的设备状态置1
CREATE TRIGGER returnEquip
AFTER UPDATE ON borrow
FOR EACH ROW
	UPDATE equipments SET eStatus=1, occupiedId=NULL WHERE eId=OLD.eId;