CREATE TABLE users
(
    id               BIGSERIAL UNIQUE,
    username         VARCHAR(255) PRIMARY KEY,
    password         VARCHAR(255),
    enabled          BOOLEAN,
    activation_token VARCHAR(255)
);

ALTER TABLE spot
    ADD COLUMN user_id BIGINT REFERENCES users (id);

ALTER TABLE spot
    DROP CONSTRAINT spot_name_key;