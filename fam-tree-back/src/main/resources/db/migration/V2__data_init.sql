-- V2__Initialize_data.sql

-- Insérer les rôles ADMIN et USER s'ils n'existent pas
INSERT INTO role (name)
SELECT 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'ADMIN');

INSERT INTO role (name)
SELECT 'USER'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'USER');

-- Insérer l'administrateur dans la table ftpro_user
INSERT INTO ftpro_user (version, created_at, updated_at, social_security_number, last_name, first_name, birth_date,
                        nationality, id_card_path, photo_path, public_code, private_code, phone, address, email,
                        password, gender, first_login, city, country)
VALUES (2, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '121221212', 'Mougamadou', 'Shaik Dawood',
        '2002-07-02', 'United States', 'rc-upload-1696454596303-25', 'rc-upload-1696454596303-27', '18203791',
        '82183825', '0124874520', '5 Passage Bonjour', 'mougamadoushaik2@gmail.com',
        '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri','male', false, 'Paris', 'France')
ON CONFLICT (email)
    DO NOTHING;

-- Insérer un utilisateur lambda dans la table ftpro_user
INSERT INTO ftpro_user (version, created_at, updated_at, social_security_number, last_name, first_name, birth_date,
                        nationality, id_card_path, photo_path, public_code, private_code, phone, address, email,
                        password, gender, first_login, city, country)
VALUES (2, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '102568745841', 'Batcha', 'Hashif',
        '2002-07-02', 'India', 'rc-upload-1696454596303-25', 'rc-upload-1696454596303-27', '18203792',
        '82183826', '0124874520', '75 avenue du bontemps', 'hashahsha@gmail.com',
        '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri','male', false, 'Cergy', 'France')
ON CONFLICT (email)
    DO NOTHING;

-- Insérer un utilisateur lambda dans la table ftpro_user
INSERT INTO ftpro_user (version, created_at, updated_at, social_security_number, last_name, first_name, birth_date,
                        nationality, id_card_path, photo_path, public_code, private_code, phone, address, email,
                        password, gender, first_login, city, country)
VALUES (2, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '102568745771', 'Tayo', 'Rolland Cedric',
        '2002-07-02', 'Camwoune', 'rc-upload-1696454596303-25', 'rc-upload-1696454596303-27', '18203793',
        '82183827', '0124874520', 'residence de neuville', 'rctayo@gmail.com',
        '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri','female', false, 'Cergy', 'France')
ON CONFLICT (email)
    DO NOTHING;

-- Insérer un utilisateur lambda dans la table ftpro_user
INSERT INTO ftpro_user (version, created_at, updated_at, social_security_number, last_name, first_name, birth_date,
                        nationality, id_card_path, photo_path, public_code, private_code, phone, address, email,
                        password, gender, first_login, city, country)
VALUES (0, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '103568745841', 'DJEARAM', 'Logesh',
        '2002-08-02', 'United States', 'rc-upload-1696224596303-25', 'rc-upload-1696224596303-27', '19181716',
        '82838485', '0124874520', '5 Passage Bonjour', 'djearamlog@cy-tech.fr',
        '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri', 'male', false, 'Cergy', 'France')
ON CONFLICT (email)
    DO NOTHING;


INSERT INTO user_role (user_id, role_id)
VALUES (1, 1)
ON CONFLICT (user_id, role_id)
    DO NOTHING;

INSERT INTO user_role (user_id, role_id)
VALUES (2, 2)
ON CONFLICT (user_id, role_id)
    DO NOTHING;

INSERT INTO user_role (user_id, role_id)
VALUES (3, 2)
ON CONFLICT (user_id, role_id)
    DO NOTHING;

INSERT INTO family_tree (user_id)
VALUES (1);

INSERT INTO family_tree (user_id)
VALUES (2);

INSERT INTO family_tree (user_id)
VALUES (3);