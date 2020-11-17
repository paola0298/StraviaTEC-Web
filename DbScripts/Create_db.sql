-- Database: StraviaTEC
-- DROP DATABASE "StraviaTEC";
-- Creación de usuario de la BD

CREATE USER "StraviaUser" WITH ENCRYPTED PASSWORD 'StraviaTEC_2020';

-- Creación de la Base de datos
CREATE DATABASE "StraviaTEC" WITH 
    OWNER = "StraviaUser" 
    ENCODING = 'UTF8' 
    LC_COLLATE = 'Spanish_Costa Rica.1252' 
    LC_CTYPE = 'Spanish_Costa Rica.1252' 
    TABLESPACE = pg_default 
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE "StraviaTEC" IS 'Database for StraviaTEC application';

-- Se le conceden los privilegios de la tablas al usuario
GRANT ALL PRIVILEGES ON DATABASE "StraviaTEC" TO "StraviaUser";

-- Conectase a la base de datos recien creada
\connect "StraviaTEC";

-- Creación de tablas
CREATE TABLE "USUARIO" (
    "User" VARCHAR(30) UNIQUE PRIMARY KEY,
    "Password" VARCHAR(64) NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Apellido1" VARCHAR(50) NOT NULL,
    "Apellido2" VARCHAR(50) NOT NULL,
    "Fecha_nacimiento" DATE NOT NULL,
    "Nacionalidad" VARCHAR(50) NOT NULL,
    "Foto" VARCHAR(200),
    "Es_organizador" BOOLEAN NOT NULL
);
CREATE TABLE "USUARIO_AMIGO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_usuario" VARCHAR(30) NOT NULL,
    "Id_amigo" VARCHAR(30) NOT NULL,
    "Fecha_amigos" DATE NOT NULL
);
CREATE TABLE "EVENTO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_tipo_evento" INT NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Es_privado" BOOLEAN NOT NULL,
    "Id_tipo_actividad" INT NOT NULL
);
CREATE TABLE "TIPO_EVENTO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Nombre" VARCHAR(50) NOT NULL
);
CREATE TABLE "TIPO_ACTIVIDAD" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Nombre" VARCHAR(50) NOT NULL
);
CREATE TABLE "ACTIVIDAD" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_usuario" VARCHAR(50) NOT NULL,
    "Id_tipo_actividad" INT NOT NULL,
    "Id_recorrido" INT NOT NULL,
    "Fecha" TIMESTAMP NOT NULL,
    "Duracion" NUMERIC(5, 1) NOT NULL,
    "Kilometros" NUMERIC(5, 1) NOT NULL,
    "Es_evento" BOOLEAN NOT NULL,
    "Id_evento" INT
);
CREATE TABLE "RECORRIDO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Nombre" VARCHAR(50) NOT NULL,
    "Fecha_hora" TIMESTAMP NOT NULL
);
CREATE TABLE "PUNTO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_recorrido" INT NOT NULL,
    "Segmento" INT NOT NULL,
    "Orden" INT NOT NULL,
    "Latitud" NUMERIC(10, 8) NOT NULL,
    "Longitud" NUMERIC(10, 8) NOT NULL,
    "Tiempo" TIMESTAMP NOT NULL,
    "Elevacion" NUMERIC(5, 1) NOT NULL
);
CREATE TABLE "GRUPO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Nombre" VARCHAR(50) NOT NULL,
    "Id_admin" VARCHAR(30) NOT NULL
);
CREATE TABLE "USUARIO_GRUPO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_grupo" INT NOT NULL,
    "Id_usuario" VARCHAR(30) NOT NULL
);
CREATE TABLE "EVENTO_GRUPO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_evento" INT NOT NULL,
    "Id_grupo" INT NOT NULL
);
CREATE TABLE "RETO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_evento" INT NOT NULL,
    "Id_tipo_reto" INT NOT NULL,
    "Inicio" TIMESTAMP NOT NULL,
    "Fin" TIMESTAMP NOT NULL,
    "Objetivo" NUMERIC(5) NOT NULL
);
CREATE TABLE "TIPO_RETO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Nombre" VARCHAR(50) NOT NULL
);
CREATE TABLE "INSCRIPCION_EVENTO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_evento" INT NOT NULL,
    "Id_usuario" VARCHAR(30) NOT NULL,
    "Estado" VARCHAR(30) NOT NULL,
    "Comprobante_pago" VARCHAR(200),
    "IdCategoriaCarrera" INT
);
CREATE TABLE "CARRERA" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_recorrido" INT NOT NULL,
    "Id_evento" INT NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Fecha" TIMESTAMP NOT NULL,
    "Costo" NUMERIC(7, 2) NOT NULL
);
CREATE TABLE "CATEGORIA_CARRERA" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_carrera" INT NOT NULL,
    "Id_categoria" INT NOT NULL
);
CREATE TABLE "CATEGORIA" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Nombre" VARCHAR(50) NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "Edad_min" INT NULL,
    "Edad_max" INT NULL
);
CREATE TABLE "PATROCINADOR" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Nombre_comercial" VARCHAR(50) NOT NULL,
    "Nombre_representante" VARCHAR(50) NOT NULL,
    "Tel_representante" CHAR(8) NOT NULL,
    "Logo" VARCHAR(200) NULL
);
CREATE TABLE "PATROCINADOR_EVENTO" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_evento" INT NOT NULL,
    "Id_patrocinador" INT NOT NULL
);
CREATE TABLE "CUENTA_BANCARIA" (
    "Id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "Id_carrera" INT NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL
);


