# Tarea-Semana-4-ing-de-software
## Requisitos
- Docker Desktop
- Postman
- MySQL

## Docker
docker compose build
docker compose up

## Preparar MySQL
Crea las tablas en MySQL:
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  carrera VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  creditos INT NOT NULL
);

## Postman
1) POST http://localhost:3001/register
   { "username":"test", "password":"1234" }

2) POST http://localhost:3001/login  -> copia token
   { "username":"test", "password":"1234" }

3) GET http://localhost:3002/products
   Header: Authorization: Bearer TU_TOKEN

4) POST http://localhost:3003/estudiantes
   Header: Authorization: Bearer TU_TOKEN
   { "nombre":"Ana", "carrera":"Sistemas" }

5) POST http://localhost:3004/cursos
   Header: Authorization: Bearer TU_TOKEN
   { "nombre":"Bases de Datos", "creditos": 8 }

6) POST http://localhost:3005/inscripciones
   Header: Authorization: Bearer TU_TOKEN
   { "estudianteId": 1, "cursoId": 1 }

7) GET http://localhost:3005/inscripciones
   Header: Authorization: Bearer TU_TOKEN

8) GET http://localhost:3006/reportes/resumen
   Header: Authorization: Bearer TU_TOKEN
