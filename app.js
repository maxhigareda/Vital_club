// ============================================================================
// VITAL CLUB · PÁDEL, CLASES, ZONA DE COMIDA, COACH & ADMIN (MINIMAL LUXURY UI)
// ============================================================================

const STORAGE_KEY = 'vital_club_zitacuaro_v2';

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

function buildInitialState() {
  const today = getTodayISO(0);
  const tomorrow = getTodayISO(1);

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
          badge: '100% Techada',
          hourlyRate: 400,
          description: 'Cancha principal techada con iluminación LED y cristal panorámico.'
        },
        {
          id: 'cancha-2',
          name: 'Cancha Techada 2 · Vital Familiar',
          shortName: 'Cancha Techada 2',
          badge: '100% Techada',
          hourlyRate: 400,
          description: 'Cancha techada conectada a la zona de comida y lounge familiar.'
        }
      ]
    },

    reservations: [
      {
        id: 'RES-101',
        date: today,
        courtId: 'cancha-1',
        hour: 9,
        duration: 1,
        customer: 'Familia Hernández',
        phone: '715 112 3490',
        type: 'Reserva',
        amount: 400,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Partido familiar (2 adultos y 2 niños)'
      },
      {
        id: 'RES-102',
        date: today,
        courtId: 'cancha-2',
        hour: 10,
        duration: 1,
        customer: 'Vital Senior (Adultos Mayores)',
        phone: '715 131 7443',
        type: 'Clase',
        coachId: 'COACH-3',
        coachName: 'Roberto Domínguez',
        students: ['Sra. Carmen', 'Don Jorge', 'Sra. Elena', 'Don Raúl'],
        attendanceChecked: true,
        amount: 550,
        status: 'Pagado',
        paymentMethod: 'Efectivo',
        notes: 'Clínica matutina de bajo impacto'
      },
      {
        id: 'RES-107',
        date: today,
        courtId: 'cancha-1',
        hour: 11,
        duration: 1,
        customer: 'Clínica Técnica Parejas',
        phone: '715 131 7443',
        type: 'Clase',
        coachId: 'COACH-1',
        coachName: 'Alejandro "Alex" Vega',
        students: ['Fernando Soto', 'Andrea Soto', 'Luis Mendoza', 'Carla Ruiz'],
        attendanceChecked: false,
        amount: 420,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Bandeja y salida de pared'
      },
      {
        id: 'MANT-101',
        date: today,
        courtId: 'cancha-2',
        hour: 13,
        duration: 1,
        customer: 'Mantenimiento Preventivo',
        phone: 'Staff Vital Club',
        type: 'Mantenimiento',
        amount: 0,
        status: 'Bloqueado',
        paymentMethod: 'N/A',
        notes: 'Cepillado de pasto sintético y revisión de red'
      },
      {
        id: 'RES-103',
        date: today,
        courtId: 'cancha-1',
        hour: 16,
        duration: 1,
        customer: 'Pádel Kids (Niños)',
        phone: '715 131 7443',
        type: 'Clase',
        coachId: 'COACH-2',
        coachName: 'Sofía Morales',
        students: ['Mateo Gómez', 'Valentina Piña', 'Santi Ruiz', 'Emilio Landa'],
        attendanceChecked: false,
        amount: 650,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Coordinación infantil y juegos'
      },
      {
        id: 'RES-104',
        date: today,
        courtId: 'cancha-2',
        hour: 17,
        duration: 1,
        customer: 'Carlos Piña & Amigos',
        phone: '715 204 8821',
        type: 'Reserva',
        amount: 480,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Incluye renta de 1 pala ($80)'
      },
      {
        id: 'RES-108',
        date: today,
        courtId: 'cancha-2',
        hour: 18,
        duration: 1,
        customer: 'Academia Intermedios',
        phone: '715 131 7443',
        type: 'Clase',
        coachId: 'COACH-1',
        coachName: 'Alejandro "Alex" Vega',
        students: ['Diego Navarro', 'Pablo Herrera', 'Miguel Ángel', 'Rodrigo Paz'],
        attendanceChecked: false,
        amount: 480,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Táctica de red y definición'
      },
      {
        id: 'RES-106',
        date: tomorrow,
        courtId: 'cancha-1',
        hour: 11,
        duration: 1,
        customer: 'Dr. Roberto Guzmán y Nieto',
        phone: '715 301 1170',
        type: 'Reserva',
        amount: 400,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Partido familiar'
      }
    ],

    programs: [
      {
        id: 'PROG-1',
        title: 'Pádel Kids (4 a 12 años)',
        category: 'Niños y Familia',
        schedule: 'Lun, Mié y Vie · 4:00 PM',
        coach: 'Coach Sofía Morales',
        ageRange: 'Niños (4–12 años)',
        price: 650,
        priceLabel: 'Mensualidad o $180 por sesión',
        spotsTotal: 12,
        spotsTaken: 8,
        court: 'Cancha Techada 1',
        description: 'Coordinación, diversión y fundamentos del pádel en un ambiente 100% seguro y techado. Incluye préstamo de pala infantil.'
      },
      {
        id: 'PROG-2',
        title: 'Clínica 100% Familiar',
        category: 'Niños y Familia',
        schedule: 'Sábados y Domingos · 10:00 AM',
        coach: 'Coach Alejandro "Alex" Vega',
        ageRange: 'Todas las edades',
        price: 420,
        priceLabel: 'Pase familiar (hasta 4 integrantes)',
        spotsTotal: 8,
        spotsTaken: 5,
        court: 'Cancha Techada 2',
        description: 'Aprendan y jueguen juntos padres, hijos y abuelos con dinámicas diseñadas para convivir en familia.'
      },
      {
        id: 'PROG-3',
        title: 'Vital Senior · Adultos Mayores',
        category: 'Adultos y Seniors',
        schedule: 'Martes y Jueves · 10:00 AM',
        coach: 'Coach Roberto Domínguez',
        ageRange: 'Adultos Mayores (55+)',
        price: 550,
        priceLabel: 'Mensualidad · Bajo impacto',
        spotsTotal: 10,
        spotsTaken: 6,
        court: 'Cancha Techada 2',
        description: 'Movilidad, salud articular, convivencia y técnica de pádel a ritmo amigable.'
      },
      {
        id: 'PROG-4',
        title: 'Academia Adultos Intermedios',
        category: 'Adultos y Seniors',
        schedule: 'Martes y Jueves · 6:00 PM',
        coach: 'Coach Alejandro "Alex" Vega',
        ageRange: 'Jóvenes y Adultos',
        price: 240,
        priceLabel: 'Por sesión de 90 min',
        spotsTotal: 8,
        spotsTaken: 6,
        court: 'Cancha Techada 1',
        description: 'Perfecciona bandeja, salida de pared y táctica en pareja.'
      },
      {
        id: 'PROG-5',
        title: 'Torneo Relámpago Familiar',
        category: 'Torneos',
        schedule: 'Sábados · 4:00 PM – 8:00 PM',
        coach: 'Staff Vital Club',
        ageRange: 'Categoría Recreativa y Mixta',
        price: 500,
        priceLabel: 'Por pareja (3 partidos garantizados)',
        spotsTotal: 16,
        spotsTaken: 12,
        court: 'Canchas Techadas 1 y 2',
        description: 'Formato americano dinámico bajo techo con hidratación incluida y premios en nuestra Zona de Comida.'
      },
      {
        id: 'PROG-6',
        title: 'Pre-registro: Barre & Gym Vital',
        category: 'Adultos y Seniors',
        schedule: 'Próxima Apertura · Pase Fundador',
        coach: 'Equipo Vital Wellness',
        ageRange: 'Jóvenes y Adultos',
        price: 350,
        priceLabel: 'Tarifa preferencial de lanzamiento',
        spotsTotal: 25,
        spotsTaken: 14,
        court: 'Nuevo Estudio Vital',
        description: 'Forma parte de las nuevas experiencias que estamos integrando en Vital Club: Barre, Gym y Cocina.'
      }
    ],

    catalog: [
      {
        id: 'FOOD-1',
        name: 'Club Sándwich Vital',
        category: 'Sándwiches y Comida',
        price: 135,
        badge: 'Favorito',
        description: 'Pavo ahumado, tocino crujiente, queso gouda y aguacate en pan artesanal tostado.'
      },
      {
        id: 'FOOD-2',
        name: 'Baguette Serrano & Pesto',
        category: 'Sándwiches y Comida',
        price: 145,
        badge: 'Gourmet',
        description: 'Jamón serrano, mozzarella fresca, jitomate deshidratado y pesto de albahaca.'
      },
      {
        id: 'FOOD-3',
        name: 'Panini Pollo & Panela',
        category: 'Sándwiches y Comida',
        price: 125,
        badge: 'Ligero',
        description: 'Pechuga a la plancha, queso panela asado, espinaca baby y aderezo suave.'
      },
      {
        id: 'FOOD-4',
        name: 'Mini Sándwich Kids',
        category: 'Sándwiches y Comida',
        price: 85,
        badge: 'Niños',
        description: 'Sándwich suave de jamón y queso derretido acompañado de papas horneadas.'
      },
      {
        id: 'DRINK-1',
        name: 'Smoothie Match-Point',
        category: 'Bebidas y Café',
        price: 78,
        badge: 'Natural',
        description: 'Fruta natural recién licuada (Verde o Mango-Maracuyá).'
      },
      {
        id: 'DRINK-2',
        name: 'Cold Brew / Latte Frío',
        category: 'Bebidas y Café',
        price: 68,
        badge: 'Café',
        description: 'Café de especialidad frío o con leche a elegir.'
      },
      {
        id: 'DRINK-3',
        name: 'Hidratante / Electrolitos',
        category: 'Bebidas y Café',
        price: 45,
        badge: 'Sport',
        description: 'Hidratación deportiva bien fría.'
      },
      {
        id: 'POS-RENT-1',
        name: 'Renta de Pala Pro',
        category: 'Renta y Accesorios',
        price: 80,
        badge: 'Por Partido',
        description: 'Pala profesional para adulto o ligera para niño/adulto mayor.'
      },
      {
        id: 'POS-RENT-2',
        name: 'Tubo de 3 Pelotas Nuevas',
        category: 'Renta y Accesorios',
        price: 195,
        badge: 'Oficial',
        description: 'Bote nuevo de 3 pelotas de pádel.'
      },
      {
        id: 'POS-COURT-1',
        name: 'Hora Cancha Techada (POS)',
        category: 'Canchas y Clases',
        price: 400,
        badge: 'Mostrador',
        description: 'Cobro rápido de 1 hora de cancha en recepción.'
      }
    ],

    coaches: [
      {
        id: 'COACH-1',
        name: 'Alejandro "Alex" Vega',
        role: 'Head Coach & Director Deportivo',
        specialty: 'Clínicas Familiares, Táctica y Torneos',
        experience: '8 años de experiencia · Certificado FMP',
        bio: 'Especialista en integrar a familias completas dentro de la cancha y elevar el nivel competitivo de forma clara y dinámica.',
        schedule: 'Lun a Sáb · 9:00 AM a 8:00 PM'
      },
      {
        id: 'COACH-2',
        name: 'Sofía Morales',
        role: 'Coach Pádel Kids & Iniciación',
        specialty: 'Niños pequeños (4 a 12 años) y Principiantes',
        experience: 'Lic. en Educación Física · Especialista Infantil',
        bio: 'Experta en psicomotricidad y enseñanza lúdica para que los niños aprendan seguro y felices.',
        schedule: 'Lun a Vie · 3:00 PM a 7:00 PM'
      },
      {
        id: 'COACH-3',
        name: 'Roberto Domínguez',
        role: 'Coach Vital Senior & Control',
        specialty: 'Adultos Mayores Activos y Técnica',
        experience: '10 años en deportes de raqueta',
        bio: 'Diseña sesiones seguras de bajo impacto ideales para adultos mayores que buscan salud, movilidad y gran convivencia.',
        schedule: 'Mar, Jue y Fin de Semana · 8:00 AM a 2:00 PM'
      }
    ],

    transactions: [
      {
        id: 'VC-1001',
        date: today,
        time: '08:50 AM',
        stream: 'Reservaciones',
        concept: 'Cancha Techada 1 (9:00 AM)',
        customer: 'Familia Hernández',
        paymentMethod: 'Tarjeta',
        amount: 400,
        status: 'Pagado'
      },
      {
        id: 'VC-1002',
        date: today,
        time: '09:45 AM',
        stream: 'Clases y Torneos',
        concept: 'Vital Senior · Adultos Mayores',
        customer: 'Sra. Carmen y Grupo',
        paymentMethod: 'Efectivo',
        amount: 550,
        status: 'Pagado'
      },
      {
        id: 'VC-1003',
        date: today,
        time: '11:15 AM',
        stream: 'Comida y Bebidas',
        concept: '2x Club Sándwich Vital + 2x Smoothie',
        customer: 'Familia Hernández',
        paymentMethod: 'Tarjeta',
        amount: 426,
        status: 'Pagado'
      },
      {
        id: 'VC-1004',
        date: today,
        time: '03:55 PM',
        stream: 'Clases y Torneos',
        concept: 'Mensualidad Pádel Kids · Mateo Gómez',
        customer: 'Laura Gómez',
        paymentMethod: 'Tarjeta',
        amount: 650,
        status: 'Pagado'
      },
      {
        id: 'VC-1005',
        date: today,
        time: '05:00 PM',
        stream: 'Reservaciones',
        concept: 'Cancha Techada 2 (5:00 PM) + Pala',
        customer: 'Carlos Piña',
        paymentMethod: 'Tarjeta',
        amount: 480,
        status: 'Pagado'
      }
    ]
  };
}

