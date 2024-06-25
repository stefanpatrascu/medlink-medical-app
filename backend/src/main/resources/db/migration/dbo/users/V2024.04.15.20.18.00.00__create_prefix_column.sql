ALTER TABLE users
    ADD COLUMN prefix VARCHAR(10) DEFAULT NULL;

UPDATE users u
    JOIN roles r ON u.id = r.user_id
SET u.prefix = 'Dr.'
WHERE r.role = 'DOCTOR';
