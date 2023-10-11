-- Insérer un admin dans la table ftpro_user
INSERT INTO ftpro_user (id, version, created_at, updated_at, social_security_number, last_name, first_name, birth_date, nationality, id_card_path, photo_path, public_code, private_code, phone, address, email, password, role, first_login)
VALUES (1, 2, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '102568745841', 'Mougamadou', 'Shaik Dawood', '2002-07-02', 'United States', 'rc-upload-1696454596303-25', 'rc-upload-1696454596303-27', '18203791', '82183825', '0124874520', '5 Passage Bonjour', 'mougamadoushaik2@gmail.com', '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri', NULL, false)
ON CONFLICT (email)
    DO NOTHING;

-- Insérer un admin dans la table user_role
INSERT INTO user_role (user_id, role_id)
VALUES (1, 1)
ON CONFLICT (user_id, role_id)
    DO NOTHING;