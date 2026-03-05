-- =============================================================================
-- ESSU DocuFlow — Seed Data
-- Schema: db.sql
-- All password_hash values are SHA-256 of 'Password@123' (demo only)
-- =============================================================================

USE defaultdb;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE download_history;
TRUNCATE TABLE request_status_history;
TRUNCATE TABLE clearance_forms;
TRUNCATE TABLE request_files;
TRUNCATE TABLE requests;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. USERS (students + staff + admin)
-- =============================================================================

INSERT INTO users (user_id, full_name, email, password_hash, role, student_number, program, year_graduated, clearance_status, position, account_status, verified, date_registered) VALUES
-- Staff / Admin
(1,  'Admin User',       'admin@essu.edu.ph',           'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Admin',   NULL,         NULL,   NULL, NULL,         'Office Administrator', 'Active', TRUE, '2023-06-01 08:00:00'),
(2,  'Jane Doe',         'jane.doe@essu.edu.ph',        'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Staff',   NULL,         NULL,   NULL, NULL,         'Registrar Staff',     'Active', TRUE, '2023-06-01 08:00:00'),
(3,  'John Smith',       'john.smith@essu.edu.ph',      'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Staff',   NULL,         NULL,   NULL, NULL,         'Document Processor',  'Active', TRUE, '2023-06-01 08:00:00'),
-- Students
(4,  'Juan Dela Cruz',   'juan.delacruz@essu.edu.ph',   'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2022-00123', 'BSIT', NULL, 'Cleared',    NULL,                  'Active', TRUE, '2022-08-10 09:00:00'),
(5,  'Maria Santos',     'maria.santos@essu.edu.ph',    'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2021-00456', 'BSED', 2024, 'Cleared',    NULL,                  'Active', TRUE, '2021-08-12 09:00:00'),
(6,  'Pedro Reyes',      'pedro.reyes@essu.edu.ph',     'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2020-00789', 'BSCS', 2024, 'Pending',    NULL,                  'Active', TRUE, '2020-08-11 09:00:00'),
(7,  'Ana Gonzales',     'ana.gonzales@essu.edu.ph',    'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2023-00321', 'BSBM', NULL, 'Incomplete', NULL,                  'Active', TRUE, '2023-08-14 09:00:00'),
(8,  'Carlos Mendoza',   'carlos.mendoza@essu.edu.ph',  'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2021-00654', 'BSIT', NULL, 'Cleared',    NULL,                  'Active', TRUE, '2021-08-10 09:00:00'),
(9,  'Luisa Fernandez',  'luisa.fernandez@essu.edu.ph', 'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2020-00111', 'BSED', 2024, 'Cleared',    NULL,                  'Active', TRUE, '2020-08-13 09:00:00'),
(10, 'Roberto Cruz',     'roberto.cruz@essu.edu.ph',    'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2022-00987', 'BSCS', NULL, 'Pending',    NULL,                  'Active', TRUE, '2022-08-09 09:00:00'),
(11, 'Elena Torres',     'elena.torres@essu.edu.ph',    'ef92b778bafe771207463574d9abbde9cfe5e91d84a78b1b13b4c0be4e0a6e3c', 'Student', '2021-00222', 'BSBM', 2024, 'Cleared',    NULL,                  'Active', TRUE, '2021-08-11 09:00:00');


-- =============================================================================
-- 2. REQUESTS
-- student_source: 'Inside' = currently enrolled, 'Outside' = already graduated
-- =============================================================================

