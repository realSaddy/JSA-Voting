import { Pool, QueryResult } from "pg";

export default function (pool: Pool) {
  // Account Table
  pool.query(
    `CREATE TABLE IF NOT EXISTS ACCOUNT (
	TOKEN CHAR(24) PRIMARY KEY NOT NULL,
	CONVENTION CHAR(50) NOT NULL,
	PIN CHAR(7) NOT NULL,
	PERMISSIONS INT NOT NULL
	)`,
    handleRes
  );

  // Voter Table
  pool.query(
    `CREATE TABLE IF NOT EXISTS VOTER (
	ID SERIAL PRIMARY KEY,
	FIRST_NAME CHAR(50) NOT NULL,
	LAST_NAME CHAR(50) NOT NULL,
	SCHOOL CHAR(65) NOT NULL,
	ROOM INT NOT NULL,
	VOTE INT NOT NULL,
	SPEAKER CHAR(75) NOT NULL
	)`,
    handleRes
  );

  //  Convention Table
  pool.query(
    `CREATE TABLE IF NOT EXISTS CONVENTION (
	NAME CHAR(50) PRIMARY KEY NOT NULL,
	ROOMS_OPEN BOOLEAN NOT NULL
	)`,
    handleRes
  );

  // Room Table
  pool.query(
    `CREATE TABLE IF NOT EXISTS ROOM (
	ID SERIAL PRIMARY KEY NOT NULL,
	NAME CHAR(50) NOT NULL,
	CONVENTION CHAR(50) NOT NULL,
	ACCESS_CODE CHAR(7) NOT NULL UNIQUE,
	OPEN BOOLEAN NOT NULL DEFAULT false,
	VOTING_OPEN BOOLEAN DEFAULT false,
	BYLINE CHAR(120),
	SPEAKERS CHAR(100)[],
	CONCLUDED BOOLEAN DEFAULT FALSE,
	YEA INT DEFAULT 0,
	NAY INT DEFAULT 0,
	ABS INT DEFAULT 0,
	BEST_SPEAKER CHAR(100)
	)`,
    handleRes
  );
}

function handleRes(err: Error, _: QueryResult<any>) {
  if (err) console.error("Error creating table: ", err);
}
