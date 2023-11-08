
CREATE DATABASE midosis;

CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL
);

CREATE TABLE medicamentos (
    medicamento_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE detalles_dosis (
    dosis_id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(usuario_id),
    medicamento_id INT REFERENCES medicamentos(medicamento_id),
    cantidad_mg DECIMAL(5, 2) NOT NULL,
    intervalo_horas INT NOT NULL,
    cada_cuanto_dias INT NOT NULL
);

INSERT INTO usuarios (nombre, correo_electronico, contrasena)
VALUES
  ('Usuario1', 'usuario1@example.com', 'contrasena1'),
  ('Usuario2', 'usuario2@example.com', 'contrasena2'),
  ('Usuario3', 'usuario3@example.com', 'contrasena3');

INSERT INTO medicamentos (nombre, descripcion)
VALUES
  ('Paracetamol', 'Medicamento para aliviar el dolor y reducir la fiebre.'),
  ('Ibuprofeno', 'Antiinflamatorio no esteroideo utilizado para aliviar el dolor y reducir la inflamación.'),
  ('Prednisona', 'Corticoide que se utiliza para reducir la inflamación y suprimir el sistema inmunológico.'),
  ('Azitromicina', 'Antibiótico utilizado para tratar infecciones bacterianas.'),
  ('Omeprazol', 'Inhibidor de la bomba de protones utilizado para reducir la producción de ácido estomacal.'),
  ('Atorvastatina', 'Estatina utilizada para reducir los niveles de colesterol en sangre.'),
  ('Aspirina', 'Analgésico, antiinflamatorio y antiagregante plaquetario.'),
  ('Loratadina', 'Antihistamínico utilizado para aliviar alergias y síntomas de resfriados.');

INSERT INTO detalles_dosis (usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias)
VALUES
  (1, 1, 500, 6, 1),
  (2, 2, 400, 8, 1), 
  (3, 3, 10, 24, 2);
