
CREATE DATABASE IF NOT EXISTS system;

USE system;


CREATE TABLE IF NOT EXISTS Institute (
    institute_id INT AUTO_INCREMENT PRIMARY KEY,  
    institute_type VARCHAR(50) NOT NULL,          
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


INSERT INTO Institute (institute_type) VALUES 
('School'), 
('College'), 
('University');


CREATE TABLE IF NOT EXISTS Boards (
    board_id INT AUTO_INCREMENT PRIMARY KEY,
    board_name VARCHAR(100) NOT NULL,
    institute_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES Institute(institute_id) 
);


INSERT INTO Boards (board_name, institute_id) VALUES 
('G.S.E.B', 1),
('C.B.S.E', 2),
('GTU', 3);      


CREATE TABLE IF NOT EXISTS Medium (
    medium_id INT AUTO_INCREMENT PRIMARY KEY,
    medium_name VARCHAR(100) NOT NULL,
    board_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES Board(board_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS Section (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    medium_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medium_id) REFERENCES Medium(medium_id)
);


CREATE TABLE IF NOT EXISTS Standard (
    standard_id INT AUTO_INCREMENT PRIMARY KEY,
    standard_name VARCHAR(100) NOT NULL,
    section_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES Section(section_id)
);


CREATE TABLE IF NOT EXISTS Subject (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    standard_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (standard_id) REFERENCES Standard(standard_id)
);


