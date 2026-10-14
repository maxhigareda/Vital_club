// ============================================================================
// VITAL CLUB · PÁDEL TECHADO | ZITÁCUARO, MICHOACÁN
// ANEXO 2: TARIFAS Y ESQUEMA DE COMISIONES OFICIAL
// Servicios: Clínica, Clase, Renta y Reta (Únicamente)
// ============================================================================

const STORAGE_KEY = 'vital_club_zitacuaro_anexo2_v2';

// ----------------------------------------------------------------------------
// CONFIGURACIÓN DE SUPABASE (CLOUD DATABASE)
// ----------------------------------------------------------------------------
const SUPABASE_URL = 'https://uuevnudtaegjkmobcjkv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZXZudWR0YWVnamttb2Jjamt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MTkyMTEsImV4cCI6MjEwNzQ5NTIxMX0.ufFn2yW9WMCHkdt7kQ8tfMBDm976SU-CzLIF2e4bTHs';
let supabaseClient = null;

try {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('⚡ Conexión con Supabase inicializada correctamente.');
  }
} catch (e) {
  console.warn('Supabase JS en modo local fallback:', e);
}

async function dbInsertReservation(res) {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('reservations').upsert({
      id: res.id,
      date: res.date,
      court_id: res.courtId,
      hour: res.hour,
      duration: res.duration || 1,
      service: res.service,
      customer: res.customer,
      phone: res.phone || '-',
      amount: res.amount,
      prestador_amount: res.prestadorAmount,
      cliente_amount: res.clienteAmount,
      coach_id: res.coachId,
      coach_name: res.coachName,
      students: res.students || [],
      attendance_checked: !!res.attendanceChecked,
      payment_method: res.paymentMethod || 'Tarjeta',
      notes: res.notes || ''
    });
  } catch (err) {
    console.warn('Supabase dbInsertReservation:', err);
  }
}

async function dbInsertTransaction(tx) {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('transactions').upsert({
      id: tx.id,
      date: tx.date,
      time: tx.time,
      service: tx.service,
      concept: tx.concept,
      customer: tx.customer,
      coach_id: tx.coachId,
      coach_name: tx.coachName,
      payment_method: tx.paymentMethod,
      amount: tx.amount,
      prestador_amount: tx.prestadorAmount,
      cliente_amount: tx.clienteAmount
    });
  } catch (err) {
    console.warn('Supabase dbInsertTransaction:', err);
  }
}

async function dbDeleteReservation(resId) {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('reservations').delete().eq('id', resId);
  } catch (err) {
    console.warn('Supabase dbDeleteReservation:', err);
  }
}

async function dbUpdateAttendance(resId, isChecked) {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('reservations').update({ attendance_checked: isChecked }).eq('id', resId);
  } catch (err) {
    console.warn('Supabase dbUpdateAttendance:', err);
  }
}

async function syncFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data: resData, error: resErr } = await supabaseClient
      .from('reservations')
      .select('*');

    if (!resErr && Array.isArray(resData) && resData.length > 0) {
      state.reservations = resData.map(r => ({
        id: r.id,
        date: r.date,
        courtId: r.court_id,
        hour: r.hour,
        duration: r.duration || 1,
        service: r.service,
        customer: r.customer,
        phone: r.phone || '-',
        amount: Number(r.amount || 0),
        prestadorAmount: Number(r.prestador_amount || 0),
        clienteAmount: Number(r.cliente_amount || 0),
        coachId: r.coach_id || 'NONE',
        coachName: r.coach_name || '-',
        students: r.students || [],
        attendanceChecked: !!r.attendance_checked,
        paymentMethod: r.payment_method || 'Tarjeta',
        notes: r.notes || ''
      }));
    }

    const { data: txData, error: txErr } = await supabaseClient
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!txErr && Array.isArray(txData) && txData.length > 0) {
      state.transactions = txData.map(t => ({
        id: t.id,
        date: t.date,
        time: t.time,
        service: t.service,
        concept: t.concept,
        customer: t.customer,
        coachId: t.coach_id || 'NONE',
        coachName: t.coach_name || '-',
        paymentMethod: t.payment_method || 'Tarjeta',
        amount: Number(t.amount || 0),
        prestadorAmount: Number(t.prestador_amount || 0),
        clienteAmount: Number(t.cliente_amount || 0)
      }));
    }

    saveState();
    renderAllClientViews();
    if (typeof renderCoachView === 'function') renderCoachView();
    if (typeof renderAllAdminViews === 'function') renderAllAdminViews();
  } catch (e) {
    console.info('Supabase syncing:', e);
  }
}

function getTodayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMXN(amount) {
  return '$' + Number(amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' MXN';
}

function formatHourLabel(hour24) {
  const h = Number(hour24);
  if (h === 12) return '12:00 PM';
  if (h === 0 || h === 24) return '12:00 AM';
  return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
}

// ----------------------------------------------------------------------------
// CONFIGURACIÓN DE COACHES Y COMISIONES (ANEXO 2)
// Lucas Morilla (Prestador): 40% comisión / 60% Vital Club
// Leo Marín (Coach 2): 50% comisión / 50% Vital Club (sin sueldo base)
// ----------------------------------------------------------------------------
const COACHES_DATA = [
  {
    id: 'COACH-1',
    name: 'Lucas Morilla',
    role: 'Director Deportivo & Head Coach',
    photo: 'assets/real/coach-lucas-morilla.jpg',
    actionPhoto: 'assets/real/entrenamiento-pareja.jpg',
    commissionRate: 0.40,
    clubRate: 0.60,
    hasBaseSalary: true,
    schemeLabel: '40% Prestador / 60% Club',
    specialty: 'Táctica, Torneos y Clínicas de Alto Rendimiento',
    bio: 'Director deportivo con amplia trayectoria formando jugadores en pista techada y coordinando clínicas integrales.',
    schedule: 'Lunes a Sábado · 8:00 AM – 8:00 PM'
  },
  {
    id: 'COACH-2',
    name: 'Leo Marín',
    role: 'Coach Infantil, Juvenil & Principiantes',
    photo: 'assets/real/coach-leo-marin.jpg',
    actionPhoto: 'assets/real/coach-leo-marin.jpg',
    commissionRate: 0.50,
    clubRate: 0.50,
    hasBaseSalary: false,
    schemeLabel: '50% Prestador / 50% Club (Sin sueldo base)',
    specialty: 'Iniciación Infantil, Psicomotricidad y Clínicas Familiares',
    bio: 'Especialista en desarrollo motriz y enseñanza dinámica para niños y jóvenes que inician en el pádel.',
    schedule: 'Lunes a Sábado · Turnos Matutinos y Vespertinos'
  }
];

function calculateSplit(serviceType, amount, coachId) {
  const total = Number(amount || 0);
  if (serviceType === 'Renta' || serviceType === 'Reta' || coachId === 'NONE' || !coachId) {
    return {
      total,
      prestador: 0,
      cliente: total,
      rateLabel: '100% Club'
    };
  }
  const coach = COACHES_DATA.find(c => c.id === coachId) || COACHES_DATA[0];
  const prestador = Math.round(total * coach.commissionRate);
  const cliente = total - prestador;
  return {
    total,
    prestador,
    cliente,
    rateLabel: coach.schemeLabel
  };
}

// ----------------------------------------------------------------------------
// CATÁLOGO OFICIAL DE SERVICIOS SEGÚN ANEXO 2
// ----------------------------------------------------------------------------
const OFFICIAL_SERVICES = [
  // 1. RENTAS
  {
    id: 'SERV-RENTA-1',
    service: 'Renta',
    name: 'Renta Cancha Techada (1 Hora)',
    price: 350,
    badge: 'Cualquier horario',
    description: 'Uso de cancha techada con cristal panorámico e iluminación LED profesional.'
  },
  {
    id: 'SERV-RENTA-2',
    service: 'Renta',
    name: 'Renta Cancha Techada (2 Horas)',
    price: 700,
    badge: 'Partido completo',
    description: 'Bloque continuo de 2 horas en cualquier horario diurno o nocturno. Tarifa plana oficial.'
  },

  // 2. RETAS
  {
    id: 'SERV-RETA-1',
    service: 'Reta',
    name: 'Reta Organizada por Club (2 Horas)',
    price: 150,
    badge: 'Por persona',
    description: 'Partido de 2 horas nivelado y organizado por Vital Club. Precio individual por participante.'
  },

  // 3. CLASES
  {
    id: 'SERV-CLASE-MUESTRA',
    service: 'Clase',
    name: 'Clase Muestra (1 Persona)',
    price: 250,
    badge: 'Primera sesión',
    description: 'Sesión diagnóstica de 1 hora con cancha techada y pelotas incluidas.'
  },
  {
    id: 'SERV-CLASE-1P',
    service: 'Clase',
    name: 'Clase Particular (1 Persona)',
    price: 500,
    badge: '1 hora · Cancha incluida',
    description: 'Entrenamiento 100% personalizado enfocado en técnica, control y golpes clave.'
  },
  {
    id: 'SERV-CLASE-2P',
    service: 'Clase',
    name: 'Clase en Pareja (2 Personas)',
    price: 600,
    badge: '$300 por persona',
    description: 'Trabajo táctico en pareja, posicionamiento en pista y salidas de pared.'
  },
  {
    id: 'SERV-CLASE-3P',
    service: 'Clase',
    name: 'Clase Grupal (3 Personas)',
    price: 750,
    badge: '$250 por persona',
    description: 'Dinámica de juego guiada, volea y transiciones de defensa a ataque.'
  },
  {
    id: 'SERV-CLASE-4P',
    service: 'Clase',
    name: 'Clase Grupal (4 Personas)',
    price: 800,
    badge: '$200 por persona',
    description: 'Partido táctico supervisado con corrección de jugadas en tiempo real.'
  },

  // 4. CLÍNICAS
  {
    id: 'SERV-CLINICA-ADULTO',
    service: 'Clínica',
    name: 'Clínica Mensual Adultos (8 Sesiones)',
    price: 1500,
    badge: '2 veces por semana',
    description: 'Mensualidad de 8 horas de entrenamiento continuo con técnica, físico y táctica.'
  },
  {
    id: 'SERV-CLINICA-NINO',
    service: 'Clínica',
    name: 'Clínica Mensual Niños (8 Sesiones)',
    price: 1200,
    badge: '2 veces por semana',
    description: 'Formación continua para niños y jóvenes con psicomotricidad, diversión y fundamentos.'
  },
  {
    id: 'SERV-CLINICA-ADULTO-DESC',
    service: 'Clínica',
    name: 'Clínica Adultos Familias Vital (-10%)',
    price: 1350,
    badge: 'Descuento Familiar',
    description: 'Tarifa preferencial con 10% de descuento al inscribirse 3 o más familiares.'
  },
  {
    id: 'SERV-CLINICA-NINO-DESC',
    service: 'Clínica',
    name: 'Clínica Niños Familias Vital (-10%)',
    price: 1080,
    badge: 'Descuento Familiar',
    description: 'Tarifa infantil con 10% de descuento al inscribirse 3 o más familiares.'
  }
];

// ----------------------------------------------------------------------------
// 3D COURT VIEWER & OFFICIAL REAL GALLERY DATA
// ----------------------------------------------------------------------------
const COURT_3D_DATA = {
  angles: {
    iso1: {
      id: 'iso1',
      label: 'Pistas 1 & 2',
      badge: 'Vista Isométrica Pistas 1 y 2',
      modeLabel: 'Render 3D Vital Club · Cubierta Techada Industrial y Pistas 1 & 2',
      image: 'assets/render-cancha-iso1.jpg',
      realPhoto: 'assets/real/cancha-1-frontal.jpg',
      realTitle: 'Cancha 1 Techada · Vista Frontal',
      realDesc: 'Perspectiva real de Cancha 1 mostrando cerramiento perimetral de cristal templado y cubierta industrial contra lluvia.',
      hotspots: [
        { x: 45, y: 15, title: 'Cubierta Techada a Dos Aguas', desc: 'Estructura metálica reticular de alta resistencia que cubre ambas pistas protegiendo del sol y la lluvia en Zitácuaro.' },
        { x: 35, y: 62, title: 'Cristales Templados de 12 mm', desc: 'Módulos de vidrio de seguridad que garantizan un rebote limpio y visión panorámica continua.' },
        { x: 80, y: 55, title: 'Cancha Techada 2', desc: 'Pista contigua con acceso lateral independiente y medidas reglamentarias.' },
        { x: 55, y: 72, title: 'Malla Electrosoldada Antilesión', desc: 'Cerramiento metálico perimetral enrasado con el cristal para evitar rebotes irregulares.' },
        { x: 20, y: 88, title: 'Andador Perimetral y Drenaje', desc: 'Piso perimetral antiderrapante con zona de grava triturada para absorción.' }
      ]
    },
    iso2: {
      id: 'iso2',
      label: 'Hangar & Techo',
      badge: 'Perspectiva Hangar Frontal',
      modeLabel: 'Render 3D Vital Club · Vista Frontal Hangar Techado (Cancha 2 y 1)',
      image: 'assets/render-cancha-iso2.jpg',
      realPhoto: 'assets/real/cancha-techo-perspectiva.jpg',
      realTitle: 'Pista Completa y Techo Industrial',
      realDesc: 'Vista longitudinal de las pistas techadas mostrando la amplitud de juego y altura de techo.',
      hotspots: [
        { x: 50, y: 18, title: 'Altura Libre de Cumbrera (8.5 m)', desc: 'Espacio vertical superior para globos defensivos y juego aéreo sin obstrucciones.' },
        { x: 12, y: 63, title: 'Frontis de Cristal Reglamentario', desc: 'Paredes traseras de 3 metros de altura para salidas de pared y contra-pared.' },
        { x: 88, y: 63, title: 'Iluminación LED Antideslumbrante', desc: 'Proyectores distribuidos estratégicamente para juego nocturno uniforme sin sombras.' },
        { x: 50, y: 78, title: 'Césped Texturado Monofilamento', desc: 'Superficie de pasto sintético con carga de arena de sílice homogénea para agarre óptimo.' }
      ]
    },
    cancha2: {
      id: 'cancha2',
      label: 'Esquina Cancha 2',
      badge: 'Detalle Esquina Cancha 2',
      modeLabel: 'Render 3D Vital Club · Esquina Cancha 2 y Andadores',
      image: 'assets/render-cancha-cancha2.jpg',
      realPhoto: 'assets/real/cancha-2-corner.jpg',
      realTitle: 'Cancha 2 Techada · Ángulo Esquina',
      realDesc: 'Vista angular de Cancha 2 mostrando la estructura perimetral de cristal y andadores.',
      hotspots: [
        { x: 58, y: 42, title: 'Señalización de Pista', desc: 'Identificador oficial de cancha y accesos para jugadores.' },
        { x: 44, y: 64, title: 'Cerramiento Posterior Panorámico', desc: 'Paneles de cristal templado fijados con herrajes de acero de alta resistencia.' },
        { x: 71, y: 28, title: 'Estructura Tubular de Acero', desc: 'Postes y perfiles tubulares con acabado electrostático anticorrosivo.' },
        { x: 50, y: 88, title: 'Protección Inferior Perimetral', desc: 'Borde inferior de seguridad en la base del cristal.' }
      ]
    }
  },
  courts: {
    'cancha-1': {
      id: 'cancha-1',
      name: 'Cancha 1 Techada',
      badge: 'Pista Principal',
      realPhoto: 'assets/real/cancha-1-frontal.jpg',
      realTitle: 'Cancha 1 Techada · Vista Frontal',
      realDesc: 'Pista reglamentaria con cerramiento de cristal templado y cubierta de acero contra lluvia.',
      photos: [
        'assets/real/cancha-1-frontal.jpg',
        'assets/real/cancha-techada-azul.jpg',
        'assets/real/cancha-techo-perspectiva.jpg'
      ]
    },
    'cancha-2': {
      id: 'cancha-2',
      name: 'Cancha 2 Techada',
      badge: 'Cristal Panorámico',
      realPhoto: 'assets/real/cancha-2-corner.jpg',
      realTitle: 'Cancha 2 Techada · Ángulo Esquina',
      realDesc: 'Vista exterior de Cancha 2 con cerramiento perimetral de cristal y andador.',
      photos: [
        'assets/real/cancha-2-corner.jpg',
        'assets/real/cancha-panoramica-red.jpg'
      ]
    }
  }
};

const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    category: 'canchas',
    title: 'Cancha 1 Techada · Acceso y Cristal',
    badge: 'Cancha 1',
    description: 'Pista techada con cristal templado de seguridad de 12 mm, iluminación LED y césped monofilamento pro.',
    image: 'assets/real/cancha-1-frontal.jpg'
  },
  {
    id: 'gal-2',
    category: 'canchas',
    title: 'Cancha 2 Techada · Ángulo Esquina',
    badge: 'Cancha 2',
    description: 'Vista exterior de Cancha 2 mostrando cerramiento perimetral de cristal y cubierta autoportante.',
    image: 'assets/real/cancha-2-corner.jpg'
  },
  {
    id: 'gal-3',
    category: 'canchas',
    title: 'Pista Completa y Techo Industrial',
    badge: 'Instalaciones',
    description: 'Vista longitudinal de la cancha bajo la cubierta que protege de lluvia y radiación solar en Zitácuaro.',
    image: 'assets/real/cancha-techo-perspectiva.jpg'
  },
  {
    id: 'gal-4',
    category: 'canchas',
    title: 'Pista Techada con Luz Natural',
    badge: 'Canchas Techadas',
    description: 'Estructura techada con iluminación natural y reflectores de alta potencia para juego nocturno.',
    image: 'assets/real/cancha-techada-azul.jpg'
  },
  {
    id: 'gal-5',
    category: 'canchas',
    title: 'Perspectiva de Juego a Nivel de Red',
    badge: 'Pista Central',
    description: 'Perspectiva desde el fondo de pista mostrando la red reglamentaria y el césped sintético pro.',
    image: 'assets/real/cancha-panoramica-red.jpg'
  },
  {
    id: 'gal-6',
    category: 'coaches',
    title: 'Lucas Morilla · Director Deportivo',
    badge: 'Head Coach',
    description: 'Lucas Morilla en sesión de entrenamiento en pista, coordinando técnica, volea y táctica de juego.',
    image: 'assets/real/coach-lucas-morilla.jpg'
  },
  {
    id: 'gal-7',
    category: 'coaches',
    title: 'Leo Marín · Coach Infantil & Principiantes',
    badge: 'Coach Oficial',
    description: 'Leo Marín impartiendo clínicas de desarrollo dinámico, psicomotricidad y fundamentos de pádel.',
    image: 'assets/real/coach-leo-marin.jpg'
  },
  {
    id: 'gal-8',
    category: 'coaches',
    title: 'Entrenamiento Particular y Parejas',
    badge: 'Clases',
    description: 'Corrección de jugadas en tiempo real: voleas, bandejas, salidas de pared y posicionamiento.',
    image: 'assets/real/entrenamiento-pareja.jpg'
  },
  {
    id: 'gal-9',
    category: 'comunidad',
    title: 'Comunidad y Partidos Femeniles',
    badge: 'Partidos & Retas',
    description: 'Jugadoras celebrando al finalizar su partido en la red. Ambiente 100% familiar y deportivo.',
    image: 'assets/real/jugadoras-celebracion.jpg'
  },
  {
    id: 'gal-10',
    category: 'social',
    title: 'Recepción y Pro Shop',
    badge: 'Club House',
    description: 'Mostrador de recepción en madera con exhibidor de palas, accesorios deportivos y zona de hidratación.',
    image: 'assets/real/social-recepcion-proshop.jpg'
  },
  {
    id: 'gal-11',
    category: 'social',
    title: 'Comedor y Terraza Social',
    badge: 'Zona de Convivencia',
    description: 'Mesas en madera natural y sillas nórdicas para relajarse antes y después de cada partido.',
    image: 'assets/real/social-comedor-terraza.jpg',
    images: [
      {
        src: 'assets/real/social-comedor-terraza.jpg',
        title: 'Comedor y Terraza Social · Mesas Nórdicas',
        description: 'Mesas en madera natural y sillas nórdicas para relajarse antes y después de cada partido.'
      },
      {
        src: 'assets/real/social-comedor-terraza-2.jpg',
        title: 'Comedor y Terraza Social · Vista Terraza',
        description: 'Espacio de terraza y área de convivencia familiar en Vital Club Zitácuaro.'
      },
      {
        src: 'assets/real/social-comedor-terraza-3.jpg',
        title: 'Comedor y Terraza Social · Zona Convivencia',
        description: 'Ambiente confortable para descansar y compartir bebidas después de jugar.'
      }
    ]
  }
];

