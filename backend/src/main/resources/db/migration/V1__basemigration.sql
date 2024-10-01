CREATE TABLE spot
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE wind_window
(
    id          BIGSERIAL PRIMARY KEY,
    speed       INTEGER,
    start_angle INTEGER,
    end_angle   INTEGER,
    spot_id     INTEGER,
    FOREIGN KEY (spot_id) REFERENCES spot (id)
);