// ============================================================================
// VITAL CLUB · PÁDEL, CLASES, ZONA DE COMIDA, POS & ADMIN DASHBOARD
// Zitácuaro, Michoacán — Andrés Landa y Piña Nte. 26, Col. Cuauhtémoc, 61506
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
      closeHour: 20, // 8:00 AM to 8:00 PM
      courts: [
        {
          id: 'cancha-1',
          name: 'Cancha Techada 1 · Vital Central',
          shortName: 'Cancha Techada 1',
          badge: '100% Techada · Panorámica',
          hourlyRate: 400,
          description: 'Cancha principal techada con iluminación LED profesional y cristal templado panorámico. Sin pretextos si llueve.'
        },
        {
          id: 'cancha-2',
          name: 'Cancha Techada 2 · Vital Familiar',
          shortName: 'Cancha Techada 2',
          badge: '100% Techada · Junto a Zona Comida',
          hourlyRate: 400,
          description: 'Cancha techada conectada directamente al lounge familiar y zona de sándwiches y bebidas. Ideal para familias y torneos.'
        }
      ]
    },

    // Control de Registro de Canchas (Reservaciones, Clases de Coach y Mantenimientos)
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
        notes: '2 adultos y 2 niños'
      },
      {
        id: 'RES-102',
        date: today,
        courtId: 'cancha-2',
        hour: 10,
        duration: 1,
        customer: 'Grupo Vital Senior (Adultos Mayores)',
        phone: '715 131 7443',
        type: 'Clase',
        coachId: 'COACH-3',
        coachName: 'Roberto Domínguez',
        students: ['Sra. Carmen', 'Don Jorge', 'Sra. Elena', 'Don Raúl'],
        attendanceChecked: true,
        amount: 550,
        status: 'Pagado',
        paymentMethod: 'Efectivo',
        notes: 'Clínica matutina bajo impacto · Movilidad y volea'
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
        notes: 'Cepillado de pasto sintético, limpieza de cristales y ajuste de red'
      },
      {
        id: 'RES-103',
        date: today,
        courtId: 'cancha-1',
        hour: 16,
        duration: 1,
        customer: 'Academia Pádel Kids (Niños 4-12 años)',
        phone: '715 131 7443',
        type: 'Clase',
        coachId: 'COACH-2',
        coachName: 'Sofía Morales',
        students: ['Mateo Gómez', 'Valentina Piña', 'Santi Ruiz', 'Emilio Landa', 'Camila Vega', 'Leo Torres'],
        attendanceChecked: false,
        amount: 650,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Coordinación infantil y mini-torneo con conos'
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
        id: 'RES-105',
        date: today,
        courtId: 'cancha-1',
        hour: 18,
        duration: 1,
        customer: 'Mariana Landa',
        phone: '715 190 4412',
        type: 'Reserva',
        amount: 400,
        status: 'Anticipo ($200)',
        paymentMethod: 'Transferencia',
        notes: 'Liquida $200 en recepción'
      },
      {
        id: 'RES-108',
        date: today,
        courtId: 'cancha-2',
        hour: 18,
        duration: 1,
        customer: 'Academia Intermedios & Retas Tácticas',
        phone: '715 131 7443',
        type: 'Clase',
        coachId: 'COACH-1',
        coachName: 'Alejandro "Alex" Vega',
        students: ['Diego Navarro', 'Pablo Herrera', 'Miguel Ángel', 'Rodrigo Paz'],
        attendanceChecked: false,
        amount: 480,
        status: 'Pagado',
        paymentMethod: 'Tarjeta',
        notes: 'Entrenamiento táctico de ataque en red'
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
        notes: 'Partido familiar abuelo y nieto'
      }
    ],

    // Clases, Academia y Torneos (Inscripción con Pago con Tarjeta)
    programs: [
      {
        id: 'PROG-1',
        title: 'Pádel Kids & Semillero Vital (4 a 12 años)',
        category: 'Niños y Familia',
        schedule: 'Lunes, Miércoles y Viernes · 4:00 PM – 5:00 PM',
        coach: 'Coach Sofía Morales',
        ageRange: 'Niños pequeños (4–12 años)',
        price: 650,
        priceLabel: 'Mensualidad o $180 por clase suelta',
        spotsTotal: 12,
        spotsTaken: 8,
        court: 'Cancha Techada 1',
        description: 'Coordinación, diversión y fundamentos del pádel en ambiente 100% seguro y techado. Incluye préstamo de pala infantil.'
      },
      {
        id: 'PROG-2',
        title: 'Clínica 100% Familiar (Padres, Hijos y Abuelos)',
        category: 'Niños y Familia',
        schedule: 'Sábados y Domingos · 10:00 AM – 11:30 AM',
        coach: 'Coach Alejandro "Alex" Vega',
        ageRange: 'Todas las edades (Familiar)',
        price: 420,
        priceLabel: 'Pase familiar hasta 4 integrantes',
        spotsTotal: 8,
        spotsTaken: 5,
        court: 'Cancha Techada 2',
        description: 'La experiencia favorita de Vital Club: aprendan y jueguen juntos en familia con dinámicas para todas las edades.'
      },
      {
        id: 'PROG-3',
        title: 'Vital Senior · Adultos Mayores Activos',
        category: 'Adultos y Seniors',
        schedule: 'Martes y Jueves · 10:00 AM – 11:00 AM',
        coach: 'Coach Roberto Domínguez',
        ageRange: 'Adultos Mayores (55+ años)',
        price: 550,
        priceLabel: 'Mensualidad · Ritmo amigable y social',
        spotsTotal: 10,
        spotsTaken: 6,
        court: 'Cancha Techada 2',
        description: 'Movilidad, salud articular, convivencia y técnica de pádel sin impacto agresivo. Café o infusión de cortesía al terminar.'
      },
      {
        id: 'PROG-4',
        title: 'Academia Adultos · Principiantes e Intermedios',
        category: 'Adultos y Seniors',
        schedule: 'Martes y Jueves · 6:00 PM – 7:30 PM',
        coach: 'Coach Alejandro "Alex" Vega',
        ageRange: 'Jóvenes y Adultos',
        price: 240,
        priceLabel: 'Por sesión de 90 min (o paquete mensual)',
        spotsTotal: 8,
        spotsTaken: 6,
        court: 'Cancha Techada 1',
        description: 'Domina bandeja, víbora, salida de pared y táctica en pareja para subir de categoría rápidamente.'
      },
      {
        id: 'PROG-5',
        title: 'Torneo Relámpago Familiar & Amigos',
        category: 'Torneos',
        schedule: 'Sábados · 4:00 PM – 8:00 PM',
        coach: 'Staff Vital Club',
        ageRange: 'Abierto · Categorías Recreativa y Mixta',
        price: 500,
        priceLabel: 'Inscripción por pareja (3 partidos garantizados)',
        spotsTotal: 16,
        spotsTaken: 12,
        court: 'Canchas Techadas 1 y 2',
        description: 'Formato americano dinámico bajo techo, música familiar, hidratación incluida y premios en nuestra Zona de Comida.'
      },
      {
        id: 'PROG-6',
        title: 'Lista Prioritaria: Experiencia Barre & Gym Vital',
        category: 'Adultos y Seniors',
        schedule: 'Próxima Apertura · Pre-registro con Tarjeta Preferencial',
        coach: 'Equipo Vital Wellness',
        ageRange: 'Jóvenes, Adultos y Seniors',
        price: 350,
        priceLabel: 'Pase fundador de lanzamiento',
        spotsTotal: 25,
        spotsTaken: 14,
        court: 'Nuevo Estudio Vital',
        description: 'Sé parte de las nuevas experiencias que estamos integrando en Vital Club: Barre, entrenamiento funcional y cocina saludable.'
      }
    ],

    // Catálogo de Zona de Comida y Punto de Venta (100% Gestionable por Admin)
    catalog: [
      {
        id: 'FOOD-1',
        name: 'Club Sándwich Vital',
        category: 'Sándwiches y Comida',
        price: 135,
        badge: 'Favorito del Club',
        description: 'Pechuga de pavo ahumada, tocino crujiente, queso gouda, aguacate de Michoacán y aderezo de la casa en pan artesanal tostado.'
      },
      {
        id: 'FOOD-2',
        name: 'Baguette Serrano & Pesto',
        category: 'Sándwiches y Comida',
        price: 145,
        badge: 'Gourmet',
        description: 'Jamón serrano, queso mozzarella fresco, jitomate deshidratado, arúgula y pesto de albahaca.'
      },
      {
        id: 'FOOD-3',
        name: 'Panini Pollo Grill & Panela',
        category: 'Sándwiches y Comida',
        price: 125,
        badge: 'Proteína Post-Partido',
        description: 'Pechuga a la plancha, queso panela asado, espinaca baby y toque ligero de chipotle dulce.'
      },
      {
        id: 'FOOD-4',
        name: 'Mini Sándwich Kids & Papas Horneadas',
        category: 'Sándwiches y Comida',
        price: 85,
        badge: 'Especial Niños',
        description: 'Sándwich suave de jamón de pavo y queso derretido sin corteza acompañado de bastones de papa o fruta.'
      },
      {
        id: 'DRINK-1',
        name: 'Smoothie Match-Point (Verde o Mango)',
        category: 'Bebidas y Café',
        price: 78,
        badge: '100% Natural',
        description: 'Fruta natural recién licuada, ideal para recuperar energía después de jugar.'
      },
      {
        id: 'DRINK-2',
        name: 'Cold Brew Vital / Latte Frío',
        category: 'Bebidas y Café',
        price: 68,
        badge: 'Café de Especialidad',
        description: 'Café frío de extracción lenta o con leche a elegir (entera, deslactosada o almendra).'
      },
      {
        id: 'DRINK-3',
        name: 'Bebida Isotónica / Electrolitos',
        category: 'Bebidas y Café',
        price: 45,
        badge: 'Hidratación',
        description: 'Hidratación deportiva bien fría para durante o después de tu partido.'
      },
      {
        id: 'DRINK-4',
        name: 'Agua Fresca del Día / Mineral Preparada',
        category: 'Bebidas y Café',
        price: 42,
        badge: 'Refrescante',
        description: 'Naranjada, limonada con chía o agua mineral preparada con limón.'
      },
      {
        id: 'POS-RENT-1',
        name: 'Renta de Pala de Pádel Pro',
        category: 'Renta y Accesorios',
        price: 80,
        badge: 'Por Partido',
        description: 'Pala de fibra de vidrio/carbono para adulto o versión ligera para niño/adulto mayor.'
      },
      {
        id: 'POS-RENT-2',
        name: 'Tubo de 3 Pelotas Nuevas',
        category: 'Renta y Accesorios',
        price: 195,
        badge: 'Presión Oficial',
        description: 'Bote nuevo de 3 pelotas de pádel de alta visibilidad.'
      },
      {
        id: 'POS-COURT-1',
        name: 'Renta 1 Hora Cancha Techada (Mostrador)',
        category: 'Canchas y Clases',
        price: 400,
        badge: 'Cobro Rápido POS',
        description: 'Cobro directo en recepción por 1 hora de cancha techada.'
      },
      {
        id: 'POS-CLASS-1',
        name: 'Clase Muestra / Sesión Individual',
        category: 'Canchas y Clases',
        price: 220,
        badge: 'Academia',
        description: 'Registro rápido en caja para clase individual o familiar.'
      }
    ],

    // Entrenadores (Sección Nosotros)
    coaches: [
      {
        id: 'COACH-1',
        name: 'Alejandro "Alex" Vega',
        role: 'Head Coach & Director Deportivo',
        specialty: 'Clínicas Familiares, Táctica en Pareja y Torneos',
        experience: '8 años de experiencia · Certificado FMP',
        bio: 'Apasionado por enseñar el pádel de forma clara y divertida. Especialista en integrar a familias completas dentro de la cancha.',
        schedule: 'Lun a Sáb · 9:00 AM a 8:00 PM'
      },
      {
        id: 'COACH-2',
        name: 'Sofía Morales',
        role: 'Coach Academia Pádel Kids & Iniciación',
        specialty: 'Niños pequeños (4 a 12 años) y Principiantes',
        experience: 'Lic. en Educación Física · Especialista Infantil',
        bio: 'Experta en psicomotricidad y enseñanza lúdica para que los más pequeños amen el deporte en un entorno 100% seguro.',
        schedule: 'Lun a Vie · 3:00 PM a 7:00 PM'
      },
      {
        id: 'COACH-3',
        name: 'Roberto Domínguez',
        role: 'Coach Vital Senior & Técnica',
        specialty: 'Adultos Mayores Activos y Control de Juego',
        experience: '10 años en deportes de raqueta y salud articular',
        bio: 'Diseña sesiones dinámicas de bajo impacto ideales para adultos mayores que buscan salud, convivencia y gran nivel de juego.',
        schedule: 'Mar, Jue y Fin de Semana · 8:00 AM a 2:00 PM'
      }
    ],

    // Control de Ingresos (Flujo de Reservaciones, Clases y Comida)
    transactions: [
      {
        id: 'VC-1001',
        date: today,
        time: '08:50 AM',
        stream: 'Reservaciones',
        concept: 'Reserva Cancha Techada 1 (9:00 AM) · Familia Hernández',
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
        concept: 'Inscripción Vital Senior · Grupo Adultos Mayores',
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
        concept: '2x Club Sándwich Vital + 2x Smoothie Match-Point',
        customer: 'Mesa Lounge 2 (Familia Hernández)',
        paymentMethod: 'Tarjeta',
        amount: 426,
        status: 'Pagado'
      },
      {
        id: 'VC-1004',
        date: today,
        time: '03:55 PM',
        stream: 'Clases y Torneos',
        concept: 'Mensualidad Pádel Kids (Niños) · Mateo Gómez',
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
        concept: 'Reserva Cancha Techada 2 (5:00 PM) + Renta Pala',
        customer: 'Carlos Piña',
        paymentMethod: 'Tarjeta',
        amount: 480,
        status: 'Pagado'
      },
      {
        id: 'VC-1006',
        date: today,
        time: '06:20 PM',
        stream: 'Comida y Bebidas',
        concept: '1x Baguette Serrano & Pesto + 2x Cold Brew Vital + 1x Mini Sándwich Kids',
        customer: 'Barra Zona de Comida',
        paymentMethod: 'Efectivo',
        amount: 366,
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
    return JSON.parse(raw);
  } catch (e) {
    return buildInitialState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error guardando estado:', e);
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  const bg = type === 'success' ? 'bg-vital-900 text-vital-cream border-vital-lime/50' : 'bg-vital-orange text-white border-white/20';
  el.className = `pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border ${bg} flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all duration-300`;
  el.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-vital-lime"></span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// ============================================================================
// NAVIGATION: CLIENT VS COACH VS ADMIN MODE
// ============================================================================

function switchMainMode(mode) {
  const clientView = document.getElementById('view-client');
  const coachView = document.getElementById('view-coach');
  const adminView = document.getElementById('view-admin');
  const clientNav = document.getElementById('client-nav');
  const adminNav = document.getElementById('admin-nav');
  const btnClient = document.getElementById('btn-mode-client');
  const btnCoach = document.getElementById('btn-mode-coach');
  const btnAdmin = document.getElementById('btn-mode-admin');

  const activeClass = 'px-3 py-1.5 rounded-xl bg-vital-lime text-vital-950 transition flex items-center gap-1.5 shadow font-extrabold';
  const inactiveClass = 'px-3 py-1.5 rounded-xl text-vital-cream/80 hover:text-white transition flex items-center gap-1.5';

  if (btnClient) btnClient.className = mode === 'client' ? activeClass : inactiveClass;
  if (btnCoach) btnCoach.className = mode === 'coach' ? activeClass : inactiveClass;
  if (btnAdmin) btnAdmin.className = mode === 'admin' ? activeClass : inactiveClass;

  if (mode === 'admin') {
    clientView?.classList.add('hidden');
    coachView?.classList.add('hidden');
    adminView?.classList.remove('hidden');
    clientNav?.classList.add('hidden');
    clientNav?.classList.remove('lg:flex');
    adminNav?.classList.remove('hidden');
    adminNav?.classList.add('hidden', 'lg:flex');
    renderAllAdminViews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (mode === 'coach') {
    clientView?.classList.add('hidden');
    adminView?.classList.add('hidden');
    coachView?.classList.remove('hidden');
    clientNav?.classList.add('hidden');
    clientNav?.classList.remove('lg:flex');
    adminNav?.classList.add('hidden');
    adminNav?.classList.remove('lg:flex');
    populateCoachSelector();
    renderCoachView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    adminView?.classList.add('hidden');
    coachView?.classList.add('hidden');
    clientView?.classList.remove('hidden');
    adminNav?.classList.add('hidden');
    adminNav?.classList.remove('lg:flex');
    clientNav?.classList.remove('hidden');
    clientNav?.classList.add('hidden', 'lg:flex');
    renderAllClientViews();
  }
  if (window.lucide) lucide.createIcons();
}

function switchAdminTab(tabName) {
  const tabs = ['dashboard', 'pos', 'registro', 'ingresos'];
  const titles = {
    dashboard: 'Dashboard Ejecutivo y Números del Club',
    pos: 'Punto de Venta (POS) · Comida, Bebidas y Canchas',
    registro: 'Control Maestro de Canchas, Clases y Mantenimiento',
    ingresos: 'Control de Ingresos y Catálogo 100% Gestionable'
  };

  tabs.forEach(t => {
    const sec = document.getElementById(`admin-tab-${t}`);
    if (sec) sec.classList.toggle('hidden', t !== tabName);
  });

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    const isCurrent = btn.getAttribute('data-admin-tab') === tabName;
    if (isCurrent) {
      btn.className = 'admin-tab-btn px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition bg-vital-lime text-vital-950 font-bold shrink-0';
    } else {
      btn.className = 'admin-tab-btn px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition text-vital-cream/80 hover:text-white bg-white/5 shrink-0';
    }
  });

  const titleEl = document.getElementById('admin-header-title');
  if (titleEl && titles[tabName]) titleEl.textContent = titles[tabName];

  renderAllAdminViews();
  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// CLIENT VIEWS: HERO, RESERVATIONS, PROGRAMS, FOOD MENU, COACHES
// ============================================================================

function renderHeroLiveStatus() {
  const dateLabel = document.getElementById('hero-live-date');
  const container = document.getElementById('hero-courts-status');
  if (!container) return;

  const today = getTodayISO(0);
  if (dateLabel) {
    const dObj = new Date(today + 'T12:00:00');
    dateLabel.textContent = dObj.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  const totalHours = state.settings.closeHour - state.settings.openHour;
  container.innerHTML = state.settings.courts.map(court => {
    const bookedCount = state.reservations.filter(r => r.date === today && r.courtId === court.id).length;
    const freeCount = Math.max(0, totalHours - bookedCount);
    return `
      <a href="#reservar" class="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-2.5 transition block">
        <div class="font-bold text-vital-cream truncate">${court.shortName}</div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-[11px] text-vital-lime font-extrabold">${freeCount} hrs libres hoy</span>
          <span class="text-[11px] text-vital-cream/80">$${court.hourlyRate}/hr</span>
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
    const dayNum = d.getDate();
    const monthShort = d.toLocaleDateString('es-MX', { month: 'short' });
    days.push({ iso, dayName, dayNum, monthShort });
  }

  const html = days.map(d => {
    const active = d.iso === selectedDate;
    return `
      <button onclick="selectBookingDate('${d.iso}')" class="px-4 py-2.5 rounded-2xl border text-left transition shrink-0 ${
        active
          ? 'bg-vital-900 text-vital-cream border-vital-900 shadow-md'
          : 'bg-vital-cream/60 hover:bg-vital-sand text-vital-900 border-vital-900/10'
      }">
        <div class="text-[11px] uppercase font-extrabold ${active ? 'text-vital-lime' : 'text-vital-900/60'}">${d.dayName}</div>
        <div class="text-sm font-extrabold">${d.dayNum} ${d.monthShort}</div>
      </button>
    `;
  }).join('');

  if (strip) strip.innerHTML = html;
  if (coachStrip) coachStrip.innerHTML = html;
}

function selectBookingDate(isoDate) {
  selectedDate = isoDate;
  renderDateStrip();
  renderClientCourtsGrid();
  renderCoachView();
  renderAdminCourtsSchedule();
  renderAdminDashboard();
}

function handleDateInputChange(val) {
  if (!val) return;
  selectBookingDate(val);
}

function renderClientCourtsGrid() {
  const container = document.getElementById('client-courts-container');
  const filterSelect = document.getElementById('court-filter-select');
  if (!container) return;

  const filterVal = filterSelect ? filterSelect.value : 'all';
  const courtsToShow = state.settings.courts.filter(c => filterVal === 'all' || c.id === filterVal);

  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hours = [];
  for (let h = openH; h < closeH; h++) hours.push(h);

  container.innerHTML = courtsToShow.map(court => {
    const dayBookings = state.reservations.filter(r => r.date === selectedDate && r.courtId === court.id);
    const freeSlots = hours.length - dayBookings.length;

    const slotsHtml = hours.map(hr => {
      const booking = dayBookings.find(r => Number(r.hour) === hr);
      const timeText = `${formatHourLabel(hr)} – ${formatHourLabel(hr + 1)}`;

      if (!booking) {
        return `
          <button onclick="openBookingModal('${court.id}', ${hr})" class="slot-card group text-left p-3.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/70 hover:bg-vital-lime hover:border-vital-900 transition flex items-center justify-between gap-2">
            <div>
              <div class="text-xs font-extrabold text-vital-900 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-600 group-hover:bg-vital-950"></span>
                ${timeText}
              </div>
              <div class="text-[11px] font-semibold text-emerald-900/80 group-hover:text-vital-950 mt-0.5">
                Disponible · Clic para apartar
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="inline-block px-2.5 py-1 rounded-xl bg-white group-hover:bg-vital-900 group-hover:text-vital-lime text-vital-900 font-extrabold text-xs shadow-sm">
                $${court.hourlyRate}
              </span>
            </div>
          </button>
        `;
      }

      if (booking.type === 'Mantenimiento') {
        return `
          <div class="p-3.5 rounded-2xl border border-amber-400/70 bg-amber-50/90 text-amber-950 flex items-center justify-between gap-2 opacity-95 cursor-not-allowed" title="${booking.notes || 'Horario en mantenimiento'}">
            <div class="min-w-0">
              <div class="text-xs font-extrabold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-600"></span>
                ${timeText}
              </div>
              <div class="text-[11px] font-bold truncate mt-0.5">
                🔧 ${booking.customer}
              </div>
              <div class="text-[10px] text-amber-800 truncate">${booking.notes || 'No disponible para reserva'}</div>
            </div>
            <div class="text-right shrink-0">
              <span class="inline-block px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-amber-600 text-white">
                Mantenimiento
              </span>
              <div class="text-[10px] font-bold text-amber-900 mt-0.5">Cerrada</div>
            </div>
          </div>
        `;
      }

      const isClass = booking.type === 'Clase' || booking.type === 'Torneo';
      return `
        <div class="p-3.5 rounded-2xl border ${
          isClass
            ? 'border-vital-orange/40 bg-orange-50/80 text-vital-950'
            : 'border-stone-300 bg-stone-100 text-stone-600'
        } flex items-center justify-between gap-2 opacity-90">
          <div class="min-w-0">
            <div class="text-xs font-extrabold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full ${isClass ? 'bg-vital-orange' : 'bg-stone-400'}"></span>
              ${timeText}
            </div>
            <div class="text-[11px] font-bold truncate mt-0.5">
              ${isClass ? `🏆 ${booking.customer}` : `🔒 Apartada · ${booking.customer}`}
            </div>
            ${booking.coachName ? `<div class="text-[10px] font-semibold text-vital-orange truncate">Coach: ${booking.coachName}</div>` : ''}
          </div>
          <div class="text-right shrink-0">
            <span class="inline-block px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
              isClass ? 'bg-vital-orange text-white' : 'bg-stone-300 text-stone-800'
            }">
              ${isClass ? booking.type : booking.status}
            </span>
            <div class="text-[10px] font-bold mt-0.5">$${booking.amount}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-vital-900/10 flex flex-col justify-between">
        <div>
          <!-- Court Card Header -->
          <div class="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-vital-900/10">
            <div>
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-vital-900 text-vital-lime text-[11px] font-extrabold uppercase tracking-wider">
                <i data-lucide="umbrella" class="w-3.5 h-3.5"></i> ${court.badge}
              </div>
              <h3 class="font-brand text-2xl text-vital-900 mt-2">${court.name}</h3>
              <p class="text-xs text-vital-900/70 mt-1">${court.description}</p>
            </div>
            <div class="bg-vital-cream px-4 py-2.5 rounded-2xl border border-vital-900/10 text-right">
              <span class="text-[11px] font-bold text-vital-900/60 block uppercase">Tarifa por Hora</span>
              <span class="font-brand text-2xl text-vital-900">$${court.hourlyRate} <span class="text-xs font-sans font-bold">MXN</span></span>
              <span class="block text-[11px] font-extrabold text-emerald-700">${freeSlots} horarios libres</span>
            </div>
          </div>

          <!-- Hourly Slots Grid -->
          <div class="grid sm:grid-cols-2 gap-2.5 mt-5">
            ${slotsHtml}
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-vital-900/10 flex flex-wrap items-center justify-between gap-2 text-xs text-vital-900/70">
          <span>☔ <strong>Cancha 100% Techada:</strong> Tu partido está garantizado aunque llueva.</span>
          <span class="font-bold text-vital-900">Incluye iluminación LED</span>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// PROGRAMS (CLASES Y TORNEOS) WITH CARD PAYMENT REGISTRATION
// ============================================================================

function filterPrograms(category) {
  currentProgramFilter = category;
  document.querySelectorAll('.prog-filter-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-prog-filter') === category;
    btn.className = isAct
      ? 'prog-filter-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-vital-lime text-vital-950 transition'
      : 'prog-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-vital-cream hover:bg-white/20 transition';
  });
  renderClientPrograms();
}

function renderClientPrograms() {
  const grid = document.getElementById('client-programs-grid');
  if (!grid) return;

  const list = state.programs.filter(p => currentProgramFilter === 'all' || p.category === currentProgramFilter);

  grid.innerHTML = list.map(prog => {
    const spotsLeft = Math.max(0, Number(prog.spotsTotal) - Number(prog.spotsTaken));
    const percentFull = Math.min(100, Math.round((prog.spotsTaken / prog.spotsTotal) * 100));

    return `
      <div class="bg-vital-950/80 border border-white/15 rounded-3xl p-6 flex flex-col justify-between hover:border-vital-lime/50 transition shadow-xl">
        <div class="space-y-3.5">
          <div class="flex items-center justify-between gap-2">
            <span class="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-vital-orange/20 text-vital-orange border border-vital-orange/30">
              ${prog.category}
            </span>
            <span class="text-xs font-bold text-vital-lime flex items-center gap-1">
              <i data-lucide="umbrella" class="w-3.5 h-3.5"></i> ${prog.court}
            </span>
          </div>

          <h3 class="font-brand text-xl sm:text-2xl text-vital-cream leading-snug">${prog.title}</h3>
          <p class="text-xs sm:text-sm text-vital-cream/75 leading-relaxed">${prog.description}</p>

          <div class="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1.5 text-xs">
            <div class="flex items-center gap-2 text-vital-cream font-bold">
              <i data-lucide="clock" class="w-4 h-4 text-vital-lime shrink-0"></i>
              <span>${prog.schedule}</span>
            </div>
            <div class="flex items-center gap-2 text-vital-cream/85">
              <i data-lucide="user-check" class="w-4 h-4 text-vital-orange shrink-0"></i>
              <span>${prog.coach} · <strong>${prog.ageRange}</strong></span>
            </div>
          </div>

          <!-- Spots Progress -->
          <div>
            <div class="flex justify-between text-xs font-bold mb-1">
              <span class="text-vital-cream/75">Cupos disponibles</span>
              <span class="${spotsLeft <= 3 ? 'text-vital-orange' : 'text-vital-lime'}">${spotsLeft} lugares libres de ${prog.spotsTotal}</span>
            </div>
            <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full bg-vital-lime rounded-full" style="width: ${percentFull}%"></div>
            </div>
          </div>
        </div>

        <div class="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <span class="font-brand text-2xl text-vital-cream">$${prog.price} <span class="text-xs font-sans">MXN</span></span>
            <span class="block text-[11px] text-vital-cream/65">${prog.priceLabel}</span>
          </div>
          <button onclick="openProgramEnrollModal('${prog.id}')" class="px-4 py-3 rounded-2xl bg-vital-lime hover:bg-vital-lime/90 text-vital-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition shrink-0">
            <i data-lucide="credit-card" class="w-4 h-4"></i>
            Inscribirme
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// ZONA DE COMIDA (SÁNDWICHES Y BEBIDAS) & PRE-ORDER CART
// ============================================================================

function filterFoodMenu(cat) {
  currentFoodFilter = cat;
  document.querySelectorAll('.food-filter-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-food-filter') === cat;
    btn.className = isAct
      ? 'food-filter-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-vital-900 text-vital-cream transition'
      : 'food-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-white border border-vital-900/15 text-vital-900 hover:bg-vital-sand transition';
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
    const isFood = item.category.includes('Sándwiches');
    const isDrink = item.category.includes('Bebidas');
    const iconName = isFood ? 'sandwich' : isDrink ? 'cup-soda' : 'tennis-ball';

    return `
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-vital-900/10 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-vital-sand text-vital-900">
              ${item.badge || item.category}
            </span>
            <span class="w-8 h-8 rounded-xl bg-vital-900/5 text-vital-900 flex items-center justify-center font-bold text-sm">
              ${isFood ? '🥪' : isDrink ? '🥤' : '🏓'}
            </span>
          </div>
          <h3 class="font-brand text-xl text-vital-900 leading-snug">${item.name}</h3>
          <p class="text-xs text-vital-900/70 mt-1.5 leading-relaxed">${item.description || ''}</p>
        </div>

        <div class="pt-4 mt-4 border-t border-vital-900/10 flex items-center justify-between">
          <span class="font-brand text-2xl text-vital-900">$${item.price} <span class="text-xs font-sans font-bold">MXN</span></span>
          <button onclick="addToClientFoodCart('${item.id}')" class="px-3.5 py-2 rounded-xl bg-vital-900 hover:bg-vital-800 text-vital-lime text-xs font-extrabold flex items-center gap-1.5 transition">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Pedir
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function addToClientFoodCart(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;
  const existing = clientFoodCart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    clientFoodCart.push({ ...item, qty: 1 });
  }
  updateClientCartBadge();
  showToast(`Agregado: ${item.name} ($${item.price})`);
}

function updateClientCartBadge() {
  const badge = document.getElementById('client-cart-count');
  if (!badge) return;
  const count = clientFoodCart.reduce((acc, i) => acc + i.qty, 0);
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

function openClientFoodCart() {
  if (clientFoodCart.length === 0) {
    showToast('Agrega sándwiches o bebidas de la Zona de Comida para hacer tu pedido', 'info');
    document.getElementById('comida')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const total = clientFoodCart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemsHtml = clientFoodCart.map(item => `
    <div class="flex items-center justify-between py-2 border-b border-stone-200 text-sm">
      <div>
        <span class="font-bold text-vital-900">${item.qty}x ${item.name}</span>
        <span class="block text-xs text-stone-500">$${item.price} c/u</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-extrabold">$${item.qty * item.price}</span>
        <button onclick="removeClientFoodItem('${item.id}')" class="text-xs text-rose-600 font-bold px-2 py-0.5 rounded bg-rose-50">✕</button>
      </div>
    </div>
  `).join('');

  openModal(`
    <div class="space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-extrabold uppercase text-vital-orange">Zona de Comida · Vital Club</span>
          <h3 class="font-brand text-2xl text-vital-900">Tu Pedido de Sándwiches y Bebidas</h3>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100 hover:bg-stone-200">✕</button>
      </div>

      <div class="max-h-52 overflow-y-auto">${itemsHtml}</div>

      <form onsubmit="submitClientFoodOrder(event)" class="space-y-3.5">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-600">Tu Nombre o Familia *</label>
            <input type="text" id="food-order-name" required placeholder="Ej. Familia Morales" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
          <div>
            <label class="text-xs font-bold text-stone-600">¿Para qué cancha o hora?</label>
            <input type="text" id="food-order-note" placeholder="Ej. Al salir de Cancha 1 (6pm)" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
        </div>

        <div class="bg-vital-cream p-4 rounded-2xl border border-vital-900/15 space-y-2">
          <div class="flex items-center justify-between text-xs font-extrabold text-vital-900 uppercase">
            <span>Pago con Tarjeta o en Barra</span>
            <span>💳 Visa · Mastercard · Amex</span>
          </div>
          <select id="food-order-pay" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm font-bold">
            <option value="Tarjeta">💳 Pagar ahora con Tarjeta ($${total} MXN)</option>
            <option value="Efectivo">💵 Pagar en Barra al recoger ($${total} MXN)</option>
          </select>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div>
            <span class="text-xs text-stone-500 block">Total del Pedido</span>
            <span class="font-brand text-2xl text-vital-900">${formatMXN(total)}</span>
          </div>
          <button type="submit" class="px-6 py-3.5 rounded-2xl bg-vital-900 text-vital-lime font-extrabold text-sm shadow-lg">
            Confirmar Pedido
          </button>
        </div>
      </form>
    </div>
  `);
}

function removeClientFoodItem(id) {
  clientFoodCart = clientFoodCart.filter(i => i.id !== id);
  updateClientCartBadge();
  if (clientFoodCart.length === 0) {
    closeModal();
  } else {
    openClientFoodCart();
  }
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
  showReceiptModal(newTx, 'Pedido en Zona de Comida Confirmado');
}

// ============================================================================
// COACHES SECTION (NOSOTROS)
// ============================================================================

function renderClientCoaches() {
  const grid = document.getElementById('client-coaches-grid');
  if (!grid) return;

  grid.innerHTML = state.coaches.map(coach => {
    const initials = coach.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-vital-900/10 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3.5 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-vital-900 text-vital-lime font-brand text-xl flex items-center justify-center shrink-0 shadow">
              ${initials}
            </div>
            <div>
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-vital-orange">${coach.role}</span>
              <h4 class="font-brand text-xl text-vital-900">${coach.name}</h4>
              <p class="text-xs text-vital-900/60 font-semibold">${coach.experience}</p>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-vital-900/80 leading-relaxed mb-3">${coach.bio}</p>
          <div class="bg-vital-cream p-3 rounded-2xl border border-vital-900/10 text-xs space-y-1">
            <div><strong class="text-vital-900">Especialidad:</strong> ${coach.specialty}</div>
            <div><strong class="text-vital-900">Horario:</strong> ${coach.schedule}</div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-vital-900/10 flex items-center justify-between">
          <a href="#clases" class="text-xs font-extrabold text-vital-700 hover:underline">Ver sus grupos →</a>
          <a href="https://wa.me/527151317443?text=${encodeURIComponent('Hola Vital Club, quiero agendar clase con ' + coach.name)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-vital-900 text-vital-lime text-xs font-bold">
            Agendar Clase
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// INTERACTIVE BOOKING MODAL & CARD CHECKOUT
// ============================================================================

function openBookingModal(courtId, hour) {
  const court = state.settings.courts.find(c => c.id === courtId) || state.settings.courts[0];
  const basePrice = Number(court.hourlyRate) || 400;

  openModal(`
    <div class="space-y-5">
      <div class="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span class="inline-flex items-center gap-1 text-xs font-extrabold uppercase text-vital-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            ☔ Cancha 100% Techada · Reserva Inmediata
          </span>
          <h3 class="font-brand text-2xl text-vital-900 mt-1">${court.name}</h3>
          <p class="text-xs text-stone-600 font-semibold">Fecha: <strong>${selectedDate}</strong> · Horario: <strong>${formatHourLabel(hour)} – ${formatHourLabel(hour + 1)}</strong></p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600">✕</button>
      </div>

      <form onsubmit="confirmCourtBooking(event, '${court.id}', ${hour})" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Nombre de quien aparta *</label>
            <input type="text" id="book-customer" required placeholder="Ej. Alejandro Ruiz / Familia" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold focus:outline-none focus:border-vital-900" />
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Teléfono / WhatsApp *</label>
            <input type="tel" id="book-phone" required placeholder="Ej. 715 131 7443" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold focus:outline-none focus:border-vital-900" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Tipo de Juego</label>
            <select id="book-notes" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold">
              <option value="Partido Familiar (Todas las edades)">👨‍👩‍👧‍👦 Partido Familiar</option>
              <option value="Partido Amistoso / Retas">🎾 Partido Amistoso / Retas</option>
              <option value="Práctica con Niños">🧒 Práctica con Niños</option>
              <option value="Adultos Mayores / Vital Senior">🤍 Adultos Mayores</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Agregar Extras (Opcional)</label>
            <select id="book-extra" onchange="recalcBookingModalTotal(${basePrice})" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold">
              <option value="0">Sin extras ($0)</option>
              <option value="80">+ Renta 1 Pala Pro (+$80)</option>
              <option value="160">+ Renta 2 Palas Pro (+$160)</option>
              <option value="195">+ Tubo 3 Pelotas Nuevas (+$195)</option>
            </select>
          </div>
        </div>

        <!-- Card Payment Section -->
        <div class="bg-vital-cream p-4 rounded-2xl border border-vital-900/15 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-extrabold uppercase text-vital-900">Método de Pago</label>
            <span class="text-[11px] font-bold text-vital-700">🔒 Pago Seguro</span>
          </div>
          <select id="book-payment-method" onchange="toggleCardInputs('book-card-fields', this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm font-bold">
            <option value="Tarjeta">💳 Pagar en línea con Tarjeta (Visa / Mastercard / Amex)</option>
            <option value="Transferencia">📲 Transferencia / Anticipo</option>
            <option value="Efectivo">💵 Pagar en Recepción al llegar</option>
          </select>

          <div id="book-card-fields" class="grid grid-cols-12 gap-2 pt-1">
            <input type="text" placeholder="Número de tarjeta (16 dígitos)" maxlength="19" class="col-span-12 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold" />
            <input type="text" placeholder="MM/AA" maxlength="5" class="col-span-6 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold" />
            <input type="password" placeholder="CVV" maxlength="4" class="col-span-6 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold" />
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-stone-200">
          <div>
            <span class="text-xs text-stone-500 block">Total a registrar</span>
            <span id="book-modal-total" class="font-brand text-2xl text-vital-900">$${basePrice} MXN</span>
          </div>
          <button type="submit" class="px-6 py-3.5 rounded-2xl bg-vital-900 hover:bg-vital-800 text-vital-lime font-extrabold text-sm shadow-lg transition">
            Confirmar y Apartar Cancha
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
  const box = document.getElementById(containerId);
  if (!box) return;
  box.classList.toggle('hidden', method !== 'Tarjeta');
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
    notes: extra > 0 ? `${notes} (+Extras $${extra})` : notes
  };

  const newTx = {
    id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
    date: selectedDate,
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream: 'Reservaciones',
    concept: `Reserva ${court.shortName} (${formatHourLabel(hour)}) · ${customer}`,
    customer,
    paymentMethod,
    amount: totalAmount,
    status: newRes.status
  };

  state.reservations.push(newRes);
  state.transactions.unshift(newTx);
  saveState();
  renderAllClientViews();
  showReceiptModal(newTx, '¡Cancha Techada Apartada con Éxito!');
}

// ============================================================================
// CLASS / TOURNAMENT ENROLLMENT MODAL WITH CARD CHECKOUT
// ============================================================================

function openProgramEnrollModal(progId) {
  const prog = state.programs.find(p => p.id === progId);
  if (!prog) return;

  openModal(`
    <div class="space-y-5">
      <div class="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span class="text-xs font-extrabold uppercase text-vital-orange">${prog.category} · Inscripción en Línea</span>
          <h3 class="font-brand text-2xl text-vital-900 mt-0.5">${prog.title}</h3>
          <p class="text-xs text-stone-600 font-semibold mt-1">${prog.schedule} · ${prog.coach}</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100 hover:bg-stone-200">✕</button>
      </div>

      <form onsubmit="confirmProgramEnrollment(event, '${prog.id}')" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Nombre del Alumno / Pareja *</label>
            <input type="text" id="enroll-name" required placeholder="Ej. Sofía Rodríguez" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Teléfono de Contacto *</label>
            <input type="tel" id="enroll-phone" required placeholder="Ej. 715 131 7443" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Categoría de Edad</label>
            <select id="enroll-age" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold">
              <option value="Niño / Infantil (4-12 años)">🧒 Niño / Infantil (4-12 años)</option>
              <option value="Joven / Adulto">🎾 Joven / Adulto</option>
              <option value="Familia Completa">👨‍👩‍👧‍👦 Familia Completa</option>
              <option value="Adulto Mayor (Vital Senior)">🤍 Adulto Mayor (Vital Senior)</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Método de Pago</label>
            <select id="enroll-pay-method" onchange="toggleCardInputs('enroll-card-box', this.value)" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold">
              <option value="Tarjeta">💳 Pago con Tarjeta</option>
              <option value="Transferencia">📲 Transferencia</option>
              <option value="Efectivo">💵 Pago en Recepción</option>
            </select>
          </div>
        </div>

        <!-- Card Input Box -->
        <div id="enroll-card-box" class="bg-vital-cream p-4 rounded-2xl border border-vital-900/15 space-y-2.5">
          <div class="flex items-center justify-between text-xs font-extrabold text-vital-900">
            <span>Datos de Tarjeta (Crédito o Débito)</span>
            <span>💳 Visa / MC / Amex</span>
          </div>
          <input type="text" placeholder="Número de tarjeta •••• •••• •••• ••••" maxlength="19" class="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold" />
          <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Vencimiento (MM/AA)" maxlength="5" class="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold" />
            <input type="password" placeholder="CVV (3 dígitos)" maxlength="4" class="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold" />
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-stone-200">
          <div>
            <span class="text-xs text-stone-500 block">Inscripción Total</span>
            <span class="font-brand text-2xl text-vital-900">${formatMXN(prog.price)}</span>
          </div>
          <button type="submit" class="px-6 py-3.5 rounded-2xl bg-vital-900 hover:bg-vital-800 text-vital-lime font-extrabold text-sm shadow-lg transition">
            Pagar e Inscribirme
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
  const ageGroup = document.getElementById('enroll-age').value;
  const paymentMethod = document.getElementById('enroll-pay-method').value;

  if (prog.spotsTaken < prog.spotsTotal) {
    prog.spotsTaken += 1;
  }

  const newTx = {
    id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
    date: getTodayISO(0),
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream: 'Clases y Torneos',
    concept: `Inscripción: ${prog.title} (${ageGroup})`,
    customer: student,
    paymentMethod,
    amount: Number(prog.price),
    status: 'Pagado'
  };

  state.transactions.unshift(newTx);
  saveState();
  renderAllClientViews();
  showReceiptModal(newTx, '¡Inscripción a Clase / Torneo Confirmada!');
}

// ============================================================================
// ADMIN VIEWS: 1. DASHBOARD, 2. POS, 3. COURT REGISTRY, 4. INCOME & CATALOG
// ============================================================================

function renderAllAdminViews() {
  renderAdminDashboard();
  renderPosCatalog();
  renderPosCart();
  renderAdminCourtsSchedule();
  renderAdminIncomeTable();
  renderAdminCatalogManagers();
}

function renderAdminDashboard() {
  const kpiContainer = document.getElementById('dashboard-kpi-cards');
  const barsContainer = document.getElementById('dashboard-streams-bars');
  const occContainer = document.getElementById('dashboard-court-occupancy');
  const recentTxContainer = document.getElementById('dashboard-recent-tx');
  const upcomingContainer = document.getElementById('dashboard-upcoming-list');
  if (!kpiContainer) return;

  const totalIncome = state.transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const resIncome = state.transactions.filter(t => t.stream === 'Reservaciones').reduce((s, t) => s + Number(t.amount || 0), 0);
  const classIncome = state.transactions.filter(t => t.stream === 'Clases y Torneos').reduce((s, t) => s + Number(t.amount || 0), 0);
  const foodIncome = state.transactions.filter(t => t.stream === 'Comida y Bebidas' || t.stream === 'Accesorios y Otros').reduce((s, t) => s + Number(t.amount || 0), 0);

  const openHoursCount = (state.settings.closeHour - state.settings.openHour) * state.settings.courts.length;
  const todayBookings = state.reservations.filter(r => r.date === selectedDate);
  const occupancyPct = openHoursCount > 0 ? Math.min(100, Math.round((todayBookings.length / openHoursCount) * 100)) : 0;

  kpiContainer.innerHTML = `
    <div class="bg-vital-900 text-vital-cream rounded-3xl p-5 shadow-md border border-vital-800">
      <div class="flex items-center justify-between text-xs text-vital-lime font-extrabold uppercase">
        <span>Ingresos Totales Registrados</span>
        <i data-lucide="trending-up" class="w-4 h-4"></i>
      </div>
      <div class="font-brand text-3xl mt-2">${formatMXN(totalIncome)}</div>
      <div class="text-[11px] text-vital-cream/70 mt-1">${state.transactions.length} transacciones en sistema</div>
    </div>

    <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
      <div class="flex items-center justify-between text-xs text-emerald-700 font-extrabold uppercase">
        <span>Flujo Reservación Canchas</span>
        <span>🎾 2 Techadas</span>
      </div>
      <div class="font-brand text-3xl text-vital-900 mt-2">${formatMXN(resIncome)}</div>
      <div class="text-[11px] text-stone-500 mt-1">Ocupación fecha activa: <strong>${occupancyPct}%</strong></div>
    </div>

    <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
      <div class="flex items-center justify-between text-xs text-vital-orange font-extrabold uppercase">
        <span>Flujo Clases y Torneos</span>
        <span>🏆 Academia</span>
      </div>
      <div class="font-brand text-3xl text-vital-900 mt-2">${formatMXN(classIncome)}</div>
      <div class="text-[11px] text-stone-500 mt-1">${state.programs.length} programas activos</div>
    </div>

    <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
      <div class="flex items-center justify-between text-xs text-amber-700 font-extrabold uppercase">
        <span>Zona de Comida y POS</span>
        <span>🥪 Sándwiches y Bebidas</span>
      </div>
      <div class="font-brand text-3xl text-vital-900 mt-2">${formatMXN(foodIncome)}</div>
      <div class="text-[11px] text-stone-500 mt-1">${state.catalog.length} productos en catálogo</div>
    </div>
  `;

  // Stream bars
  const streams = [
    { label: '🎾 Reservaciones de Canchas Techadas', val: resIncome, color: 'bg-vital-900' },
    { label: '🏆 Clases, Academia Familiar y Torneos', val: classIncome, color: 'bg-vital-orange' },
    { label: '🥪 Zona de Comida (Sándwiches, Bebidas y POS)', val: foodIncome, color: 'bg-emerald-600' }
  ];

  barsContainer.innerHTML = streams.map(st => {
    const pct = totalIncome > 0 ? Math.round((st.val / totalIncome) * 100) : 0;
    return `
      <div class="space-y-1.5">
        <div class="flex justify-between text-xs font-bold">
          <span class="text-vital-900">${st.label}</span>
          <span class="text-vital-900 font-extrabold">${formatMXN(st.val)} (${pct}%)</span>
        </div>
        <div class="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
          <div class="h-full ${st.color} rounded-full transition-all duration-500" style="width: ${Math.max(4, pct)}%"></div>
        </div>
      </div>
    `;
  }).join('');

  // Court Occupancy Breakdown
  const hoursPerCourt = state.settings.closeHour - state.settings.openHour;
  occContainer.innerHTML = state.settings.courts.map(court => {
    const bks = todayBookings.filter(r => r.courtId === court.id);
    const pct = Math.min(100, Math.round((bks.length / hoursPerCourt) * 100));
    const courtRev = bks.reduce((s, r) => s + Number(r.amount || 0), 0);
    return `
      <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-sm text-vital-900">${court.name}</span>
          <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">${bks.length}/${hoursPerCourt} hrs ocupadas (${pct}%)</span>
        </div>
        <div class="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
          <div class="h-full bg-vital-700 rounded-full" style="width: ${pct}%"></div>
        </div>
        <div class="flex justify-between text-xs text-stone-500">
          <span>Monto apartado hoy: <strong class="text-vital-900">${formatMXN(courtRev)}</strong></span>
          <span>Tarifa base: $${court.hourlyRate}/hr</span>
        </div>
      </div>
    `;
  }).join('');

  // Recent transactions
  recentTxContainer.innerHTML = `
    <table class="w-full text-left border-collapse text-xs">
      <thead>
        <tr class="border-b border-stone-200 text-stone-500 uppercase">
          <th class="py-2">Folio</th>
          <th class="py-2">Flujo</th>
          <th class="py-2">Concepto / Cliente</th>
          <th class="py-2">Pago</th>
          <th class="py-2 text-right">Monto</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-100">
        ${state.transactions.slice(0, 6).map(t => `
          <tr>
            <td class="py-2.5 font-bold text-stone-500">${t.id}</td>
            <td class="py-2.5"><span class="px-2 py-0.5 rounded-full font-bold bg-stone-100 text-vital-900">${t.stream}</span></td>
            <td class="py-2.5">
              <div class="font-bold text-vital-900">${t.concept}</div>
              <div class="text-[11px] text-stone-500">${t.customer} · ${t.time}</div>
            </td>
            <td class="py-2.5 font-semibold">${t.paymentMethod}</td>
            <td class="py-2.5 text-right font-extrabold text-vital-900">${formatMXN(t.amount)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Upcoming bookings list
  upcomingContainer.innerHTML = todayBookings.length === 0
    ? `<p class="text-xs text-stone-500 py-4">No hay reservas registradas para ${selectedDate}.</p>`
    : todayBookings.sort((a, b) => a.hour - b.hour).map(b => {
        const cName = state.settings.courts.find(c => c.id === b.courtId)?.shortName || b.courtId;
        return `
          <div class="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-2 text-xs">
            <div>
              <div class="font-extrabold text-vital-900">${formatHourLabel(b.hour)} · ${cName}</div>
              <div class="text-stone-600 font-semibold">${b.customer} (${b.type})</div>
            </div>
            <div class="text-right">
              <span class="font-extrabold text-vital-900 block">$${b.amount}</span>
              <span class="text-[10px] font-bold text-emerald-700">${b.status}</span>
            </div>
          </div>
        `;
      }).join('');
}

// ============================================================================
// PUNTO DE VENTA (POS) LOGIC
// ============================================================================

function setPosCategory(cat) {
  currentPosCategory = cat;
  document.querySelectorAll('.pos-cat-btn').forEach(btn => {
    const isAct = btn.getAttribute('data-pos-cat') === cat;
    btn.className = isAct
      ? 'pos-cat-btn px-3.5 py-2 rounded-xl text-xs font-extrabold bg-vital-900 text-vital-cream'
      : 'pos-cat-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200';
  });
  renderPosCatalog();
}

function renderPosCatalog() {
  const grid = document.getElementById('pos-catalog-grid');
  const searchInput = document.getElementById('pos-search-input');
  if (!grid) return;

  const query = (searchInput?.value || '').toLowerCase().trim();
  const filtered = state.catalog.filter(item => {
    const matchCat = currentPosCategory === 'all' || item.category === currentPosCategory;
    const matchQuery = !query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  grid.innerHTML = filtered.map(item => `
    <button onclick="addToPosCart('${item.id}')" class="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-vital-cream hover:border-vital-900 text-left transition flex flex-col justify-between group">
      <div>
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">${item.category}</span>
        <div class="font-bold text-sm text-vital-900 mt-0.5 group-hover:text-vital-950">${item.name}</div>
      </div>
      <div class="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/70 w-full">
        <span class="font-brand text-lg text-vital-900">$${item.price}</span>
        <span class="w-6 h-6 rounded-lg bg-vital-900 text-vital-lime flex items-center justify-center text-xs font-bold">+</span>
      </div>
    </button>
  `).join('');
}

function addToPosCart(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;
  const existing = posCart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    posCart.push({ ...item, qty: 1 });
  }
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
    container.innerHTML = `
      <div class="py-8 text-center text-xs text-stone-400">
        Selecciona sándwiches, bebidas, canchas o accesorios a la izquierda para agregar a la cuenta.
      </div>
    `;
    if (qtyEl) qtyEl.textContent = '0';
    if (totalEl) totalEl.textContent = '$0.00 MXN';
    updatePosCashChange();
    return;
  }

  const totalQty = posCart.reduce((s, i) => s + i.qty, 0);
  const totalAmount = posCart.reduce((s, i) => s + i.qty * i.price, 0);

  container.innerHTML = posCart.map(item => `
    <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
      <div class="min-w-0">
        <div class="font-bold text-vital-900 truncate">${item.name}</div>
        <div class="text-stone-500">$${item.price} c/u</div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button onclick="changePosQty('${item.id}', -1)" class="w-6 h-6 rounded-lg bg-white border border-stone-300 font-bold">-</button>
        <span class="font-extrabold w-5 text-center">${item.qty}</span>
        <button onclick="changePosQty('${item.id}', 1)" class="w-6 h-6 rounded-lg bg-white border border-stone-300 font-bold">+</button>
        <span class="font-extrabold text-vital-900 w-14 text-right">$${item.qty * item.price}</span>
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
  const totalAmount = posCart.reduce((s, i) => s + i.qty * i.price, 0);

  if (cashBox) cashBox.classList.toggle('hidden', method !== 'Efectivo');
  if (changeEl) {
    const diff = received - totalAmount;
    changeEl.textContent = diff >= 0 && totalAmount > 0 ? formatMXN(diff) : '$0.00';
  }
}

function completePosSale() {
  if (posCart.length === 0) {
    showToast('Agrega al menos un producto o servicio al Punto de Venta', 'error');
    return;
  }

  const customer = document.getElementById('pos-customer-input')?.value.trim() || 'Cliente en Mostrador';
  const paymentMethod = document.getElementById('pos-payment-method')?.value || 'Efectivo';
  const totalAmount = posCart.reduce((s, i) => s + i.qty * i.price, 0);
  const concept = posCart.map(i => `${i.qty}x ${i.name}`).join(', ');

  // Determine main stream
  const hasCourtOrClass = posCart.some(i => i.category === 'Canchas y Clases');
  const stream = hasCourtOrClass ? 'Reservaciones' : 'Comida y Bebidas';

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
  if (document.getElementById('pos-customer-input')) document.getElementById('pos-customer-input').value = '';
  if (document.getElementById('pos-cash-received')) document.getElementById('pos-cash-received').value = '';
  saveState();
  renderAllAdminViews();
  showReceiptModal(newTx, 'Venta POS Registrada con Éxito');
}

// ============================================================================
// COACH VIEW (HOURLY CALENDAR, CLASSES, STUDENTS & ATTENDANCE)
// ============================================================================

function populateCoachSelector() {
  const sel = document.getElementById('coach-view-select');
  if (!sel) return;
  const currentVal = sel.value;
  const options = [
    `<option value="all" class="text-vital-950 font-bold">👥 Todos los Coaches (Vista General)</option>`,
    ...state.coaches.map(c => `<option value="${c.id}" class="text-vital-950 font-bold">👟 ${c.name} (${c.role.split('&')[0].trim()})</option>`)
  ];
  sel.innerHTML = options.join('');
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
  const dateBadge = document.getElementById('coach-active-date-badge');
  const headingEl = document.getElementById('coach-schedule-heading');
  if (!timelineWrap) return;

  if (sel && sel.options.length === 0) populateCoachSelector();
  const selectedCoachId = sel?.value || 'all';
  const selectedCoachObj = state.coaches.find(c => c.id === selectedCoachId);

  renderDateStrip();

  if (dateBadge) {
    const dObj = new Date(selectedDate + 'T12:00:00');
    dateBadge.textContent = dObj.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  if (headingEl) {
    headingEl.textContent = selectedCoachObj
      ? `Calendario por Hora · ${selectedCoachObj.name}`
      : 'Calendario por Hora · Todos los Entrenadores';
  }

  const dayBookings = state.reservations.filter(r => r.date === selectedDate);
  const myClasses = dayBookings.filter(r =>
    (r.type === 'Clase' || r.type === 'Torneo') &&
    (selectedCoachId === 'all' || r.coachId === selectedCoachId || (selectedCoachObj && r.coachName === selectedCoachObj.name))
  );
  const totalStudentsToday = myClasses.reduce((sum, c) => sum + (Array.isArray(c.students) ? c.students.length : 1), 0);
  const checkedCount = myClasses.filter(c => c.attendanceChecked).length;
  const maintCount = dayBookings.filter(r => r.type === 'Mantenimiento').length;

  if (kpiWrap) {
    kpiWrap.innerHTML = `
      <div class="bg-vital-900 text-vital-cream rounded-3xl p-5 shadow-md border border-vital-800">
        <div class="text-xs font-extrabold uppercase text-vital-lime flex items-center justify-between">
          <span>Horas de Clase en este Día</span>
          <span>🎾</span>
        </div>
        <div class="font-brand text-3xl mt-1.5">${myClasses.length} ${myClasses.length === 1 ? 'hora' : 'horas'}</div>
        <div class="text-[11px] text-vital-cream/70 mt-1">${selectedCoachObj ? selectedCoachObj.name : 'Todos los coaches'}</div>
      </div>

      <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
        <div class="text-xs font-extrabold uppercase text-vital-orange flex items-center justify-between">
          <span>Alumnos en Lista</span>
          <span>👨‍👩‍👧‍👦</span>
        </div>
        <div class="font-brand text-3xl text-vital-900 mt-1.5">${totalStudentsToday} alumnos</div>
        <div class="text-[11px] text-stone-500 mt-1">Grupos infantiles, familiares y adultos</div>
      </div>

      <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
        <div class="text-xs font-extrabold uppercase text-emerald-700 flex items-center justify-between">
          <span>Control de Asistencia</span>
          <span>✓</span>
        </div>
        <div class="font-brand text-3xl text-vital-900 mt-1.5">${checkedCount} / ${myClasses.length}</div>
        <div class="text-[11px] text-stone-500 mt-1">Clases con asistencia confirmada</div>
      </div>

      <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
        <div class="text-xs font-extrabold uppercase text-amber-700 flex items-center justify-between">
          <span>Bloqueos de Mantenimiento</span>
          <span>🔧</span>
        </div>
        <div class="font-brand text-3xl text-vital-900 mt-1.5">${maintCount} ${maintCount === 1 ? 'horario' : 'horarios'}</div>
        <div class="text-[11px] text-stone-500 mt-1">Sincronizado con el Panel Admin</div>
      </div>
    `;
  }

  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hours = [];
  for (let h = openH; h < closeH; h++) hours.push(h);

  timelineWrap.innerHTML = hours.map(hr => {
    const timeLabel = `${formatHourLabel(hr)} – ${formatHourLabel(hr + 1)}`;

    const courtsCols = state.settings.courts.map(court => {
      const booking = dayBookings.find(r => r.courtId === court.id && Number(r.hour) === hr);

      if (!booking) {
        return `
          <div class="p-3.5 rounded-2xl border border-emerald-500/25 bg-emerald-50/50 flex items-center justify-between gap-2">
            <div>
              <span class="text-[11px] font-extrabold uppercase text-emerald-800 block">${court.shortName}</span>
              <span class="text-xs font-bold text-stone-600">🟢 Cancha Libre (Sin clase ni reserva)</span>
            </div>
            <button onclick="openCoachClassModal('${court.id}', ${hr})" class="px-3 py-1.5 rounded-xl bg-vital-900 hover:bg-vital-800 text-vital-lime text-xs font-extrabold shrink-0 transition">
              + Asignar Clase
            </button>
          </div>
        `;
      }

      if (booking.type === 'Mantenimiento') {
        return `
          <div class="p-3.5 rounded-2xl border border-amber-400 bg-amber-50/90 flex items-center justify-between gap-2">
            <div>
              <span class="text-[11px] font-extrabold uppercase text-amber-800 block">${court.shortName} · 🔧 EN MANTENIMIENTO</span>
              <div class="text-xs font-extrabold text-amber-950 mt-0.5">${booking.customer}</div>
              <div class="text-[11px] text-amber-800">${booking.notes || 'Horario bloqueado por administración'}</div>
            </div>
            <span class="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[10px] font-extrabold uppercase shrink-0">No disponible</span>
          </div>
        `;
      }

      const isClass = booking.type === 'Clase' || booking.type === 'Torneo';
      const isMyClass = isClass && (
        selectedCoachId === 'all' ||
        booking.coachId === selectedCoachId ||
        (selectedCoachObj && booking.coachName === selectedCoachObj.name)
      );

      if (isClass) {
        const studentsList = Array.isArray(booking.students) && booking.students.length > 0
          ? booking.students.join(', ')
          : 'Alumnos registrados en recepción';

        return `
          <div class="p-4 rounded-2xl border-2 ${
            isMyClass
              ? 'border-vital-orange bg-orange-50/90 shadow-sm'
              : 'border-stone-300 bg-stone-100/80 opacity-80'
          } space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded-md bg-vital-900 text-vital-lime text-[10px] font-extrabold uppercase">${court.shortName}</span>
                  <span class="px-2 py-0.5 rounded-md bg-vital-orange text-white text-[10px] font-extrabold uppercase">
                    ${isMyClass ? '👟 Tu Clase Asignada' : `Clase · ${booking.coachName || 'Otro Coach'}`}
                  </span>
                </div>
                <h4 class="font-brand text-base sm:text-lg text-vital-950 mt-1">${booking.customer}</h4>
                <p class="text-xs text-stone-700 font-semibold">Coach: <strong>${booking.coachName || 'Staff Vital Club'}</strong> · ${booking.notes || ''}</p>
              </div>
              <button onclick="toggleClassAttendance('${booking.id}')" class="px-3 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 ${
                booking.attendanceChecked
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-vital-900/20 text-vital-900 hover:bg-vital-lime'
              }">
                ${booking.attendanceChecked ? '✅ Asistencia Lista' : '✓ Pasar Asistencia'}
              </button>
            </div>

            <div class="bg-white/90 p-2.5 rounded-xl border border-orange-200/80 text-xs flex items-center justify-between gap-2">
              <div class="truncate">
                <strong class="text-vital-900">Alumnos:</strong> <span class="text-stone-700">${studentsList}</span>
              </div>
              <button onclick="deleteReservation('${booking.id}')" class="text-[11px] text-rose-600 hover:underline font-bold shrink-0">Liberar</button>
            </div>
          </div>
        `;
      }

      // Regular customer court booking
      return `
        <div class="p-3.5 rounded-2xl border border-stone-300 bg-stone-100 text-stone-700 flex items-center justify-between gap-2">
          <div>
            <span class="text-[11px] font-extrabold uppercase text-stone-500 block">${court.shortName} · Renta de Cancha</span>
            <div class="text-xs font-bold text-vital-900 mt-0.5">🔒 Apartada por ${booking.customer}</div>
            <div class="text-[11px] text-stone-500">${booking.notes || 'Partido de clientes'}</div>
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-stone-300 text-stone-800 text-[10px] font-extrabold uppercase shrink-0">Ocupada</span>
        </div>
      `;
    }).join('');

    const hasCoachClassThisHour = myClasses.some(c => Number(c.hour) === hr);

    return `
      <div class="p-4 rounded-2xl border ${
        hasCoachClassThisHour ? 'border-vital-orange/60 bg-vital-cream/60' : 'border-stone-200 bg-stone-50/40'
      } grid lg:grid-cols-12 gap-3 items-center">
        <div class="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between gap-1">
          <span class="font-brand text-base sm:text-lg text-vital-900">${formatHourLabel(hr)}</span>
          <span class="text-[11px] font-bold ${hasCoachClassThisHour ? 'text-vital-orange' : 'text-stone-500'}">
            ${hasCoachClassThisHour ? '● Tienes Clase' : 'Sin clase asignada'}
          </span>
        </div>
        <div class="lg:col-span-10 grid md:grid-cols-2 gap-3">
          ${courtsCols}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleClassAttendance(resId) {
  const item = state.reservations.find(r => r.id === resId);
  if (!item) return;
  item.attendanceChecked = !item.attendanceChecked;
  saveState();
  renderCoachView();
  renderAdminCourtsSchedule();
  showToast(item.attendanceChecked ? `Asistencia confirmada: ${item.customer}` : 'Asistencia marcada como pendiente');
}

function openCoachClassModal(defaultCourtId = 'cancha-1', defaultHour = null) {
  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const chosenHour = defaultHour !== null ? Number(defaultHour) : openH;

  const hourOptions = [];
  for (let h = openH; h < closeH; h++) {
    hourOptions.push(`<option value="${h}" ${h === chosenHour ? 'selected' : ''}>${formatHourLabel(h)} – ${formatHourLabel(h + 1)}</option>`);
  }

  const coachOptions = state.coaches.map(c => `<option value="${c.id}">${c.name} (${c.role})</option>`).join('');

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <span class="text-xs font-extrabold uppercase text-vital-orange">Agenda de Coach & Academia</span>
          <h3 class="font-brand text-2xl text-vital-900">Programar Clase en Cancha Techada</h3>
          <p class="text-xs text-stone-500">Se verá reflejada en el Calendario del Coach, en Admin y bloqueará el horario para clientes.</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <form onsubmit="confirmCoachClass(event)" class="space-y-3.5">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Entrenador (Coach) *</label>
            <select id="coach-modal-coach" class="w-full mt-1 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs sm:text-sm font-bold">
              ${coachOptions}
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Nombre de la Clase / Grupo *</label>
            <input type="text" id="coach-modal-title" required placeholder="Ej. Clase Particular / Pádel Kids" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Fecha *</label>
            <input type="date" id="coach-modal-date" value="${selectedDate}" required class="w-full mt-1 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold" />
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Cancha Techada *</label>
            <select id="coach-modal-court" class="w-full mt-1 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
              ${state.settings.courts.map(c => `<option value="${c.id}" ${c.id === defaultCourtId ? 'selected' : ''}>${c.shortName}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Horario *</label>
            <select id="coach-modal-hour" class="w-full mt-1 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
              ${hourOptions.join('')}
            </select>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Alumnos (separados por coma)</label>
            <input type="text" id="coach-modal-students" placeholder="Ej. Mateo, Sofía, Familia Ruiz" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Monto de la Clase ($ MXN)</label>
            <input type="number" id="coach-modal-amount" value="350" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold" />
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-stone-700">Objetivo / Notas de la Sesión</label>
          <input type="text" id="coach-modal-notes" placeholder="Ej. Práctica de saque, volea y juego familiar" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
        </div>

        <button type="submit" class="w-full py-3.5 rounded-2xl bg-vital-900 hover:bg-vital-800 text-vital-lime font-extrabold text-sm shadow-lg transition">
          Guardar Clase en Calendario
        </button>
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
  const notes = document.getElementById('coach-modal-notes').value.trim() || 'Clase programada';

  // Remove any existing slot at that exact date/court/hour
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
    coachName: coachObj ? coachObj.name : 'Coach Vital Club',
    students,
    attendanceChecked: false,
    amount,
    status: 'Pagado',
    paymentMethod: 'Tarjeta',
    notes
  });

  if (amount > 0) {
    state.transactions.unshift({
      id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
      date,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      stream: 'Clases y Torneos',
      concept: `Clase (${formatHourLabel(hour)}): ${title} · ${coachObj ? coachObj.name : ''}`,
      customer: students.join(', '),
      paymentMethod: 'Tarjeta',
      amount,
      status: 'Pagado'
    });
  }

  selectedDate = date;
  saveState();
  closeModal();
  renderAllClientViews();
  renderCoachView();
  renderAllAdminViews();
  showToast(`Clase asignada a ${coachObj ? coachObj.name : 'Coach'} a las ${formatHourLabel(hour)}`);
}

// ============================================================================
// ADMIN MAINTENANCE BLOCK MODAL & SCHEDULE CONTROL
// ============================================================================

function openMaintenanceModal(defaultCourtId = 'cancha-1', defaultHour = null) {
  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const chosenHour = defaultHour !== null ? Number(defaultHour) : 13;

  const hourOptions = [];
  for (let h = openH; h < closeH; h++) {
    hourOptions.push(`<option value="${h}" ${h === chosenHour ? 'selected' : ''}>${formatHourLabel(h)} – ${formatHourLabel(h + 1)}</option>`);
  }

  openModal(`
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <span class="text-xs font-extrabold uppercase text-amber-700">Control de Canchas · Bloqueo Operativo</span>
          <h3 class="font-brand text-2xl text-vital-900">Agregar Horario de Mantenimiento</h3>
          <p class="text-xs text-stone-500">Durante este horario la cancha aparecerá cerrada y ningún cliente podrá apartarla.</p>
        </div>
        <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
      </div>

      <form onsubmit="confirmMaintenanceBlock(event)" class="space-y-3.5">
        <div class="grid sm:grid-cols-3 gap-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Fecha *</label>
            <input type="date" id="maint-date" value="${selectedDate}" required class="w-full mt-1 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold" />
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Cancha a Bloquear *</label>
            <select id="maint-court" class="w-full mt-1 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
              ${state.settings.courts.map(c => `<option value="${c.id}" ${c.id === defaultCourtId ? 'selected' : ''}>${c.shortName}</option>`).join('')}
              <option value="both">Ambas Canchas Techadas (1 y 2)</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Hora *</label>
            <select id="maint-hour" class="w-full mt-1 px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
              ${hourOptions.join('')}
            </select>
          </div>
        </div>

        <div>
          <label class="text-xs font-bold text-stone-700">Tipo de Mantenimiento / Bloqueo *</label>
          <select id="maint-title" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold">
            <option value="Mantenimiento Preventivo de Cancha">🔧 Mantenimiento Preventivo de Cancha</option>
            <option value="Limpieza Profunda y Cepillado de Pasto">🧹 Limpieza Profunda y Cepillado de Pasto</option>
            <option value="Revisión de Cristales, Red e Iluminación LED">💡 Revisión de Cristales, Red e Iluminación LED</option>
            <option value="Bloqueo por Evento Privado / Torneo Interno">🏆 Bloqueo por Evento Privado / Torneo Interno</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-bold text-stone-700">Observaciones para Staff y Coaches</label>
          <input type="text" id="maint-notes" placeholder="Ej. No agendar partidos ni clases durante esta hora" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
        </div>

        <button type="submit" class="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-lg transition">
          🔧 Bloquear Horario por Mantenimiento
        </button>
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
  const notes = document.getElementById('maint-notes').value.trim() || 'Bloqueado por administración para mantenimiento';

  const courtIds = courtTarget === 'both' ? state.settings.courts.map(c => c.id) : [courtTarget];

  courtIds.forEach(cId => {
    state.reservations = state.reservations.filter(r => !(r.date === date && r.courtId === cId && Number(r.hour) === hour));
    state.reservations.push({
      id: 'MANT-' + Math.floor(100 + Math.random() * 900),
      date,
      courtId: cId,
      hour,
      duration: 1,
      customer: title,
      phone: 'Staff Vital Club',
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
  showToast(`Horario de ${formatHourLabel(hour)} bloqueado por mantenimiento`);
}

// ============================================================================
// ADMIN TAB 3: CONTROL MAESTRO DE CANCHAS, CLASES Y MANTENIMIENTO
// ============================================================================

function renderAdminCourtsSchedule() {
  const container = document.getElementById('admin-courts-schedule');
  if (!container) return;

  const openH = Number(state.settings.openHour) || 8;
  const closeH = Number(state.settings.closeHour) || 20;
  const hours = [];
  for (let h = openH; h < closeH; h++) hours.push(h);

  container.innerHTML = state.settings.courts.map(court => {
    const rows = hours.map(hr => {
      const booking = state.reservations.find(r => r.date === selectedDate && r.courtId === court.id && Number(r.hour) === hr);
      if (!booking) {
        return `
          <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white border border-stone-200 text-xs">
            <div>
              <span class="font-extrabold text-vital-900">${formatHourLabel(hr)} – ${formatHourLabel(hr + 1)}</span>
              <span class="ml-2 text-emerald-700 font-bold">● Disponible ($${court.hourlyRate})</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="openBookingModal('${court.id}', ${hr})" class="px-2.5 py-1 rounded-lg bg-vital-900 text-vital-lime font-bold hover:opacity-90" title="Apartar a cliente">
                + Apartar
              </button>
              <button onclick="openCoachClassModal('${court.id}', ${hr})" class="px-2.5 py-1 rounded-lg bg-vital-orange text-white font-bold hover:opacity-90" title="Asignar clase a Coach">
                + Clase
              </button>
              <button onclick="openMaintenanceModal('${court.id}', ${hr})" class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold hover:bg-amber-200" title="Bloquear por mantenimiento">
                🔧 Mant.
              </button>
            </div>
          </div>
        `;
      }

      if (booking.type === 'Mantenimiento') {
        return `
          <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs gap-2">
            <div>
              <div class="font-extrabold text-amber-950 flex items-center gap-1.5">
                <span>🔧 ${formatHourLabel(hr)} · ${booking.customer}</span>
              </div>
              <div class="text-[11px] text-amber-800">${booking.notes || 'Horario bloqueado para clientes'}</div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-extrabold uppercase">Mantenimiento</span>
              <button onclick="deleteReservation('${booking.id}')" class="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold" title="Quitar mantenimiento y abrir horario">✕</button>
            </div>
          </div>
        `;
      }

      const isClass = booking.type === 'Clase' || booking.type === 'Torneo';
      return `
        <div class="flex items-center justify-between p-3 rounded-xl ${
          isClass ? 'bg-orange-50/80 border border-vital-orange/40' : 'bg-emerald-50/70 border border-emerald-200'
        } text-xs gap-2">
          <div>
            <div class="font-extrabold text-vital-900">
              ${formatHourLabel(hr)} · ${isClass ? '🏆 ' : '🎾 '}${booking.customer}
            </div>
            <div class="text-[11px] text-stone-600">
              ${isClass ? `<strong>Coach: ${booking.coachName || 'Asignado'}</strong> · ${booking.attendanceChecked ? '✅ Asistencia OK' : '⏳ Asistencia pendiente'}` : `${booking.type} · Tel: ${booking.phone || 'S/N'}`}
              ${booking.notes ? ` · ${booking.notes}` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="text-right">
              <span class="font-extrabold text-vital-900 block">$${booking.amount}</span>
              <span class="text-[10px] font-bold ${isClass ? 'text-vital-orange' : 'text-emerald-800'}">${booking.status} (${booking.paymentMethod})</span>
            </div>
            <button onclick="deleteReservation('${booking.id}')" class="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold" title="Liberar horario">✕</button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="bg-stone-50/70 rounded-2xl p-4 border border-stone-200 space-y-3">
        <div class="flex items-center justify-between border-b border-stone-200 pb-2">
          <h3 class="font-brand text-lg text-vital-900">${court.name}</h3>
          <span class="text-xs font-bold text-stone-500">Fecha: ${selectedDate}</span>
        </div>
        <div class="space-y-2">${rows}</div>
      </div>
    `;
  }).join('');
}

function deleteReservation(resId) {
  state.reservations = state.reservations.filter(r => r.id !== resId);
  saveState();
  renderAllAdminViews();
  renderCoachView();
  renderAllClientViews();
  showToast('Horario liberado correctamente');
}

function openManualBookingModal() {
  openBookingModal('cancha-1', state.settings.openHour);
}

// ============================================================================
// ADMIN TAB 4: CONTROL DE INGRESOS & CATÁLOGO 100% GESTIONABLE
// ============================================================================

function renderAdminIncomeTable() {
  const wrap = document.getElementById('admin-income-table-wrap');
  const filterVal = document.getElementById('income-filter-stream')?.value || 'all';
  if (!wrap) return;

  const list = state.transactions.filter(t => filterVal === 'all' || t.stream === filterVal);
  const sumFiltered = list.reduce((s, t) => s + Number(t.amount || 0), 0);

  wrap.innerHTML = `
    <div class="mb-3 flex items-center justify-between bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-200 text-xs">
      <span>Mostrando <strong>${list.length}</strong> registros</span>
      <span>Suma del filtro actual: <strong class="text-vital-900 text-sm">${formatMXN(sumFiltered)}</strong></span>
    </div>
    <table class="w-full text-left border-collapse text-xs">
      <thead>
        <tr class="border-b border-stone-200 text-stone-500 uppercase">
          <th class="py-2.5 px-2">Folio / Fecha</th>
          <th class="py-2.5 px-2">Flujo de Ingreso</th>
          <th class="py-2.5 px-2">Concepto</th>
          <th class="py-2.5 px-2">Cliente</th>
          <th class="py-2.5 px-2">Método</th>
          <th class="py-2.5 px-2 text-right">Monto</th>
          <th class="py-2.5 px-2 text-right">Acción</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-100">
        ${list.map(t => `
          <tr class="hover:bg-stone-50">
            <td class="py-2.5 px-2 font-bold text-stone-600">${t.id}<br><span class="text-[10px] font-normal">${t.date} ${t.time}</span></td>
            <td class="py-2.5 px-2"><span class="px-2.5 py-1 rounded-full font-bold bg-stone-100 text-vital-900">${t.stream}</span></td>
            <td class="py-2.5 px-2 font-bold text-vital-900">${t.concept}</td>
            <td class="py-2.5 px-2 text-stone-600">${t.customer}</td>
            <td class="py-2.5 px-2 font-semibold">${t.paymentMethod}</td>
            <td class="py-2.5 px-2 text-right font-extrabold text-vital-900">${formatMXN(t.amount)}</td>
            <td class="py-2.5 px-2 text-right">
              <button onclick="deleteTransaction('${t.id}')" class="text-rose-600 hover:underline font-bold">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function deleteTransaction(txId) {
  state.transactions = state.transactions.filter(t => t.id !== txId);
  saveState();
  renderAllAdminViews();
  showToast('Registro eliminado');
}

function renderAdminCatalogManagers() {
  // Populate court settings inputs
  const c1Input = document.getElementById('setting-price-c1');
  const c2Input = document.getElementById('setting-price-c2');
  const openSel = document.getElementById('setting-open-hour');
  const closeSel = document.getElementById('setting-close-hour');

  if (c1Input && state.settings.courts[0]) c1Input.value = state.settings.courts[0].hourlyRate;
  if (c2Input && state.settings.courts[1]) c2Input.value = state.settings.courts[1].hourlyRate;
  if (openSel) openSel.value = String(state.settings.openHour);
  if (closeSel) closeSel.value = String(state.settings.closeHour);

  // Catalog Items
  const catList = document.getElementById('admin-catalog-list');
  if (catList) {
    catList.innerHTML = state.catalog.map(item => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
        <div>
          <div class="font-bold text-vital-900">${item.name}</div>
          <div class="text-[11px] text-stone-500">${item.category} · <strong>$${item.price}</strong></div>
        </div>
        <button onclick="deleteCatalogItem('${item.id}')" class="text-rose-600 font-bold px-2 py-1 hover:bg-rose-50 rounded">✕</button>
      </div>
    `).join('');
  }

  // Programs
  const progList = document.getElementById('admin-programs-list');
  if (progList) {
    progList.innerHTML = state.programs.map(p => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
        <div>
          <div class="font-bold text-vital-900">${p.title}</div>
          <div class="text-[11px] text-stone-500">${p.schedule} · <strong>$${p.price}</strong></div>
        </div>
        <button onclick="deleteProgramItem('${p.id}')" class="text-rose-600 font-bold px-2 py-1 hover:bg-rose-50 rounded">✕</button>
      </div>
    `).join('');
  }

  // Coaches
  const coachList = document.getElementById('admin-coaches-list');
  if (coachList) {
    coachList.innerHTML = state.coaches.map(c => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
        <div>
          <div class="font-bold text-vital-900">${c.name}</div>
          <div class="text-[11px] text-stone-500">${c.role}</div>
        </div>
        <button onclick="deleteCoachItem('${c.id}')" class="text-rose-600 font-bold px-2 py-1 hover:bg-rose-50 rounded">✕</button>
      </div>
    `).join('');
  }
}

function saveCourtSettings() {
  const c1 = Number(document.getElementById('setting-price-c1')?.value || 400);
  const c2 = Number(document.getElementById('setting-price-c2')?.value || 400);
  const openH = Number(document.getElementById('setting-open-hour')?.value || 8);
  const closeH = Number(document.getElementById('setting-close-hour')?.value || 20);

  if (state.settings.courts[0]) state.settings.courts[0].hourlyRate = c1;
  if (state.settings.courts[1]) state.settings.courts[1].hourlyRate = c2;
  state.settings.openHour = openH;
  state.settings.closeHour = Math.max(openH + 2, closeH);

  saveState();
  renderAllClientViews();
  renderAllAdminViews();
  showToast('Tarifas y horarios de canchas actualizados');
}

function deleteCatalogItem(id) {
  state.catalog = state.catalog.filter(i => i.id !== id);
  saveState();
  renderAllAdminViews();
  renderAllClientViews();
  showToast('Producto eliminado del catálogo');
}

function deleteProgramItem(id) {
  state.programs = state.programs.filter(p => p.id !== id);
  saveState();
  renderAllAdminViews();
  renderAllClientViews();
  showToast('Clase / Torneo eliminado');
}

function deleteCoachItem(id) {
  state.coaches = state.coaches.filter(c => c.id !== id);
  saveState();
  renderAllAdminViews();
  renderAllClientViews();
  showToast('Entrenador eliminado');
}

function openAdminNewModal(type) {
  if (type === 'item') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Agregar Producto (Comida, Bebida o POS)</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewCatalogItem(event)" class="space-y-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Nombre del Producto o Experiencia *</label>
            <input type="text" id="new-item-name" required placeholder="Ej. Sándwich Pavo & Arándano / Clase Barre" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-stone-700">Categoría *</label>
              <select id="new-item-cat" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold">
                <option value="Sándwiches y Comida">🥪 Sándwiches y Comida</option>
                <option value="Bebidas y Café">🥤 Bebidas y Café</option>
                <option value="Renta y Accesorios">🏓 Renta y Accesorios</option>
                <option value="Canchas y Clases">🎾 Canchas / Barre / Gym</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-stone-700">Precio ($ MXN) *</label>
              <input type="number" id="new-item-price" required placeholder="120" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold" />
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Descripción breve</label>
            <input type="text" id="new-item-desc" placeholder="Ingredientes o detalles del producto..." class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
          </div>
          <button type="submit" class="w-full py-3.5 rounded-2xl bg-vital-900 text-vital-lime font-extrabold text-sm">Guardar en Catálogo y POS</button>
        </form>
      </div>
    `);
  } else if (type === 'program') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Agregar Nueva Clase, Torneo o Experiencia</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewProgram(event)" class="space-y-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Título de la Clase o Torneo *</label>
            <input type="text" id="new-prog-title" required placeholder="Ej. Torneo Familiar Dominical / Clase Barre" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-stone-700">Categoría</label>
              <select id="new-prog-cat" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold">
                <option value="Niños y Familia">Niños y Familia</option>
                <option value="Adultos y Seniors">Adultos y Seniors</option>
                <option value="Torneos">Torneos</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-stone-700">Costo de Inscripción ($ MXN) *</label>
              <input type="number" id="new-prog-price" required placeholder="350" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-stone-700">Días y Horario *</label>
              <input type="text" id="new-prog-sched" required placeholder="Ej. Lun y Mié 5:00 PM" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
            </div>
            <div>
              <label class="text-xs font-bold text-stone-700">Entrenador / Responsable *</label>
              <input type="text" id="new-prog-coach" required placeholder="Ej. Coach Alex Vega" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Descripción</label>
            <input type="text" id="new-prog-desc" placeholder="Detalles de edades, material incluido..." class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
          </div>
          <button type="submit" class="w-full py-3.5 rounded-2xl bg-vital-900 text-vital-lime font-extrabold text-sm">Publicar Clase / Torneo</button>
        </form>
      </div>
    `);
  } else if (type === 'coach') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Agregar Entrenador (Sección Nosotros)</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewCoach(event)" class="space-y-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Nombre Completo *</label>
            <input type="text" id="new-coach-name" required placeholder="Ej. Coach Daniel Estrada" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-stone-700">Cargo / Rol *</label>
              <input type="text" id="new-coach-role" required placeholder="Ej. Coach Pádel & Barre" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
            </div>
            <div>
              <label class="text-xs font-bold text-stone-700">Horario disponible *</label>
              <input type="text" id="new-coach-sched" required placeholder="Lun a Vie 8am - 4pm" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
            </div>
          </div>
          <div>
            <label class="text-xs font-bold text-stone-700">Especialidad y Semblanza *</label>
            <input type="text" id="new-coach-bio" required placeholder="Experiencia con niños, adultos mayores y torneos..." class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
          </div>
          <button type="submit" class="w-full py-3.5 rounded-2xl bg-vital-900 text-vital-lime font-extrabold text-sm">Guardar Entrenador</button>
        </form>
      </div>
    `);
  } else if (type === 'transaction') {
    openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 class="font-brand text-2xl text-vital-900">Registrar Ingreso Manual</h3>
          <button onclick="closeModal()" class="p-2 rounded-xl bg-stone-100">✕</button>
        </div>
        <form onsubmit="saveNewManualTransaction(event)" class="space-y-3">
          <div>
            <label class="text-xs font-bold text-stone-700">Concepto del Ingreso *</label>
            <input type="text" id="new-tx-concept" required placeholder="Ej. Evento Familiar / Patrocinio Torneo" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-stone-700">Flujo *</label>
              <select id="new-tx-stream" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold">
                <option value="Reservaciones">Reservaciones</option>
                <option value="Clases y Torneos">Clases y Torneos</option>
                <option value="Comida y Bebidas">Comida y Bebidas</option>
                <option value="Accesorios y Otros">Accesorios y Otros</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-stone-700">Monto ($ MXN) *</label>
              <input type="number" id="new-tx-amount" required placeholder="500" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-stone-700">Cliente</label>
              <input type="text" id="new-tx-customer" placeholder="Nombre del cliente" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm" />
            </div>
            <div>
              <label class="text-xs font-bold text-stone-700">Método de Pago</label>
              <select id="new-tx-method" class="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-bold">
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>
          <button type="submit" class="w-full py-3.5 rounded-2xl bg-vital-900 text-vital-lime font-extrabold text-sm">Registrar Ingreso</button>
        </form>
      </div>
    `);
  }
}

function saveNewCatalogItem(e) {
  e.preventDefault();
  const name = document.getElementById('new-item-name').value.trim();
  const category = document.getElementById('new-item-cat').value;
  const price = Number(document.getElementById('new-item-price').value);
  const description = document.getElementById('new-item-desc').value.trim() || 'Disponible en Vital Club.';

  state.catalog.unshift({
    id: 'ITEM-' + Math.floor(100 + Math.random() * 900),
    name,
    category,
    price,
    badge: 'Nuevo',
    description
  });
  saveState();
  closeModal();
  renderAllAdminViews();
  renderAllClientViews();
  showToast(`Producto agregado: ${name}`);
}

function saveNewProgram(e) {
  e.preventDefault();
  const title = document.getElementById('new-prog-title').value.trim();
  const category = document.getElementById('new-prog-cat').value;
  const price = Number(document.getElementById('new-prog-price').value);
  const schedule = document.getElementById('new-prog-sched').value.trim();
  const coach = document.getElementById('new-prog-coach').value.trim();
  const description = document.getElementById('new-prog-desc').value.trim() || 'Inscripciones abiertas en Vital Club.';

  state.programs.unshift({
    id: 'PROG-' + Math.floor(100 + Math.random() * 900),
    title,
    category,
    schedule,
    coach,
    ageRange: 'Familiar / Abierto',
    price,
    priceLabel: 'Inscripción abierta con tarjeta',
    spotsTotal: 12,
    spotsTaken: 1,
    court: 'Cancha Techada 1',
    description
  });
  saveState();
  closeModal();
  renderAllAdminViews();
  renderAllClientViews();
  showToast(`Clase / Torneo agregado: ${title}`);
}

function saveNewCoach(e) {
  e.preventDefault();
  const name = document.getElementById('new-coach-name').value.trim();
  const role = document.getElementById('new-coach-role').value.trim();
  const schedule = document.getElementById('new-coach-sched').value.trim();
  const bio = document.getElementById('new-coach-bio').value.trim();

  state.coaches.push({
    id: 'COACH-' + Math.floor(100 + Math.random() * 900),
    name,
    role,
    specialty: 'Pádel Familiar y Competitivo',
    experience: 'Entrenador Oficial Vital Club',
    bio,
    schedule
  });
  saveState();
  closeModal();
  renderAllAdminViews();
  renderAllClientViews();
  showToast(`Entrenador agregado: ${name}`);
}

function saveNewManualTransaction(e) {
  e.preventDefault();
  const concept = document.getElementById('new-tx-concept').value.trim();
  const stream = document.getElementById('new-tx-stream').value;
  const amount = Number(document.getElementById('new-tx-amount').value);
  const customer = document.getElementById('new-tx-customer').value.trim() || 'Cliente Vital Club';
  const paymentMethod = document.getElementById('new-tx-method').value;

  state.transactions.unshift({
    id: 'VC-' + Math.floor(1000 + Math.random() * 9000),
    date: getTodayISO(0),
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    stream,
    concept,
    customer,
    paymentMethod,
    amount,
    status: 'Pagado'
  });
  saveState();
  closeModal();
  renderAllAdminViews();
  showToast('Ingreso registrado correctamente');
}

function exportIncomeCSV() {
  const headers = ['Folio', 'Fecha', 'Hora', 'Flujo', 'Concepto', 'Cliente', 'MetodoPago', 'MontoMXN', 'Estado'];
  const rows = state.transactions.map(t => [
    t.id,
    t.date,
    t.time,
    `"${t.stream}"`,
    `"${(t.concept || '').replace(/"/g, '""')}"`,
    `"${(t.customer || '').replace(/"/g, '""')}"`,
    t.paymentMethod,
    t.amount,
    t.status
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ingresos_vital_club_${getTodayISO(0)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Reporte CSV descargado');
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  state = buildInitialState();
  saveState();
  renderAllClientViews();
  renderAllAdminViews();
  showToast('Datos originales de demostración restaurados');
}

// ============================================================================
// UNIVERSAL MODAL & PRINTABLE RECEIPT TICKET
// ============================================================================

function openModal(html) {
  const modal = document.getElementById('universal-modal');
  const content = document.getElementById('universal-modal-content');
  if (!modal || !content) return;
  content.innerHTML = html;
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeModal() {
  const modal = document.getElementById('universal-modal');
  if (modal) modal.classList.add('hidden');
}

function showReceiptModal(tx, heading) {
  openModal(`
    <div id="printable-receipt" class="space-y-4">
      <div class="text-center border-b border-dashed border-stone-300 pb-4">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-vital-900 text-vital-lime font-extrabold text-xl mb-2">✓</div>
        <h3 class="font-brand text-2xl text-vital-900">${heading}</h3>
        <p class="text-xs text-stone-500 font-bold uppercase tracking-wider mt-0.5">VITAL CLUB · ZITÁCUARO, MICH.</p>
        <p class="text-[11px] text-stone-500">Andrés Landa y Piña Nte. 26, Col. Cuauhtémoc · Tel: 715 131 7443</p>
      </div>

      <div class="bg-vital-cream p-4 rounded-2xl border border-vital-900/15 text-xs space-y-2">
        <div class="flex justify-between"><span class="text-stone-500">Folio de Operación:</span><strong class="text-vital-900">${tx.id}</strong></div>
        <div class="flex justify-between"><span class="text-stone-500">Fecha y Hora:</span><strong>${tx.date} · ${tx.time}</strong></div>
        <div class="flex justify-between"><span class="text-stone-500">Flujo:</span><strong>${tx.stream}</strong></div>
        <div class="flex justify-between"><span class="text-stone-500">Cliente:</span><strong>${tx.customer}</strong></div>
        <div class="flex justify-between"><span class="text-stone-500">Método de Pago:</span><strong>${tx.paymentMethod} (${tx.status})</strong></div>
        <div class="pt-2 border-t border-vital-900/10">
          <span class="text-stone-500 block">Detalle:</span>
          <strong class="text-vital-900 text-sm">${tx.concept}</strong>
        </div>
        <div class="pt-2 border-t border-vital-900/10 flex justify-between items-baseline">
          <span class="font-bold uppercase text-vital-900">Total Registrado</span>
          <span class="font-brand text-2xl text-vital-900">${formatMXN(tx.amount)}</span>
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button onclick="window.print()" class="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-vital-900 font-bold text-xs">
          🖨️ Imprimir Comprobante
        </button>
        <button onclick="closeModal()" class="flex-1 py-3 rounded-xl bg-vital-900 text-vital-lime font-extrabold text-xs">
          Listo
        </button>
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

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('universal-modal');
  if (modal && e.target === modal) closeModal();
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderAllClientViews();
  if (window.lucide) lucide.createIcons();
});