function buildInitialState() {
  const today = getTodayISO(0);

  return {
    settings: {
      clubName: 'Vital Club',
      address: 'Andrés Landa y Piña Nte. 26, Col. Cuauhtémoc, Zitácuaro, Mich., México, 61506',
      phone: '715 131 7443',
      instagram: 'https://www.instagram.com/vitalclub.zit/',
      facebook: 'https://web.facebook.com/profile.php?id=61584920653779&sk=about',
      openHour: 8,
      closeHour: 20,
      courts: [
        {
          id: 'cancha-1',
          name: 'Cancha Techada 1 · Vital Central',
          shortName: 'Cancha Techada 1',
          hourlyRate: 350
        },
        {
          id: 'cancha-2',
          name: 'Cancha Techada 2 · Vital Familiar',
          shortName: 'Cancha Techada 2',
          hourlyRate: 350
        }
      ]
    },

    coaches: COACHES_DATA,

    // Horarios ocupados del día
    reservations: [
      {
        id: 'RES-201',
        date: today,
        courtId: 'cancha-1',
        hour: 9,
        duration: 1,
        service: 'Renta',
        customer: 'Familia Hernández',
        phone: '715 112 3490',
        amount: 350,
        prestadorAmount: 0,
        clienteAmount: 350,
        coachId: 'NONE',
        coachName: 'Sin Coach',
        paymentMethod: 'Tarjeta',
        notes: 'Renta 1 hora matutina'
      },
      {
        id: 'RES-202',
        date: today,
        courtId: 'cancha-2',
        hour: 10,
        duration: 1,
        service: 'Clase',
        customer: 'Clase Muestra · Carlos Piña',
        phone: '715 131 7443',
        amount: 250,
        prestadorAmount: 100,
        clienteAmount: 150,
        coachId: 'COACH-1',
        coachName: 'Lucas Morilla',
        students: ['Carlos Piña'],
        attendanceChecked: true,
        paymentMethod: 'Tarjeta',
        notes: 'Clase muestra individual'
      },
      {
        id: 'RES-203',
        date: today,
        courtId: 'cancha-1',
        hour: 11,
        duration: 1,
        service: 'Clase',
        customer: 'Clase Particular · Andrea Soto',
        phone: '715 224 8899',
        amount: 500,
        prestadorAmount: 250,
        clienteAmount: 250,
        coachId: 'COACH-2',
        coachName: 'Leo Marín',
        students: ['Andrea Soto'],
        attendanceChecked: true,
        paymentMethod: 'Efectivo',
        notes: '1 persona (50% comisión Leo)'
      },
      {
        id: 'MANT-201',
        date: today,
        courtId: 'cancha-2',
        hour: 13,
        duration: 1,
        service: 'Mantenimiento',
        customer: 'Limpieza de Cristales y Cepillado',
        phone: 'Staff',
        amount: 0,
        prestadorAmount: 0,
        clienteAmount: 0,
        coachId: 'NONE',
        coachName: 'Staff',
        paymentMethod: '-',
        notes: 'Mantenimiento preventivo'
      },
      {
        id: 'RES-204',
        date: today,
        courtId: 'cancha-1',
        hour: 16,
        duration: 1,
        service: 'Clínica',
        customer: 'Clínica Niños · Grupo Kids',
        phone: '715 131 7443',
        amount: 1200,
        prestadorAmount: 600,
        clienteAmount: 600,
        coachId: 'COACH-2',
        coachName: 'Leo Marín',
        students: ['Mateo R.', 'Valentina S.', 'Leo G.', 'Camila H.'],
        attendanceChecked: true,
        paymentMethod: 'Tarjeta',
        notes: 'Mensualidad 8 sesiones (Leo Marín 50%)'
      },
      {
        id: 'RES-205',
        date: today,
        courtId: 'cancha-2',
        hour: 18,
        duration: 2,
        service: 'Reta',
        customer: 'Reta Vespertina 4 Jugadores',
        phone: '715 334 1122',
        amount: 600,
        prestadorAmount: 0,
        clienteAmount: 600,
        coachId: 'NONE',
        coachName: 'Organizada por Club',
        students: ['Rodrigo K.', 'Luis M.', 'Daniela P.', 'Arturo G.'],
        paymentMethod: 'Efectivo',
        notes: 'Reta organizada 2 hrs ($150 x 4 personas)'
      }
    ],

    // Transacciones con desglose contable estricto
    transactions: [
      {
        id: 'VC-TX-01',
        date: today,
        time: '08:45 AM',
        service: 'Renta',
        concept: 'Renta Cancha Techada 1 (9:00 AM)',
        customer: 'Familia Hernández',
        coachId: 'NONE',
        coachName: '-',
        paymentMethod: 'Tarjeta',
        amount: 350,
        prestadorAmount: 0,
        clienteAmount: 350
      },
      {
        id: 'VC-TX-02',
        date: today,
        time: '09:50 AM',
        service: 'Clase',
        concept: 'Clase Muestra 1 Persona',
        customer: 'Carlos Piña',
        coachId: 'COACH-1',
        coachName: 'Lucas Morilla',
        paymentMethod: 'Tarjeta',
        amount: 250,
        prestadorAmount: 100,
        clienteAmount: 150
      },
      {
        id: 'VC-TX-03',
        date: today,
        time: '10:55 AM',
        service: 'Clase',
        concept: 'Clase Particular 1 Persona',
        customer: 'Andrea Soto',
        coachId: 'COACH-2',
        coachName: 'Leo Marín',
        paymentMethod: 'Efectivo',
        amount: 500,
        prestadorAmount: 250,
        clienteAmount: 250
      },
      {
        id: 'VC-TX-04',
        date: today,
        time: '03:40 PM',
        service: 'Clínica',
        concept: 'Clínica Mensual Niños (8 sesiones)',
        customer: 'Mateo R. / Laura Gómez',
        coachId: 'COACH-2',
        coachName: 'Leo Marín',
        paymentMethod: 'Tarjeta',
        amount: 1200,
        prestadorAmount: 600,
        clienteAmount: 600
      },
      {
        id: 'VC-TX-05',
        date: today,
        time: '05:30 PM',
        service: 'Reta',
        concept: 'Reta Organizada (4 jugadores x $150)',
        customer: '4 Participantes',
        coachId: 'NONE',
        coachName: '-',
        paymentMethod: 'Efectivo',
        amount: 600,
        prestadorAmount: 0,
        clienteAmount: 600
      }
    ]
  };
}

