-- =============================================================================
-- ESSU DocuFlow — Schema
-- =============================================================================

USE defaultdb;

DROP TABLE IF EXISTS download_history;
DROP TABLE IF EXISTS request_status_history;
DROP TABLE IF EXISTS clearance_forms;
DROP TABLE IF EXISTS request_files;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS students;

-- 1. Users (students + staff + admin — all in one)
CREATE TABLE users (
    user_id          INT PRIMARY KEY AUTO_INCREMENT,
    full_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(100) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    role             ENUM('Student', 'Staff', 'Admin') NOT NULL DEFAULT 'Student',
    -- Student-specific
    student_number   VARCHAR(20) UNIQUE,
    program          VARCHAR(100),
    year_graduated   INT,
    clearance_status ENUM('Cleared', 'Pending', 'Incomplete') DEFAULT 'Pending',
    -- Staff-specific
    position         VARCHAR(50),
    -- Shared
    account_status   ENUM('Active', 'Inactive') DEFAULT 'Active',
    verified         BOOLEAN DEFAULT FALSE,
    date_registered  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Core Request System
CREATE TABLE requests (
    request_id        VARCHAR(20) PRIMARY KEY,
    student_id        INT NOT NULL,
    document_type     ENUM('TOR', 'Diploma', 'Certificate', 'OR') NOT NULL,
    purpose           VARCHAR(100),
    status            ENUM('Pending', 'Processing', 'Ready', 'Completed', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    student_source    ENUM('Inside', 'Outside') NOT NULL,
    date_requested    DATETIME DEFAULT CURRENT_TIMESTAMP,
    assigned_staff_id INT,
    clearance_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    FOREIGN KEY (assigned_staff_id) REFERENCES users(user_id)
);

-- 3. Request Files
CREATE TABLE request_files (
    file_id        INT PRIMARY KEY AUTO_INCREMENT,
    request_id     VARCHAR(20) NOT NULL,
    file_type      ENUM('Honorable Dismissal', 'Clearance Form', 'Request for Entry', 'Valid ID') NOT NULL,
    file_path      VARCHAR(255) NOT NULL,
    uploaded_by    INT NOT NULL,
    upload_date    DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified       BOOLEAN DEFAULT FALSE,
    verified_by_id INT,
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);

-- 4. Clearance Forms
CREATE TABLE clearance_forms (
    clearance_id      INT PRIMARY KEY AUTO_INCREMENT,
    request_id        VARCHAR(20) NOT NULL,
    form_file_id      INT NOT NULL,
    is_complete       BOOLEAN DEFAULT FALSE,
    verification_date DATETIME,
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (form_file_id) REFERENCES request_files(file_id)
);

-- 5. History & Logs
CREATE TABLE request_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(20),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);

CREATE TABLE download_history (
    download_id   INT PRIMARY KEY AUTO_INCREMENT,
    request_id    VARCHAR(20),
    student_id    INT,
    downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address    VARCHAR(50),
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);