let state = loadState();
let selectedDate = getTodayISO(0);
let currentProgramFilter = 'all';
let currentFoodFilter = 'all';
let currentPosCategory = 'all';
let posCart = [];
let clientFoodCart = [];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.settings || !Array.isArray(parsed.programs) || !Array.isArray(parsed.catalog) || parsed.catalog.length === 0) {
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
  const coachNav = document.getElementById('coach-nav');
  const adminNav = document.getElementById('admin-nav');
  const clientCartBtn = document.getElementById('client-cart-btn');

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

  if (mode === 'client') {
    clientNav?.classList.remove('is-hidden');
    coachNav?.classList.add('is-hidden');
    coachNav?.classList.remove('md:flex');
    adminNav?.classList.add('is-hidden');
    adminNav?.classList.remove('md:flex');
    clientCartBtn?.classList.remove('is-hidden');
    renderAllClientViews();
  } else if (mode === 'coach') {
    clientNav?.classList.add('is-hidden');
    coachNav?.classList.remove('is-hidden');
    coachNav?.classList.add('md:flex');
    adminNav?.classList.add('is-hidden');
    adminNav?.classList.remove('md:flex');
    clientCartBtn?.classList.add('is-hidden');
    populateCoachSelector();
    renderCoachView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    clientNav?.classList.add('is-hidden');
    coachNav?.classList.add('is-hidden');
    coachNav?.classList.remove('md:flex');
    adminNav?.classList.remove('is-hidden');
    adminNav?.classList.add('md:flex');
    clientCartBtn?.classList.add('is-hidden');
    renderAllAdminViews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (window.lucide) lucide.createIcons();
}

function switchAdminTab(tabName) {
  const tabs = ['dashboard', 'pos', 'registro', 'ingresos'];
  const titles = {
    dashboard: 'Dashboard y Números',
    pos: 'Punto de Venta (POS)',
    registro: 'Calendario Maestro de Canchas',
    ingresos: 'Ingresos y Catálogo'
  };

  tabs.forEach(t => {
    document.getElementById(`admin-tab-${t}`)?.classList.toggle('is-hidden', t !== tabName);
  });

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-admin-tab') === tabName;
    btn.className = isAct
      ? 'admin-tab-btn px-3.5 py-1.5 rounded-lg bg-vital-lime text-vital-950 font-bold transition shrink-0'
      : 'admin-tab-btn px-3.5 py-1.5 rounded-lg text-vital-cream/75 hover:text-white transition shrink-0';
  });

  const titleEl = document.getElementById('admin-header-title');
  if (titleEl && titles[tabName]) titleEl.textContent = titles[tabName];

  renderAllAdminViews();
}

// ============================================================================
// CLIENT VIEWS: ULTRA-CLEAN & MODAL-DRIVEN
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
      <a href="#reservar" class="bg-vital-950/85 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-vital-cream hover:border-vital-lime transition">
        <div class="text-xs font-bold truncate">${court.shortName}</div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-[11px] text-vital-lime font-bold">${free} hrs libres</span>
          <span class="text-[11px] text-vital-cream/70">$${court.hourlyRate}/h</span>
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
      <button onclick="selectBookingDate('${d.iso}')" class="px-4 py-2 rounded-2xl border text-left transition shrink-0 ${
        active
          ? 'bg-vital-900 text-vital-cream border-vital-900 shadow-sm'
          : 'bg-white hover:bg-vital-sand/60 text-vital-900 border-vital-900/10'
      }">
        <span class="text-[10px] uppercase font-bold block ${active ? 'text-vital-lime' : 'text-vital-900/50'}">${d.dayName}</span>
        <span class="text-xs font-extrabold">${d.dayNum} ${d.month}</span>
      </button>
    `;
  }).join('');

  if (strip) strip.innerHTML = html;
  if (coachStrip) coachStrip.innerHTML = html;
}

function selectBookingDate(iso) {
  selectedDate = iso;
  renderDateStrip();
  renderClientCourtsGrid();
  renderCoachView();
  renderAdminCourtsSchedule();
  renderAdminDashboard();
}

function handleDateInputChange(val) {
  if (val) selectBookingDate(val);
}

// Minimal Hour-Chip Grid for Client Reservations
function renderClientCourtsGrid() {
  const container = document.getElementById('client-courts-container');
  if (!container) return;

  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hours = [];
  for (let h = openH; h < closeH; h++) hours.push(h);

  container.innerHTML = state.settings.courts.map(court => {
    const dayBookings = state.reservations.filter(r => r.date === selectedDate && r.courtId === court.id);
    const freeCount = hours.length - dayBookings.length;

    const pills = hours.map(hr => {
      const booking = dayBookings.find(r => Number(r.hour) === hr);
      const label = formatHourLabel(hr);

      if (!booking) {
        return `
          <button onclick="openBookingModal('${court.id}', ${hr})" class="hour-pill p-3 rounded-2xl border border-emerald-500/25 bg-emerald-50/50 hover:bg-vital-lime hover:border-vital-900 text-left transition group">
            <div class="text-xs font-extrabold text-vital-900">${label}</div>
            <div class="text-[11px] font-semibold text-emerald-800 group-hover:text-vital-950 mt-0.5">Libre · $${court.hourlyRate}</div>
          </button>
        `;
      }

      if (booking.type === 'Mantenimiento') {
        return `
          <button onclick="openSlotInfoModal('${booking.id}')" class="hour-pill p-3 rounded-2xl border border-amber-300 bg-amber-50/80 text-left">
            <div class="text-xs font-bold text-amber-950">${label}</div>
            <div class="text-[11px] font-semibold text-amber-700 truncate mt-0.5">🔧 Mant.</div>
          </button>
        `;
      }

      const isClass = booking.type === 'Clase' || booking.type === 'Torneo';
      return `
        <button onclick="openSlotInfoModal('${booking.id}')" class="hour-pill p-3 rounded-2xl border ${
          isClass ? 'border-vital-orange/30 bg-orange-50/70 text-vital-950' : 'border-stone-200 bg-stone-100 text-stone-500'
        } text-left">
          <div class="text-xs font-bold">${label}</div>
          <div class="text-[11px] font-semibold truncate mt-0.5">${isClass ? '🏆 Clase' : 'Ocupada'}</div>
        </button>
      `;
    }).join('');

    return `
      <div class="card-luxury rounded-3xl p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-vital-700">☔ ${court.badge}</span>
            <h3 class="font-brand text-2xl text-vital-900">${court.shortName}</h3>
          </div>
          <div class="text-right">
            <span class="font-brand text-xl text-vital-900">$${court.hourlyRate}<span class="text-xs font-sans text-stone-500">/hr</span></span>
            <span class="block text-[11px] font-bold text-emerald-700">${freeCount} disponibles</span>
          </div>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          ${pills}
        </div>
      </div>
    `;
  }).join('');
}

// Modal when user clicks an occupied / class / maintenance slot
function openSlotInfoModal(resId) {
  const b = state.reservations.find(r => r.id === resId);
  if (!b) return;
  const court = state.settings.courts.find(c => c.id === b.courtId);

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase ${b.type === 'Mantenimiento' ? 'text-amber-700' : 'text-vital-orange'}">${b.type}</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${b.customer}</h3>
          <p class="text-xs text-stone-500">${court ? court.shortName : ''} · ${formatHourLabel(b.hour)} – ${formatHourLabel(b.hour + 1)}</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <div class="bg-vital-cream p-4 rounded-2xl text-xs space-y-1.5">
        ${b.coachName ? `<div><strong>Entrenador:</strong> ${b.coachName}</div>` : ''}
        <div><strong>Estado:</strong> ${b.type === 'Mantenimiento' ? 'Cerrada por mantenimiento' : 'Horario apartado'}</div>
        ${b.notes ? `<div><strong>Detalle:</strong> ${b.notes}</div>` : ''}
      </div>

      <div class="flex justify-end">
        <button onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-vital-900 text-vital-cream text-xs font-bold">Entendido</button>
      </div>
    </div>
  `);
}

