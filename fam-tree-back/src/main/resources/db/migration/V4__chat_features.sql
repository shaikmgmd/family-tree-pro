-- Création de la table Chat
CREATE TABLE chat (
                      id BIGSERIAL PRIMARY KEY,
                      user_id_1 BIGINT NOT NULL,
                      user_id_2 BIGINT NOT NULL,
                      CONSTRAINT fk_user1 FOREIGN KEY (user_id_1) REFERENCES ftpro_user(id),
                      CONSTRAINT fk_user2 FOREIGN KEY (user_id_2) REFERENCES ftpro_user(id)
);

-- Création de la table ChatMessage
CREATE TABLE chat_message (
                              id BIGSERIAL PRIMARY KEY,
                              sender_name VARCHAR(255) NOT NULL,
                              receiver_name VARCHAR(255) NOT NULL,
                              message TEXT NOT NULL,
                              date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              chat_id BIGINT NOT NULL,
                              CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES chat(id)
);

-- Insertion de données fictives dans la table Chat
INSERT INTO chat (user_id_1, user_id_2) VALUES (1, 2);
INSERT INTO chat (user_id_1, user_id_2) VALUES (1, 3);
INSERT INTO chat (user_id_1, user_id_2) VALUES (2, 3);

-- Insertion de messages fictifs dans la table ChatMessage
-- Chat entre l'utilisateur 1 et 2
INSERT INTO chat_message (sender_name, receiver_name, message, chat_id) VALUES ('Mougamadou', 'Batcha', 'Salut, comment ça va ?', 1);
INSERT INTO chat_message (sender_name, receiver_name, message, chat_id) VALUES ('Batcha', 'Mougamadou', 'Bien, et toi ?', 1);

-- Chat entre l'utilisateur 1 et 3
INSERT INTO chat_message (sender_name, receiver_name, message, chat_id) VALUES ('Mougamadou', 'Tayo', 'Hey, prêt pour demain ?', 2);
INSERT INTO chat_message (sender_name, receiver_name, message, chat_id) VALUES ('Tayo', 'Mougamadou', 'Tout à fait!', 2);

-- Chat entre l'utilisateur 2 et 3
INSERT INTO chat_message (sender_name, receiver_name, message, chat_id) VALUES ('Batcha', 'Tayo', 'As-tu le rapport ?', 3);
INSERT INTO chat_message (sender_name, receiver_name, message, chat_id) VALUES ('Tayo', 'Batcha', 'Je te lenvoie dans 5 minutes.', 3);
