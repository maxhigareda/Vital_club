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
    commissionRate: 0.40,
    clubRate: 0.60,
    hasBaseSalary: true,
    schemeLabel: '40% Prestador / 60% Club',
    specialty: 'Táctica, Torneos y Clínicas de Alto Rendimiento',
    bio: 'Prestador principal con amplia trayectoria formando jugadores en pista techada y coordinando clínicas integrales.',
    schedule: 'Lunes a Sábado · 8:00 AM – 8:00 PM'
  },
  {
    id: 'COACH-2',
    name: 'Leo Marín',
    role: 'Coach Infantil, Juvenil & Principiantes',
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
    description: 'Uso de cancha techada con cristal panorámico e iluminación LED. No genera comisión al prestador.'
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
    description: '1 hora de duración con cancha incluida. $100 Prestador / $150 Club con Lucas; $125 / $125 con Leo.'
  },
  {
    id: 'SERV-CLASE-1P',
    service: 'Clase',
    name: 'Clase Particular (1 Persona)',
    price: 500,
    badge: '1 hora · Cancha incluida',
    description: 'Atención 100% personalizada. $200 Prestador / $300 Club (Lucas) o $250 / $250 (Leo).'
  },
  {
    id: 'SERV-CLASE-2P',
    service: 'Clase',
    name: 'Clase en Pareja (2 Personas)',
    price: 600,
    badge: '$300 por persona',
    description: 'Trabajo táctico en pareja. $240 Prestador / $360 Club (Lucas) o $300 / $300 (Leo).'
  },
  {
    id: 'SERV-CLASE-3P',
    service: 'Clase',
    name: 'Clase Grupal (3 Personas)',
    price: 750,
    badge: '$250 por persona',
    description: 'Dinámica de juego y salidas de pared. $300 Prestador / $450 Club (Lucas) o $375 / $375 (Leo).'
  },
  {
    id: 'SERV-CLASE-4P',
    service: 'Clase',
    name: 'Clase Grupal (4 Personas)',
    price: 800,
    badge: '$200 por persona',
    description: 'Partido táctico guiado y volea. $320 Prestador / $480 Club (Lucas) o $400 / $400 (Leo).'
  },

  // 4. CLÍNICAS
  {
    id: 'SERV-CLINICA-ADULTO',
    service: 'Clínica',
    name: 'Clínica Mensual Adultos (8 Sesiones)',
    price: 1500,
    badge: '2 veces por semana',
    description: 'Mensualidad de 8 horas de entrenamiento. $600 Prestador / $900 Club (Lucas) o $750 / $750 (Leo).'
  },
  {
    id: 'SERV-CLINICA-NINO',
    service: 'Clínica',
    name: 'Clínica Mensual Niños (8 Sesiones)',
    price: 1200,
    badge: '2 veces por semana',
    description: 'Formación para niños y jóvenes. $480 Prestador / $720 Club (Lucas) o $600 / $600 (Leo).'
  },
  {
    id: 'SERV-CLINICA-ADULTO-DESC',
    service: 'Clínica',
    name: 'Clínica Adultos Familias Vital (-10%)',
    price: 1350,
    badge: 'Descuento Familiar',
    description: 'Tarifa con 10% de descuento al inscribirse 3+ familiares. $540 Prestador / $810 Club (Lucas).'
  },
  {
    id: 'SERV-CLINICA-NINO-DESC',
    service: 'Clínica',
    name: 'Clínica Niños Familias Vital (-10%)',
    price: 1080,
    badge: 'Descuento Familiar',
    description: 'Tarifa infantil con 10% descuento Familias Vital. $432 Prestador / $648 Club (Lucas).'
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
// MODE SWITCHING (CLIENTE · COACH · ADMIN)
// ============================================================================

function switchMainMode(mode) {
  const clientView = document.getElementById('view-client');
  const coachView = document.getElementById('view-coach');
  const adminView = document.getElementById('view-admin');
  const clientNav = document.getElementById('client-nav');

  const btnClient = document.getElementById('btn-mode-client');
  const btnCoach = document.getElementById('btn-mode-coach');
  const btnAdmin = document.getElementById('btn-mode-admin');

  const activeCls = 'px-3 py-1.5 rounded-lg bg-vital-lime text-vital-950 font-bold transition';
  const inactiveCls = 'px-3 py-1.5 rounded-lg text-vital-cream/75 hover:text-white transition';

  if (btnClient) btnClient.className = mode === 'client' ? activeCls : inactiveCls;
  if (btnCoach) btnCoach.className = mode === 'coach' ? activeCls : inactiveCls;
  if (btnAdmin) btnAdmin.className = mode === 'admin' ? activeCls : inactiveCls;

  clientView?.classList.toggle('is-hidden', mode !== 'client');
  coachView?.classList.toggle('is-hidden', mode !== 'coach');
  adminView?.classList.toggle('is-hidden', mode !== 'admin');

  if (clientView) clientView.style.display = mode === 'client' ? '' : 'none';
  if (coachView) coachView.style.display = mode === 'coach' ? '' : 'none';
  if (adminView) adminView.style.display = mode === 'admin' ? '' : 'none';

  if (mode === 'client') {
    clientNav?.classList.remove('is-hidden');
    if (clientNav) clientNav.style.display = '';
    renderAllClientViews();
  } else if (mode === 'coach') {
    clientNav?.classList.add('is-hidden');
    if (clientNav) clientNav.style.display = 'none';
    populateCoachSelector();
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
    <div class="bg-vital-950/80 rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-5">
      <div class="space-y-3">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-vital-lime text-vital-950 font-brand font-bold text-xl flex items-center justify-center">
            ${coach.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 class="font-brand text-2xl text-vital-cream font-bold">${coach.name}</h4>
            <p class="text-xs font-semibold text-vital-orange">${coach.role}</p>
          </div>
        </div>
        <p class="text-xs text-vital-cream/80 leading-relaxed">${coach.bio}</p>
      </div>

      <div class="pt-4 border-t border-white/10 space-y-1 text-xs">
        <div class="text-vital-cream/60">Especialidad: <span class="text-vital-cream font-medium">${coach.specialty}</span></div>
        <div class="text-vital-cream/60">Horarios: <span class="text-vital-lime font-medium">${coach.schedule}</span></div>
      </div>
    </div>
  `).join('');
}

function renderAllClientViews() {
  renderHeroLiveStatus();
  renderDateStrip();
  renderCourtsGrid();
  renderClientClasses();
  renderClientClinics();
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
            <option value="COACH-1">Lucas Morilla (Head Coach · 40% com.)</option>
            <option value="COACH-2">Leo Marín (Coach Infantil/Principiantes · 50% com.)</option>
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
            <option value="COACH-1">Lucas Morilla (Director Deportivo · 40% com.)</option>
            <option value="COACH-2">Leo Marín (Infantil & Juvenil · 50% com.)</option>
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
  if (window.lucide) lucide.createIcons();
  syncFromSupabase();
});
