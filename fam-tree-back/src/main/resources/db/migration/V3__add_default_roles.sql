-- Insérer le rôle ADMIN s'il n'existe pas
INSERT INTO role (name)
SELECT 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'ADMIN');

-- Insérer le rôle USER s'il n'existe pas
INSERT INTO role (name)
SELECT 'USER'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'USER');
