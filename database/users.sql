DROP TABLE IF EXISTS users;
   CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      profilepic VARCHAR,
      cv VARCHAR(255),
      jobtitle VARCHAR(255),
      city VARCHAR(255),
      country VARCHAR(255),
 );



 