let state = loadState();
let selectedDate = getTodayISO(0);
let currentPosFilter = 'all';
let currentPosCoach = 'COACH-1';
let currentPosMethod = 'Tarjeta';
let posCart = [];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.settings || !Array.isArray(parsed.transactions)) {
      const seed = buildInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch (e) {
    return buildInitialState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'pointer-events-auto px-4 py-3 rounded-2xl shadow-xl bg-vital-900 text-vital-cream border border-white/15 flex items-center gap-2 text-xs font-bold transition-all duration-300';
  el.innerHTML = `<span class="w-2 h-2 rounded-full bg-vital-lime"></span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// ============================================================================
// SISTEMA DE ACCESO POR PIN (STAFF & DIRECCIÓN)
// Lucas: 1111 · Leo: 2222 · Admin Jesús: 0000 o 9999
// ============================================================================

const STAFF_PINS = {
  '1111': { role: 'coach', coachId: 'COACH-1', name: 'Lucas Morilla', title: 'Director Deportivo & Head Coach' },
  '2222': { role: 'coach', coachId: 'COACH-2', name: 'Leo Marín', title: 'Coach Infantil & Juvenil' },
  '0000': { role: 'admin', coachId: 'ADMIN', name: 'Jesús Higareda', title: 'Dirección General' },
  '9999': { role: 'admin', coachId: 'ADMIN', name: 'Jesús Higareda', title: 'Dirección General' }
};

function getActiveStaffSession() {
  try {
    const raw = localStorage.getItem('vital_staff_session');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function openStaffPinModal() {
  openModal(`
    <div class="space-y-5 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-vital-900 text-vital-lime font-brand font-bold text-xl mb-1 shadow-sm">
        <i data-lucide="shield-check" class="w-6 h-6"></i>
      </div>
      <div>
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-vital-orange block">Acceso Colaboradores & Dirección</span>
        <h3 class="font-brand text-2xl text-vital-900 mt-1">Portal Staff Vital Club</h3>
        <p class="text-xs text-stone-500 mt-1">Ingresa tu PIN de 4 dígitos para acceder a tu agenda o panel.</p>
      </div>

      <form id="staff-pin-form" onsubmit="handleStaffPinSubmit(event)" class="space-y-4 max-w-xs mx-auto">
        <div>
          <input type="password" id="staff-pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" required autofocus
            placeholder="••••"
            class="w-full text-center tracking-[1em] text-2xl font-mono py-3 rounded-2xl bg-vital-cream border-2 border-vital-900/15 focus:border-vital-green focus:outline-none font-bold" />
          <p id="staff-pin-error" class="text-xs text-red-600 font-bold mt-1.5 is-hidden">PIN no reconocido. Intenta de nuevo.</p>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <button type="button" onclick="closeModal()" class="py-2.5 rounded-xl border border-vital-900/15 text-xs font-bold text-stone-600 hover:bg-stone-100">
            Cancelar
          </button>
          <button type="submit" class="py-2.5 rounded-xl bg-vital-lime text-vital-950 text-xs font-bold hover:opacity-95 shadow-sm">
            Entrar al Portal
          </button>
        </div>
      </form>

      <div class="p-3 rounded-xl bg-stone-100 text-[11px] text-stone-500 space-y-0.5 text-left border border-stone-200/80">
        <span class="font-bold text-stone-700 block mb-0.5">PINs configurados:</span>
        <p>• <strong>1111:</strong> Lucas Morilla (Head Coach · Portal)</p>
        <p>• <strong>2222:</strong> Leo Marín (Coach · Portal)</p>
        <p>• <strong>0000 / 9999:</strong> Administración General (Dashboard & POS)</p>
      </div>
    </div>
  `);

  setTimeout(() => {
    document.getElementById('staff-pin-input')?.focus();
  }, 100);
}

function handleStaffPinSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('staff-pin-input');
  const errorEl = document.getElementById('staff-pin-error');
  if (!input) return;

  const pin = input.value.trim();
  const user = STAFF_PINS[pin];

  if (!user) {
    if (errorEl) errorEl.classList.remove('is-hidden');
    input.value = '';
    input.focus();
    return;
  }

  // Guardar sesión persistente
  localStorage.setItem('vital_staff_session', JSON.stringify(user));

  closeModal();
  showToast(`¡Bienvenido, ${user.name}!`);

  if (user.role === 'coach') {
    const sel = document.getElementById('coach-view-select');
    if (sel) sel.value = user.coachId;
    switchMainMode('coach');
  } else {
    switchMainMode('admin');
  }
}

function staffLogout() {
  localStorage.removeItem('vital_staff_session');
  switchMainMode('client');
  showToast('Sesión de staff cerrada. Modo público activado.');
}

function updateStaffHeaderUI(mode, session) {
  const publicActions = document.getElementById('public-header-actions');
  const staffActions = document.getElementById('staff-header-actions');
  const userBadge = document.getElementById('staff-user-badge');

  if (mode === 'client') {
    if (publicActions) publicActions.classList.remove('is-hidden');
    if (staffActions) staffActions.classList.add('is-hidden');
  } else {
    if (publicActions) publicActions.classList.add('is-hidden');
    if (staffActions) staffActions.classList.remove('is-hidden');
    if (userBadge) {
      const activeUser = session || getActiveStaffSession();
      userBadge.textContent = activeUser ? `👤 ${activeUser.name}` : (mode === 'coach' ? '👟 Coach' : '🛡️ Admin');
    }
  }
}

// ============================================================================
// MODE SWITCHING (CLIENTE · COACH · ADMIN)
// ============================================================================

function switchMainMode(mode) {
  const clientView = document.getElementById('view-client');
  const coachView = document.getElementById('view-coach');
  const adminView = document.getElementById('view-admin');
  const clientNav = document.getElementById('client-nav');

  const session = getActiveStaffSession();

  clientView?.classList.toggle('is-hidden', mode !== 'client');
  coachView?.classList.toggle('is-hidden', mode !== 'coach');
  adminView?.classList.toggle('is-hidden', mode !== 'admin');

  if (clientView) clientView.style.display = mode === 'client' ? '' : 'none';
  if (coachView) coachView.style.display = mode === 'coach' ? '' : 'none';
  if (adminView) adminView.style.display = mode === 'admin' ? '' : 'none';

  updateStaffHeaderUI(mode, session);

  if (mode === 'client') {
    clientNav?.classList.remove('is-hidden');
    if (clientNav) clientNav.style.display = '';
    renderAllClientViews();
  } else if (mode === 'coach') {
    clientNav?.classList.add('is-hidden');
    if (clientNav) clientNav.style.display = 'none';
    populateCoachSelector();
    if (session && session.coachId) {
      const sel = document.getElementById('coach-view-select');
      if (sel) sel.value = session.coachId;
    }
    renderCoachView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    clientNav?.classList.add('is-hidden');
    if (clientNav) clientNav.style.display = 'none';
    renderAllAdminViews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (window.lucide) lucide.createIcons();
}

function switchAdminTab(tabName) {
  const tabs = ['dashboard', 'pos', 'registro', 'ingresos'];
  const titles = {
    dashboard: 'Dashboard y Números',
    pos: 'Punto de Venta Oficial (POS)',
    registro: 'Calendario Maestro de Canchas',
    ingresos: 'Ingresos y Comisiones'
  };

  tabs.forEach(t => {
    const el = document.getElementById(`admin-tab-${t}`);
    if (!el) return;
    el.classList.toggle('is-hidden', t !== tabName);
    el.style.display = t === tabName ? '' : 'none';
  });

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-admin-tab') === tabName;
    btn.className = isAct
      ? 'admin-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-vital-900 text-vital-cream transition'
      : 'admin-tab-btn px-3.5 py-2 rounded-xl text-xs font-semibold bg-vital-cream text-vital-900 hover:bg-vital-sand transition';
  });

  const titleEl = document.getElementById('admin-header-title');
  if (titleEl && titles[tabName]) titleEl.textContent = titles[tabName];

  renderAllAdminViews();
}

// ============================================================================
// 1. VISTA CLIENTE
// ============================================================================

function renderHeroLiveStatus() {
  const container = document.getElementById('hero-courts-status');
  if (!container) return;
  const today = getTodayISO(0);
  const totalHours = state.settings.closeHour - state.settings.openHour;

  container.innerHTML = state.settings.courts.map(court => {
    const booked = state.reservations.filter(r => r.date === today && r.courtId === court.id).length;
    const free = Math.max(0, totalHours - booked);
    return `
      <a href="#canchas" class="bg-vital-950/85 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-vital-cream hover:border-vital-lime transition">
        <div class="text-xs font-bold truncate">${court.shortName}</div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-[11px] text-vital-lime font-bold">${free} hrs libres</span>
          <span class="text-[11px] text-vital-cream/70">$350/h</span>
        </div>
      </a>
    `;
  }).join('');
}

function renderDateStrip() {
  const strip = document.getElementById('date-strip');
  const coachStrip = document.getElementById('coach-date-strip');
  const dateInput = document.getElementById('booking-date-input');
  const adminDateInput = document.getElementById('admin-booking-date');
  const coachDateInput = document.getElementById('coach-booking-date');

  if (dateInput) dateInput.value = selectedDate;
  if (adminDateInput) adminDateInput.value = selectedDate;
  if (coachDateInput) coachDateInput.value = selectedDate;

  const days = [];
  for (let i = 0; i < 7; i++) {
    const iso = getTodayISO(i);
    const d = new Date(iso + 'T12:00:00');
    const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : d.toLocaleDateString('es-MX', { weekday: 'short' });
    days.push({ iso, dayName, dayNum: d.getDate(), month: d.toLocaleDateString('es-MX', { month: 'short' }) });
  }

  const html = days.map(d => {
    const active = d.iso === selectedDate;
    return `
      <button onclick="selectBookingDate('${d.iso}')" class="px-3.5 py-1.5 rounded-xl border text-left transition shrink-0 ${
        active
          ? 'bg-vital-900 text-vital-cream border-vital-900 shadow-sm'
          : 'bg-white hover:bg-vital-sand/60 text-vital-900 border-vital-900/10'
      }">
        <div class="text-[10px] font-bold uppercase tracking-wider ${active ? 'text-vital-lime' : 'text-vital-900/50'}">${d.dayName}</div>
        <div class="text-xs font-black">${d.dayNum} ${d.month}</div>
      </button>
    `;
  }).join('');

  if (strip) strip.innerHTML = html;
  if (coachStrip) coachStrip.innerHTML = html;
}

function selectBookingDate(iso) {
  selectedDate = iso;
  renderDateStrip();
  renderCourtsGrid();
  if (document.getElementById('view-coach') && !document.getElementById('view-coach').classList.contains('is-hidden')) {
    renderCoachView();
  }
  if (document.getElementById('view-admin') && !document.getElementById('view-admin').classList.contains('is-hidden')) {
    renderAdminMasterCalendar();
  }
}

function handleDateInputChange(iso) {
  if (iso) selectBookingDate(iso);
}

function renderCourtsGrid() {
  const container = document.getElementById('courts-slots-container');
  if (!container) return;

  const openH = state.settings.openHour;
  const closeH = state.settings.closeHour;

  container.innerHTML = state.settings.courts.map(court => {
    const hoursHtml = [];
    for (let h = openH; h < closeH; h++) {
      const existing = state.reservations.find(r => r.date === selectedDate && r.courtId === court.id && r.hour === h);

      if (!existing) {
        hoursHtml.push(`
          <button onclick="openBookingModal('${court.id}', ${h}, 'Renta')"
            class="hour-pill p-3 rounded-2xl border border-emerald-300/80 bg-emerald-50/70 hover:bg-vital-lime hover:border-vital-lime hover:text-vital-950 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-xs">
            <span>${formatHourLabel(h)}</span>
            <span class="text-[10px] text-emerald-700 uppercase font-extrabold tracking-wider">Libre · $350</span>
          </button>
        `);
      } else if (existing.service === 'Mantenimiento') {
        hoursHtml.push(`
          <div class="p-3 rounded-2xl border border-stone-200 bg-stone-100 text-stone-400 font-bold text-xs flex items-center justify-between">
            <span class="line-through">${formatHourLabel(h)}</span>
            <span class="text-[10px] uppercase font-semibold">Mantenimiento</span>
          </div>
        `);
      } else if (existing.service === 'Reta') {
        hoursHtml.push(`
          <div class="p-3 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-between">
            <span>${formatHourLabel(h)}</span>
            <span class="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Reta ($150/p)</span>
          </div>
        `);
      } else if (existing.service === 'Clase' || existing.service === 'Clínica') {
        hoursHtml.push(`
          <div class="p-3 rounded-2xl border border-sky-300 bg-sky-50 text-sky-950 font-bold text-xs flex items-center justify-between">
            <span>${formatHourLabel(h)}</span>
            <span class="text-[10px] text-sky-700 font-bold uppercase tracking-wider">${existing.service}: ${existing.coachName}</span>
          </div>
        `);
      } else {
        hoursHtml.push(`
          <div class="p-3 rounded-2xl border border-stone-200 bg-stone-100/80 text-stone-400 font-medium text-xs flex items-center justify-between">
            <span class="line-through">${formatHourLabel(h)}</span>
            <span class="text-[10px] uppercase font-semibold">Apartada</span>
          </div>
        `);
      }
    }

    return `
      <div class="card-luxury rounded-3xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-vital-900/10 pb-4">
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-vital-orange">Techada · Cristal Panorámico</span>
            <h3 class="font-brand text-2xl text-vital-900">${court.name}</h3>
          </div>
          <div class="text-right">
            <span class="font-brand text-xl font-bold text-vital-900">$350</span>
            <span class="text-[11px] text-stone-500 block">por hora fija</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          ${hoursHtml.join('')}
        </div>
      </div>
    `;
  }).join('');
}

// ----------------------------------------------------------------------------
// SECCIÓN 2: CLASES CLIENTE
// ----------------------------------------------------------------------------
function renderClientClasses() {
  const container = document.getElementById('client-classes-grid');
  if (!container) return;

  const classes = OFFICIAL_SERVICES.filter(s => s.service === 'Clase');

  container.innerHTML = classes.map(c => `
    <div class="card-luxury rounded-3xl p-6 flex flex-col justify-between space-y-5 border border-vital-900/10 hover:border-vital-lime transition">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-900">${c.badge}</span>
          <span class="font-brand text-2xl font-bold text-vital-900">$${c.price} <span class="text-xs font-normal text-stone-500">MXN</span></span>
        </div>
        <h4 class="font-brand text-xl text-vital-900 font-bold">${c.name}</h4>
        <p class="text-xs text-stone-600 leading-relaxed">${c.description}</p>
      </div>

      <div class="pt-3 border-t border-vital-900/10 flex items-center justify-between">
        <div class="text-[11px] text-stone-500">
          <span>Lucas Morilla o Leo Marín</span>
        </div>
        <button onclick="openClassBookingModal('${c.id}')" class="px-4 py-2 rounded-xl bg-vital-900 hover:bg-vital-800 text-vital-cream font-bold text-xs transition">
          Agendar Clase
        </button>
      </div>
    </div>
  `).join('');
}

// ----------------------------------------------------------------------------
// SECCIÓN 3: CLÍNICAS MENSUALES CLIENTE
// ----------------------------------------------------------------------------
function renderClientClinics() {
  const container = document.getElementById('client-clinics-grid');
  if (!container) return;

  const clinics = OFFICIAL_SERVICES.filter(s => s.service === 'Clínica');

  container.innerHTML = clinics.map(c => `
    <div class="card-luxury rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 border border-vital-900/10 hover:border-vital-orange transition">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            c.badge.includes('Descuento') ? 'bg-vital-lime text-vital-950 font-extrabold' : 'bg-emerald-100 text-emerald-900'
          }">${c.badge}</span>
          <span class="font-brand text-2xl sm:text-3xl font-bold text-vital-900">$${c.price} <span class="text-xs font-normal text-stone-500">MXN/mes</span></span>
        </div>
        <h4 class="font-brand text-xl sm:text-2xl text-vital-900 font-bold">${c.name}</h4>
        <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${c.description}</p>
      </div>

      <div class="pt-4 border-t border-vital-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="text-xs text-vital-orange font-bold">
          8 sesiones al mes · 2 por semana
        </div>
        <button onclick="openClinicBookingModal('${c.id}')" class="px-5 py-2.5 rounded-xl bg-vital-orange hover:bg-orange-600 text-white font-bold text-xs transition shadow-sm">
          Inscribirme a Clínica
        </button>
      </div>
    </div>
  `).join('');
}

// ----------------------------------------------------------------------------
// SECCIÓN 4: COACHES CLIENTE
// ----------------------------------------------------------------------------
function renderClientCoaches() {
  const container = document.getElementById('client-coaches-grid');
  if (!container) return;

  container.innerHTML = COACHES_DATA.map(coach => `
    <div class="bg-vital-950/80 rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between space-y-5 group">
      <div class="space-y-4">
        
        <div class="flex items-center gap-4">
          <!-- Real Coach Photo -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-vital-lime/50 shrink-0 shadow-lg group-hover:border-vital-lime transition duration-300">
            <img src="${coach.photo}" alt="${coach.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div class="space-y-0.5">
            <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-vital-lime/15 text-vital-lime border border-vital-lime/30">
              Coach Oficial
            </span>
            <h4 class="font-brand text-2xl text-vital-cream font-bold leading-tight">${coach.name}</h4>
            <p class="text-xs font-semibold text-vital-orange">${coach.role}</p>
          </div>
        </div>

        <p class="text-xs text-vital-cream/80 leading-relaxed">${coach.bio}</p>
      </div>

      <div class="pt-4 border-t border-white/10 space-y-1.5 text-xs">
        <div class="text-vital-cream/60">Especialidad: <span class="text-vital-cream font-medium">${coach.specialty}</span></div>
        <div class="text-vital-cream/60">Disponibilidad: <span class="text-vital-lime font-medium">${coach.schedule}</span></div>
        <div class="pt-2 flex items-center gap-2">
          <a href="#clases" class="px-3.5 py-1.5 rounded-xl bg-vital-lime text-vital-950 font-bold text-xs hover:opacity-95 transition shadow-sm">
            Agendar con ${coach.name.split(' ')[0]}
          </a>
          <button onclick="openCustomLightbox('${coach.photo}', 'Coach Oficial', '${coach.name}', '${coach.bio}')" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition">
            Ver Foto ↗
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ----------------------------------------------------------------------------
// VISOR INTERACTIVO 3D DE CANCHAS Y FOTOS REALES
// ----------------------------------------------------------------------------
let current3DAngle = 'iso1';
let current3DCourt = 'cancha-1';
let isCompareRealMode = false;
let currentLightboxIndex = 0;
let currentLightboxSubIndex = 0;
let currentGalleryCategory = 'todos';

