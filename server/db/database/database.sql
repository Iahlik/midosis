-- Tabla de Usuarios
CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL
);

-- Tabla de Medicamentos
CREATE TABLE medicamentos (
    medicamento_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla de Detalles de la Dosis
CREATE TABLE detalles_dosis (
    dosis_id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(usuario_id),
    medicamento_id INT REFERENCES medicamentos(medicamento_id),
    cantidad_mg DECIMAL(5, 2) NOT NULL,
    intervalo_horas INT NOT NULL,
    cada_cuanto_dias INT NOT NULL
);
