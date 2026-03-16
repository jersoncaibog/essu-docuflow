-- =============================================================================
-- ESSU DocuFlow — Schema
-- =============================================================================

USE defaultdb;

DROP TABLE IF EXISTS download_history;
DROP TABLE IF EXISTS request_status_history;
DROP TABLE IF EXISTS clearance_forms;
DROP TABLE IF EXISTS request_files;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS students;

-- 1. Users
CREATE TABLE users (
    user_id          INT PRIMARY KEY AUTO_INCREMENT,
    first_name       VARCHAR(50) NOT NULL,
    middle_name      VARCHAR(50),
    last_name        VARCHAR(50) NOT NULL,
    date_of_birth    DATE,
    email            VARCHAR(100) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    role             ENUM('Student', 'Staff', 'Admin') NOT NULL DEFAULT 'Student',
    student_id       VARCHAR(20) UNIQUE,
    program          VARCHAR(100),
    student_type     ENUM('Enrolled', 'Supplemental', 'Former', 'Alumni'),
    last_school_year INT,
    position         VARCHAR(50),
    verified         BOOLEAN DEFAULT FALSE,
    date_registered  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Documents (admin-managed list of requestable documents)
CREATE TABLE documents (
    document_id   INT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    template_path VARCHAR(255),
    template_name VARCHAR(255),
    requirements  TEXT,
    uploaded_by   INT NOT NULL,
    upload_date   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- 3. Requests
CREATE TABLE requests (
    request_id         VARCHAR(20) PRIMARY KEY,
    student_id         INT NOT NULL,
    document_id        INT NOT NULL,
    purpose            VARCHAR(255),
    status             ENUM('Pending', 'Approved', 'Rejected', 'Correction Requested') DEFAULT 'Pending',
    requirements       TEXT,
    admin_message      TEXT,
    approved_file_path VARCHAR(255),
    approved_file_name VARCHAR(255),
    date_requested     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
);

-- 4. Request Status History
CREATE TABLE request_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(20),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by INT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (changed_by) REFERENCES users(user_id)
);
