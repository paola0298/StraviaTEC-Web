-- Database: StraviaTEC

-- DROP DATABASE "StraviaTEC";

-- Creación de usuario de la BD

CREATE USER "StraviaUser" WITH ENCRYPTED PASSWORD 'StraviaTEC_2020';


-- Creación de la Base de datos

CREATE DATABASE "StraviaTEC" 
    WITH OWNER = "StraviaUser" 
    ENCODING = 'UTF8' 
    LC_COLLATE = 'Spanish_Costa Rica.1252' 
    LC_CTYPE = 'Spanish_Costa Rica.1252' 
    TABLESPACE = pg_default CONNECTION
    LIMIT = -1;

COMMENT ON DATABASE "StraviaTEC" 
    IS 'Database for StraviaTEC application';


-- Se le conceden los privilegios de la tablas al usuario

GRANT ALL PRIVILEGES ON DATABASE "StraviaTEC" TO "StraviaUser";


-- Conectase a la base de datos recien creada

\connect "StraviaTEC"


-- Creación de tablas

CREATE TABLE "USUARIO" (
    "User" VARCHAR (30) PRIMARY KEY,
    "Password" VARCHAR (64) NOT NULL,
    "Nombre" VARCHAR (50) NOT NULL,
    "Apellido1" VARCHAR (50) NOT NULL,
    "Apellido2" VARCHAR (50) NOT NULL,
    "Fecha_nacimiento" DATE NOT NULL,
    "Nacionalidad" VARCHAR (50) NOT NULL,
    "Foto" VARCHAR (150) NOT NULL
);


GRANT ALL ON ALL TABLES IN SCHEMA "public" TO "StraviaUser";