function render3DCourtViewer() {
  const angle = COURT_3D_DATA.angles[current3DAngle] || COURT_3D_DATA.angles.iso1;
  const court = COURT_3D_DATA.courts[current3DCourt] || COURT_3D_DATA.courts['cancha-1'];

  // Update Angle Switcher Buttons
  ['iso1', 'iso2', 'cancha2'].forEach(ang => {
    const btn = document.getElementById(`btn-ang-${ang}`);
    if (btn) {
      if (ang === current3DAngle && !isCompareRealMode) {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition bg-vital-lime text-vital-950 shadow-sm';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition bg-white/10 text-vital-cream hover:bg-white/20';
      }
    }
  });

  const compareBtn = document.getElementById('btn-compare-mode');
  if (compareBtn) {
    if (isCompareRealMode) {
      compareBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition bg-vital-lime text-vital-950 shadow-sm';
      compareBtn.innerHTML = '🔄 Volver a Render 3D';
    } else {
      compareBtn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition bg-vital-orange text-white hover:opacity-90 shadow-sm';
      compareBtn.innerHTML = '⚖️ Comparar Real';
    }
  }

  // Update Court toggle buttons
  const btnC1 = document.getElementById('btn-court-1');
  const btnC2 = document.getElementById('btn-court-2');
  if (btnC1) {
    btnC1.className = current3DCourt === 'cancha-1'
      ? 'px-4 py-2 rounded-xl text-xs font-bold transition bg-vital-lime text-vital-950 shadow-sm'
      : 'px-4 py-2 rounded-xl text-xs font-bold transition text-vital-cream/80 hover:text-white';
  }
  if (btnC2) {
    btnC2.className = current3DCourt === 'cancha-2'
      ? 'px-4 py-2 rounded-xl text-xs font-bold transition bg-vital-lime text-vital-950 shadow-sm'
      : 'px-4 py-2 rounded-xl text-xs font-bold transition text-vital-cream/80 hover:text-white';
  }

  // Update Badge & Labels
  const badgeEl = document.getElementById('active-angle-badge');
  if (badgeEl) badgeEl.textContent = isCompareRealMode ? 'Foto Real en Directo' : angle.badge;

  const modeLabel = document.getElementById('render-mode-label');
  if (modeLabel) modeLabel.textContent = isCompareRealMode ? 'Instalaciones Reales · Zitácuaro' : angle.modeLabel;

  // Update Viewport Image
  const imgEl = document.getElementById('render-display-img');
  if (imgEl) {
    imgEl.classList.remove('fade-in-quick');
    void imgEl.offsetWidth; // trigger reflow
    imgEl.src = isCompareRealMode ? angle.realPhoto : angle.image;
    imgEl.classList.add('fade-in-quick');
  }

  // Render Hotspots (only when in 3D CAD mode)
  const hotspotsContainer = document.getElementById('render-hotspots');
  if (hotspotsContainer) {
    if (isCompareRealMode) {
      hotspotsContainer.innerHTML = '';
      hideHotspotTooltip();
    } else {
      hotspotsContainer.innerHTML = (angle.hotspots || []).map((h, idx) => `
        <button
          type="button"
          onclick="showHotspotTooltip(${idx})"
          class="hotspot-btn hotspot-pulse"
          style="left: ${h.x}%; top: ${h.y}%;"
          title="${h.title}"
        >
          ${idx + 1}
        </button>
      `).join('');
    }
  }

  // Update Synchronized Side Real Photo Card
  const sidePill = document.getElementById('side-court-pill');
  if (sidePill) sidePill.textContent = court.name;

  const sideTitle = document.getElementById('side-photo-title');
  if (sideTitle) sideTitle.textContent = court.realTitle;

  const sideDesc = document.getElementById('side-photo-desc');
  if (sideDesc) sideDesc.textContent = court.realDesc;

  const sideImg = document.getElementById('side-real-img');
  if (sideImg) sideImg.src = court.realPhoto;

  // Render Side Thumbnails Strip
  const thumbsContainer = document.getElementById('side-thumbnails-strip');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = (court.photos || []).map((photoSrc) => `
      <div
        onclick="setSideRealPhoto('${photoSrc}')"
        class="rounded-xl overflow-hidden aspect-square border-2 ${sideImg && sideImg.src.includes(photoSrc) ? 'border-vital-lime' : 'border-white/10'} cursor-pointer hover:border-vital-lime transition"
      >
        <img src="${photoSrc}" alt="Vista pista" class="w-full h-full object-cover" />
      </div>
    `).join('');
  }
}

function switch3DAngle(angleId) {
  isCompareRealMode = false;
  current3DAngle = angleId;
  render3DCourtViewer();
}

function switchCourt3D(courtId) {
  current3DCourt = courtId;
  render3DCourtViewer();
}

function toggleCompareMode() {
  isCompareRealMode = !isCompareRealMode;
  render3DCourtViewer();
}

