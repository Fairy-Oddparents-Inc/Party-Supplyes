-- ============================================
-- Base de Datos: Plataforma de Renta de Equipo para Fiestas
-- Basado en casos de uso tipo Airbnb
-- ============================================

CREATE DATABASE IF NOT EXISTS party_rental_platform;
USE party_rental_platform;

-- ============================================
-- TABLA: usuarios
-- Almacena tanto clientes como proveedores
-- ============================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('cliente', 'proveedor', 'ambos') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verificado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_tipo (tipo_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: proveedores
-- Información adicional para usuarios proveedores
-- ============================================
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_negocio VARCHAR(200),
    descripcion TEXT,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    codigo_postal VARCHAR(10),
    ubicacion_lat DECIMAL(10, 8),
    ubicacion_lng DECIMAL(11, 8),
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0.00,
    total_rentas INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_ubicacion (ciudad, estado),
    INDEX idx_calificacion (calificacion_promedio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: tipos_evento
-- Catálogo de tipos de eventos
-- ============================================
CREATE TABLE tipos_evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: categorias_equipo
-- Categorías de equipamiento
-- ============================================
CREATE TABLE categorias_equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: equipos
-- Equipamiento publicado por proveedores
-- ============================================
CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    categoria_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_por_dia DECIMAL(10, 2) NOT NULL,
    precio_por_evento DECIMAL(10, 2),
    incluye_montaje BOOLEAN DEFAULT FALSE,
    incluye_desmontaje BOOLEAN DEFAULT FALSE,
    incluye_operador BOOLEAN DEFAULT FALSE,
    cantidad_disponible INT DEFAULT 1,
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0.00,
    total_rentas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias_equipo(id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_precio (precio_por_dia),
    INDEX idx_calificacion (calificacion_promedio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: fotos_equipo
-- Imágenes del equipamiento
-- ============================================
CREATE TABLE fotos_equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipo_id INT NOT NULL,
    url_foto VARCHAR(500) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    INDEX idx_equipo (equipo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: politicas_equipo
-- Políticas de cancelación, depósito, etc.
-- ============================================
CREATE TABLE politicas_equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipo_id INT NOT NULL,
    tipo_politica ENUM('cancelacion', 'deposito', 'uso', 'daños', 'retraso') NOT NULL,
    descripcion TEXT NOT NULL,
    monto_deposito DECIMAL(10, 2),
    cargo_extra_efectivo DECIMAL(10, 2),
    cargo_extra_tarjeta DECIMAL(10, 2),
    porcentaje_cargo_mal_uso DECIMAL(5, 2),
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    INDEX idx_equipo (equipo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: disponibilidad_equipo
-- Control de fechas bloqueadas
-- ============================================
CREATE TABLE disponibilidad_equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipo_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    cantidad_bloqueada INT DEFAULT 1,
    motivo ENUM('reservado', 'mantenimiento', 'bloqueado_proveedor') NOT NULL,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    INDEX idx_equipo_fecha (equipo_id, fecha_inicio, fecha_fin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reservas
-- Reservaciones de equipos
-- ============================================
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    equipo_id INT NOT NULL,
    tipo_evento_id INT,
    fecha_evento DATETIME NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    ubicacion_evento VARCHAR(255),
    cantidad_solicitada INT DEFAULT 1,
    precio_total DECIMAL(10, 2) NOT NULL,
    anticipo_pagado DECIMAL(10, 2),
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
    cargo_extra_aplicado DECIMAL(10, 2) DEFAULT 0.00,
    estado ENUM('pendiente', 'confirmada', 'rechazada', 'completada', 'cancelada') DEFAULT 'pendiente',
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (equipo_id) REFERENCES equipos(id),
    FOREIGN KEY (tipo_evento_id) REFERENCES tipos_evento(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_equipo (equipo_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_evento (fecha_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: notificaciones
-- Sistema de notificaciones
-- ============================================
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    reserva_id INT,
    tipo ENUM('nueva_reserva', 'reserva_confirmada', 'reserva_rechazada', 'recordatorio', 'calificacion') NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_leida (leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: calificaciones
-- Reseñas y calificaciones post-evento
-- ============================================
CREATE TABLE calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    calificador_id INT NOT NULL,
    calificado_id INT NOT NULL,
    tipo_calificacion ENUM('cliente_a_proveedor', 'proveedor_a_cliente') NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (calificador_id) REFERENCES usuarios(id),
    FOREIGN KEY (calificado_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_calificacion (reserva_id, tipo_calificacion),
    INDEX idx_calificado (calificado_id),
    INDEX idx_puntuacion (puntuacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: historial_reservas
-- Log de cambios de estado de reservas
-- ============================================
CREATE TABLE historial_reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    estado_anterior ENUM('pendiente', 'confirmada', 'rechazada', 'completada', 'cancelada'),
    estado_nuevo ENUM('pendiente', 'confirmada', 'rechazada', 'completada', 'cancelada') NOT NULL,
    motivo TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Tipos de evento
INSERT INTO tipos_evento (nombre, descripcion) VALUES
('Boda', 'Celebración de matrimonio'),
('XV Años', 'Fiesta de quinceañera'),
('Cumpleaños', 'Celebración de cumpleaños'),
('Corporativo', 'Evento empresarial'),
('Graduación', 'Fiesta de graduación'),
('Baby Shower', 'Celebración de bebé'),
('Otro', 'Otro tipo de evento');

-- Categorías de equipo
INSERT INTO categorias_equipo (nombre, descripcion, icono) VALUES
('Audio', 'Equipos de sonido, bocinas, micrófonos', '🔊'),
('Iluminación', 'Luces, spots, efectos luminosos', '💡'),
('Mobiliario', 'Mesas, sillas, manteles', '🪑'),
('Decoración', 'Centros de mesa, globos, arreglos', '🎈'),
('Coctelería', 'Barras, licuadoras, cristalería', '🍹'),
('Entretenimiento', 'Inflables, juegos, karaoke', '🎮'),
('Carpas', 'Carpas, toldos, estructuras', '⛺'),
('Fotografía/Video', 'Cámaras, photobooth, drones', '📷');

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Equipos disponibles con información completa
CREATE VIEW v_equipos_disponibles AS
SELECT 
    e.id,
    e.nombre,
    e.descripcion,
    e.precio_por_dia,
    e.precio_por_evento,
    c.nombre AS categoria,
    p.nombre_negocio AS proveedor,
    p.ciudad,
    p.estado,
    e.calificacion_promedio,
    e.total_rentas,
    e.incluye_montaje,
    e.incluye_desmontaje,
    e.incluye_operador,
    (SELECT url_foto FROM fotos_equipo WHERE equipo_id = e.id AND es_principal = TRUE LIMIT 1) AS foto_principal
FROM equipos e
JOIN categorias_equipo c ON e.categoria_id = c.id
JOIN proveedores p ON e.proveedor_id = p.id
WHERE e.activo = TRUE;

-- Vista: Reservas con detalles completos
CREATE VIEW v_reservas_detalladas AS
SELECT 
    r.id,
    r.fecha_evento,
    r.estado,
    CONCAT(u.nombre, ' ', u.apellido) AS cliente,
    e.nombre AS equipo,
    p.nombre_negocio AS proveedor,
    te.nombre AS tipo_evento,
    r.precio_total,
    r.metodo_pago
FROM reservas r
JOIN usuarios u ON r.cliente_id = u.id
JOIN equipos e ON r.equipo_id = e.id
JOIN proveedores p ON e.proveedor_id = p.id
LEFT JOIN tipos_evento te ON r.tipo_evento_id = te.id;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

DELIMITER $$

-- Procedimiento: Verificar disponibilidad de equipo
CREATE PROCEDURE sp_verificar_disponibilidad(
    IN p_equipo_id INT,
    IN p_fecha_inicio DATETIME,
    IN p_fecha_fin DATETIME,
    IN p_cantidad INT
)
BEGIN
    SELECT 
        e.cantidad_disponible,
        COALESCE(SUM(d.cantidad_bloqueada), 0) AS cantidad_bloqueada,
        (e.cantidad_disponible - COALESCE(SUM(d.cantidad_bloqueada), 0)) AS cantidad_libre
    FROM equipos e
    LEFT JOIN disponibilidad_equipo d ON e.id = d.equipo_id
        AND d.fecha_inicio < p_fecha_fin
        AND d.fecha_fin > p_fecha_inicio
    WHERE e.id = p_equipo_id
    GROUP BY e.id, e.cantidad_disponible;
END$$

-- Procedimiento: Actualizar calificación promedio del equipo
CREATE PROCEDURE sp_actualizar_calificacion_equipo(IN p_equipo_id INT)
BEGIN
    UPDATE equipos 
    SET calificacion_promedio = (
        SELECT AVG(c.puntuacion)
        FROM calificaciones c
        JOIN reservas r ON c.reserva_id = r.id
        WHERE r.equipo_id = p_equipo_id 
        AND c.tipo_calificacion = 'cliente_a_proveedor'
    )
    WHERE id = p_equipo_id;
END$

-- Procedimiento: Actualizar calificación promedio del proveedor
CREATE PROCEDURE sp_actualizar_calificacion_proveedor(IN p_proveedor_id INT)
BEGIN
    UPDATE proveedores 
    SET calificacion_promedio = (
        SELECT AVG(c.puntuacion)
        FROM calificaciones c
        JOIN reservas r ON c.reserva_id = r.id
        JOIN equipos e ON r.equipo_id = e.id
        WHERE e.proveedor_id = p_proveedor_id
        AND c.tipo_calificacion = 'cliente_a_proveedor'
    ),
    total_rentas = (
        SELECT COUNT(*)
        FROM reservas r
        JOIN equipos e ON r.equipo_id = e.id
        WHERE e.proveedor_id = p_proveedor_id
        AND r.estado = 'completada'
    )
    WHERE id = p_proveedor_id;
END$

-- Procedimiento: Actualizar calificación promedio del usuario/cliente
CREATE PROCEDURE sp_actualizar_calificacion_usuario(IN p_usuario_id INT)
BEGIN
    DECLARE calificacion_calculada DECIMAL(3,2);
    
    SELECT AVG(c.puntuacion) INTO calificacion_calculada
    FROM calificaciones c
    WHERE c.calificado_id = p_usuario_id
    AND c.tipo_calificacion = 'proveedor_a_cliente';
    
    -- Opcional: Podrías agregar una columna calificacion_promedio a la tabla usuarios
    -- Si decides hacerlo, descomenta la siguiente línea:
    -- UPDATE usuarios SET calificacion_promedio = calificacion_calculada WHERE id = p_usuario_id;
    
    SELECT calificacion_calculada AS calificacion_usuario;
END$

DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX idx_busqueda_equipo ON equipos(categoria_id, activo, precio_por_dia);
CREATE INDEX idx_reservas_fecha_estado ON reservas(fecha_evento, estado);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================