> Antes de usar este seed, genera hashes bcrypt válidos.

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('123456',10).then(console.log)"
```

INSERT INTO system_parameters (max_practical_hours)
SELECT 20
WHERE NOT EXISTS (SELECT 1 FROM system_parameters);

INSERT INTO users (
  full_name, first_name, last_name, address, email, phone, password_hash, role,
  enrollment_category, license_category_code, is_active
)
VALUES
  (
    'Juan Pérez',
    'Juan',
    'Pérez',
    'Calle 10 # 20 - 30',
    'juan@cea.com',
    '3001234567',
    '$2a$10$iM8alHksQsJbHOuy.dTQw.BF3S5QePgF5k1FkZrl3eFaTsBhtf9SK',
    'Student',
    'A_B',
    'B1',
    true
  ),
  (
    'Admin CEA',
    'Admin',
    'CEA',
    'Oficina principal',
    'admin@cea.com',
    '3000000000',
    '$2a$10$iM8alHksQsJbHOuy.dTQw.BF3S5QePgF5k1FkZrl3eFaTsBhtf9SK',
    'Admin',
    'A',
    'A2',
    true
  )
ON CONFLICT (email) DO NOTHING;

INSERT INTO instructors (full_name, email, phone, license_category_code, profile_photo, is_active)
VALUES
  ('Carlos Gómez', 'carlos.gomez@cea.com', '3001112233', 'B1', NULL, true),
  ('Ana Ruiz', 'ana.ruiz@cea.com', '3004445566', 'C1', NULL, true)
ON CONFLICT DO NOTHING;

INSERT INTO vehicles (name, plate, vehicle_type, category_code, model, color, is_active)
VALUES
  ('Moto 001', 'MOT001', 'Motocicleta', 'A2', '2023', 'Negro', true),
  ('Carro particular 101', 'CAR101', 'Automóvil', 'B1', '2024', 'Blanco', true)
ON CONFLICT DO NOTHING;

INSERT INTO theory_classes (topic, class_date, class_time, category)
VALUES
  ('Señales viales', CURRENT_DATE + INTERVAL '2 day', '08:00', 'B1'),
  ('Normas de tránsito', CURRENT_DATE + INTERVAL '4 day', '10:00', 'A2')
ON CONFLICT DO NOTHING;