function showHotspotTooltip(idx) {
  const angle = COURT_3D_DATA.angles[current3DAngle];
  if (!angle || !angle.hotspots || !angle.hotspots[idx]) return;
  const hotspot = angle.hotspots[idx];

  const card = document.getElementById('hotspot-tooltip-card');
  const title = document.getElementById('tooltip-title');
  const desc = document.getElementById('tooltip-desc');
  if (!card || !title || !desc) return;

  title.textContent = `Punto ${idx + 1}: ${hotspot.title}`;
  desc.textContent = hotspot.desc;
  card.classList.remove('is-hidden');
}

function hideHotspotTooltip() {
  const card = document.getElementById('hotspot-tooltip-card');
  if (card) card.classList.add('is-hidden');
}

function setSideRealPhoto(src) {
  const sideImg = document.getElementById('side-real-img');
  if (sideImg) sideImg.src = src;
  const court = COURT_3D_DATA.courts[current3DCourt];
  const thumbsContainer = document.getElementById('side-thumbnails-strip');
  if (thumbsContainer && court) {
    thumbsContainer.innerHTML = (court.photos || []).map((photoSrc) => `
      <div
        onclick="setSideRealPhoto('${photoSrc}')"
        class="rounded-xl overflow-hidden aspect-square border-2 ${photoSrc === src ? 'border-vital-lime' : 'border-white/10'} cursor-pointer hover:border-vital-lime transition"
      >
        <img src="${photoSrc}" alt="Vista pista" class="w-full h-full object-cover" />
      </div>
    `).join('');
  }
}

function openCurrentRenderLightbox() {
  const angle = COURT_3D_DATA.angles[current3DAngle] || COURT_3D_DATA.angles.iso1;
  const targetImg = isCompareRealMode ? angle.realPhoto : angle.image;
  openCustomLightbox(targetImg, angle.badge, isCompareRealMode ? 'Fotografía de Instalaciones Reales' : 'Render CAD Arquitectónico 3D', angle.realDesc);
}

function openCurrentSidePhotoModal() {
  const sideImg = document.getElementById('side-real-img');
  const court = COURT_3D_DATA.courts[current3DCourt];
  if (sideImg && court) {
    openCustomLightbox(sideImg.src, court.name, court.realTitle, court.realDesc);
  }
}

// ----------------------------------------------------------------------------
// GALERÍA FOTOGRÁFICA OFICIAL CON LIGHTBOX
// ----------------------------------------------------------------------------
function renderOfficialGallery(category = currentGalleryCategory) {
  currentGalleryCategory = category;
  const container = document.getElementById('official-gallery-grid');
  if (!container) return;

  // Update Filter Tabs styles
  document.querySelectorAll('.gal-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.className = 'gal-filter-btn px-4 py-2 rounded-xl font-bold bg-vital-900 text-vital-cream transition shadow-sm';
    } else {
      btn.className = 'gal-filter-btn px-4 py-2 rounded-xl font-bold bg-white text-stone-700 border border-vital-900/10 hover:bg-stone-50 transition';
    }
  });

  const list = category === 'todos'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === category);

  container.innerHTML = list.map((item) => {
    const globalIdx = GALLERY_ITEMS.findIndex(g => g.id === item.id);
    const hasMultiple = item.images && item.images.length > 1;

    return `
      <div
        onclick="openGalleryLightbox(${globalIdx})"
        class="group relative rounded-2xl overflow-hidden bg-vital-900 aspect-[4/5] border border-vital-900/10 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end"
      >
        <img src="${item.image}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
        
        <!-- Multi-photo Badge for Comedor/Social -->
        <div class="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
          ${hasMultiple ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-vital-orange text-white shadow-md border border-white/20">
              <span>📸</span> 3 Fotos
            </span>
          ` : ''}
        </div>

        <div class="relative z-10 p-3.5 sm:p-4 space-y-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-vital-lime text-vital-950">
              ${item.badge}
            </span>
            ${hasMultiple ? `<span class="text-[10px] text-vital-lime font-bold">★ Interactivo</span>` : ''}
          </div>
          <h4 class="font-brand font-bold text-white text-sm sm:text-base leading-tight">${item.title}</h4>
          <p class="text-[11px] text-white/75 line-clamp-2">${item.description}</p>
        </div>

        <div class="absolute top-2.5 right-2.5 w-7 h-7 rounded-xl bg-black/60 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition backdrop-blur-sm z-20">
          ↗
        </div>
      </div>
    `;
  }).join('');
}

function filterGallery(cat) {
  renderOfficialGallery(cat);
}

function openGalleryLightbox(index, subIndex = 0) {
  currentLightboxIndex = (index + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  currentLightboxSubIndex = subIndex;
  updateLightboxContent();
  const modal = document.getElementById('gallery-lightbox');
  if (modal) modal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}

function selectLightboxSubImage(subIdx) {
  currentLightboxSubIndex = subIdx;
  updateLightboxContent();
}

function navigateGalleryLightbox(direction) {
  const item = GALLERY_ITEMS[currentLightboxIndex];
  if (item && item.images && item.images.length > 1) {
    const nextSub = currentLightboxSubIndex + direction;
    if (nextSub >= 0 && nextSub < item.images.length) {
      currentLightboxSubIndex = nextSub;
      updateLightboxContent();
      return;
    }
  }

  currentLightboxIndex = (currentLightboxIndex + direction + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  const newItem = GALLERY_ITEMS[currentLightboxIndex];
  currentLightboxSubIndex = (direction > 0) ? 0 : ((newItem && newItem.images) ? newItem.images.length - 1 : 0);
  updateLightboxContent();
}

function updateLightboxContent() {
  const item = GALLERY_ITEMS[currentLightboxIndex];
  if (!item) return;

  const img = document.getElementById('lb-image');
  const counter = document.getElementById('lb-counter');
  const badge = document.getElementById('lb-badge');
  const title = document.getElementById('lb-title');
  const desc = document.getElementById('lb-desc');
  const thumbsContainer = document.getElementById('lb-subgallery-thumbs');

  const hasSubImages = item.images && item.images.length > 1;
  const currentSub = hasSubImages ? item.images[currentLightboxSubIndex] || item.images[0] : null;

  const activeSrc = currentSub ? currentSub.src : item.image;
  const activeTitle = currentSub ? currentSub.title : item.title;
  const activeDesc = currentSub ? currentSub.description : item.description;

  if (img) {
    img.src = activeSrc;
    img.onerror = () => { img.src = item.image; };
  }

  if (counter) {
    if (hasSubImages) {
      counter.textContent = `${item.title} · Foto ${currentLightboxSubIndex + 1} de ${item.images.length}`;
    } else {
      counter.textContent = `Foto ${currentLightboxIndex + 1} de ${GALLERY_ITEMS.length}`;
    }
  }

  if (badge) badge.textContent = item.badge;
  if (title) title.textContent = activeTitle;
  if (desc) desc.textContent = activeDesc;

  if (thumbsContainer) {
    if (hasSubImages) {
      thumbsContainer.innerHTML = item.images.map((sub, sIdx) => {
        const isActive = sIdx === currentLightboxSubIndex;
        return `
          <button onclick="selectLightboxSubImage(${sIdx})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            isActive
              ? 'bg-vital-lime text-vital-950 shadow-md ring-2 ring-vital-lime scale-105'
              : 'bg-white/10 text-white hover:bg-white/20'
          }">
            <span>📸 Foto ${sIdx + 1}</span>
          </button>
        `;
      }).join('');
      thumbsContainer.classList.remove('is-hidden');
    } else {
      thumbsContainer.innerHTML = '';
      thumbsContainer.classList.add('is-hidden');
    }
  }
}

function openCustomLightbox(imgSrc, badgeText, titleText, descText) {
  const img = document.getElementById('lb-image');
  const counter = document.getElementById('lb-counter');
  const badge = document.getElementById('lb-badge');
  const title = document.getElementById('lb-title');
  const desc = document.getElementById('lb-desc');

  if (img) img.src = imgSrc;
  if (counter) counter.textContent = 'Detalle en Alta Definición';
  if (badge) badge.textContent = badgeText;
  if (title) title.textContent = titleText;
  if (desc) desc.textContent = descText;

  const modal = document.getElementById('gallery-lightbox');
  if (modal) modal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}

function closeGalleryLightbox() {
  const modal = document.getElementById('gallery-lightbox');
  if (modal) modal.classList.add('is-hidden');
  document.body.style.overflow = '';
}

function handleLightboxBackdropClick(e) {
  if (e.target.id === 'gallery-lightbox') {
    closeGalleryLightbox();
  }
}

// Keyboard shortcuts for Lightbox (Esc, Left, Right)
window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('gallery-lightbox');
  if (!modal || modal.classList.contains('is-hidden')) return;

  if (e.key === 'Escape') closeGalleryLightbox();
  if (e.key === 'ArrowLeft') navigateGalleryLightbox(-1);
  if (e.key === 'ArrowRight') navigateGalleryLightbox(1);
});

function renderAllClientViews() {
  renderHeroLiveStatus();
  renderDateStrip();
  render3DCourtViewer();
  renderCourtsGrid();
  renderClientClasses();
  renderClientClinics();
  renderOfficialGallery();
  renderClientCoaches();
}

// ============================================================================
// MODALES DE CLIENTE (RENTA, RETA, CLASE, CLÍNICA)
// ============================================================================

function openBookingModal(courtId, hour, defaultService = 'Renta') {
  const court = state.settings.courts.find(c => c.id === courtId) || state.settings.courts[0];

  openModal(`
    <div class="space-y-5">
      <div class="border-b border-vital-900/10 pb-3">
        <span class="text-[10px] font-bold uppercase tracking-widest text-vital-orange">Reserva de Cancha Techada</span>
        <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${court.name}</h3>
        <p class="text-xs text-stone-500">${selectedDate} · ${formatHourLabel(hour)}</p>
      </div>

      <form id="court-booking-form" onsubmit="submitCourtBooking(event, '${courtId}', ${hour})" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Servicio</label>
          <select id="modal-bk-service" onchange="updateBookingModalPrice(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-bold text-vital-900">
            <option value="Renta" ${defaultService === 'Renta' ? 'selected' : ''}>Renta de Cancha (1 Hora) · $350 MXN</option>
            <option value="Renta-2H">Renta de Cancha (2 Horas) · $700 MXN</option>
            <option value="Reta" ${defaultService === 'Reta' ? 'selected' : ''}>Reta Organizada (2 Horas) · $150 MXN por persona</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Nombre Completo</label>
            <input type="text" id="modal-bk-name" required placeholder="Ej. Familia Hernández / Carlos R." class="w-full px-3 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-semibold" />
          </div>
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">WhatsApp de Contacto</label>
            <input type="tel" id="modal-bk-phone" required placeholder="715 123 4567" class="w-full px-3 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-semibold" />
          </div>
        </div>

        <div>
          <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Método de Pago</label>
          <select id="modal-bk-payment" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-bold text-vital-900">
            <option value="Tarjeta">Tarjeta en línea (Confirmación inmediata)</option>
            <option value="Efectivo">Pago en recepción del club</option>
            <option value="Transferencia">Transferencia SPEI</option>
          </select>
        </div>

        <div class="p-3.5 rounded-2xl bg-vital-cream border border-vital-900/10 flex items-center justify-between">
          <span class="font-bold text-vital-900/70">Total a Pagar:</span>
          <span id="modal-bk-price-display" class="font-brand text-2xl font-bold text-vital-900">$350 MXN</span>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl border border-vital-900/15 font-bold text-stone-600">Cancelar</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-vital-lime hover:opacity-95 text-vital-950 font-bold">Confirmar Reserva</button>
        </div>
      </form>
    </div>
  `);
}

function updateBookingModalPrice(val) {
  const el = document.getElementById('modal-bk-price-display');
  if (!el) return;
  if (val === 'Renta-2H') el.textContent = '$700 MXN';
  else if (val === 'Reta') el.textContent = '$150 MXN';
  else el.textContent = '$350 MXN';
}

function submitCourtBooking(e, courtId, hour) {
  e.preventDefault();
  const servVal = document.getElementById('modal-bk-service').value;
  const name = document.getElementById('modal-bk-name').value.trim();
  const phone = document.getElementById('modal-bk-phone').value.trim();
  const method = document.getElementById('modal-bk-payment').value;

  const is2H = servVal === 'Renta-2H';
  const service = servVal === 'Reta' ? 'Reta' : 'Renta';
  const amount = is2H ? 700 : (servVal === 'Reta' ? 150 : 350);

  const newRes = {
    id: 'RES-' + Date.now().toString().slice(-5),
    date: selectedDate,
    courtId,
    hour,
    duration: is2H ? 2 : 1,
    service,
    customer: name,
    phone,
    amount,
    prestadorAmount: 0,
    clienteAmount: amount,
    coachId: 'NONE',
    coachName: 'Sin Coach',
    paymentMethod: method,
    notes: is2H ? 'Renta 2 horas' : (service === 'Reta' ? 'Reta 2 horas' : 'Renta 1 hora')
  };

  state.reservations.push(newRes);

  const newTx = {
    id: 'VC-TX-' + Date.now().toString().slice(-4),
    date: selectedDate,
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    service,
    concept: `${service} (${courtId === 'cancha-1' ? 'Cancha 1' : 'Cancha 2'}) - ${name}`,
    customer: name,
    coachId: 'NONE',
    coachName: '-',
    paymentMethod: method,
    amount,
    prestadorAmount: 0,
    clienteAmount: amount
  };

  state.transactions.unshift(newTx);

  dbInsertReservation(newRes);
  dbInsertTransaction(newTx);

  saveState();
  closeModal();
  renderCourtsGrid();
  renderHeroLiveStatus();
  showToast(`¡${service} confirmada para ${name}!`);
}

function openClassBookingModal(classId) {
  const item = OFFICIAL_SERVICES.find(s => s.id === classId) || OFFICIAL_SERVICES[3];

  openModal(`
    <div class="space-y-5">
      <div class="border-b border-vital-900/10 pb-3">
        <span class="text-[10px] font-bold uppercase tracking-widest text-vital-orange">Agendar Clase de Pádel</span>
        <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${item.name}</h3>
        <p class="text-xs text-stone-500">1 hora de duración · Cancha techada y pelotas incluidas</p>
      </div>

      <form id="class-booking-form" onsubmit="submitClassBooking(event, '${item.id}')" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Selecciona tu Coach</label>
          <select id="modal-cls-coach" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-bold text-vital-900">
            <option value="COACH-1">Lucas Morilla · Head Coach</option>
            <option value="COACH-2">Leo Marín · Coach Infantil y Principiantes</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Nombre Alumno(a)</label>
            <input type="text" id="modal-cls-name" required placeholder="Nombre completo" class="w-full px-3 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-semibold" />
          </div>
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">WhatsApp</label>
            <input type="tel" id="modal-cls-phone" required placeholder="715 123 4567" class="w-full px-3 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-semibold" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Cancha</label>
            <select id="modal-cls-court" class="w-full px-3 py-2 rounded-xl bg-vital-cream border border-vital-900/10 font-bold">
              <option value="cancha-1">Cancha Techada 1</option>
              <option value="cancha-2">Cancha Techada 2</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Horario Deseado</label>
            <select id="modal-cls-hour" class="w-full px-3 py-2 rounded-xl bg-vital-cream border border-vital-900/10 font-bold">
              ${[9, 10, 11, 12, 16, 17, 18, 19].map(h => `<option value="${h}">${formatHourLabel(h)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Método de Pago</label>
          <select id="modal-cls-payment" class="w-full px-3 py-2 rounded-xl bg-vital-cream border border-vital-900/10 font-bold">
            <option value="Tarjeta">Tarjeta en línea</option>
            <option value="Efectivo">Pago al llegar al club</option>
          </select>
        </div>

        <div class="p-3.5 rounded-2xl bg-vital-cream border border-vital-900/10 flex items-center justify-between">
          <span class="font-bold text-vital-900/70">Monto Final:</span>
          <span class="font-brand text-2xl font-bold text-vital-900">$${item.price} MXN</span>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl border border-vital-900/15 font-bold text-stone-600">Cancelar</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-vital-lime text-vital-950 font-bold">Confirmar Clase</button>
        </div>
      </form>
    </div>
  `);
}

