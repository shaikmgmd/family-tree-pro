-- Insérer l'administrateur dans la table ftpro_user
INSERT INTO ftpro_user (version, created_at, updated_at, social_security_number, last_name, first_name, birth_date,
                        nationality, id_card_path, photo_path, public_code, private_code, phone, address, email,
                        password, role, first_login)
VALUES (0, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '103568745841', 'DJEARAM', 'Logesh',
        '2002-08-02', 'United States', 'rc-upload-1696224596303-25', 'rc-upload-1696224596303-27', '19181716',
        '82838485', '0124874520', '5 Passage Bonjour', 'djearamlog@cy-tech.fr',
        '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri', 'ADMIN', false)
ON CONFLICT (email)
    DO NOTHING;


ALTER TABLE relationship_confirmation
    DROP COLUMN relationship_type;

ALTER TABLE ftpro_user
    ADD COLUMN city VARCHAR(100) DEFAULT NULL;

ALTER TABLE personne
    ADD COLUMN address TEXT DEFAULT NULL;

UPDATE ftpro_user
    SET city = 'Cergy'
    WHERE id = '1';

UPDATE ftpro_user
    SET city = 'Cergy'  --
    WHERE id = '2';

ALTER TABLE personne
    ADD COLUMN is_registered BOOLEAN DEFAULT FALSE