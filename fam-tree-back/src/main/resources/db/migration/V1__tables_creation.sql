-- Création de la table ftpro_user
CREATE TABLE IF NOT EXISTS ftpro_user (
    id BIGSERIAL PRIMARY KEY,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    social_security_number VARCHAR(255),
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    birth_date DATE,
    nationality TEXT,
    id_card_path TEXT,
    photo_path TEXT,
    public_code TEXT,
    private_code TEXT UNIQUE,
    phone TEXT,
    address TEXT DEFAULT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    gender TEXT NOT NULL,
    first_login BOOLEAN DEFAULT TRUE,
    city TEXT NOT NULL,
    country TEXT NOT NULL
);

-- Création de la table adhesion_request
CREATE TABLE IF NOT EXISTS adhesion_request (
    id BIGSERIAL PRIMARY KEY,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    social_security_number VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(255),
    id_card_path VARCHAR(255),
    photo_path VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    gender TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    status VARCHAR(255) DEFAULT 'PENDING'
);

-- Création de la table role
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Création de la table user_role
CREATE TABLE IF NOT EXISTS user_role (
    user_id INT REFERENCES ftpro_user (id) ON DELETE CASCADE,
    role_id INT REFERENCES role (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Création de la table family_tree
CREATE TABLE IF NOT EXISTS family_tree (
   id BIGSERIAL PRIMARY KEY,
   user_id BIGINT NOT NULL,
   CONSTRAINT fk_family_tree_user FOREIGN KEY (user_id) REFERENCES ftpro_user (id)
);

-- Création de la table relationship_confirmation
CREATE TABLE IF NOT EXISTS relationship_confirmation (
    id BIGSERIAL PRIMARY KEY,
    confirmation_code VARCHAR(255) NOT NULL UNIQUE,
    source_member_id BIGINT,
    target_member_id BIGINT,
    expiry_date TIMESTAMP WITHOUT TIME ZONE,
    is_confirmed BOOLEAN DEFAULT FALSE,
    is_processed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_relationship_confirmation_source_member FOREIGN KEY (source_member_id) REFERENCES ftpro_user (id),
    CONSTRAINT fk_relationship_confirmation_target_member FOREIGN KEY (target_member_id) REFERENCES ftpro_user (id)
);

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
      is_registered BOOLEAN DEFAULT FALSE,
      visibility VARCHAR(100) DEFAULT 'PUBLIC',
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

-- Création de la table View
CREATE TABLE view (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tree_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
          REFERENCES ftpro_user(id)
          ON DELETE CASCADE,

    CONSTRAINT fk_tree
      FOREIGN KEY(tree_id)
          REFERENCES family_tree(id)
          ON DELETE CASCADE
);