// ============================================================================
// CLASES Y TORNEOS (MINIMAL CARDS -> DETAIL & CHECKOUT MODAL)
// ============================================================================

function filterPrograms(category) {
  currentProgramFilter = category;
  document.querySelectorAll('.prog-filter-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-prog-filter') === category;
    btn.className = isAct
      ? 'prog-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-vital-900 text-vital-cream transition'
      : 'prog-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-vital-900/70 hover:text-vital-900 transition';
  });
  renderClientPrograms();
}

function renderClientPrograms() {
  const grid = document.getElementById('client-programs-grid');
  if (!grid) return;

  const list = state.programs.filter(p => currentProgramFilter === 'all' || p.category === currentProgramFilter);

  grid.innerHTML = list.map(prog => {
    const spotsLeft = Math.max(0, prog.spotsTotal - prog.spotsTaken);
    return `
      <div onclick="openProgramEnrollModal('${prog.id}')" class="card-luxury rounded-3xl p-6 cursor-pointer flex flex-col justify-between group">
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-[11px] font-bold">
            <span class="text-vital-orange uppercase tracking-wider">${prog.category}</span>
            <span class="text-emerald-700">${spotsLeft} lugares</span>
          </div>
          <h3 class="font-brand text-xl text-vital-900 group-hover:text-vital-700 transition">${prog.title}</h3>
          <p class="text-xs text-stone-500 font-medium">${prog.schedule}</p>
        </div>

        <div class="pt-4 mt-5 border-t border-stone-100 flex items-center justify-between">
          <span class="font-brand text-xl text-vital-900">$${prog.price} <span class="text-[11px] font-sans text-stone-400">MXN</span></span>
          <span class="text-xs font-bold text-vital-900 group-hover:translate-x-1 transition inline-flex items-center gap-1">
            Ver e Inscribirme →
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// ZONA DE COMIDA (MINIMAL CARDS -> DETAIL MODAL OR QUICK ADD)
// ============================================================================

function filterFoodMenu(cat) {
  currentFoodFilter = cat;
  document.querySelectorAll('.food-filter-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-food-filter') === cat;
    btn.className = isAct
      ? 'food-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-vital-900 text-vital-cream transition'
      : 'food-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-vital-900/70 hover:text-vital-900 transition';
  });
  renderClientFoodGrid();
}

function renderClientFoodGrid() {
  const grid = document.getElementById('client-food-grid');
  if (!grid) return;

  const items = state.catalog.filter(item => {
    if (item.category === 'Canchas y Clases') return false;
    return currentFoodFilter === 'all' || item.category === currentFoodFilter;
  });

  grid.innerHTML = items.map(item => {
    const emoji = item.category.includes('Sándwiches') ? '🥪' : item.category.includes('Bebidas') ? '🥤' : '🏓';
    return `
      <div class="card-luxury rounded-3xl p-5 flex flex-col justify-between">
        <div onclick="openFoodDetailModal('${item.id}')" class="cursor-pointer">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-bold text-stone-400 uppercase text-[10px] tracking-wider">${item.badge || item.category}</span>
            <span>${emoji}</span>
          </div>
          <h3 class="font-brand text-lg text-vital-900 leading-snug hover:text-vital-700 transition">${item.name}</h3>
        </div>

        <div class="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between">
          <span class="font-brand text-lg text-vital-900">$${item.price}</span>
          <div class="flex items-center gap-1.5">
            <button onclick="openFoodDetailModal('${item.id}')" class="px-2.5 py-1.5 rounded-xl bg-vital-cream text-vital-900 text-[11px] font-bold">Detalle</button>
            <button onclick="addToClientFoodCart('${item.id}')" class="px-3 py-1.5 rounded-xl bg-vital-900 text-vital-lime text-[11px] font-bold">+ Pedir</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openFoodDetailModal(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase text-vital-orange">${item.category}</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${item.name}</h3>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>
      <p class="text-sm text-stone-600 leading-relaxed">${item.description || 'Preparado al momento en la Zona de Comida de Vital Club.'}</p>
      <div class="flex items-center justify-between pt-3 border-t border-stone-100">
        <span class="font-brand text-2xl text-vital-900">${formatMXN(item.price)}</span>
        <button onclick="addToClientFoodCart('${item.id}'); closeModal();" class="px-5 py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs">
          + Agregar a mi Pedido
        </button>
      </div>
    </div>
  `);
}

function addToClientFoodCart(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;
  const ex = clientFoodCart.find(c => c.id === itemId);
  if (ex) ex.qty += 1;
  else clientFoodCart.push({ ...item, qty: 1 });
  updateClientCartBadge();
  showToast(`Agregado: ${item.name}`);
}

function updateClientCartBadge() {
  const badge = document.getElementById('client-cart-count');
  if (!badge) return;
  const count = clientFoodCart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = count;
  badge.classList.toggle('is-hidden', count === 0);
}

function openClientFoodCart() {
  if (clientFoodCart.length === 0) {
    showToast('Tu carrito está vacío. Selecciona alimentos en la Zona de Comida.');
    document.getElementById('comida')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const total = clientFoodCart.reduce((s, i) => s + i.price * i.qty, 0);
  const rows = clientFoodCart.map(item => `
    <div class="flex items-center justify-between py-2 border-b border-stone-100 text-xs">
      <div>
        <span class="font-bold text-vital-900">${item.qty}x ${item.name}</span>
        <span class="text-stone-400 ml-1">($${item.price})</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-bold">$${item.qty * item.price}</span>
        <button onclick="removeClientFoodItem('${item.id}')" class="text-rose-600 font-bold">✕</button>
      </div>
    </div>
  `).join('');

  openModal(`
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 class="font-brand text-2xl text-vital-900">Tu Pedido · Zona de Comida</h3>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>
      <div class="max-h-48 overflow-y-auto">${rows}</div>
      <form onsubmit="submitClientFoodOrder(event)" class="space-y-3">
        <div class="grid sm:grid-cols-2 gap-2.5">
          <input type="text" id="food-order-name" required placeholder="Tu nombre o familia *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
          <input type="text" id="food-order-note" placeholder="¿Para qué cancha o mesa?" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
        </div>
        <select id="food-order-pay" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-bold">
          <option value="Tarjeta">💳 Pagar con Tarjeta (${formatMXN(total)})</option>
          <option value="Efectivo">💵 Pagar en Barra al recoger (${formatMXN(total)})</option>
        </select>
        <div class="flex items-center justify-between pt-2">
          <span class="font-brand text-2xl text-vital-900">${formatMXN(total)}</span>
          <button type="submit" class="px-5 py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs">Confirmar Pedido</button>
        </div>
      </form>
    </div>
  `);
}

function removeClientFoodItem(id) {
  clientFoodCart = clientFoodCart.filter(i => i.id !== id);
  updateClientCartBadge();
  if (clientFoodCart.length === 0) closeModal();
  else openClientFoodCart();
}

function submitClientFoodOrder(e) {
  e.preventDefault();
  const customer = document.getElementById('food-order-name').value.trim();
  const note = document.getElementById('food-order-note').value.trim();
  const paymentMethod = document.getElementById('food-order-pay').value;
  const total = clientFoodCart.reduce((s, i) => s + i.price * i.qty, 0);
  const summary = clientFoodCart.map(i => `${i.qty}x ${i.name}`).join(', ');

  const newTx = {
    id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
    date: getTodayISO(0),
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream: 'Comida y Bebidas',
    concept: `${summary}${note ? ' · ' + note : ''}`,
    customer,
    paymentMethod,
    amount: total,
    status: 'Pagado'
  };

  state.transactions.unshift(newTx);
  clientFoodCart = [];
  updateClientCartBadge();
  saveState();
  showReceiptModal(newTx, 'Pedido Confirmado');
}

// ============================================================================
// COACHES & CLUB INFO MODALS (LOW COGNITIVE LOAD)
// ============================================================================

function renderClientCoaches() {
  const grid = document.getElementById('client-coaches-grid');
  if (!grid) return;

  grid.innerHTML = state.coaches.map(coach => {
    const initials = coach.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    return `
      <div onclick="openCoachProfileModal('${coach.id}')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 cursor-pointer transition flex items-center justify-between gap-4">
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-12 h-12 rounded-2xl bg-vital-lime text-vital-950 font-brand text-lg flex items-center justify-center shrink-0">
            ${initials}
          </div>
          <div class="min-w-0">
            <h4 class="font-brand text-lg text-vital-cream truncate">${coach.name}</h4>
            <p class="text-xs text-vital-cream/60 truncate">${coach.role}</p>
          </div>
        </div>
        <span class="text-xs font-bold text-vital-lime shrink-0">Ver →</span>
      </div>
    `;
  }).join('');
}

function openCoachProfileModal(coachId) {
  const coach = state.coaches.find(c => c.id === coachId);
  if (!coach) return;

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase text-vital-orange">${coach.role}</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${coach.name}</h3>
          <p class="text-xs text-stone-500">${coach.experience}</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>
      <p class="text-sm text-stone-600 leading-relaxed">${coach.bio}</p>
      <div class="bg-vital-cream p-4 rounded-2xl text-xs space-y-1">
        <div><strong>Especialidad:</strong> ${coach.specialty}</div>
        <div><strong>Horario:</strong> ${coach.schedule}</div>
      </div>
      <div class="flex items-center justify-between pt-2">
        <button onclick="closeModal()" class="px-4 py-2.5 rounded-xl bg-stone-100 text-xs font-bold">Cerrar</button>
        <a href="https://wa.me/527151317443?text=${encodeURIComponent('Hola Vital Club, me gustaría agendar clase con ' + coach.name)}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl bg-vital-900 text-vital-lime text-xs font-bold">
          Agendar por WhatsApp
        </a>
      </div>
    </div>
  `);
}

function openClubInfoModal() {
  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase text-vital-700">Zitácuaro, Michoacán</span>
          <h3 class="font-brand text-2xl text-vital-900">Ubicación, Horarios y Amenidades</h3>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <div class="grid grid-cols-2 gap-2.5 text-xs">
        <div class="bg-vital-cream p-3.5 rounded-2xl">
          <strong class="block text-vital-900 mb-0.5">📍 Dirección</strong>
          <span class="text-stone-600">Andrés Landa y Piña Nte. 26, Col. Cuauhtémoc, Zitácuaro, Mich., 61506</span>
        </div>
        <div class="bg-vital-cream p-3.5 rounded-2xl">
          <strong class="block text-vital-900 mb-0.5">🕒 Horarios</strong>
          <span class="text-stone-600">Lun a Vie: 8:00 AM – 8:00 PM<br>Sáb y Dom: 8:00 AM – 8:00 PM</span>
        </div>
      </div>

      <div class="rounded-2xl overflow-hidden border border-stone-200 h-48">
        <iframe
          title="Mapa Vital Club"
          class="w-full h-full"
          loading="lazy"
          src="https://www.google.com/maps?q=Andr%C3%A9s+Landa+y+Pi%C3%B1a+Nte.+26,+Cuauht%C3%A9moc,+61506+Her%C3%B3ica+Zit%C3%A1cuaro,+Mich.,+Mexico&output=embed">
        </iframe>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
        <a href="tel:7151317443" class="px-4 py-2.5 rounded-xl bg-vital-900 text-vital-lime text-xs font-bold">📞 715 131 7443</a>
        <a href="https://www.instagram.com/vitalclub.zit/" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-stone-100 text-vital-900 text-xs font-bold">Instagram @vitalclub.zit</a>
        <a href="https://web.facebook.com/profile.php?id=61584920653779&sk=about" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-stone-100 text-vital-900 text-xs font-bold">Facebook</a>
      </div>
    </div>
  `);
}

// ============================================================================
// BOOKING & PROGRAM ENROLLMENT MODALS (WITH CARD PAYMENT)
// ============================================================================

function openBookingModal(courtId, hour) {
  const court = state.settings.courts.find(c => c.id === courtId) || state.settings.courts[0];
  const basePrice = Number(court.hourlyRate) || 400;

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase text-emerald-700">☔ ${court.shortName}</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${formatHourLabel(hour)} – ${formatHourLabel(hour + 1)}</h3>
          <p class="text-xs text-stone-500">Fecha: ${selectedDate}</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <form onsubmit="confirmCourtBooking(event, '${court.id}', ${hour})" class="space-y-3.5">
        <div class="grid sm:grid-cols-2 gap-2.5">
          <input type="text" id="book-customer" required placeholder="Nombre completo *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
          <input type="tel" id="book-phone" required placeholder="Teléfono / WhatsApp *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
        </div>

        <div class="grid sm:grid-cols-2 gap-2.5">
          <select id="book-notes" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold">
            <option value="Partido Familiar">👨‍👩‍👧‍👦 Partido Familiar</option>
            <option value="Partido Amistoso">🎾 Partido Amistoso</option>
            <option value="Práctica con Niños">🧒 Práctica con Niños</option>
            <option value="Adultos Mayores">🤍 Adultos Mayores</option>
          </select>
          <select id="book-extra" onchange="recalcBookingModalTotal(${basePrice})" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold">
            <option value="0">Sin extras ($0)</option>
            <option value="80">+ Renta 1 Pala (+$80)</option>
            <option value="160">+ Renta 2 Palas (+$160)</option>
            <option value="195">+ Tubo Pelotas (+$195)</option>
          </select>
        </div>

        <div class="bg-vital-cream p-3.5 rounded-2xl space-y-2.5">
          <select id="book-payment-method" onchange="toggleCardInputs('book-card-fields', this.value)" class="w-full px-3 py-2 rounded-xl bg-white text-xs font-bold">
            <option value="Tarjeta">💳 Pagar con Tarjeta (Visa / MC / Amex)</option>
            <option value="Efectivo">💵 Pagar en Recepción</option>
            <option value="Transferencia">📲 Transferencia</option>
          </select>
          <div id="book-card-fields" class="grid grid-cols-12 gap-2">
            <input type="text" placeholder="Número de tarjeta" maxlength="19" class="col-span-12 px-3 py-2 rounded-xl bg-white text-xs" />
            <input type="text" placeholder="MM/AA" maxlength="5" class="col-span-6 px-3 py-2 rounded-xl bg-white text-xs" />
            <input type="password" placeholder="CVV" maxlength="4" class="col-span-6 px-3 py-2 rounded-xl bg-white text-xs" />
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-stone-100">
          <span id="book-modal-total" class="font-brand text-2xl text-vital-900">$${basePrice} MXN</span>
          <button type="submit" class="px-6 py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs shadow-md">
            Confirmar Reserva
          </button>
        </div>
      </form>
    </div>
  `);
}

function recalcBookingModalTotal(basePrice) {
  const extra = Number(document.getElementById('book-extra')?.value || 0);
  const el = document.getElementById('book-modal-total');
  if (el) el.textContent = `$${basePrice + extra} MXN`;
}

function toggleCardInputs(containerId, method) {
  document.getElementById(containerId)?.classList.toggle('hidden', method !== 'Tarjeta');
}

function confirmCourtBooking(e, courtId, hour) {
  e.preventDefault();
  const court = state.settings.courts.find(c => c.id === courtId) || state.settings.courts[0];
  const customer = document.getElementById('book-customer').value.trim();
  const phone = document.getElementById('book-phone').value.trim();
  const notes = document.getElementById('book-notes').value;
  const extra = Number(document.getElementById('book-extra').value || 0);
  const paymentMethod = document.getElementById('book-payment-method').value;
  const totalAmount = Number(court.hourlyRate) + extra;

  const newRes = {
    id: 'RES-' + Math.floor(100 + Math.random() * 900),
    date: selectedDate,
    courtId: court.id,
    hour: Number(hour),
    duration: 1,
    customer,
    phone,
    type: 'Reserva',
    amount: totalAmount,
    status: paymentMethod === 'Efectivo' ? 'Pago en Club' : 'Pagado',
    paymentMethod,
    notes
  };

  const newTx = {
    id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
    date: selectedDate,
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream: 'Reservaciones',
    concept: `Reserva ${court.shortName} (${formatHourLabel(hour)})`,
    customer,
    paymentMethod,
    amount: totalAmount,
    status: newRes.status
  };

  state.reservations.push(newRes);
  state.transactions.unshift(newTx);
  saveState();
  renderAllClientViews();
  renderCoachView();
  renderAllAdminViews();
  showReceiptModal(newTx, '¡Cancha Apartada!');
}

function openProgramEnrollModal(progId) {
  const prog = state.programs.find(p => p.id === progId);
  if (!prog) return;
  const spotsLeft = Math.max(0, prog.spotsTotal - prog.spotsTaken);

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase text-vital-orange">${prog.category} · ${prog.court}</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${prog.title}</h3>
          <p class="text-xs text-stone-500">${prog.schedule} · ${prog.coach}</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${prog.description}</p>

      <div class="flex items-center justify-between bg-vital-cream px-3.5 py-2 rounded-xl text-xs">
        <span>Edades: <strong>${prog.ageRange}</strong></span>
        <span class="text-emerald-700 font-bold">${spotsLeft} cupos libres</span>
      </div>

      <form onsubmit="confirmProgramEnrollment(event, '${prog.id}')" class="space-y-3">
        <div class="grid sm:grid-cols-2 gap-2.5">
          <input type="text" id="enroll-name" required placeholder="Nombre del alumno / pareja *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
          <input type="tel" id="enroll-phone" required placeholder="Teléfono *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
        </div>

        <div class="bg-vital-cream p-3.5 rounded-2xl space-y-2">
          <select id="enroll-pay-method" onchange="toggleCardInputs('enroll-card-box', this.value)" class="w-full px-3 py-2 rounded-xl bg-white text-xs font-bold">
            <option value="Tarjeta">💳 Pagar con Tarjeta</option>
            <option value="Efectivo">💵 Pagar en Recepción</option>
          </select>
          <div id="enroll-card-box" class="grid grid-cols-12 gap-2">
            <input type="text" placeholder="Número de tarjeta" maxlength="19" class="col-span-12 px-3 py-2 rounded-xl bg-white text-xs" />
            <input type="text" placeholder="MM/AA" maxlength="5" class="col-span-6 px-3 py-2 rounded-xl bg-white text-xs" />
            <input type="password" placeholder="CVV" maxlength="4" class="col-span-6 px-3 py-2 rounded-xl bg-white text-xs" />
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-stone-100">
          <div>
            <span class="font-brand text-2xl text-vital-900">${formatMXN(prog.price)}</span>
            <span class="block text-[10px] text-stone-400">${prog.priceLabel}</span>
          </div>
          <button type="submit" class="px-6 py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs shadow-md">
            Inscribirme Ahora
          </button>
        </div>
      </form>
    </div>
  `);
}

function confirmProgramEnrollment(e, progId) {
  e.preventDefault();
  const prog = state.programs.find(p => p.id === progId);
  if (!prog) return;

  const student = document.getElementById('enroll-name').value.trim();
  const paymentMethod = document.getElementById('enroll-pay-method').value;
  if (prog.spotsTaken < prog.spotsTotal) prog.spotsTaken += 1;

  const newTx = {
    id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
    date: getTodayISO(0),
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream: 'Clases y Torneos',
    concept: `Inscripción: ${prog.title}`,
    customer: student,
    paymentMethod,
    amount: Number(prog.price),
    status: 'Pagado'
  };

  state.transactions.unshift(newTx);
  saveState();
  renderAllClientViews();
  showReceiptModal(newTx, '¡Inscripción Confirmada!');
}

// ============================================================================
// 2. VISTA COACH (CLEAN HOURLY PILLS + MODAL FOR ATTENDANCE & STUDENTS)
// ============================================================================

function populateCoachSelector() {
  const sel = document.getElementById('coach-view-select');
  if (!sel) return;
  const currentVal = sel.value;
  sel.innerHTML = [
    `<option value="all">👥 Todos los Coaches</option>`,
    ...state.coaches.map(c => `<option value="${c.id}">👟 ${c.name}</option>`)
  ].join('');
  if (currentVal && (currentVal === 'all' || state.coaches.some(c => c.id === currentVal))) {
    sel.value = currentVal;
  } else if (state.coaches[0]) {
    sel.value = state.coaches[0].id;
  }
}

function renderCoachView() {
  const kpiWrap = document.getElementById('coach-kpi-cards');
  const timelineWrap = document.getElementById('coach-hourly-timeline');
  const sel = document.getElementById('coach-view-select');
  const headingEl = document.getElementById('coach-schedule-heading');
  if (!timelineWrap) return;

  if (sel && sel.options.length === 0) populateCoachSelector();
  const selectedCoachId = sel?.value || 'all';
  const coachObj = state.coaches.find(c => c.id === selectedCoachId);

  renderDateStrip();
  if (headingEl) {
    headingEl.textContent = coachObj ? `Calendario · ${coachObj.name}` : 'Calendario · Todos los Coaches';
  }

  const dayBookings = state.reservations.filter(r => r.date === selectedDate);
  const myClasses = dayBookings.filter(r =>
    (r.type === 'Clase' || r.type === 'Torneo') &&
    (selectedCoachId === 'all' || r.coachId === selectedCoachId || (coachObj && r.coachName === coachObj.name))
  );
  const totalStudents = myClasses.reduce((s, c) => s + (Array.isArray(c.students) ? c.students.length : 1), 0);
  const checkedCount = myClasses.filter(c => c.attendanceChecked).length;
  const maintCount = dayBookings.filter(r => r.type === 'Mantenimiento').length;

  if (kpiWrap) {
    kpiWrap.innerHTML = `
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[11px] font-bold text-stone-400 uppercase">Mis Clases Hoy</span>
        <div class="font-brand text-2xl text-vital-900 mt-1">${myClasses.length} hrs</div>
      </div>
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[11px] font-bold text-stone-400 uppercase">Alumnos en Lista</span>
        <div class="font-brand text-2xl text-vital-900 mt-1">${totalStudents}</div>
      </div>
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[11px] font-bold text-stone-400 uppercase">Asistencias</span>
        <div class="font-brand text-2xl text-emerald-700 mt-1">${checkedCount}/${myClasses.length}</div>
      </div>
      <div class="card-luxury rounded-2xl p-4">
        <span class="text-[11px] font-bold text-stone-400 uppercase">Mantenimientos</span>
        <div class="font-brand text-2xl text-amber-700 mt-1">${maintCount}</div>
      </div>
    `;
  }

  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hours = [];
  for (let h = openH; h < closeH; h++) hours.push(h);

  timelineWrap.innerHTML = state.settings.courts.map(court => {
    const pills = hours.map(hr => {
      const booking = dayBookings.find(r => r.courtId === court.id && Number(r.hour) === hr);
      const label = formatHourLabel(hr);

      if (!booking) {
        return `
          <button onclick="openCoachClassModal('${court.id}', ${hr})" class="hour-pill p-3 rounded-2xl border border-emerald-500/20 bg-emerald-50/40 hover:bg-vital-lime text-left transition">
            <div class="text-xs font-bold text-vital-900">${label}</div>
            <div class="text-[11px] text-emerald-800 font-semibold mt-0.5">+ Asignar</div>
          </button>
        `;
      }

      if (booking.type === 'Mantenimiento') {
        return `
          <button onclick="openAdminSlotModal('${court.id}', ${hr})" class="hour-pill p-3 rounded-2xl border border-amber-300 bg-amber-50 text-left">
            <div class="text-xs font-bold text-amber-950">${label}</div>
            <div class="text-[11px] text-amber-800 font-semibold truncate mt-0.5">🔧 Mant.</div>
          </button>
        `;
      }

      const isClass = booking.type === 'Clase' || booking.type === 'Torneo';
      const isMine = isClass && (selectedCoachId === 'all' || booking.coachId === selectedCoachId || (coachObj && booking.coachName === coachObj.name));

      if (isClass) {
        return `
          <button onclick="openCoachClassDetailModal('${booking.id}')" class="hour-pill p-3 rounded-2xl border-2 ${
            isMine ? 'border-vital-orange bg-orange-50 text-vital-950' : 'border-stone-200 bg-stone-50 text-stone-500'
          } text-left">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold">${label}</span>
              <span class="text-[10px]">${booking.attendanceChecked ? '✅' : '👟'}</span>
            </div>
            <div class="text-[11px] font-bold truncate mt-0.5">${booking.customer}</div>
          </button>
        `;
      }

      return `
        <button onclick="openSlotInfoModal('${booking.id}')" class="hour-pill p-3 rounded-2xl border border-stone-200 bg-stone-100 text-stone-500 text-left">
          <div class="text-xs font-bold">${label}</div>
          <div class="text-[11px] truncate mt-0.5">🔒 Cliente</div>
        </button>
      `;
    }).join('');

    return `
      <div class="card-luxury rounded-3xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-brand text-xl text-vital-900">${court.shortName}</h3>
          <span class="text-xs text-stone-400 font-semibold">${selectedDate}</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">${pills}</div>
      </div>
    `;
  }).join('');
}

// Focused Modal for Coach to check attendance and see student list
function openCoachClassDetailModal(resId) {
  const b = state.reservations.find(r => r.id === resId);
  if (!b) return;
  const court = state.settings.courts.find(c => c.id === b.courtId);
  const students = Array.isArray(b.students) && b.students.length > 0 ? b.students : ['Grupo registrado'];

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase text-vital-orange">${court ? court.shortName : ''} · ${formatHourLabel(b.hour)}</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${b.customer}</h3>
          <p class="text-xs text-stone-500">Coach: ${b.coachName || 'Vital Club'}</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <div class="bg-vital-cream p-4 rounded-2xl space-y-2 text-xs">
        <div class="font-bold text-vital-900 uppercase">Alumnos Inscritos (${students.length})</div>
        <div class="flex flex-wrap gap-1.5">
          ${students.map(st => `<span class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 font-semibold">${st}</span>`).join('')}
        </div>
        ${b.notes ? `<div class="pt-2 border-t border-stone-200/60 text-stone-600"><strong>Notas:</strong> ${b.notes}</div>` : ''}
      </div>

      <div class="flex items-center justify-between pt-2">
        <button onclick="deleteReservation('${b.id}'); closeModal();" class="text-xs font-bold text-rose-600 hover:underline">
          Liberar horario
        </button>
        <button onclick="toggleClassAttendance('${b.id}'); closeModal();" class="px-5 py-3 rounded-2xl font-bold text-xs ${
          b.attendanceChecked ? 'bg-emerald-600 text-white' : 'bg-vital-900 text-vital-lime'
        }">
          ${b.attendanceChecked ? '✅ Asistencia Confirmada' : '✓ Confirmar Asistencia'}
        </button>
      </div>
    </div>
  `);
}

function toggleClassAttendance(resId) {
  const item = state.reservations.find(r => r.id === resId);
  if (!item) return;
  item.attendanceChecked = !item.attendanceChecked;
  saveState();
  renderCoachView();
  renderAdminCourtsSchedule();
  showToast(item.attendanceChecked ? 'Asistencia confirmada' : 'Asistencia pendiente');
}

// ============================================================================
// 3. VISTA ADMIN (DASHBOARD, POS, UNIFIED SLOT MODAL & CATALOG MODAL)
// ============================================================================

function renderAllAdminViews() {
  renderAdminDashboard();
  renderPosCatalog();
  renderPosCart();
  renderAdminCourtsSchedule();
  renderAdminIncomeTable();
}

function renderAdminDashboard() {
  const kpiContainer = document.getElementById('dashboard-kpi-cards');
  const barsContainer = document.getElementById('dashboard-streams-bars');
  const occContainer = document.getElementById('dashboard-court-occupancy');
  const recentTxContainer = document.getElementById('dashboard-recent-tx');
  if (!kpiContainer) return;

  const totalIncome = state.transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const resIncome = state.transactions.filter(t => t.stream === 'Reservaciones').reduce((s, t) => s + Number(t.amount || 0), 0);
  const classIncome = state.transactions.filter(t => t.stream === 'Clases y Torneos').reduce((s, t) => s + Number(t.amount || 0), 0);
  const foodIncome = state.transactions.filter(t => t.stream === 'Comida y Bebidas' || t.stream === 'Accesorios y Otros').reduce((s, t) => s + Number(t.amount || 0), 0);

  kpiContainer.innerHTML = `
    <div class="bg-vital-900 text-vital-cream rounded-3xl p-5">
      <span class="text-[11px] font-bold uppercase text-vital-lime">Ingresos Totales</span>
      <div class="font-brand text-2xl mt-1">${formatMXN(totalIncome)}</div>
    </div>
    <div class="card-luxury rounded-3xl p-5">
      <span class="text-[11px] font-bold uppercase text-emerald-700">Canchas Techadas</span>
      <div class="font-brand text-2xl text-vital-900 mt-1">${formatMXN(resIncome)}</div>
    </div>
    <div class="card-luxury rounded-3xl p-5">
      <span class="text-[11px] font-bold uppercase text-vital-orange">Clases y Torneos</span>
      <div class="font-brand text-2xl text-vital-900 mt-1">${formatMXN(classIncome)}</div>
    </div>
    <div class="card-luxury rounded-3xl p-5">
      <span class="text-[11px] font-bold uppercase text-amber-700">Comida y POS</span>
      <div class="font-brand text-2xl text-vital-900 mt-1">${formatMXN(foodIncome)}</div>
    </div>
  `;

  const streams = [
    { label: 'Reservaciones de Canchas', val: resIncome, color: 'bg-vital-900' },
    { label: 'Clases y Torneos', val: classIncome, color: 'bg-vital-orange' },
    { label: 'Zona de Comida y POS', val: foodIncome, color: 'bg-emerald-600' }
  ];

  barsContainer.innerHTML = streams.map(st => {
    const pct = totalIncome > 0 ? Math.round((st.val / totalIncome) * 100) : 0;
    return `
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-bold">
          <span>${st.label}</span>
          <span>${formatMXN(st.val)} (${pct}%)</span>
        </div>
        <div class="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
          <div class="h-full ${st.color} rounded-full" style="width: ${Math.max(4, pct)}%"></div>
        </div>
      </div>
    `;
  }).join('');

  const hoursPerCourt = state.settings.closeHour - state.settings.openHour;
  const todayBookings = state.reservations.filter(r => r.date === selectedDate);
  occContainer.innerHTML = state.settings.courts.map(court => {
    const bks = todayBookings.filter(r => r.courtId === court.id);
    const pct = Math.min(100, Math.round((bks.length / hoursPerCourt) * 100));
    return `
      <div class="p-4 rounded-2xl bg-vital-cream space-y-1.5">
        <div class="flex justify-between text-xs font-bold">
          <span>${court.shortName}</span>
          <span class="text-emerald-700">${bks.length}/${hoursPerCourt} hrs (${pct}%)</span>
        </div>
        <div class="w-full h-2 rounded-full bg-white overflow-hidden">
          <div class="h-full bg-vital-900 rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  recentTxContainer.innerHTML = `
    <table class="w-full text-left text-xs">
      <thead>
        <tr class="border-b border-stone-100 text-stone-400 uppercase">
          <th class="py-2">Folio</th>
          <th class="py-2">Flujo</th>
          <th class="py-2">Concepto</th>
          <th class="py-2">Cliente</th>
          <th class="py-2 text-right">Monto</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-100">
        ${state.transactions.slice(0, 5).map(t => `
          <tr>
            <td class="py-2.5 font-bold text-stone-400">${t.id}</td>
            <td class="py-2.5 font-semibold">${t.stream}</td>
            <td class="py-2.5 font-bold text-vital-900">${t.concept}</td>
            <td class="py-2.5 text-stone-500">${t.customer}</td>
            <td class="py-2.5 text-right font-extrabold">${formatMXN(t.amount)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Admin Calendar: Clean Hour Pills -> Single Modal for Booking / Coach Class / Maintenance
function renderAdminCourtsSchedule() {
  const container = document.getElementById('admin-courts-schedule');
  if (!container) return;

  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hours = [];
  for (let h = openH; h < closeH; h++) hours.push(h);

  container.innerHTML = state.settings.courts.map(court => {
    const pills = hours.map(hr => {
      const b = state.reservations.find(r => r.date === selectedDate && r.courtId === court.id && Number(r.hour) === hr);
      const label = formatHourLabel(hr);

      if (!b) {
        return `
          <button onclick="openAdminSlotModal('${court.id}', ${hr})" class="hour-pill p-3 rounded-2xl border border-emerald-500/20 bg-emerald-50/40 hover:bg-vital-lime text-left transition">
            <div class="text-xs font-bold text-vital-900">${label}</div>
            <div class="text-[11px] text-emerald-800 font-semibold mt-0.5">Libre</div>
          </button>
        `;
      }

      if (b.type === 'Mantenimiento') {
        return `
          <button onclick="openAdminSlotModal('${court.id}', ${hr})" class="hour-pill p-3 rounded-2xl border border-amber-300 bg-amber-50 text-left">
            <div class="text-xs font-bold text-amber-950">${label}</div>
            <div class="text-[11px] text-amber-800 font-semibold truncate mt-0.5">🔧 Mant.</div>
          </button>
        `;
      }

      const isClass = b.type === 'Clase' || b.type === 'Torneo';
      return `
        <button onclick="openAdminSlotModal('${court.id}', ${hr})" class="hour-pill p-3 rounded-2xl border ${
          isClass ? 'border-vital-orange/40 bg-orange-50' : 'border-stone-200 bg-stone-100'
        } text-left">
          <div class="text-xs font-bold text-vital-900">${label}</div>
          <div class="text-[11px] font-semibold truncate mt-0.5">${isClass ? '🏆 ' : '🎾 '}${b.customer}</div>
        </button>
      `;
    }).join('');

    return `
      <div class="bg-vital-cream/60 rounded-3xl p-5 border border-vital-900/5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-brand text-xl text-vital-900">${court.shortName}</h3>
          <span class="text-xs font-bold text-stone-400">${selectedDate}</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">${pills}</div>
      </div>
    `;
  }).join('');
}

// Unified Admin Slot Action Modal (Eliminates button clutter on screen)
function openAdminSlotModal(courtId, hour) {
  const court = state.settings.courts.find(c => c.id === courtId) || state.settings.courts[0];
  const existing = state.reservations.find(r => r.date === selectedDate && r.courtId === courtId && Number(r.hour) === Number(hour));

  if (existing) {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-start justify-between border-b border-stone-100 pb-3">
          <div>
            <span class="text-xs font-bold uppercase text-vital-orange">${court.shortName} · ${formatHourLabel(hour)}</span>
            <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${existing.customer}</h3>
          </div>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>

        <div class="bg-vital-cream p-4 rounded-2xl text-xs space-y-1.5">
          <div><strong>Tipo:</strong> ${existing.type}</div>
          ${existing.coachName ? `<div><strong>Coach:</strong> ${existing.coachName} (${existing.attendanceChecked ? '✅ Asistencia OK' : '⏳ Pendiente'})</div>` : ''}
          ${existing.amount ? `<div><strong>Monto:</strong> ${formatMXN(existing.amount)} (${existing.paymentMethod})</div>` : ''}
          ${existing.notes ? `<div><strong>Notas:</strong> ${existing.notes}</div>` : ''}
        </div>

        <div class="flex items-center justify-between pt-2">
          <button onclick="deleteReservation('${existing.id}'); closeModal();" class="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs">
            Liberar Horario
          </button>
          <button onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-vital-900 text-vital-cream font-bold text-xs">
            Cerrar
          </button>
        </div>
      </div>
    `);
    return;
  }

  // Free slot -> Choose action cleanly in modal
  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <div>
          <span class="text-xs font-bold uppercase text-emerald-700">Horario Libre · ${selectedDate}</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${court.shortName} · ${formatHourLabel(hour)}</h3>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <p class="text-xs text-stone-500">¿Qué deseas registrar en este horario?</p>

      <div class="grid gap-2.5">
        <button onclick="openBookingModal('${court.id}', ${hour})" class="p-4 rounded-2xl bg-vital-cream hover:bg-vital-lime text-left transition flex items-center justify-between">
          <div>
            <div class="font-bold text-sm text-vital-900">🎾 Apartar Cancha a Cliente</div>
            <div class="text-xs text-stone-500">Registrar reserva normal ($${court.hourlyRate}/hr)</div>
          </div>
          <span class="font-bold text-xs">→</span>
        </button>

        <button onclick="openCoachClassModal('${court.id}', ${hour})" class="p-4 rounded-2xl bg-vital-cream hover:bg-orange-100 text-left transition flex items-center justify-between">
          <div>
            <div class="font-bold text-sm text-vital-900">👟 Asignar Clase a un Coach</div>
            <div class="text-xs text-stone-500">Se sincroniza con el calendario del entrenador</div>
          </div>
          <span class="font-bold text-xs">→</span>
        </button>

        <button onclick="openMaintenanceModal('${court.id}', ${hour})" class="p-4 rounded-2xl bg-vital-cream hover:bg-amber-100 text-left transition flex items-center justify-between">
          <div>
            <div class="font-bold text-sm text-vital-900">🔧 Bloquear por Mantenimiento</div>
            <div class="text-xs text-stone-500">Cierra el horario para que ningún cliente reserve</div>
          </div>
          <span class="font-bold text-xs">→</span>
        </button>
      </div>
    </div>
  `);
}

function openCoachClassModal(defaultCourtId = 'cancha-1', defaultHour = 10) {
  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hourOptions = [];
  for (let h = openH; h < closeH; h++) {
    hourOptions.push(`<option value="${h}" ${h === Number(defaultHour) ? 'selected' : ''}>${formatHourLabel(h)}</option>`);
  }

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <h3 class="font-brand text-2xl text-vital-900">Programar Clase de Coach</h3>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>
      <form onsubmit="confirmCoachClass(event)" class="space-y-3">
        <div class="grid sm:grid-cols-2 gap-2.5">
          <select id="coach-modal-coach" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-bold">
            ${state.coaches.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <input type="text" id="coach-modal-title" required placeholder="Nombre de la Clase *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
        </div>
        <div class="grid grid-cols-3 gap-2">
          <input type="date" id="coach-modal-date" value="${selectedDate}" required class="px-3 py-2 rounded-xl bg-vital-cream text-xs font-bold" />
          <select id="coach-modal-court" class="px-3 py-2 rounded-xl bg-vital-cream text-xs font-bold">
            ${state.settings.courts.map(c => `<option value="${c.id}" ${c.id === defaultCourtId ? 'selected' : ''}>${c.shortName}</option>`).join('')}
          </select>
          <select id="coach-modal-hour" class="px-3 py-2 rounded-xl bg-vital-cream text-xs font-bold">${hourOptions.join('')}</select>
        </div>
        <div class="grid sm:grid-cols-2 gap-2.5">
          <input type="text" id="coach-modal-students" placeholder="Alumnos (separados por coma)" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
          <input type="number" id="coach-modal-amount" value="350" placeholder="Costo ($)" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-bold" />
        </div>
        <input type="text" id="coach-modal-notes" placeholder="Notas de la sesión" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
        <button type="submit" class="w-full py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs">Guardar Clase</button>
      </form>
    </div>
  `);
}

