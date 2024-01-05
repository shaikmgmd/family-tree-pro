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
VALUES (0, '2023-10-05 09:31:36.251349', '2023-10-05 09:57:58.258603', '121221212', 'Franklin', 'Philippe',
        '1980-07-02', 'United States', 'https://upload.wikimedia.org/wikipedia/commons/3/3f/New_Finnish_ID_card_%28front_side%29.jpg', 'https://media.istockphoto.com/id/1192884194/vector/admin-sign-on-laptop-icon-stock-vector.jpg?s=612x612&w=0&k=20&c=W7ClQXF-0UP_9trbNMvC04qUE4f__SOgg6BUdoX6hdQ=', '18203791',
        '82183825', '0124874520', '5 Passage de la coccinelle', 'familytree.pro2024@gmail.com',
        '$2a$10$u1/a0fnOiH54mhL6HTi9ee/rSIq7/DMQzGO3rMKGDvFX/Nr3RIEri','male', false, 'Paris', 'France')
ON CONFLICT (email)
    DO NOTHING;


INSERT INTO user_role (user_id, role_id)
VALUES (1, 1)
ON CONFLICT (user_id, role_id)
    DO NOTHING;

INSERT INTO family_tree (user_id)
VALUES (1);

INSERT INTO personne (id, tree_id, name, gender, born, photo, email, phone, city, country, is_registered)
VALUES (1, 1, 'Franklin Philippe', 'male', '1980-07-02', 'https://media.istockphoto.com/id/1192884194/vector/admin-sign-on-laptop-icon-stock-vector.jpg?s=612x612&w=0&k=20&c=W7ClQXF-0UP_9trbNMvC04qUE4f__SOgg6BUdoX6hdQ=', 'familytree.pro2024@gmail.com', '0124874520', 'Paris', 'France', true);
SELECT setval('personne_id_seq', COALESCE((SELECT MAX(id)+1 FROM personne), 1), false);