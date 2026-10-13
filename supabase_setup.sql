-- ============================================================================
-- VITAL CLUB · SCRIPT COMPLETO DE CONFIGURACIÓN PARA SUPABASE
-- Tablas, Índices, Políticas RLS y Datos Semilla del ANEXO 2
-- Ejecuta este script en Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. TABLA: COACHES (ENTRENADORES Y ESQUEMA DE COMISIONES)
CREATE TABLE IF NOT EXISTS public.coaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  commission_rate NUMERIC(4,2) NOT NULL,
  club_rate NUMERIC(4,2) NOT NULL,
  has_base_salary BOOLEAN DEFAULT false,
  scheme_label TEXT,
  specialty TEXT,
  bio TEXT,
  schedule TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA: SERVICES (CATÁLOGO OFICIAL ANEXO 2: RENTA, RETA, CLASE, CLÍNICA)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  service_type TEXT NOT NULL, -- 'Renta', 'Reta', 'Clase', 'Clínica'
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  badge TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLA: RESERVATIONS (CALENDARIO DE CANCHAS Y HORARIOS)
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  court_id TEXT NOT NULL, -- 'cancha-1', 'cancha-2'
  hour INTEGER NOT NULL,  -- 8 a 19
  duration INTEGER DEFAULT 1,
  service TEXT NOT NULL,  -- 'Renta', 'Reta', 'Clase', 'Clínica', 'Mantenimiento'
  customer TEXT NOT NULL,
  phone TEXT DEFAULT '-',
  amount NUMERIC(10,2) DEFAULT 0,
  prestador_amount NUMERIC(10,2) DEFAULT 0,
  cliente_amount NUMERIC(10,2) DEFAULT 0,
  coach_id TEXT,
  coach_name TEXT DEFAULT '-',
  students TEXT[] DEFAULT '{}',
  attendance_checked BOOLEAN DEFAULT false,
  payment_method TEXT DEFAULT 'Tarjeta',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLA: TRANSACTIONS (REGISTRO CONTABLE Y DESGLOSE PRESTADOR / CLIENTE)
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  service TEXT NOT NULL,
  concept TEXT NOT NULL,
  customer TEXT NOT NULL,
  coach_id TEXT DEFAULT 'NONE',
  coach_name TEXT DEFAULT '-',
  payment_method TEXT DEFAULT 'Tarjeta',
  amount NUMERIC(10,2) NOT NULL,
  prestador_amount NUMERIC(10,2) DEFAULT 0,
  cliente_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- HABILITAR SEGURIDAD (ROW LEVEL SECURITY) CON ACCESO PÚBLICO (ANON KEY)
-- ============================================================================
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for coaches" ON public.coaches;
CREATE POLICY "Public access for coaches" ON public.coaches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for services" ON public.services;
CREATE POLICY "Public access for services" ON public.services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for reservations" ON public.reservations;
CREATE POLICY "Public access for reservations" ON public.reservations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for transactions" ON public.transactions;
CREATE POLICY "Public access for transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- DATOS SEMILLA OFICIALES (ANEXO 2)
-- ============================================================================

-- Coaches
INSERT INTO public.coaches (id, name, role, commission_rate, club_rate, has_base_salary, scheme_label, specialty, bio, schedule)
VALUES
  ('COACH-1', 'Lucas Morilla', 'Director Deportivo & Head Coach', 0.40, 0.60, true, '40% Prestador / 60% Club', 'Táctica, Torneos y Clínicas de Alto Rendimiento', 'Prestador principal con amplia trayectoria formando jugadores en pista techada y coordinando clínicas integrales.', 'Lunes a Sábado · 8:00 AM – 8:00 PM'),
  ('COACH-2', 'Leo Marín', 'Coach Infantil, Juvenil & Principiantes', 0.50, 0.50, false, '50% Prestador / 50% Club (Sin sueldo base)', 'Iniciación Infantil, Psicomotricidad y Clínicas Familiares', 'Especialista en desarrollo motriz y enseñanza dinámica para niños y jóvenes que inician en el pádel.', 'Lunes a Sábado · Turnos Matutinos y Vespertinos')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  commission_rate = EXCLUDED.commission_rate,
  club_rate = EXCLUDED.club_rate,
  has_base_salary = EXCLUDED.has_base_salary;