function confirmCoachClass(e) {
  e.preventDefault();
  const coachId = document.getElementById('coach-modal-coach').value;
  const coachObj = state.coaches.find(c => c.id === coachId);
  const title = document.getElementById('coach-modal-title').value.trim();
  const date = document.getElementById('coach-modal-date').value;
  const courtId = document.getElementById('coach-modal-court').value;
  const hour = Number(document.getElementById('coach-modal-hour').value);
  const studentsRaw = document.getElementById('coach-modal-students').value.trim();
  const amount = Number(document.getElementById('coach-modal-amount').value || 0);
  const notes = document.getElementById('coach-modal-notes').value.trim();

  state.reservations = state.reservations.filter(r => !(r.date === date && r.courtId === courtId && Number(r.hour) === hour));
  const students = studentsRaw ? studentsRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Grupo Vital Club'];

  state.reservations.push({
    id: 'CLS-' + Math.floor(100 + Math.random() * 900),
    date,
    courtId,
    hour,
    duration: 1,
    customer: title,
    phone: '715 131 7443',
    type: 'Clase',
    coachId,
    coachName: coachObj ? coachObj.name : 'Coach',
    students,
    attendanceChecked: false,
    amount,
    status: 'Pagado',
    paymentMethod: 'Tarjeta',
    notes
  });

  selectedDate = date;
  saveState();
  closeModal();
  renderAllClientViews();
  renderCoachView();
  renderAllAdminViews();
  showToast('Clase programada en calendario');
}

