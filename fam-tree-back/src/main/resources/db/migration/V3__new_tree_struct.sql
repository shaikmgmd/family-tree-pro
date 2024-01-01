-- Création de la table Personnes
CREATE TABLE personne (
                           id BIGSERIAL PRIMARY KEY,
                           tree_id BIGINT,
                           name VARCHAR(255),
                           gender VARCHAR(50),
                           born DATE,
                           photo VARCHAR(255),
                           email VARCHAR(255),
                           phone VARCHAR(50),
                           city VARCHAR(100),
                           country VARCHAR(100),
                           CONSTRAINT fk_member_tree FOREIGN KEY (tree_id) REFERENCES family_tree (id)
);

-- Création de la table Relations
CREATE TABLE relation (
                           id BIGSERIAL PRIMARY KEY,
                           person_id INT REFERENCES personne(id),
                           partner_id INT REFERENCES personne(id),
                           mother_id INT REFERENCES personne(id),
                           father_id INT REFERENCES personne(id)
);

-- Insertion des données dans la table Personnes
INSERT INTO personne (id, tree_id, name, gender, born, photo, email, phone, city, country) VALUES
                                                                                       (1, 1, 'Shaik MASTER', 'male', '1954-09-29', 'https://media.licdn.com/dms/image/D4E03AQHHTIB4b7KdBg/profile-displayphoto-shrink_800_800/0/1691258212491?e=1707350400&v=beta&t=Xq8wX9sckDe6mBxkl5f1WuKn6TrLd2A3YWjdAMwSkrg', 'mougamadoushaik2@gmail.com', NULL, NULL, NULL),
                                                                                       (2, 1,'Hashif BATCHA', 'male', '1952-10-10', 'https://media.licdn.com/dms/image/C4E03AQHH8oM-mc-xUQ/profile-displayphoto-shrink_800_800/0/1649011599937?e=1707350400&v=beta&t=bW4LIfJE5Pe9Aj7axGZCsylHwNjj-Hf-c4-Y28wBbl0', NULL, NULL, NULL, NULL),
                                                                                       (3,  1,'Laura Shepherd', 'female', '1943-01-13', 'https://cdn.balkan.app/shared/w60/1.jpg', 'laura.shepherd@gmail.com', '+44 845 5752 547', 'Moscow', 'ru'),
                                                                                       (4, 1, 'Rowan Annable', 'male', '1975-11-12', 'https://cdn.balkan.app/shared/m60/3.jpg', NULL, NULL, NULL, NULL),
                                                                                       (5,  1,'Lois Sowle', 'female', '1975-11-12', 'https://cdn.balkan.app/shared/w60/3.jpg', NULL, NULL, NULL, NULL),
                                                                                       (6, 1, 'Tyler Heath', 'female', '1975-11-12', 'https://cdn.balkan.app/shared/w30/1.jpg', NULL, NULL, NULL, NULL),
                                                                                       (7, 1, 'ILIAS ARCHI', 'male', '1986-10-01', 'https://media.licdn.com/dms/image/D4E03AQGsp8qCVHU9QQ/profile-displayphoto-shrink_800_800/0/1666099563197?e=1707350400&v=beta&t=0M7mSXaG4MUzZtpfy2ScJ2kagGBL_ZgmW0RJEjnwGnk', NULL, NULL, NULL, NULL),
                                                                                       (8, 1, 'Celeste Castillo', 'female', '2021-02-01', 'https://cdn.balkan.app/shared/w10/3.jpg', NULL, NULL, NULL, NULL),
                                                                                       (9, 2, 'Hashif BATCHA', 'male', '2002-02-01', 'https://media.licdn.com/dms/image/C4E03AQHH8oM-mc-xUQ/profile-displayphoto-shrink_800_800/0/1649011599937?e=1707350400&v=beta&t=bW4LIfJE5Pe9Aj7axGZCsylHwNjj-Hf-c4-Y28wBbl0', NULL, NULL, NULL, NULL),
                                                                                       (10, 3, 'Roland-Cédric TAYO', 'male', '1990-02-01', 'https://media.licdn.com/dms/image/C4E03AQHH8oM-mc-xUQ/profile-displayphoto-shrink_800_800/0/1649011599937?e=1707350400&v=beta&t=bW4LIfJE5Pe9Aj7axGZCsylHwNjj-Hf-c4-Y28wBbl0', NULL, NULL, NULL, NULL);

-- Insertion des données dans la table Relations
INSERT INTO relation (person_id, partner_id, mother_id, father_id) VALUES
                                                                        (1, 3, NULL, NULL), -- Personne 1 est en relation avec la Personne 3
                                                                       (2, 3, NULL, NULL), -- Personne 2 est en relation avec la Personne 3
                                                                       (3, 1, NULL, NULL), -- Personne 3 est en relation avec la Personne 1
                                                                       (3, 2, NULL, NULL), -- Personne 3 est aussi en relation avec la Personne 2
                                                                       (4, 5, NULL, NULL), -- Personne 4 est en relation avec la Personne 5
                                                                       (5, 4, NULL, NULL), -- Personne 5 est en relation avec la Personne 4
                                                                       (6, 7, 3, 2),      -- Personne 6 est en relation avec la Personne 7 et a pour parents 3 et 2
                                                                       (7, 6, 5, 4),      -- Personne 7 est en relation avec la Personne 6 et a pour parents 5 et 4
                                                                       (8, NULL, 7, 6);   -- Personne 8 a pour parents 7 et 6, pas de partenaire indiqué

SELECT setval('personne_id_seq', COALESCE((SELECT MAX(id)+1 FROM personne), 1), false);