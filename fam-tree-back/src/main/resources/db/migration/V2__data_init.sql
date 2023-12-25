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
                        password, role, first_login)
VALUES (0, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '102568745841', 'Mougamadou', 'Shaik Dawood',
        '2002-07-02', 'United States', 'rc-upload-1696454596303-25', 'rc-upload-1696454596303-27', '18203791',
        '82183825', '0124874520', '5 Passage Bonjour', 'mougamadoushaik2@gmail.com',
        '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri', 'ADMIN', false)
ON CONFLICT (email)
    DO NOTHING;

INSERT INTO user_role (user_id, role_id)
VALUES (1, 1)
ON CONFLICT (user_id, role_id)
    DO NOTHING;

INSERT INTO family_tree (user_id)
VALUES (1);

INSERT INTO family_member(user_id, birthdate, name, tree_id)
VALUES (1, '2023-10-17', 'Shaik', 1);