function openMaintenanceModal(defaultCourtId = 'cancha-1', defaultHour = 13) {
  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hourOptions = [];
  for (let h = openH; h < closeH; h++) {
    hourOptions.push(`<option value="${h}" ${h === Number(defaultHour) ? 'selected' : ''}>${formatHourLabel(h)}</option>`);
  }

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between border-b border-stone-100 pb-3">
        <h3 class="font-brand text-2xl text-vital-900">Bloquear por Mantenimiento</h3>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>
      <form onsubmit="confirmMaintenanceBlock(event)" class="space-y-3">
        <div class="grid grid-cols-3 gap-2">
          <input type="date" id="maint-date" value="${selectedDate}" required class="px-3 py-2 rounded-xl bg-vital-cream text-xs font-bold" />
          <select id="maint-court" class="px-3 py-2 rounded-xl bg-vital-cream text-xs font-bold">
            ${state.settings.courts.map(c => `<option value="${c.id}" ${c.id === defaultCourtId ? 'selected' : ''}>${c.shortName}</option>`).join('')}
            <option value="both">Ambas Canchas</option>
          </select>
          <select id="maint-hour" class="px-3 py-2 rounded-xl bg-vital-cream text-xs font-bold">${hourOptions.join('')}</select>
        </div>
        <select id="maint-title" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-bold">
          <option value="Mantenimiento Preventivo">🔧 Mantenimiento Preventivo</option>
          <option value="Limpieza y Cepillado">🧹 Limpieza y Cepillado de Pasto</option>
          <option value="Evento Privado">🏆 Bloqueo por Evento / Torneo</option>
        </select>
        <input type="text" id="maint-notes" placeholder="Motivo u observaciones..." class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
        <button type="submit" class="w-full py-3 rounded-2xl bg-amber-600 text-white font-bold text-xs">Bloquear Horario</button>
      </form>
    </div>
  `);
}

function confirmMaintenanceBlock(e) {
  e.preventDefault();
  const date = document.getElementById('maint-date').value;
  const courtTarget = document.getElementById('maint-court').value;
  const hour = Number(document.getElementById('maint-hour').value);
  const title = document.getElementById('maint-title').value;
  const notes = document.getElementById('maint-notes').value.trim() || 'Cerrada por mantenimiento';

  const targets = courtTarget === 'both' ? state.settings.courts.map(c => c.id) : [courtTarget];
  targets.forEach(cId => {
    state.reservations = state.reservations.filter(r => !(r.date === date && r.courtId === cId && Number(r.hour) === hour));
    state.reservations.push({
      id: 'MANT-' + Math.floor(100 + Math.random() * 900),
      date,
      courtId: cId,
      hour,
      duration: 1,
      customer: title,
      type: 'Mantenimiento',
      amount: 0,
      status: 'Bloqueado',
      paymentMethod: 'N/A',
      notes
    });
  });

  selectedDate = date;
  saveState();
  closeModal();
  renderAllClientViews();
  renderCoachView();
  renderAllAdminViews();
  showToast('Horario bloqueado por mantenimiento');
}

function deleteReservation(resId) {
  state.reservations = state.reservations.filter(r => r.id !== resId);
  saveState();
  renderAllClientViews();
  renderCoachView();
  renderAllAdminViews();
  showToast('Horario liberado');
}

// ============================================================================
// POS & CATALOG MODALS
// ============================================================================

function setPosCategory(cat) {
  currentPosCategory = cat;
  document.querySelectorAll('.pos-cat-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-pos-cat') === cat;
    btn.className = isAct
      ? 'pos-cat-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-vital-900 text-vital-cream'
      : 'pos-cat-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-vital-cream text-vital-900';
  });
  renderPosCatalog();
}

function renderPosCatalog() {
  const grid = document.getElementById('pos-catalog-grid');
  const q = (document.getElementById('pos-search-input')?.value || '').toLowerCase().trim();
  if (!grid) return;

  const list = state.catalog.filter(i => {
    const matchCat = currentPosCategory === 'all' || i.category === currentPosCategory;
    const matchQ = !q || i.name.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  grid.innerHTML = list.map(item => `
    <button onclick="addToPosCart('${item.id}')" class="p-3.5 rounded-2xl border border-stone-100 bg-vital-cream/60 hover:bg-vital-lime text-left transition flex flex-col justify-between">
      <div class="font-bold text-xs text-vital-900">${item.name}</div>
      <div class="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/50 w-full">
        <span class="font-brand text-base text-vital-900">$${item.price}</span>
        <span class="text-xs font-bold">+</span>
      </div>
    </button>
  `).join('');
}

function addToPosCart(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;
  const ex = posCart.find(c => c.id === itemId);
  if (ex) ex.qty += 1;
  else posCart.push({ ...item, qty: 1 });
  renderPosCart();
}

function changePosQty(itemId, delta) {
  const idx = posCart.findIndex(c => c.id === itemId);
  if (idx === -1) return;
  posCart[idx].qty += delta;
  if (posCart[idx].qty <= 0) posCart.splice(idx, 1);
  renderPosCart();
}

function clearPosCart() {
  posCart = [];
  renderPosCart();
}

function renderPosCart() {
  const container = document.getElementById('pos-cart-items');
  const qtyEl = document.getElementById('pos-total-qty');
  const totalEl = document.getElementById('pos-total-amount');
  if (!container) return;

  if (posCart.length === 0) {
    container.innerHTML = `<p class="text-xs text-stone-400 py-6 text-center">Selecciona productos para cobrar.</p>`;
    if (qtyEl) qtyEl.textContent = '0';
    if (totalEl) totalEl.textContent = '$0 MXN';
    updatePosCashChange();
    return;
  }

  const totalQty = posCart.reduce((s, i) => s + i.qty, 0);
  const totalAmount = posCart.reduce((s, i) => s + i.qty * i.price, 0);

  container.innerHTML = posCart.map(item => `
    <div class="flex items-center justify-between p-2 rounded-xl bg-vital-cream text-xs">
      <span class="font-bold truncate max-w-[130px]">${item.name}</span>
      <div class="flex items-center gap-1.5">
        <button onclick="changePosQty('${item.id}', -1)" class="w-5 h-5 rounded bg-white font-bold">-</button>
        <span class="font-bold">${item.qty}</span>
        <button onclick="changePosQty('${item.id}', 1)" class="w-5 h-5 rounded bg-white font-bold">+</button>
        <span class="font-extrabold w-12 text-right">$${item.qty * item.price}</span>
      </div>
    </div>
  `).join('');

  if (qtyEl) qtyEl.textContent = String(totalQty);
  if (totalEl) totalEl.textContent = formatMXN(totalAmount);
  updatePosCashChange();
}

function updatePosCashChange() {
  const method = document.getElementById('pos-payment-method')?.value || 'Efectivo';
  const cashBox = document.getElementById('pos-cash-box');
  const received = Number(document.getElementById('pos-cash-received')?.value || 0);
  const changeEl = document.getElementById('pos-cash-change');
  const total = posCart.reduce((s, i) => s + i.qty * i.price, 0);

  cashBox?.classList.toggle('hidden', method !== 'Efectivo');
  if (changeEl) {
    const diff = received - total;
    changeEl.textContent = diff >= 0 && total > 0 ? formatMXN(diff) : '$0';
  }
}

function completePosSale() {
  if (posCart.length === 0) return;
  const customer = document.getElementById('pos-customer-input')?.value.trim() || 'Mostrador';
  const paymentMethod = document.getElementById('pos-payment-method')?.value || 'Efectivo';
  const totalAmount = posCart.reduce((s, i) => s + i.qty * i.price, 0);
  const concept = posCart.map(i => `${i.qty}x ${i.name}`).join(', ');
  const stream = posCart.some(i => i.category === 'Canchas y Clases') ? 'Reservaciones' : 'Comida y Bebidas';

  const newTx = {
    id: 'POS-' + Math.floor(1000 + Math.random() * 9000),
    date: getTodayISO(0),
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream,
    concept,
    customer,
    paymentMethod,
    amount: totalAmount,
    status: 'Pagado'
  };

  state.transactions.unshift(newTx);
  posCart = [];
  saveState();
  renderAllAdminViews();
  showReceiptModal(newTx, 'Venta POS Registrada');
}

function renderAdminIncomeTable() {
  const wrap = document.getElementById('admin-income-table-wrap');
  const filterVal = document.getElementById('income-filter-stream')?.value || 'all';
  if (!wrap) return;

  const list = state.transactions.filter(t => filterVal === 'all' || t.stream === filterVal);
  wrap.innerHTML = `
    <table class="w-full text-left text-xs">
      <thead>
        <tr class="border-b border-stone-100 text-stone-400 uppercase">
          <th class="py-2">Folio</th>
          <th class="py-2">Flujo</th>
          <th class="py-2">Concepto</th>
          <th class="py-2">Cliente</th>
          <th class="py-2">Pago</th>
          <th class="py-2 text-right">Monto</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-100">
        ${list.map(t => `
          <tr>
            <td class="py-2.5 font-bold text-stone-400">${t.id}</td>
            <td class="py-2.5">${t.stream}</td>
            <td class="py-2.5 font-bold text-vital-900">${t.concept}</td>
            <td class="py-2.5 text-stone-500">${t.customer}</td>
            <td class="py-2.5">${t.paymentMethod}</td>
            <td class="py-2.5 text-right font-extrabold">${formatMXN(t.amount)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Clean Catalog & Settings Modal (Instead of cluttering the page)
function openCatalogManagerModal() {
  openModal(`
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 class="font-brand text-2xl text-vital-900">Configuración y Catálogo</h3>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <div class="bg-vital-cream p-4 rounded-2xl space-y-2.5 text-xs">
        <div class="font-bold text-vital-900 uppercase">Tarifa por Hora de Canchas Techadas ($)</div>
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="text-stone-500">Cancha Techada 1</label>
            <input type="number" id="modal-rate-c1" value="${state.settings.courts[0].hourlyRate}" class="w-full mt-1 px-3 py-2 rounded-xl bg-white font-bold" />
          </div>
          <div>
            <label class="text-stone-500">Cancha Techada 2</label>
            <input type="number" id="modal-rate-c2" value="${state.settings.courts[1].hourlyRate}" class="w-full mt-1 px-3 py-2 rounded-xl bg-white font-bold" />
          </div>
        </div>
        <button onclick="saveModalCourtRates()" class="w-full py-2 rounded-xl bg-vital-900 text-vital-lime font-bold">Actualizar Tarifas</button>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <button onclick="openAdminNewModal('item')" class="p-3 rounded-2xl bg-vital-cream hover:bg-vital-sand text-xs font-bold text-vital-900">+ Producto Comida</button>
        <button onclick="openAdminNewModal('program')" class="p-3 rounded-2xl bg-vital-cream hover:bg-vital-sand text-xs font-bold text-vital-900">+ Clase / Torneo</button>
        <button onclick="openAdminNewModal('coach')" class="p-3 rounded-2xl bg-vital-cream hover:bg-vital-sand text-xs font-bold text-vital-900">+ Entrenador</button>
      </div>
    </div>
  `);
}

function saveModalCourtRates() {
  const r1 = Number(document.getElementById('modal-rate-c1')?.value || 400);
  const r2 = Number(document.getElementById('modal-rate-c2')?.value || 400);
  state.settings.courts[0].hourlyRate = r1;
  state.settings.courts[1].hourlyRate = r2;
  saveState();
  closeModal();
  renderAllClientViews();
  renderAllAdminViews();
  showToast('Tarifas actualizadas');
}

function openAdminNewModal(type) {
  if (type === 'item') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Nuevo Producto</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewCatalogItem(event)" class="space-y-3">
          <input type="text" id="new-item-name" required placeholder="Nombre del producto *" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
          <div class="grid grid-cols-2 gap-2">
            <select id="new-item-cat" class="px-3 py-2.5 rounded-xl bg-vital-cream text-xs font-bold">
              <option value="Sándwiches y Comida">Sándwiches y Comida</option>
              <option value="Bebidas y Café">Bebidas y Café</option>
              <option value="Renta y Accesorios">Renta y Accesorios</option>
            </select>
            <input type="number" id="new-item-price" required placeholder="Precio ($) *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-bold" />
          </div>
          <input type="text" id="new-item-desc" placeholder="Descripción breve" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
          <button type="submit" class="w-full py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs">Guardar Producto</button>
        </form>
      </div>
    `);
  } else if (type === 'program') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Nueva Clase o Torneo</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewProgram(event)" class="space-y-3">
          <input type="text" id="new-prog-title" required placeholder="Título *" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
          <div class="grid grid-cols-2 gap-2">
            <select id="new-prog-cat" class="px-3 py-2.5 rounded-xl bg-vital-cream text-xs font-bold">
              <option value="Niños y Familia">Niños y Familia</option>
              <option value="Adultos y Seniors">Adultos y Seniors</option>
              <option value="Torneos">Torneos</option>
            </select>
            <input type="number" id="new-prog-price" required placeholder="Precio ($) *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" id="new-prog-sched" required placeholder="Horario (ej. Lun 5pm) *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
            <input type="text" id="new-prog-coach" required placeholder="Coach *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
          </div>
          <input type="text" id="new-prog-desc" placeholder="Descripción" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
          <button type="submit" class="w-full py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs">Publicar</button>
        </form>
      </div>
    `);
  } else if (type === 'coach') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Nuevo Entrenador</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewCoach(event)" class="space-y-3">
          <input type="text" id="new-coach-name" required placeholder="Nombre completo *" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
          <input type="text" id="new-coach-role" required placeholder="Especialidad / Rol *" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
          <input type="text" id="new-coach-sched" required placeholder="Horario *" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
          <input type="text" id="new-coach-bio" required placeholder="Semblanza breve *" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
          <button type="submit" class="w-full py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs">Guardar Entrenador</button>
        </form>
      </div>
    `);
  } else if (type === 'transaction') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Registrar Ingreso</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewManualTransaction(event)" class="space-y-3">
          <input type="text" id="new-tx-concept" required placeholder="Concepto *" class="w-full px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-semibold" />
          <div class="grid grid-cols-2 gap-2">
            <select id="new-tx-stream" class="px-3 py-2.5 rounded-xl bg-vital-cream text-xs font-bold">
              <option value="Reservaciones">Reservaciones</option>
              <option value="Clases y Torneos">Clases y Torneos</option>
              <option value="Comida y Bebidas">Comida y Bebidas</option>
            </select>
            <input type="number" id="new-tx-amount" required placeholder="Monto ($) *" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" id="new-tx-customer" placeholder="Cliente" class="px-3.5 py-2.5 rounded-xl bg-vital-cream text-xs" />
            <select id="new-tx-method" class="px-3 py-2.5 rounded-xl bg-vital-cream text-xs font-bold">
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
          <button type="submit" class="w-full py-3 rounded-2xl bg-vital-900 text-vital-lime font-bold text-xs">Guardar</button>
        </form>
      </div>
    `);
  }
}

function saveNewCatalogItem(e) {
  e.preventDefault();
  state.catalog.unshift({
    id: 'ITEM-' + Math.floor(100 + Math.random() * 900),
    name: document.getElementById('new-item-name').value.trim(),
    category: document.getElementById('new-item-cat').value,
    price: Number(document.getElementById('new-item-price').value),
    badge: 'Nuevo',
    description: document.getElementById('new-item-desc').value.trim()
  });
  saveState();
  closeModal();
  renderAllClientViews();
  renderAllAdminViews();
  showToast('Producto agregado');
}

function saveNewProgram(e) {
  e.preventDefault();
  state.programs.unshift({
    id: 'PROG-' + Math.floor(100 + Math.random() * 900),
    title: document.getElementById('new-prog-title').value.trim(),
    category: document.getElementById('new-prog-cat').value,
    price: Number(document.getElementById('new-prog-price').value),
    schedule: document.getElementById('new-prog-sched').value.trim(),
    coach: document.getElementById('new-prog-coach').value.trim(),
    ageRange: 'Familiar',
    priceLabel: 'Inscripción abierta',
    spotsTotal: 12,
    spotsTaken: 1,
    court: 'Cancha Techada 1',
    description: document.getElementById('new-prog-desc').value.trim()
  });
  saveState();
  closeModal();
  renderAllClientViews();
  showToast('Clase / Torneo publicado');
}

function saveNewCoach(e) {
  e.preventDefault();
  state.coaches.push({
    id: 'COACH-' + Math.floor(100 + Math.random() * 900),
    name: document.getElementById('new-coach-name').value.trim(),
    role: document.getElementById('new-coach-role').value.trim(),
    specialty: 'Pádel Familiar',
    experience: 'Coach Vital Club',
    schedule: document.getElementById('new-coach-sched').value.trim(),
    bio: document.getElementById('new-coach-bio').value.trim()
  });
  saveState();
  closeModal();
  renderAllClientViews();
  showToast('Entrenador agregado');
}

function saveNewManualTransaction(e) {
  e.preventDefault();
  state.transactions.unshift({
    id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
    date: getTodayISO(0),
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream: document.getElementById('new-tx-stream').value,
    concept: document.getElementById('new-tx-concept').value.trim(),
    customer: document.getElementById('new-tx-customer').value.trim() || 'Cliente',
    paymentMethod: document.getElementById('new-tx-method').value,
    amount: Number(document.getElementById('new-tx-amount').value),
    status: 'Pagado'
  });
  saveState();
  closeModal();
  renderAllAdminViews();
  showToast('Ingreso registrado');
}

function exportIncomeCSV() {
  const headers = ['Folio', 'Fecha', 'Hora', 'Flujo', 'Concepto', 'Cliente', 'MetodoPago', 'MontoMXN'];
  const rows = state.transactions.map(t => [t.id, t.date, t.time, `"${t.stream}"`, `"${t.concept}"`, `"${t.customer}"`, t.paymentMethod, t.amount]);
  const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', `vital_club_ingresos_${getTodayISO(0)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// ============================================================================
// MODAL & RECEIPT HELPERS
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

function showReceiptModal(tx, heading) {
  openModal(`
    <div id="printable-receipt" class="space-y-4">
      <div class="text-center border-b border-dashed border-stone-200 pb-4">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-vital-900 text-vital-lime font-bold mb-2">✓</div>
        <h3 class="font-brand text-2xl text-vital-900">${heading}</h3>
        <p class="text-[11px] text-stone-400 uppercase tracking-widest mt-0.5">Vital Club · Zitácuaro</p>
      </div>

      <div class="bg-vital-cream p-4 rounded-2xl text-xs space-y-1.5">
        <div class="flex justify-between"><span class="text-stone-500">Folio:</span><strong>${tx.id}</strong></div>
        <div class="flex justify-between"><span class="text-stone-500">Cliente:</span><strong>${tx.customer}</strong></div>
        <div class="flex justify-between"><span class="text-stone-500">Pago:</span><strong>${tx.paymentMethod}</strong></div>
        <div class="pt-2 border-t border-stone-200/60"><strong>${tx.concept}</strong></div>
        <div class="pt-2 border-t border-stone-200/60 flex justify-between items-baseline">
          <span class="font-bold uppercase">Total</span>
          <span class="font-brand text-2xl text-vital-900">${formatMXN(tx.amount)}</span>
        </div>
      </div>

      <div class="flex gap-2.5">
        <button onclick="window.print()" class="flex-1 py-2.5 rounded-xl bg-stone-100 text-xs font-bold">🖨️ Imprimir</button>
        <button onclick="closeModal()" class="flex-1 py-2.5 rounded-xl bg-vital-900 text-vital-lime text-xs font-bold">Listo</button>
      </div>
    </div>
  `);
}

function renderAllClientViews() {
  renderHeroLiveStatus();
  renderDateStrip();
  renderClientCourtsGrid();
  renderClientPrograms();
  renderClientFoodGrid();
  renderClientCoaches();
  updateClientCartBadge();
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('universal-modal');
  if (modal && e.target === modal) closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
  renderAllClientViews();
  if (window.lucide) lucide.createIcons();
});
