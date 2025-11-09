
CREATE TYPE ht_data AS (
	revision  BIGINT,
	ht_begin  TIMESTAMPTZ,
	ht_end    TIMESTAMPTZ
);


CREATE TYPE address AS (
	country_id        INTEGER,
	state_id          INTEGER,
	city              TEXT,
	neighborhood      TEXT,
	street            TEXT,
	number            TEXT,
	floor             TEXT,
	unit              TEXT,
	additional        TEXT,
	postal_code       TEXT,
	between_street_1  TEXT,
	between_street_2  TEXT
);