function submitClassBooking(e, classId) {
  e.preventDefault();
  const item = OFFICIAL_SERVICES.find(s => s.id === classId);
  const coachId = document.getElementById('modal-cls-coach').value;
  const name = document.getElementById('modal-cls-name').value.trim();
  const phone = document.getElementById('modal-cls-phone').value.trim();
  const courtId = document.getElementById('modal-cls-court').value;
  const hour = Number(document.getElementById('modal-cls-hour').value);
  const method = document.getElementById('modal-cls-payment').value;

  const coach = COACHES_DATA.find(c => c.id === coachId) || COACHES_DATA[0];
  const split = calculateSplit('Clase', item.price, coachId);

  const newRes = {
    id: 'RES-' + Date.now().toString().slice(-5),
    date: selectedDate,
    courtId,
    hour,
    duration: 1,
    service: 'Clase',
    customer: `${item.name} · ${name}`,
    phone,
    amount: item.price,
    prestadorAmount: split.prestador,
    clienteAmount: split.cliente,
    coachId,
    coachName: coach.name,
    students: [name],
    attendanceChecked: false,
    paymentMethod: method,
    notes: item.name
  };

  state.reservations.push(newRes);

  const newTx = {
    id: 'VC-TX-' + Date.now().toString().slice(-4),
    date: selectedDate,
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    service: 'Clase',
    concept: `${item.name} (${coach.name}) - ${name}`,
    customer: name,
    coachId,
    coachName: coach.name,
    paymentMethod: method,
    amount: item.price,
    prestadorAmount: split.prestador,
    clienteAmount: split.cliente
  };

  state.transactions.unshift(newTx);

  dbInsertReservation(newRes);
  dbInsertTransaction(newTx);

  saveState();
  closeModal();
  renderCourtsGrid();
  showToast(`¡Clase agendada con ${coach.name} para ${name}!`);
}

function openClinicBookingModal(clinicId) {
  const item = OFFICIAL_SERVICES.find(s => s.id === clinicId) || OFFICIAL_SERVICES[8];

  openModal(`
    <div class="space-y-5">
      <div class="border-b border-vital-900/10 pb-3">
        <span class="text-[10px] font-bold uppercase tracking-widest text-vital-orange">Inscripción a Clínica Mensual</span>
        <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${item.name}</h3>
        <p class="text-xs text-stone-500">8 sesiones mensuales de 1 hora · 2 por semana</p>
      </div>

      <form id="clinic-booking-form" onsubmit="submitClinicBooking(event, '${item.id}')" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Entrenador Titular</label>
          <select id="modal-cln-coach" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-bold text-vital-900">
            <option value="COACH-1">Lucas Morilla · Director Deportivo</option>
            <option value="COACH-2">Leo Marín · Especialista Infantil & Juvenil</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">Nombre Alumno(a)</label>
            <input type="text" id="modal-cln-name" required placeholder="Nombre y Apellido" class="w-full px-3 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-semibold" />
          </div>
          <div>
            <label class="block font-bold text-vital-900 uppercase tracking-wider mb-1">WhatsApp</label>
            <input type="tel" id="modal-cln-phone" required placeholder="715 123 4567" class="w-full px-3 py-2.5 rounded-xl bg-vital-cream border border-vital-900/10 font-semibold" />
          </div>
        </div>

        <!-- Familias Vital checkbox -->
        <label class="flex items-center gap-2 p-3 rounded-xl bg-vital-lime/20 border border-vital-lime/40 cursor-pointer">
          <input type="checkbox" id="modal-cln-family" onchange="toggleFamilyDiscount('${item.id}', this.checked)" class="accent-vital-900 w-4 h-4" />
          <span class="text-xs font-bold text-vital-950">Aplicar Descuento Familias Vital (10% si se inscriben 3+ integrantes)</span>
        </label>

        <div class="p-3.5 rounded-2xl bg-vital-cream border border-vital-900/10 flex items-center justify-between">
          <span class="font-bold text-vital-900/70">Mensualidad Total:</span>
          <span id="modal-cln-price-display" class="font-brand text-2xl font-bold text-vital-900">$${item.price} MXN</span>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl border border-vital-900/15 font-bold text-stone-600">Cancelar</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-vital-orange hover:bg-orange-600 text-white font-bold">Confirmar Inscripción</button>
        </div>
      </form>
    </div>
  `);
}

function toggleFamilyDiscount(originalId, isChecked) {
  const el = document.getElementById('modal-cln-price-display');
  if (!el) return;
  const isKid = originalId.includes('NINO');
  if (isChecked) {
    el.textContent = isKid ? '$1,080 MXN' : '$1,350 MXN';
  } else {
    el.textContent = isKid ? '$1,200 MXN' : '$1,500 MXN';
  }
}

function submitClinicBooking(e, clinicId) {
  e.preventDefault();
  const coachId = document.getElementById('modal-cln-coach').value;
  const name = document.getElementById('modal-cln-name').value.trim();
  const phone = document.getElementById('modal-cln-phone').value.trim();
  const isFamily = document.getElementById('modal-cln-family').checked;

  const isKid = clinicId.includes('NINO');
  let finalPrice = isKid ? (isFamily ? 1080 : 1200) : (isFamily ? 1350 : 1500);
  const finalTitle = `Clínica Mensual ${isKid ? 'Niños' : 'Adultos'}${isFamily ? ' (Familias Vital)' : ''}`;

  const coach = COACHES_DATA.find(c => c.id === coachId) || COACHES_DATA[0];
  const split = calculateSplit('Clínica', finalPrice, coachId);

  const newRes = {
    id: 'RES-' + Date.now().toString().slice(-5),
    date: selectedDate,
    courtId: 'cancha-2',
    hour: isKid ? 16 : 18,
    duration: 1,
    service: 'Clínica',
    customer: `${finalTitle} · ${name}`,
    phone,
    amount: finalPrice,
    prestadorAmount: split.prestador,
    clienteAmount: split.cliente,
    coachId,
    coachName: coach.name,
    students: [name],
    attendanceChecked: true,
    paymentMethod: 'Tarjeta',
    notes: 'Inscripción a mensualidad 8 sesiones'
  };

  state.reservations.push(newRes);

  const newTx = {
    id: 'VC-TX-' + Date.now().toString().slice(-4),
    date: selectedDate,
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    service: 'Clínica',
    concept: `${finalTitle} (${coach.name}) - ${name}`,
    customer: name,
    coachId,
    coachName: coach.name,
    paymentMethod: 'Tarjeta',
    amount: finalPrice,
    prestadorAmount: split.prestador,
    clienteAmount: split.cliente
  };

  state.transactions.unshift(newTx);

  dbInsertReservation(newRes);
  dbInsertTransaction(newTx);

  saveState();
  closeModal();
  renderCourtsGrid();
  showToast(`¡Inscripción confirmada para ${name} con ${coach.name}!`);
}

function openClubInfoModal() {
  openModal(`
    <div class="space-y-4">
      <div class="border-b border-vital-900/10 pb-3">
        <span class="text-[10px] font-bold uppercase tracking-widest text-vital-orange">Vital Club Zitácuaro</span>
        <h3 class="font-brand text-2xl text-vital-900 mt-0.5">Información y Ubicación</h3>
      </div>
      <div class="space-y-2.5 text-xs text-stone-600 leading-relaxed">
        <p><strong>Dirección:</strong> Andrés Landa y Piña Nte. 26, Col. Cuauhtémoc, Zitácuaro, Mich., México, 61506.</p>
        <p><strong>Horarios:</strong> Lunes a Viernes 8:00 AM – 8:00 PM y Fines de Semana.</p>
        <p><strong>WhatsApp / Tel:</strong> 715 131 7443</p>
        <p><strong>Amenidades Actuales:</strong> 2 canchas de cristal panorámico 100% techadas (sin pretexto si llueve), iluminación profesional y estacionamiento.</p>
        <p><strong>Próximamente:</strong> Zona de cocina, café de especialidad, barra saludable, barre y gym.</p>
      </div>
      <div class="flex justify-end pt-2">
        <button onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-vital-900 text-vital-cream font-bold text-xs">Cerrar</button>
      </div>
    </div>
  `);
}

// ============================================================================
// 2. VISTA COACH (AGENDA Y COMISIONES PRESTADOR)
// ============================================================================

function populateCoachSelector() {
  const sel = document.getElementById('coach-view-select');
  if (!sel) return;
  sel.innerHTML = COACHES_DATA.map(c => `
    <option value="${c.id}">${c.name} · ${c.schemeLabel}</option>
  `).join('');
}