-- Servicios oficiales Anexo 2
INSERT INTO public.services (id, service_type, name, price, badge, description)
VALUES
  ('SERV-RENTA-1', 'Renta', 'Renta Cancha Techada (1 Hora)', 350.00, 'Cualquier horario', 'Uso de cancha techada con cristal panorámico e iluminación LED. No genera comisión al prestador.'),
  ('SERV-RENTA-2', 'Renta', 'Renta Cancha Techada (2 Horas)', 700.00, 'Partido completo', 'Bloque continuo de 2 horas en cualquier horario diurno o nocturno. Tarifa plana oficial.'),
  ('SERV-RETA-1', 'Reta', 'Reta Organizada por Club (2 Horas)', 150.00, 'Por persona', 'Partido de 2 horas nivelado y organizado por Vital Club. Precio individual por participante.'),
  ('SERV-CLASE-MUESTRA', 'Clase', 'Clase Muestra (1 Persona)', 250.00, 'Primera sesión', '1 hora de duración con cancha incluida. $100 Prestador / $150 Club con Lucas; $125 / $125 con Leo.'),
  ('SERV-CLASE-1P', 'Clase', 'Clase Particular (1 Persona)', 500.00, '1 hora · Cancha incluida', 'Atención 100% personalizada. $200 Prestador / $300 Club (Lucas) o $250 / $250 (Leo).'),
  ('SERV-CLASE-2P', 'Clase', 'Clase en Pareja (2 Personas)', 600.00, '$300 por persona', 'Trabajo táctico en pareja. $240 Prestador / $360 Club (Lucas) o $300 / $300 (Leo).'),
  ('SERV-CLASE-3P', 'Clase', 'Clase Grupal (3 Personas)', 750.00, '$250 por persona', 'Dinámica de juego y salidas de pared. $300 Prestador / $450 Club (Lucas) o $375 / $375 (Leo).'),
  ('SERV-CLASE-4P', 'Clase', 'Clase Grupal (4 Personas)', 800.00, '$200 por persona', 'Partido táctico guiado y volea. $320 Prestador / $480 Club (Lucas) o $400 / $400 (Leo).'),
  ('SERV-CLINICA-ADULTO', 'Clínica', 'Clínica Mensual Adultos (8 Sesiones)', 1500.00, '2 veces por semana', 'Mensualidad de 8 horas de entrenamiento. $600 Prestador / $900 Club (Lucas) o $750 / $750 (Leo).'),
  ('SERV-CLINICA-NINO', 'Clínica', 'Clínica Mensual Niños (8 Sesiones)', 1200.00, '2 veces por semana', 'Formación para niños y jóvenes. $480 Prestador / $720 Club (Lucas) o $600 / $600 (Leo).'),
  ('SERV-CLINICA-ADULTO-DESC', 'Clínica', 'Clínica Adultos Familias Vital (-10%)', 1350.00, 'Descuento Familiar', 'Tarifa con 10% de descuento al inscribirse 3+ familiares. $540 Prestador / $810 Club (Lucas).'),
  ('SERV-CLINICA-NINO-DESC', 'Clínica', 'Clínica Niños Familias Vital (-10%)', 1080.00, 'Descuento Familiar', 'Tarifa infantil con 10% descuento Familias Vital. $432 Prestador / $648 Club (Lucas).')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description;

