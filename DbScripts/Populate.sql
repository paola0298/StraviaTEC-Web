-- Insertar valores por defecto

INSERT INTO "TIPO_ACTIVIDAD" ("Nombre") VALUES 
    ('Correr'),
    ('Nadar'),
    ('Ciclismo'),
    ('Senderismo'),
    ('Kayak'),
    ('Caminata');


INSERT INTO "CATEGORIA" ("Nombre", "Edad_min", "Edad_max", "Descripcion") VALUES
    ('Junior', NULL, 15, 'Categoría junior, para niños menores a 15 años.'),
    ('Sub-23', 15, 23, 'Categoría Sub-23, para jóvenes entre 15 y 23 años.'),
    ('Open', 24, 30, 'Categoría Open, para deportistas entre 24 y 30 años.'),
    ('Elite', NULL, NULL, 'Categoría Elite, para deportistas de cualquier edad.'),
    ('Master A', 30, 40, 'Categoría Master A, para deportistas entre 30 y 40 años.'),
    ('Master B', 41, 50, 'Categoría Master B, para deportistas entre 41 y 50 años.'),
    ('Master C', 51, NULL, 'Categoría Master C, para deportistas de 51 años en adelante.');


INSERT INTO "PATROCINADOR" ("Nombre_comercial", "Nombre_representante", "Tel_representante", "Logo") VALUES
    ('Adidas', 'Representante Coca', '12345678', 'https://duckduckgo.com/i/0f63df22.png'),
    ('SONY', 'Representante SONY', '12345678', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogosmarcas.com%2Fwp-content%2Fuploads%2F2018%2F11%2FSony-logo.png&f=1&nofb=1'),
    ('Visa', 'Representante Visa', '12345678', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F04%2FVisa.svg%2F1200px-Visa.svg.png&f=1&nofb=1'),
    ('McDonalds', 'Representante Mac', '12345678', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.bhwt.org.uk%2Fwp-content%2Fuploads%2F2015%2F03%2FMcdonalds_Logo.jpg&f=1&nofb=1');