function renderCoachView() {
  const sel = document.getElementById('coach-view-select');
  const coachId = sel?.value || 'COACH-1';
  const coach = COACHES_DATA.find(c => c.id === coachId) || COACHES_DATA[0];

  const heading = document.getElementById('coach-schedule-heading');
  if (heading) heading.textContent = `${coach.name} · Agenda y Comisiones`;

  // Comisiones acumuladas por este coach en las transacciones
  const coachTxs = state.transactions.filter(t => t.coachId === coachId);
  const totalEarned = coachTxs.reduce((s, t) => s + (t.prestadorAmount || 0), 0);
  const totalSessions = state.reservations.filter(r => r.date === selectedDate && r.coachId === coachId).length;

  const kpis = document.getElementById('coach-kpi-cards');
  if (kpis) {
    kpis.innerHTML = `
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[10px] uppercase font-bold text-stone-400">Comisiones Acumuladas</span>
        <p class="font-brand text-2xl font-bold text-vital-green mt-0.5">${formatMXN(totalEarned)}</p>
        <span class="text-[11px] text-stone-500 font-semibold">${coach.schemeLabel}</span>
      </div>
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[10px] uppercase font-bold text-stone-400">Sesiones Hoy</span>
        <p class="font-brand text-2xl font-bold text-vital-900 mt-0.5">${totalSessions}</p>
        <span class="text-[11px] text-stone-500">Clases y clínicas programadas</span>
      </div>
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[10px] uppercase font-bold text-stone-400">Total Alumnos Atendidos</span>
        <p class="font-brand text-2xl font-bold text-vital-orange mt-0.5">${coachTxs.length}</p>
        <span class="text-[11px] text-stone-500">Registros de pago oficiales</span>
      </div>
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[10px] uppercase font-bold text-stone-400">Esquema Laboral</span>
        <p class="text-sm font-bold text-vital-900 mt-1.5">${coach.hasBaseSalary ? 'Sueldo Base + 40%' : '50% Directo (Sin Base)'}</p>
        <span class="text-[11px] text-emerald-700 font-semibold">Anexo 2 Vigente</span>
      </div>
    `;
  }

  // Timeline por hora
  const timeline = document.getElementById('coach-hourly-timeline');
  if (!timeline) return;

  const openH = state.settings.openHour;
  const closeH = state.settings.closeHour;

  const hoursList = [];
  for (let h = openH; h < closeH; h++) {
    const res = state.reservations.find(r => r.date === selectedDate && r.coachId === coachId && r.hour === h);
    if (res) {
      hoursList.push(`
        <div class="p-4 rounded-2xl border border-vital-lime/60 bg-vital-lime/10 space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-vital-900">
            <span>${formatHourLabel(h)} · ${res.courtId === 'cancha-1' ? 'Cancha 1' : 'Cancha 2'}</span>
            <span class="px-2 py-0.5 rounded bg-vital-lime text-vital-950 font-black">${res.service}</span>
          </div>
          <p class="font-brand text-base font-bold text-vital-900">${res.customer}</p>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-vital-900/10">
            <span class="text-stone-500">Comisión Coach: <strong class="text-vital-green">${formatMXN(res.prestadorAmount)}</strong></span>
            <button onclick="toggleAttendance('${res.id}')" class="px-2.5 py-1 rounded-lg ${res.attendanceChecked ? 'bg-emerald-600 text-white' : 'bg-white border text-stone-700'} font-bold">
              ${res.attendanceChecked ? '✓ Asistencia Tomada' : 'Pasar Asistencia'}
            </button>
          </div>
        </div>
      `);
    } else {
      hoursList.push(`
        <div class="p-3.5 rounded-2xl border border-stone-200 bg-white/70 flex items-center justify-between text-xs text-stone-400">
          <span>${formatHourLabel(h)}</span>
          <span>Disponible para clase particular</span>
        </div>
      `);
    }
  }

  timeline.innerHTML = hoursList.join('');
}

function toggleAttendance(resId) {
  const r = state.reservations.find(x => x.id === resId);
  if (!r) return;
  r.attendanceChecked = !r.attendanceChecked;
  dbUpdateAttendance(resId, r.attendanceChecked);
  saveState();
  renderCoachView();
  showToast(r.attendanceChecked ? 'Asistencia marcada.' : 'Asistencia desmarcada.');
}

function openCoachClassModal() {
  const sel = document.getElementById('coach-view-select');
  const coachId = sel?.value || 'COACH-1';
  openClassBookingModal('SERV-CLASE-1P');
}

// ============================================================================
// 3. VISTA ADMIN (DASHBOARD, POS, CONTROL CANCHAS & COMISIONES)
// ============================================================================

