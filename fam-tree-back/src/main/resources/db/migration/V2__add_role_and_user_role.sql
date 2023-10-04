CREATE TABLE if not exists  role (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE if not exists  user_role (
                           user_id INT REFERENCES ftpro_user(id) ON DELETE CASCADE,
                           role_id INT REFERENCES role(id) ON DELETE CASCADE,
                           PRIMARY KEY(user_id, role_id)
);