-- Reservaciones Semilla para hoy
INSERT INTO public.reservations (id, date, court_id, hour, duration, service, customer, phone, amount, prestador_amount, cliente_amount, coach_id, coach_name, students, attendance_checked, payment_method, notes)
VALUES
  ('RES-201', CURRENT_DATE, 'cancha-1', 9, 1, 'Renta', 'Familia Hernández', '715 112 3490', 350.00, 0.00, 350.00, 'NONE', 'Sin Coach', '{}', false, 'Tarjeta', 'Renta 1 hora matutina'),
  ('RES-202', CURRENT_DATE, 'cancha-2', 10, 1, 'Clase', 'Clase Muestra · Carlos Piña', '715 131 7443', 250.00, 100.00, 150.00, 'COACH-1', 'Lucas Morilla', '{"Carlos Piña"}', true, 'Tarjeta', 'Clase muestra individual'),
  ('RES-203', CURRENT_DATE, 'cancha-1', 11, 1, 'Clase', 'Clase Particular · Andrea Soto', '715 224 8899', 500.00, 250.00, 250.00, 'COACH-2', 'Leo Marín', '{"Andrea Soto"}', true, 'Efectivo', '1 persona (50% comisión Leo)'),
  ('MANT-201', CURRENT_DATE, 'cancha-2', 13, 1, 'Mantenimiento', 'Limpieza de Cristales y Cepillado', 'Staff', 0.00, 0.00, 0.00, 'NONE', 'Staff', '{}', false, '-', 'Mantenimiento preventivo'),
  ('RES-204', CURRENT_DATE, 'cancha-1', 16, 1, 'Clínica', 'Clínica Niños · Grupo Kids', '715 131 7443', 1200.00, 600.00, 600.00, 'COACH-2', 'Leo Marín', '{"Mateo R.", "Valentina S.", "Leo G.", "Camila H."}', true, 'Tarjeta', 'Mensualidad 8 sesiones (Leo Marín 50%)'),
  ('RES-205', CURRENT_DATE, 'cancha-2', 18, 2, 'Reta', 'Reta Vespertina 4 Jugadores', '715 334 1122', 600.00, 0.00, 600.00, 'NONE', 'Organizada por Club', '{"Rodrigo K.", "Luis M.", "Daniela P.", "Arturo G."}', false, 'Efectivo', 'Reta organizada 2 hrs ($150 x 4 personas)')
ON CONFLICT (id) DO NOTHING;

-- Transacciones Semilla para hoy
INSERT INTO public.transactions (id, date, time, service, concept, customer, coach_id, coach_name, payment_method, amount, prestador_amount, cliente_amount)
VALUES
  ('VC-TX-01', CURRENT_DATE, '08:45 AM', 'Renta', 'Renta Cancha Techada 1 (9:00 AM)', 'Familia Hernández', 'NONE', '-', 'Tarjeta', 350.00, 0.00, 350.00),
  ('VC-TX-02', CURRENT_DATE, '09:50 AM', 'Clase', 'Clase Muestra 1 Persona', 'Carlos Piña', 'COACH-1', 'Lucas Morilla', 'Tarjeta', 250.00, 100.00, 150.00),
  ('VC-TX-03', CURRENT_DATE, '10:55 AM', 'Clase', 'Clase Particular 1 Persona', 'Andrea Soto', 'COACH-2', 'Leo Marín', 'Efectivo', 500.00, 250.00, 250.00),
  ('VC-TX-04', CURRENT_DATE, '03:40 PM', 'Clínica', 'Clínica Mensual Niños (8 sesiones)', 'Mateo R. / Laura Gómez', 'COACH-2', 'Leo Marín', 'Tarjeta', 1200.00, 600.00, 600.00),
  ('VC-TX-05', CURRENT_DATE, '05:30 PM', 'Reta', 'Reta Organizada (4 jugadores x $150)', '4 Participantes', 'NONE', '-', 'Efectivo', 600.00, 0.00, 600.00)
ON CONFLICT (id) DO NOTHING;