function renderAdminDashboard() {
  const kpis = document.getElementById('dashboard-kpi-cards');
  if (!kpis) return;

  const totalGross = state.transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalClub = state.transactions.reduce((s, t) => s + Number(t.clienteAmount || 0), 0);
  const totalCoaches = state.transactions.reduce((s, t) => s + Number(t.prestadorAmount || 0), 0);

  const lucasEarned = state.transactions.filter(t => t.coachId === 'COACH-1').reduce((s, t) => s + Number(t.prestadorAmount || 0), 0);
  const leoEarned = state.transactions.filter(t => t.coachId === 'COACH-2').reduce((s, t) => s + Number(t.prestadorAmount || 0), 0);

  kpis.innerHTML = `
    <div class="card-luxury rounded-2xl p-5">
      <span class="text-[10px] uppercase font-bold tracking-wider text-stone-400">Ingreso Bruto Total</span>
      <p class="font-brand text-3xl font-bold text-vital-900 mt-1">${formatMXN(totalGross)}</p>
      <span class="text-[11px] text-stone-500">${state.transactions.length} operaciones registradas</span>
    </div>
    <div class="card-luxury rounded-2xl p-5 border-l-4 border-l-vital-green">
      <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Utilidad Vital Club (Cliente)</span>
      <p class="font-brand text-3xl font-bold text-vital-green mt-1">${formatMXN(totalClub)}</p>
      <span class="text-[11px] text-stone-500">Libre de comisiones a coaches</span>
    </div>
    <div class="card-luxury rounded-2xl p-5 border-l-4 border-l-vital-orange">
      <span class="text-[10px] uppercase font-bold tracking-wider text-amber-800">Comisiones Prestadores</span>
      <p class="font-brand text-3xl font-bold text-vital-orange mt-1">${formatMXN(totalCoaches)}</p>
      <span class="text-[11px] text-stone-500">Lucas: ${formatMXN(lucasEarned)} · Leo: ${formatMXN(leoEarned)}</span>
    </div>
    <div class="card-luxury rounded-2xl p-5">
      <span class="text-[10px] uppercase font-bold tracking-wider text-stone-400">Servicios Oficiales</span>
      <p class="font-brand text-3xl font-bold text-vital-900 mt-1">4</p>
      <span class="text-[11px] text-stone-500">Renta, Reta, Clase, Clínica</span>
    </div>
  `;

  // Bars
  const bars = document.getElementById('dashboard-streams-bars');
  if (bars) {
    const streams = ['Renta', 'Reta', 'Clase', 'Clínica'];
    const safeTotal = Math.max(1, totalGross);

    bars.innerHTML = streams.map(st => {
      const amt = state.transactions.filter(t => t.service === st).reduce((s, t) => s + Number(t.amount || 0), 0);
      const pct = Math.round((amt / safeTotal) * 100);
      return `
        <div>
          <div class="flex justify-between text-xs font-bold mb-1">
            <span class="text-vital-900">${st}s</span>
            <span>${formatMXN(amt)} (${pct}%)</span>
          </div>
          <div class="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
            <div class="h-full bg-vital-900 rounded-full transition-all" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Occupancy
  const occ = document.getElementById('dashboard-court-occupancy');
  if (occ) {
    const totalSlots = (state.settings.closeHour - state.settings.openHour) * state.settings.courts.length;
    const bookedSlots = state.reservations.filter(r => r.date === selectedDate).length;
    const occPct = Math.round((bookedSlots / Math.max(1, totalSlots)) * 100);

    occ.innerHTML = `
      <div class="p-4 rounded-2xl bg-vital-cream space-y-2">
        <div class="flex justify-between text-xs font-bold">
          <span>Ocupación de Canchas Hoy</span>
          <span class="text-vital-green">${occPct}% (${bookedSlots}/${totalSlots} hrs)</span>
        </div>
        <div class="w-full h-2 rounded-full bg-white overflow-hidden">
          <div class="h-full bg-vital-lime rounded-full" style="width: ${occPct}%"></div>
        </div>
      </div>
      <p class="text-xs text-stone-500">
        Tarifa de $350/h fija en cualquier horario según el Anexo 2.
      </p>
    `;
  }

  // Recent Table
  const table = document.getElementById('dashboard-recent-txs');
  if (table) {
    table.innerHTML = state.transactions.slice(0, 6).map(t => `
      <tr class="hover:bg-vital-cream/50">
        <td class="py-2.5 px-3 text-stone-400 font-mono">${t.time}</td>
        <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-[10px] bg-stone-100">${t.service}</span></td>
        <td class="py-2.5 px-3 font-semibold text-vital-900">${t.concept}</td>
        <td class="py-2.5 px-3 text-stone-600">${t.coachName || '-'}</td>
        <td class="py-2.5 px-3 font-bold">${formatMXN(t.amount)}</td>
        <td class="py-2.5 px-3 font-bold text-vital-orange">${formatMXN(t.prestadorAmount)}</td>
        <td class="py-2.5 px-3 font-bold text-vital-green">${formatMXN(t.clienteAmount)}</td>
      </tr>
    `).join('');
  }
}

// ----------------------------------------------------------------------------
// PUNTO DE VENTA (POS) ADMIN
// ----------------------------------------------------------------------------
function filterPosCatalog(cat) {
  currentPosFilter = cat;
  document.querySelectorAll('.pos-cat-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-pos-cat') === cat;
    btn.className = isAct
      ? 'pos-cat-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-vital-900 text-vital-cream'
      : 'pos-cat-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-vital-cream text-vital-900 hover:bg-vital-sand';
  });
  renderPosCatalog();
}

function renderPosCatalog() {
  const container = document.getElementById('pos-catalog-grid');
  if (!container) return;

  const query = (document.getElementById('pos-search-input')?.value || '').toLowerCase().trim();

  let items = OFFICIAL_SERVICES;
  if (currentPosFilter !== 'all') {
    items = items.filter(i => i.service === currentPosFilter);
  }
  if (query) {
    items = items.filter(i => i.name.toLowerCase().includes(query));
  }

  container.innerHTML = items.map(item => `
    <button onclick="addToPosCart('${item.id}')" class="p-3.5 rounded-2xl bg-vital-cream hover:bg-vital-lime/30 border border-vital-900/10 text-left transition flex flex-col justify-between">
      <div>
        <span class="text-[9px] font-extrabold uppercase tracking-wider text-vital-orange">${item.service}</span>
        <h5 class="font-bold text-xs text-vital-900 mt-0.5 line-clamp-2">${item.name}</h5>
      </div>
      <span class="font-brand text-sm font-bold text-vital-900 mt-2 block">${formatMXN(item.price)}</span>
    </button>
  `).join('');
}

function addToPosCart(serviceId) {
  const item = OFFICIAL_SERVICES.find(s => s.id === serviceId);
  if (!item) return;

  const existing = posCart.find(c => c.id === serviceId);
  if (existing) {
    existing.qty += 1;
  } else {
    posCart.push({ ...item, qty: 1 });
  }

  renderPosCart();
}

function changePosCartQty(serviceId, delta) {
  const item = posCart.find(c => c.id === serviceId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    posCart = posCart.filter(c => c.id !== serviceId);
  }
  renderPosCart();
}

function clearPosCart() {
  posCart = [];
  renderPosCart();
}

function renderPosCart() {
  const list = document.getElementById('pos-ticket-items');
  const totalEl = document.getElementById('pos-total-amount');
  if (!list || !totalEl) return;

  const total = posCart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = formatMXN(total);

  if (posCart.length === 0) {
    list.innerHTML = `<p class="text-xs text-stone-400 text-center py-6">Selecciona servicios para cobrar en mostrador.</p>`;
    return;
  }

  list.innerHTML = posCart.map(c => `
    <div class="p-2.5 rounded-xl bg-vital-cream border border-vital-900/10 flex items-center justify-between text-xs">
      <div class="min-w-0 pr-2">
        <p class="font-bold text-vital-900 truncate">${c.name}</p>
        <p class="text-[11px] text-stone-500">${formatMXN(c.price)} c/u</p>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button onclick="changePosCartQty('${c.id}', -1)" class="w-6 h-6 rounded bg-white font-bold text-stone-700">-</button>
        <span class="font-bold w-4 text-center">${c.qty}</span>
        <button onclick="changePosCartQty('${c.id}', 1)" class="w-6 h-6 rounded bg-white font-bold text-stone-700">+</button>
      </div>
    </div>
  `).join('');

  calculatePosChange();
}

function selectPosPaymentMethod(method) {
  currentPosMethod = method;
  document.querySelectorAll('.pos-method-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-pos-method') === method;
    btn.className = isAct
      ? 'pos-method-btn px-2 py-1.5 rounded-lg border text-xs font-bold bg-vital-900 text-vital-cream'
      : 'pos-method-btn px-2 py-1.5 rounded-lg border text-xs font-semibold bg-white';
  });

  const cashBox = document.getElementById('pos-cash-container');
  if (cashBox) {
    cashBox.classList.toggle('is-hidden', method !== 'Efectivo');
  }
}

function calculatePosChange() {
  const input = document.getElementById('pos-cash-input');
  const changeEl = document.getElementById('pos-cash-change');
  if (!input || !changeEl) return;

  const total = posCart.reduce((s, i) => s + i.price * i.qty, 0);
  const given = Number(input.value || 0);
  const diff = Math.max(0, given - total);
  changeEl.textContent = formatMXN(diff);
}

function executePosCheckout() {
  if (posCart.length === 0) {
    showToast('Agrega al menos un servicio al ticket.');
    return;
  }

  const coachId = document.getElementById('pos-coach-select')?.value || 'COACH-1';
  const customer = document.getElementById('pos-customer-input')?.value.trim() || 'Cliente Mostrador';
  const coach = COACHES_DATA.find(c => c.id === coachId);
  const coachName = coachId === 'NONE' || !coach ? '-' : coach.name;

  let totalAmount = 0;
  let totalPrestador = 0;
  let totalCliente = 0;

  const concepts = posCart.map(item => {
    const lineTotal = item.price * item.qty;
    totalAmount += lineTotal;
    const split = calculateSplit(item.service, lineTotal, coachId);
    totalPrestador += split.prestador;
    totalCliente += split.cliente;
    return `${item.qty}x ${item.name}`;
  }).join(', ');

  const primaryService = posCart[0].service;

  const newTx = {
    id: 'VC-TX-' + Date.now().toString().slice(-4),
    date: selectedDate,
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    service: primaryService,
    concept: concepts,
    customer,
    coachId,
    coachName,
    paymentMethod: currentPosMethod,
    amount: totalAmount,
    prestadorAmount: totalPrestador,
    clienteAmount: totalCliente
  };

  state.transactions.unshift(newTx);
  dbInsertTransaction(newTx);
  posCart = [];
  if (document.getElementById('pos-customer-input')) document.getElementById('pos-customer-input').value = '';
  if (document.getElementById('pos-cash-input')) document.getElementById('pos-cash-input').value = '';

  saveState();
  renderPosCart();
  renderAdminAllViews();
  showToast(`Cobro registrado por ${formatMXN(totalAmount)}`);
}

// ----------------------------------------------------------------------------
// CALENDARIO MAESTRO ADMIN
// ----------------------------------------------------------------------------
function renderAdminMasterCalendar() {
  const container = document.getElementById('admin-master-calendar-grid');
  if (!container) return;

  const openH = state.settings.openHour;
  const closeH = state.settings.closeHour;

  container.innerHTML = state.settings.courts.map(court => {
    const slots = [];
    for (let h = openH; h < closeH; h++) {
      const res = state.reservations.find(r => r.date === selectedDate && r.courtId === court.id && r.hour === h);

      if (!res) {
        slots.push(`
          <button onclick="openAdminCreateSlotModal('${court.id}', ${h})" class="p-3 rounded-xl border border-dashed border-stone-300 hover:border-vital-900 bg-white text-left transition flex items-center justify-between text-xs">
            <span class="font-bold text-stone-400">${formatHourLabel(h)}</span>
            <span class="text-vital-green font-bold text-[11px]">+ Asignar Horario</span>
          </button>
        `);
      } else {
        const isMaint = res.service === 'Mantenimiento';
        slots.push(`
          <div class="p-3 rounded-xl border ${isMaint ? 'border-stone-300 bg-stone-100 text-stone-500' : 'border-vital-900/15 bg-vital-cream'} flex items-center justify-between text-xs">
            <div class="min-w-0 pr-2">
              <span class="font-black text-vital-900">${formatHourLabel(h)} · ${res.service}</span>
              <p class="font-semibold text-stone-600 truncate">${res.customer}</p>
              ${res.coachName !== 'Sin Coach' ? `<p class="text-[10px] text-stone-400">Coach: ${res.coachName}</p>` : ''}
            </div>
            <button onclick="deleteReservationSlot('${res.id}')" class="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[10px] shrink-0">
              Liberar
            </button>
          </div>
        `);
      }
    }

    return `
      <div class="card-luxury rounded-2xl p-5 space-y-3">
        <h4 class="font-brand text-xl text-vital-900 font-bold border-b border-vital-900/10 pb-2">${court.name}</h4>
        <div class="grid sm:grid-cols-2 gap-2">${slots.join('')}</div>
      </div>
    `;
  }).join('');
}

function openAdminCreateSlotModal(courtId = 'cancha-1', hour = 10) {
  openModal(`
    <div class="space-y-4">
      <div class="border-b border-vital-900/10 pb-2">
        <span class="text-[10px] font-bold uppercase tracking-widest text-vital-orange">Control de Canchas Admin</span>
        <h3 class="font-brand text-2xl text-vital-900 mt-0.5">Asignar o Bloquear Cancha</h3>
      </div>

      <form id="admin-create-slot-form" onsubmit="submitAdminCreateSlot(event)" class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="block font-bold mb-1">Cancha</label>
            <select id="adm-slot-court" class="w-full px-3 py-2 rounded-xl bg-vital-cream border font-bold">
              <option value="cancha-1" ${courtId === 'cancha-1' ? 'selected' : ''}>Cancha Techada 1</option>
              <option value="cancha-2" ${courtId === 'cancha-2' ? 'selected' : ''}>Cancha Techada 2</option>
            </select>
          </div>
          <div>
            <label class="block font-bold mb-1">Hora</label>
            <select id="adm-slot-hour" class="w-full px-3 py-2 rounded-xl bg-vital-cream border font-bold">
              ${[8,9,10,11,12,13,14,15,16,17,18,19].map(h => `<option value="${h}" ${h === hour ? 'selected' : ''}>${formatHourLabel(h)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold mb-1">Servicio Oficial</label>
          <select id="adm-slot-service" class="w-full px-3 py-2 rounded-xl bg-vital-cream border font-bold">
            <option value="Renta">Renta de Cancha ($350)</option>
            <option value="Reta">Reta Organizada ($150/p)</option>
            <option value="Clase">Clase con Coach</option>
            <option value="Clínica">Clínica Mensual</option>
            <option value="Mantenimiento">Mantenimiento (Bloqueo de horario)</option>
          </select>
        </div>

        <div>
          <label class="block font-bold mb-1">Coach Responsable</label>
          <select id="adm-slot-coach" class="w-full px-3 py-2 rounded-xl bg-vital-cream border font-bold">
            <option value="NONE">Sin Coach / Mantenimiento</option>
            <option value="COACH-1">Lucas Morilla (40% comisión)</option>
            <option value="COACH-2">Leo Marín (50% comisión)</option>
          </select>
        </div>

        <div>
          <label class="block font-bold mb-1">Detalle / Cliente</label>
          <input type="text" id="adm-slot-desc" required placeholder="Ej. Familia Ruiz / Limpieza de vidrios" class="w-full px-3 py-2 rounded-xl bg-vital-cream border font-semibold" />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border text-stone-600 font-bold">Cancelar</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-vital-lime text-vital-950 font-bold">Guardar en Calendario</button>
        </div>
      </form>
    </div>
  `);
}

function submitAdminCreateSlot(e) {
  e.preventDefault();
  const courtId = document.getElementById('adm-slot-court').value;
  const hour = Number(document.getElementById('adm-slot-hour').value);
  const service = document.getElementById('adm-slot-service').value;
  const coachId = document.getElementById('adm-slot-coach').value;
  const desc = document.getElementById('adm-slot-desc').value.trim();

  const coach = COACHES_DATA.find(c => c.id === coachId);
  const coachName = coach ? coach.name : 'Sin Coach';

  const amount = service === 'Mantenimiento' ? 0 : (service === 'Reta' ? 150 : 350);
  const split = calculateSplit(service, amount, coachId);

  // Eliminar slot previo si existía en esa hora
  state.reservations = state.reservations.filter(r => !(r.date === selectedDate && r.courtId === courtId && r.hour === hour));

  const newSlot = {
    id: 'RES-' + Date.now().toString().slice(-5),
    date: selectedDate,
    courtId,
    hour,
    duration: 1,
    service,
    customer: desc,
    phone: '-',
    amount,
    prestadorAmount: split.prestador,
    clienteAmount: split.cliente,
    coachId,
    coachName,
    paymentMethod: 'Recepción',
    notes: 'Asignado desde panel admin'
  };

  state.reservations.push(newSlot);
  dbInsertReservation(newSlot);

  saveState();
  closeModal();
  renderAdminMasterCalendar();
  renderCourtsGrid();
  showToast('Horario actualizado en el calendario maestro.');
}

function deleteReservationSlot(resId) {
  state.reservations = state.reservations.filter(r => r.id !== resId);
  dbDeleteReservation(resId);
  saveState();
  renderAdminMasterCalendar();
  renderCourtsGrid();
  renderHeroLiveStatus();
  showToast('Cancha liberada exitosamente.');
}

// ----------------------------------------------------------------------------
// CONTROL DE INGRESOS Y LIQUIDACIÓN DE COMISIONES
// ----------------------------------------------------------------------------
function renderAdminIncomeTable() {
  const body = document.getElementById('admin-income-table-body');
  if (!body) return;

  const filter = document.getElementById('income-filter-stream')?.value || 'all';

  let list = state.transactions;
  if (filter !== 'all') {
    list = list.filter(t => t.service === filter);
  }

  // Update payout balances
  const lucasTotal = state.transactions.filter(t => t.coachId === 'COACH-1').reduce((s, t) => s + Number(t.prestadorAmount || 0), 0);
  const leoTotal = state.transactions.filter(t => t.coachId === 'COACH-2').reduce((s, t) => s + Number(t.prestadorAmount || 0), 0);

  const lucasEl = document.getElementById('payout-lucas');
  const leoEl = document.getElementById('payout-leo');
  if (lucasEl) lucasEl.textContent = formatMXN(lucasTotal);
  if (leoEl) leoEl.textContent = formatMXN(leoTotal);

  body.innerHTML = list.map(t => `
    <tr class="hover:bg-vital-cream/50 text-xs">
      <td class="py-3 px-3 font-mono text-stone-400">${t.id}</td>
      <td class="py-3 px-3">${t.date} ${t.time}</td>
      <td class="py-3 px-3"><span class="px-2 py-0.5 rounded font-bold text-[10px] bg-stone-100">${t.service}</span></td>
      <td class="py-3 px-3 font-semibold text-vital-900">${t.concept}</td>
      <td class="py-3 px-3 text-stone-600">${t.coachName || '-'}</td>
      <td class="py-3 px-3 text-stone-500">${t.paymentMethod}</td>
      <td class="py-3 px-3 font-bold">${formatMXN(t.amount)}</td>
      <td class="py-3 px-3 font-bold text-vital-orange">${formatMXN(t.prestadorAmount)}</td>
      <td class="py-3 px-3 font-bold text-vital-green">${formatMXN(t.clienteAmount)}</td>
    </tr>
  `).join('');
}

function exportIncomeToCSV() {
  const rows = [
    ['Folio', 'Fecha', 'Hora', 'Servicio', 'Concepto', 'Cliente', 'Coach', 'Pago', 'Total', 'Prestador', 'Vital Club']
  ];

  state.transactions.forEach(t => {
    rows.push([
      t.id,
      t.date,
      t.time,
      t.service,
      `"${t.concept.replace(/"/g, '""')}"`,
      `"${t.customer.replace(/"/g, '""')}"`,
      t.coachName || '-',
      t.paymentMethod,
      t.amount,
      t.prestadorAmount,
      t.clienteAmount
    ]);
  });

  const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', `vital_club_ingresos_comisiones_${getTodayISO(0)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function renderAllAdminViews() {
  renderAdminDashboard();
  renderPosCatalog();
  renderPosCart();
  renderAdminMasterCalendar();
  renderAdminIncomeTable();
}

// ============================================================================
// MODAL HELPERS
// ============================================================================

function openModal(html) {
  const modal = document.getElementById('universal-modal');
  const content = document.getElementById('universal-modal-content');
  if (!modal || !content) return;
  content.innerHTML = html;
  modal.classList.remove('is-hidden', 'hidden');
  if (window.lucide) lucide.createIcons();
}

function closeModal() {
  document.getElementById('universal-modal')?.classList.add('is-hidden');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderAllClientViews();
  populateCoachSelector();

  const savedSession = getActiveStaffSession();
  if (savedSession && savedSession.role) {
    switchMainMode(savedSession.role);
  } else {
    switchMainMode('client');
  }

  if (window.lucide) lucide.createIcons();
  syncFromSupabase();
});
