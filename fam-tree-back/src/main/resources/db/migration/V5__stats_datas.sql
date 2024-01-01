
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

-- Indexes for better query performance
CREATE INDEX idx_view_user_id ON view (user_id);
CREATE INDEX idx_view_tree_id ON view (tree_id);
CREATE INDEX idx_view_created_at ON view (created_at);


INSERT INTO view (user_id, tree_id, created_at, updated_at) VALUES
                                                                (1, 1, '2023-01-01 10:00:00', '2023-01-01 10:00:00'),  -- Your view
                                                                (2, 1, '2023-01-02 10:00:00', '2023-01-02 10:00:00'),  -- Other user's view
                                                                (3, 1, '2023-01-03 10:00:00', '2023-01-03 10:00:00'),  -- Another user's view
                                                                (4, 1, '2023-01-04 10:00:00', '2023-01-04 10:00:00');  -- Yet another user's view


SELECT setval('view_id_seq', COALESCE((SELECT MAX(id)+1 FROM view), 1), false);