INSERT INTO requests (request_id, student_id, document_type, purpose, status, student_source, date_requested, assigned_staff_id, clearance_verified) VALUES
('REQ-2024-001', 4,  'TOR',         'Graduate school application', 'Pending',    'Inside',  '2024-01-15 08:30:00', NULL, FALSE),
('REQ-2024-002', 5,  'Diploma',     'Employment requirement',      'Processing', 'Outside', '2024-01-16 09:00:00', 2,    TRUE),
('REQ-2024-003', 6,  'Certificate', 'Job application',             'Completed',  'Outside', '2024-01-10 07:45:00', 3,    TRUE),
('REQ-2024-004', 7,  'Certificate', 'Scholarship application',     'Rejected',   'Inside',  '2024-01-12 10:00:00', 2,    FALSE),
('REQ-2024-005', 8,  'TOR',         'Board exam application',      'Pending',    'Inside',  '2024-01-17 08:00:00', NULL, FALSE),
('REQ-2024-006', 9,  'Certificate', 'Teaching application',        'Ready',      'Outside', '2024-01-11 09:30:00', 2,    TRUE),
('REQ-2024-007', 10, 'Diploma',     'Graduate school',             'Processing', 'Outside', '2024-01-13 10:15:00', 3,    TRUE),
('REQ-2024-008', 11, 'TOR',         'Employment',                  'Completed',  'Outside', '2024-01-08 08:00:00', 2,    TRUE),
('REQ-2024-009', 4,  'Certificate', 'Work visa application',       'Pending',    'Inside',  '2024-01-18 07:30:00', NULL, FALSE),
('REQ-2024-010', 6,  'TOR',         'Transfer school',             'Cancelled',  'Inside',  '2024-01-09 09:00:00', NULL, FALSE);


-- =============================================================================
-- 3. REQUEST FILES
-- =============================================================================

INSERT INTO request_files (file_id, request_id, file_type, file_path, uploaded_by, upload_date, verified, verified_by_id) VALUES
(1,  'REQ-2024-001', 'Clearance Form',      'uploads/REQ-2024-001/clearance.pdf',     4, '2024-01-15 08:35:00', FALSE, NULL),
(2,  'REQ-2024-001', 'Valid ID',            'uploads/REQ-2024-001/valid_id.jpg',      4, '2024-01-15 08:36:00', FALSE, NULL),
(3,  'REQ-2024-002', 'Honorable Dismissal', 'uploads/REQ-2024-002/hon_dismissal.pdf', 5, '2024-01-16 09:10:00', TRUE,  2),
(4,  'REQ-2024-002', 'Clearance Form',      'uploads/REQ-2024-002/clearance.pdf',     5, '2024-01-16 09:12:00', TRUE,  2),
(5,  'REQ-2024-002', 'Valid ID',            'uploads/REQ-2024-002/valid_id.jpg',      5, '2024-01-16 09:13:00', TRUE,  2),
(6,  'REQ-2024-003', 'Honorable Dismissal', 'uploads/REQ-2024-003/hon_dismissal.pdf', 6, '2024-01-10 07:50:00', TRUE,  3),
(7,  'REQ-2024-003', 'Clearance Form',      'uploads/REQ-2024-003/clearance.pdf',     6, '2024-01-10 07:52:00', TRUE,  3),
(8,  'REQ-2024-003', 'Valid ID',            'uploads/REQ-2024-003/valid_id.jpg',      6, '2024-01-10 07:53:00', TRUE,  3),
(9,  'REQ-2024-004', 'Clearance Form',      'uploads/REQ-2024-004/clearance.pdf',     7, '2024-01-12 10:05:00', FALSE, NULL),
(10, 'REQ-2024-004', 'Valid ID',            'uploads/REQ-2024-004/valid_id.jpg',      7, '2024-01-12 10:06:00', FALSE, NULL),
(11, 'REQ-2024-005', 'Clearance Form',      'uploads/REQ-2024-005/clearance.pdf',     8, '2024-01-17 08:10:00', FALSE, NULL),
(12, 'REQ-2024-005', 'Valid ID',            'uploads/REQ-2024-005/valid_id.jpg',      8, '2024-01-17 08:11:00', FALSE, NULL),
(13, 'REQ-2024-006', 'Honorable Dismissal', 'uploads/REQ-2024-006/hon_dismissal.pdf', 9, '2024-01-11 09:35:00', TRUE,  2),
(14, 'REQ-2024-006', 'Clearance Form',      'uploads/REQ-2024-006/clearance.pdf',     9, '2024-01-11 09:36:00', TRUE,  2),
(15, 'REQ-2024-006', 'Valid ID',            'uploads/REQ-2024-006/valid_id.jpg',      9, '2024-01-11 09:37:00', TRUE,  2),
(16, 'REQ-2024-007', 'Honorable Dismissal', 'uploads/REQ-2024-007/hon_dismissal.pdf', 10, '2024-01-13 10:20:00', TRUE, 3),
(17, 'REQ-2024-007', 'Clearance Form',      'uploads/REQ-2024-007/clearance.pdf',     10, '2024-01-13 10:21:00', TRUE, 3),
(18, 'REQ-2024-007', 'Valid ID',            'uploads/REQ-2024-007/valid_id.jpg',      10, '2024-01-13 10:22:00', TRUE, 3),
(19, 'REQ-2024-008', 'Honorable Dismissal', 'uploads/REQ-2024-008/hon_dismissal.pdf', 11, '2024-01-08 08:05:00', TRUE, 2),
(20, 'REQ-2024-008', 'Clearance Form',      'uploads/REQ-2024-008/clearance.pdf',     11, '2024-01-08 08:06:00', TRUE, 2),
(21, 'REQ-2024-008', 'Valid ID',            'uploads/REQ-2024-008/valid_id.jpg',      11, '2024-01-08 08:07:00', TRUE, 2),
(22, 'REQ-2024-009', 'Request for Entry',   'uploads/REQ-2024-009/request_entry.pdf', 4,  '2024-01-18 07:35:00', FALSE, NULL),
(23, 'REQ-2024-009', 'Valid ID',            'uploads/REQ-2024-009/valid_id.jpg',      4,  '2024-01-18 07:36:00', FALSE, NULL);


