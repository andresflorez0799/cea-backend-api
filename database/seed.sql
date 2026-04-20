> Antes de usar este seed, genera hashes bcrypt válidos.

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('123456',10).then(console.log)"
```

INSERT INTO system_parameters (max_practical_hours)
SELECT 20
WHERE NOT EXISTS (SELECT 1 FROM system_parameters);

INSERT INTO users (full_name, email, password_hash, role, is_active)
VALUES
  ('Juan Pérez', 'juan@cea.com', '$2a$10$iM8alHksQsJbHOuy.dTQw.BF3S5QePgF5k1FkZrl3eFaTsBhtf9SK', 'Student', true),
  ('Admin CEA', 'admin@cea.com', '$2a$10$iM8alHksQsJbHOuy.dTQw.BF3S5QePgF5k1FkZrl3eFaTsBhtf9SK', 'Admin', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO instructors (full_name, is_active)
VALUES
  ('Carlos Gómez', true),
  ('Ana Ruiz', true)
ON CONFLICT DO NOTHING;

INSERT INTO vehicles (name, is_active)
VALUES
  ('Moto 001', true),
  ('Carro particular 101', true)
ON CONFLICT DO NOTHING;

INSERT INTO theory_classes (topic, class_date, class_time, category)
VALUES
  ('Señales viales', CURRENT_DATE + INTERVAL '2 day', '08:00', 'B1'),
  ('Normas de tránsito', CURRENT_DATE + INTERVAL '4 day', '10:00', 'A2')
ON CONFLICT DO NOTHING;