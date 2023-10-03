CREATE TABLE if not exists ftpro_user (
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

CREATE TABLE if not exists adhesion_request (
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
