-- 1. User Management
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Staff', 'Admin') NOT NULL,
    email VARCHAR(100),
    date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    program VARCHAR(100),
    year_graduated INT,
    clearance_status ENUM('Cleared', 'Pending', 'Incomplete'),
    account_status ENUM('Active', 'Inactive'),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    full_name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 2. Core Request System
CREATE TABLE requests (
    request_id VARCHAR(20) PRIMARY KEY,
    student_id INT NOT NULL,
    document_type ENUM('TOR', 'Diploma', 'Certificate', 'OR') NOT NULL,
    purpose VARCHAR(100),
    status ENUM('Pending', 'Processing', 'Ready', 'Completed', 'Rejected', 'Cancelled'),
    date_requested DATETIME NOT NULL,
    assigned_staff_id INT,
    clearance_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (assigned_staff_id) REFERENCES staff(staff_id)

-- Core requests table updated for conditional logic
ALTER TABLE requests ;
ADD COLUMN student_source ENUM('Inside', 'Outside') NOT NULL;
);
-- Updated request_files table to handle specific physical requirements
CREATE TABLE request_files (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(20) NOT NULL,
    -- Added specific types for your scenarios
    file_type ENUM(
        'Honorable Dismissal',
        'Clearance Form',
        'Request for Entry',
        'Valid ID'
    ) NOT NULL,
    file_path VARCHAR(255) NOT NULL, -- The scanned PDF/Image
    uploaded_by INT NOT NULL, -- student_id
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    verified_by_id INT,
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);

CREATE TABLE clearance_forms (
    clearance_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(20) NOT NULL,
    form_file_id INT NOT NULL, -- Links to the uploaded scan
    is_complete BOOLEAN DEFAULT FALSE, -- Set by staff after checking the file
    verification_date DATETIME,
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (form_file_id) REFERENCES request_files(file_id)
);
-- 4. History & Logs
CREATE TABLE request_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(20),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);

CREATE TABLE download_history (
    download_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(20),
    student_id INT,
    downloaded_at DATETIME,
    ip_address VARCHAR(50),
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);