-- =============================================================================
-- 4. CLEARANCE FORMS
-- =============================================================================

INSERT INTO clearance_forms (clearance_id, request_id, form_file_id, is_complete, verification_date) VALUES
(1, 'REQ-2024-002', 4,  TRUE,  '2024-01-16 14:00:00'),
(2, 'REQ-2024-003', 7,  TRUE,  '2024-01-10 15:00:00'),
(3, 'REQ-2024-004', 9,  FALSE, NULL),
(4, 'REQ-2024-006', 14, TRUE,  '2024-01-11 16:00:00'),
(5, 'REQ-2024-007', 17, TRUE,  '2024-01-13 15:30:00'),
(6, 'REQ-2024-008', 20, TRUE,  '2024-01-08 14:00:00');


-- =============================================================================
-- 5. REQUEST STATUS HISTORY
-- =============================================================================

INSERT INTO request_status_history (request_id, old_status, new_status, changed_at) VALUES
('REQ-2024-002', 'Pending',    'Processing', '2024-01-16 11:00:00'),
('REQ-2024-003', 'Pending',    'Processing', '2024-01-10 13:00:00'),
('REQ-2024-003', 'Processing', 'Ready',      '2024-01-12 10:00:00'),
('REQ-2024-003', 'Ready',      'Completed',  '2024-01-14 09:00:00'),
('REQ-2024-004', 'Pending',    'Rejected',   '2024-01-13 11:00:00'),
('REQ-2024-006', 'Pending',    'Processing', '2024-01-11 13:00:00'),
('REQ-2024-006', 'Processing', 'Ready',      '2024-01-15 10:00:00'),
('REQ-2024-007', 'Pending',    'Processing', '2024-01-13 14:00:00'),
('REQ-2024-008', 'Pending',    'Processing', '2024-01-08 14:00:00'),
('REQ-2024-008', 'Processing', 'Ready',      '2024-01-10 10:00:00'),
('REQ-2024-008', 'Ready',      'Completed',  '2024-01-12 09:30:00'),
('REQ-2024-010', 'Pending',    'Cancelled',  '2024-01-11 08:00:00');


-- =============================================================================
-- 6. DOWNLOAD HISTORY
-- =============================================================================

INSERT INTO download_history (request_id, student_id, downloaded_at, ip_address) VALUES
('REQ-2024-003', 6,  '2024-01-14 10:00:00', '192.168.1.42'),
('REQ-2024-003', 6,  '2024-01-15 14:30:00', '192.168.1.42'),
('REQ-2024-008', 11, '2024-01-12 11:00:00', '192.168.1.88'),
('REQ-2024-006', 9,  '2024-01-16 09:00:00', '10.0.0.15');