-- Creación de llaves foráneas
ALTER TABLE "USUARIO_AMIGO"
ADD FOREIGN KEY ("Id_usuario") REFERENCES "USUARIO" ("User") ON DELETE CASCADE;
ALTER TABLE "USUARIO_AMIGO"
ADD FOREIGN KEY ("Id_amigo") REFERENCES "USUARIO" ("User") ON DELETE CASCADE;
ALTER TABLE "EVENTO"
ADD FOREIGN KEY ("Id_tipo_evento") REFERENCES "TIPO_EVENTO" ("Id");
ALTER TABLE "EVENTO"
ADD FOREIGN KEY ("Id_tipo_actividad") REFERENCES "TIPO_ACTIVIDAD" ("Id");
ALTER TABLE "ACTIVIDAD"
ADD FOREIGN KEY ("Id_usuario") REFERENCES "USUARIO" ("User") ON DELETE CASCADE;
ALTER TABLE "ACTIVIDAD"
ADD FOREIGN KEY ("Id_tipo_actividad") REFERENCES "TIPO_ACTIVIDAD" ("Id");
ALTER TABLE "ACTIVIDAD"
ADD FOREIGN KEY ("Id_recorrido") REFERENCES "RECORRIDO" ("Id") ON DELETE SET NULL;
ALTER TABLE "ACTIVIDAD"
ADD FOREIGN KEY ("Id_evento") REFERENCES "EVENTO" ("Id") ON DELETE SET NULL;
ALTER TABLE "PUNTO"
ADD FOREIGN KEY ("Id_recorrido") REFERENCES "RECORRIDO" ("Id") ON DELETE CASCADE;
ALTER TABLE "GRUPO"
ADD FOREIGN KEY ("Id_admin") REFERENCES "USUARIO" ("User");
ALTER TABLE "USUARIO_GRUPO"
ADD FOREIGN KEY ("Id_grupo") REFERENCES "GRUPO" ("Id") ON DELETE CASCADE;
ALTER TABLE "USUARIO_GRUPO"
ADD FOREIGN KEY ("Id_usuario") REFERENCES "USUARIO" ("User") ON DELETE CASCADE;
ALTER TABLE "EVENTO_GRUPO"
ADD FOREIGN KEY ("Id_evento") REFERENCES "EVENTO" ("Id") ON DELETE CASCADE;
ALTER TABLE "EVENTO_GRUPO"
ADD FOREIGN KEY ("Id_grupo") REFERENCES "GRUPO" ("Id") ON DELETE CASCADE;
ALTER TABLE "RETO"
ADD FOREIGN KEY ("Id_evento") REFERENCES "EVENTO" ("Id") ON DELETE CASCADE;
ALTER TABLE "RETO"
ADD FOREIGN KEY ("Id_tipo_reto") REFERENCES "TIPO_RETO" ("Id");
ALTER TABLE "INSCRIPCION_EVENTO"
ADD FOREIGN KEY ("Id_evento") REFERENCES "EVENTO" ("Id") ON DELETE CASCADE;
ALTER TABLE "INSCRIPCION_EVENTO"
ADD FOREIGN KEY ("Id_usuario") REFERENCES "USUARIO" ("User") ON DELETE CASCADE;
ALTER TABLE "INSCRIPCION_EVENTO"
ADD FOREIGN KEY ("IdCategoriaCarrera") REFERENCES "CATEGORIA_CARRERA" ("Id");
ALTER TABLE "CARRERA"
ADD FOREIGN KEY ("Id_recorrido") REFERENCES "RECORRIDO" ("Id") ON DELETE SET NULL;
ALTER TABLE "CARRERA"
ADD FOREIGN KEY ("Id_evento") REFERENCES "EVENTO" ("Id") ON DELETE CASCADE;
ALTER TABLE "CATEGORIA_CARRERA"
ADD FOREIGN KEY ("Id_carrera") REFERENCES "CARRERA" ("Id") ON DELETE CASCADE;
ALTER TABLE "CATEGORIA_CARRERA"
ADD FOREIGN KEY ("Id_categoria") REFERENCES "CATEGORIA" ("Id");
ALTER TABLE "PATROCINADOR_EVENTO"
ADD FOREIGN KEY ("Id_evento") REFERENCES "EVENTO" ("Id") ON DELETE CASCADE;
ALTER TABLE "PATROCINADOR_EVENTO"
ADD FOREIGN KEY ("Id_patrocinador") REFERENCES "PATROCINADOR" ("Id") ON DELETE CASCADE;
ALTER TABLE "CUENTA_BANCARIA"
ADD FOREIGN KEY ("Id_carrera") REFERENCES "CARRERA" ("Id") ON DELETE CASCADE;

-- Dar permisos para hacer operaciones en las tablas al usuario
GRANT ALL ON ALL TABLES IN SCHEMA "public" TO "StraviaUser";