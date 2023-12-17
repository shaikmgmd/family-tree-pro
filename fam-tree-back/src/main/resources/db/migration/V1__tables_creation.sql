-- Création de la table ftpro_user
CREATE TABLE IF NOT EXISTS ftpro_user (
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
    public_code VARCHAR(255),
    private_code VARCHAR(255) UNIQUE,
    phone VARCHAR(255),
    address TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    first_login BOOLEAN DEFAULT TRUE
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

-- Création de la table family_member
CREATE TABLE IF NOT EXISTS family_member (
                                             id BIGSERIAL PRIMARY KEY,
                                             tree_id BIGINT,
                                             user_id BIGINT,
                                             name VARCHAR(255),
    birthdate DATE,
    CONSTRAINT fk_family_member_tree FOREIGN KEY (tree_id) REFERENCES family_tree (id),
    CONSTRAINT fk_family_member_user FOREIGN KEY (user_id) REFERENCES ftpro_user (id)
    );

-- Création de la table relationship_confirmation
CREATE TABLE IF NOT EXISTS relationship_confirmation (
                                                         id BIGSERIAL PRIMARY KEY,
                                                         confirmation_code VARCHAR(255) NOT NULL UNIQUE,
    source_member_id BIGINT,
    target_member_id BIGINT,
    relationship_type VARCHAR(50),
    expiry_date TIMESTAMP WITHOUT TIME ZONE,
    is_confirmed BOOLEAN DEFAULT FALSE,
    is_processed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_relationship_confirmation_source_member FOREIGN KEY (source_member_id) REFERENCES family_member (id),
    CONSTRAINT fk_relationship_confirmation_target_member FOREIGN KEY (target_member_id) REFERENCES family_member (id)
    );

-- Création de la table relationship
CREATE TABLE IF NOT EXISTS relationship (
                                            id BIGSERIAL PRIMARY KEY,
                                            source_member_id BIGINT,
                                            target_member_id BIGINT,
                                            relationship_type VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_relationship_source_member FOREIGN KEY (source_member_id) REFERENCES family_member (id),
    CONSTRAINT fk_relationship_target_member FOREIGN KEY (target_member_id) REFERENCES family_member (id)
    );
