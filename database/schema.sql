CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'Student',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instructors (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS system_parameters (
  id SERIAL PRIMARY KEY,
  max_practical_hours INTEGER NOT NULL DEFAULT 20
);

CREATE TABLE IF NOT EXISTS practical_classes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  instructor_id INTEGER NOT NULL REFERENCES instructors(id),
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
  class_date DATE NOT NULL,
  class_time TIME NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Activa',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS theory_classes (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(200) NOT NULL,
  class_date DATE NOT NULL,
  class_time TIME NOT NULL,
  category VARCHAR(50)
);