// ==========================================
// VITAL CLUB — ZITÁCUARO, MICH.
// Sistema Integral minimalista con Modales
// ==========================================

const STORAGE_KEY = 'vital_club_state_v3';

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const COURTS = [
  { id: 'cancha-1', name: 'Cancha 1 (Techada Pro)', price: 350, type: 'Cristal Panorámico · Techada' },
  { id: 'cancha-2', name: 'Cancha 2 (Techada Familiar)', price: 350, type: 'Cristal Panorámico · Techada' }
];

function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDefaultState() {
  const today = getTodayStr();
  return {
    selectedDate: today,
    selectedCoachId: 'coach-1',
    selectedPosCategory: 'all',
    selectedFoodCategory: 'all',
    bookings: [
      { id: 'bk-101', date: today, courtId: 'cancha-1', hour: '09:00', customer: 'Familia Hernández', phone: '715 112 3344', price: 350, status: 'Pagado', paymentMethod: 'Tarjeta', type: 'booking', notes: '2 adultos y 2 niños' },
      { id: 'bk-102', date: today, courtId: 'cancha-2', hour: '09:00', customer: 'CLASE: Pádel Kids Inicial', phone: '715 131 7443', price: 220, status: 'Clase Activa', paymentMethod: 'Club', type: 'class', coachId: 'coach-2', classId: 'cls-1', notes: 'Grupo infantil 6 a 11 años' },
      { id: 'bk-103', date: today, courtId: 'cancha-1', hour: '11:00', customer: 'Roberto M. y Amigos', phone: '715 234 9988', price: 350, status: 'Pagado', paymentMethod: 'Efectivo', type: 'booking', notes: 'Renta de 2 palas incluida' },
      { id: 'bk-104', date: today, courtId: 'cancha-2', hour: '12:00', customer: 'MANTENIMIENTO: Limpieza de Cristal y Cepillado', phone: '-', price: 0, status: 'Bloqueado', paymentMethod: '-', type: 'maintenance', notes: 'Mantenimiento preventivo diario' },
      { id: 'bk-105', date: today, courtId: 'cancha-1', hour: '16:00', customer: 'CLASE: Clínica Familiar & Principiantes', phone: '715 131 7443', price: 250, status: 'Clase Activa', paymentMethod: 'Club', type: 'class', coachId: 'coach-1', classId: 'cls-3', notes: 'Padres e hijos' },
      { id: 'bk-106', date: today, courtId: 'cancha-2', hour: '17:00', customer: 'Dr. Arturo Gómez (Adultos Mayores)', phone: '715 445 6677', price: 350, status: 'Pagado', paymentMethod: 'Tarjeta', type: 'booking', notes: 'Juego recreativo suave' },
      { id: 'bk-107', date: today, courtId: 'cancha-1', hour: '18:00', customer: 'CLASE: Entrenamiento Táctico Intermedio', phone: '715 131 7443', price: 280, status: 'Clase Activa', paymentMethod: 'Club', type: 'class', coachId: 'coach-1', classId: 'cls-4', notes: 'Bandeja, víbora y salida de pared' },
      { id: 'bk-108', date: today, courtId: 'cancha-2', hour: '18:00', customer: 'CLASE: Pádel Senior & Salud Activa', phone: '715 131 7443', price: 200, status: 'Clase Activa', paymentMethod: 'Club', type: 'class', coachId: 'coach-3', classId: 'cls-2', notes: 'Movilidad articular y juego controlado' }
    ],
    classes: [
      {
        id: 'cls-1',
        title: 'Academia Pádel Kids (5 a 12 años)',
        category: 'Niños',
        schedule: 'Lun a Vie · 09:00 AM y 04:00 PM',
        hour: '09:00',
        courtId: 'cancha-2',
        coachId: 'coach-2',
        coach: 'Coach Sofía Mendoza',
        price: 220,
        spots: 8,
        enrolled: 5,
        students: ['Mateo R.', 'Valentina S.', 'Leo G.', 'Camila H.', 'Santi P.'],
        attendance: { 'Mateo R.': true, 'Valentina S.': true, 'Leo G.': true, 'Camila H.': false, 'Santi P.': true },
        description: 'Coordinación motriz, diversión segura bajo techo y fundamentos del pádel para los más pequeños de la casa.',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'cls-2',
        title: 'Pádel Senior & Movilidad Suave (60+)',
        category: 'Adultos Mayores',
        schedule: 'Lun, Mié y Vie · 06:00 PM',
        hour: '18:00',
        courtId: 'cancha-2',
        coachId: 'coach-3',
        coach: 'Coach Jorge Villaseñor',
        price: 200,
        spots: 8,
        enrolled: 6,
        students: ['Don Carlos M.', 'Sra. Elena V.', 'Ing. Raúl T.', 'Sra. Carmen L.', 'Dr. Fernando P.', 'Sra. Rosa G.'],
        attendance: { 'Don Carlos M.': true, 'Sra. Elena V.': true, 'Ing. Raúl T.': true, 'Sra. Carmen L.': true, 'Dr. Fernando P.': false, 'Sra. Rosa G.': true },
        description: 'Sesiones de bajo impacto diseñadas para cuidar articulaciones, fortalecer reflejos y convivir en un ambiente cálido.',
        badgeColor: 'bg-emerald-100 text-emerald-800'
      },
      {
        id: 'cls-3',
        title: 'Clínica Familiar Fin de Semana / Tarde',
        category: '100% Familiar',
        schedule: 'Lun a Vie · 04:00 PM · Sáb 10:00 AM',
        hour: '16:00',
        courtId: 'cancha-1',
        coachId: 'coach-1',
        coach: 'Coach Alejandro Morales',
        price: 250,
        spots: 8,
        enrolled: 4,
        students: ['Fam. Ramírez (4)', 'Luis y Ana M.', 'Jorge e Hijo', 'Carla D.'],
        attendance: { 'Fam. Ramírez (4)': true, 'Luis y Ana M.': true, 'Jorge e Hijo': true, 'Carla D.': true },
        description: 'Aprendan juntos padres, hijos y abuelos. Incluye préstamo de palas infantiles y de adulto sin costo extra.',
        badgeColor: 'bg-lime-200 text-vital-green'
      },
      {
        id: 'cls-4',
        title: 'Entrenamiento Táctico & Torneo',
        category: 'Intermedio / Avanzado',
        schedule: 'Mar y Jue · 06:00 PM',
        hour: '18:00',
        courtId: 'cancha-1',
        coachId: 'coach-1',
        coach: 'Coach Alejandro Morales',
        price: 280,
        spots: 4,
        enrolled: 3,
        students: ['Rodrigo K.', 'Daniela P.', 'Mauricio B.'],
        attendance: { 'Rodrigo K.': true, 'Daniela P.': true, 'Mauricio B.': false },
        description: 'Perfeccionamiento de bandeja, víbora, defensa en doble pared y posicionamiento táctico en pareja.',
        badgeColor: 'bg-orange-100 text-orange-800'
      },
      {
        id: 'cls-5',
        title: 'Torneo Relámpago Familiar Vital Club',
        category: 'Torneo Club',
        schedule: 'Sábados · 11:00 AM a 03:00 PM',
        hour: '11:00',
        courtId: 'cancha-1',
        coachId: 'coach-1',
        coach: 'Staff Vital Club',
        price: 450,
        spots: 16,
        enrolled: 12,
        students: ['Pareja 1: Hdez', 'Pareja 2: López', 'Pareja 3: Silva', 'Pareja 4: Gómez'],
        attendance: { 'Pareja 1: Hdez': true, 'Pareja 2: López': true, 'Pareja 3: Silva': true, 'Pareja 4: Gómez': true },
        description: 'Inscripción por pareja. Incluye hidratación isotónica, fruta, pelotas oficiales y premios en Zona de Comida.',
        badgeColor: 'bg-purple-100 text-purple-800'
      }
    ],
    foodMenu: [
      { id: 'fd-1', name: 'Sándwich Club Vital (Pavo, Panela y Aguacate)', category: 'sandwiches', price: 115, desc: 'Pan artesanal masa madre tostado, pechuga de pavo horneada, queso panela, aguacate de Michoacán y aderezo de la casa.', badge: 'Favorito' },
      { id: 'fd-2', name: 'Panini Italiano Pesto & Mozzarella', category: 'sandwiches', price: 125, desc: 'Jamón serrano suave, queso mozzarella fresco, jitomate deshidratado y pesto de albahaca.', badge: 'Crujiente' },
      { id: 'fd-3', name: 'Sándwich Kids Grill Cheese & Jamón', category: 'sandwiches', price: 85, desc: 'Especial para niños: pan suave dorado con mantequilla, queso gouda fundido y bastones de manzana.', badge: 'Kids' },
      { id: 'fd-4', name: 'Bagel Salmón & Queso Crema con Alcaparras', category: 'sandwiches', price: 145, desc: 'Bagel artesanal tostado con queso crema batido, salmón ahumado, pepino y ajonjolí negro.', badge: 'Premium' },
      { id: 'fd-5', name: 'Smoothie Matcha & Proteína Vainilla', category: 'bebidas', price: 95, desc: 'Leche de almendra, matcha ceremonial, 24g de proteína aislada y hielo frappé.', badge: 'Post-Pádel' },
      { id: 'fd-6', name: 'Limonada Vital con Chía y Menta Fresca', category: 'bebidas', price: 55, desc: 'Refrescante limonada natural endulzada ligeramente con miel de agave y hojas de menta.', badge: 'Hidratante' },
      { id: 'fd-7', name: 'Café Cold Brew / Latte Artesanal', category: 'bebidas', price: 65, desc: 'Grano de especialidad mexicano, frío o caliente, con leche entera, deslactosada o avena.', badge: 'Energía' },
      { id: 'fd-8', name: 'Bowl de Fruta de Temporada, Granola y Miel', category: 'snacks', price: 80, desc: 'Fresas, plátano, mora azul, yogur griego natural y granola horneada con almendras.', badge: 'Saludable' },
      { id: 'fd-9', name: 'Renta de Pala Profesional / Infantil', category: 'renta', price: 60, desc: 'Pala de fibra de carbono o pala ligera junior por sesión de juego.', badge: 'Equipo' },
      { id: 'fd-10', name: 'Bote de 3 Pelotas Oficiales de Pádel', category: 'renta', price: 190, desc: 'Bote presurizado nuevo de alta durabilidad para cancha cubierta.', badge: 'Pro' }
    ],
    coaches: [
      {
        id: 'coach-1',
        name: 'Coach Alejandro Morales',
        role: 'Head Coach & Director Deportivo',
        specialty: 'Táctica, Nivel Intermedio/Avanzado y Clínicas Familiares',
        experience: '8 años de experiencia · Certificación Federación Mexicana de Pádel',
        bio: 'Apasionado por enseñar desde la primera vez que tomas una pala hasta golpes avanzados de bandeja y víbora en cancha techada.',
        schedule: 'Lunes a Viernes 08:00 AM - 08:00 PM',
        avatarBg: 'from-vital-green to-emerald-800',
        initials: 'AM'
      },
      {
        id: 'coach-2',
        name: 'Coach Sofía Mendoza',
        role: 'Especialista Academia Kids & Juvenil',
        specialty: 'Iniciación Infantil (4 a 14 años) y Psicomotricidad',
        experience: '6 años formando niños · Lic. en Educación Física y Deporte',
        bio: 'Convierte cada clase en una experiencia divertida, segura y formativa para que los niños desarrollen coordinación y amor por el deporte.',
        schedule: 'Lunes a Sábado · Mañanas y Tardes',
        avatarBg: 'from-vital-orange to-amber-600',
        initials: 'SM'
      },
      {
        id: 'coach-3',
        name: 'Coach Jorge Villaseñor',
        role: 'Coach Senior, Salud Activa & Principiantes',
        specialty: 'Adultos Mayores (60+), Rehabilitación Funcional y Juego Recreativo',
        experience: '10 años en acondicionamiento físico integral y raqueta',
        bio: 'Especialista en adaptar el ritmo del pádel para que adultos mayores y principiantes disfruten sin riesgo de lesiones.',
        schedule: 'Lunes a Viernes · Horarios Matutinos y Vespertinos',
        avatarBg: 'from-sky-700 to-vital-green',
        initials: 'JV'
      }
    ],
    transactions: [
      { id: 'tx-1001', timestamp: '08:45 AM', concept: 'Reserva Cancha 1 (09:00) - Familia Hernández', category: 'Canchas', method: 'Tarjeta', amount: 350 },
      { id: 'tx-1002', timestamp: '09:15 AM', concept: 'Inscripción Academia Pádel Kids - Mateo R.', category: 'Clases', method: 'Tarjeta', amount: 220 },
      { id: 'tx-1003', timestamp: '10:30 AM', concept: '2x Sándwich Club Vital + 2x Limonada Vital', category: 'Comida', method: 'Efectivo', amount: 340 },
      { id: 'tx-1004', timestamp: '11:00 AM', concept: 'Reserva Cancha 1 (11:00) - Roberto M.', category: 'Canchas', method: 'Efectivo', amount: 350 },
      { id: 'tx-1005', timestamp: '04:00 PM', concept: 'Clínica Familiar - Fam. Ramírez', category: 'Clases', method: 'Transferencia', amount: 250 },
      { id: 'tx-1006', timestamp: '05:00 PM', concept: 'Reserva Cancha 2 (17:00) - Dr. Arturo Gómez', category: 'Canchas', method: 'Tarjeta', amount: 350 },
      { id: 'tx-1007', timestamp: '05:40 PM', concept: 'Smoothie Matcha + Panini Italiano', category: 'Comida', method: 'Tarjeta', amount: 220 }
    ],
    clientCart: [],
    posCart: [],
    posPaymentMethod: 'Efectivo'
  };
}

let state = loadState();
let currentMode = 'client';
let currentSelection = { courtId: 'cancha-1', hour: '10:00' };
let activeModalAction = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return { ...getDefaultState(), ...parsed };
  } catch (e) {
    return getDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error guardando estado local:', e);
  }
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  state = getDefaultState();
  saveState();
  renderAll();
  showToast('Datos de demostración restaurados correctamente.');
}

// ==========================================
// NAVEGACIÓN PRINCIPAL Y CAMBIO DE VISTA
// ==========================================
function switchMainMode(mode) {
  currentMode = mode;
  const views = {
    client: document.getElementById('view-client'),
    coach: document.getElementById('view-coach'),
    admin: document.getElementById('view-admin')
  };
  const btns = {
    client: document.getElementById('mode-client-btn'),
    coach: document.getElementById('mode-coach-btn'),
    admin: document.getElementById('mode-admin-btn')
  };

  Object.keys(views).forEach((k) => {
    if (k === mode) {
      views[k].classList.remove('is-hidden');
    } else {
      views[k].classList.add('is-hidden');
    }
  });

  Object.keys(btns).forEach((k) => {
    if (!btns[k]) return;
    if (k === mode) {
      btns[k].className = 'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all bg-vital-lime text-vital-green shadow-sm';
    } else {
      btns[k].className = 'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all text-white/80 hover:text-white';
    }
  });

  const clientNav = document.getElementById('client-nav');
  const coachNav = document.getElementById('coach-nav');
  const adminNav = document.getElementById('admin-nav');
  const clientCartBtn = document.getElementById('client-cart-btn');

  // Ocultar estrictamente el menú de cliente cuando estamos en Coach o Admin
  if (mode === 'client') {
    clientNav.classList.remove('is-hidden');
    coachNav.classList.add('is-hidden');
    adminNav.classList.add('is-hidden');
    updateClientCartBadge();
  } else if (mode === 'coach') {
    clientNav.classList.add('is-hidden');
    coachNav.classList.remove('is-hidden');
    adminNav.classList.add('is-hidden');
    clientCartBtn.classList.add('is-hidden');
    renderCoachView();
  } else if (mode === 'admin') {
    clientNav.classList.add('is-hidden');
    coachNav.classList.add('is-hidden');
    adminNav.classList.remove('is-hidden');
    clientCartBtn.classList.add('is-hidden');
    renderAdminAll();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchAdminTab(tabName) {
  const tabs = ['dashboard', 'pos', 'registro', 'ingresos'];
  tabs.forEach((t) => {
    const el = document.getElementById(`admin-tab-${t}`);
    if (!el) return;
    if (t === tabName) {
      el.classList.remove('is-hidden');
    } else {
      el.classList.add('is-hidden');
    }
  });

  document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
    if (btn.dataset.tab === tabName) {
      btn.className = 'admin-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-vital-lime text-vital-green transition';
    } else {
      btn.className = 'admin-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white/75 hover:text-white hover:bg-white/10 transition';
    }
  });

  renderAdminAll();
}

// ==========================================
// SISTEMA UNIVERSAL DE MODALES
// ==========================================
function openModal({ badge, title, subtitle, bodyHtml, footerHtml }) {
  const modal = document.getElementById('universal-modal');
  document.getElementById('modal-badge').textContent = badge || 'VITAL CLUB';
  document.getElementById('modal-title').textContent = title || '';
  document.getElementById('modal-subtitle').textContent = subtitle || '';
  document.getElementById('modal-body').innerHTML = bodyHtml || '';
  document.getElementById('modal-footer').innerHTML = footerHtml || '';
  modal.classList.remove('is-hidden');
}

function closeModal() {
  const modal = document.getElementById('universal-modal');
  modal.classList.add('is-hidden');
  activeModalAction = null;
}

// ==========================================
// 1. VISTA CLIENTE — CANCHAS (BAJA CARGA COGNITIVA)
// ==========================================
function getSlotInfo(date, courtId, hour) {
  return state.bookings.find((b) => b.date === date && b.courtId === courtId && b.hour === hour) || null;
}

function renderBookingGrid() {
  const container = document.getElementById('courts-grid-container');
  if (!container) return;

  const dateInput = document.getElementById('booking-date-picker');
  if (dateInput && dateInput.value !== state.selectedDate) {
    dateInput.value = state.selectedDate;
  }

  let totalAvailable = 0;

  const courtsHtml = COURTS.map((court) => {
    let courtFreeCount = 0;

    const pillsHtml = HOURS.map((hour) => {
      const slot = getSlotInfo(state.selectedDate, court.id, hour);

      if (!slot) {
        courtFreeCount++;
        totalAvailable++;
        return `
          <button onclick="openBookingModal('${court.id}', '${hour}')"
            class="slot-btn py-2.5 px-2 rounded-xl bg-emerald-50/90 hover:bg-vital-lime hover:text-vital-green border border-emerald-200/80 text-vital-green font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-xs">
            <span>${hour}</span>
            <span class="text-[10px] font-semibold text-emerald-700">Libre</span>
          </button>
        `;
      }

      if (slot.type === 'class') {
        return `
          <button onclick="openOccupiedSlotInfoModal('${slot.id}')"
            class="slot-btn py-2.5 px-2 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 font-bold text-xs flex flex-col items-center justify-center gap-0.5">
            <span>${hour}</span>
            <span class="text-[10px] font-semibold text-amber-700 truncate max-w-full">Clase</span>
          </button>
        `;
      }

      if (slot.type === 'maintenance') {
        return `
          <button onclick="openOccupiedSlotInfoModal('${slot.id}')"
            class="slot-btn py-2.5 px-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 font-bold text-xs flex flex-col items-center justify-center gap-0.5">
            <span>${hour}</span>
            <span class="text-[10px] font-medium">Mantenim.</span>
          </button>
        `;
      }

      return `
        <button onclick="openOccupiedSlotInfoModal('${slot.id}')"
          class="slot-btn py-2.5 px-2 rounded-xl bg-stone-100 border border-stone-200/80 text-stone-400 font-semibold text-xs flex flex-col items-center justify-center gap-0.5">
          <span class="line-through">${hour}</span>
          <span class="text-[10px]">Ocupada</span>
        </button>
      `;
    }).join('');

    return `
      <div class="bg-vital-cream/50 rounded-2xl p-5 border border-stone-200/80">
        <div class="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/70">
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-vital-orange">Techada · Clima Perfecto</span>
            <h3 class="font-serif text-lg font-bold text-vital-green">${court.name}</h3>
          </div>
          <div class="text-right">
            <span class="text-sm font-black text-vital-green">$${court.price} <span class="text-xs font-normal text-stone-500">MXN/hr</span></span>
            <p class="text-[11px] text-emerald-700 font-semibold">${courtFreeCount} horarios libres</p>
          </div>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          ${pillsHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = courtsHtml;

  const badge = document.getElementById('hero-available-badge');
  if (badge) {
    badge.textContent = `${totalAvailable} horarios libres hoy`;
  }
}

// Modal limpio para reservar horario libre
function openBookingModal(courtId, hour) {
  currentSelection = { courtId, hour };
  const court = COURTS.find((c) => c.id === courtId) || COURTS[0];

  openModal({
    badge: 'RESERVA DE CANCHA TECHADA',
    title: `${court.name} · ${hour} hrs`,
    subtitle: `Fecha seleccionada: ${state.selectedDate} · Tarifa: $${court.price} MXN (1 hora)`,
    bodyHtml: `
      <form id="modal-booking-form" onsubmit="submitModalBooking(event)" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Nombre completo</label>
            <input type="text" id="modal-bk-name" required placeholder="Ej. Familia Gómez / Carlos R."
              class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium focus:outline-none focus:border-vital-green">
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Teléfono / WhatsApp</label>
            <input type="tel" id="modal-bk-phone" required placeholder="Ej. 715 123 4567"
              class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium focus:outline-none focus:border-vital-green">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Tipo de jugadores</label>
            <select id="modal-bk-notes" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium focus:outline-none focus:border-vital-green">
              <option value="Partido Familiar (Adultos y Niños)">Familiar (Adultos y Niños)</option>
              <option value="Partido Amistoso Adultos">Amistoso Adultos (4 jugadores)</option>
              <option value="Adultos Mayores / Recreativo">Adultos Mayores (Juego Suave)</option>
              <option value="Principiantes (Requiere renta de palas)">Principiantes</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Método de pago</label>
            <select id="modal-bk-payment" onchange="toggleCardInputs(this.value)"
              class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium focus:outline-none focus:border-vital-green">
              <option value="Tarjeta">Tarjeta en línea (Confirmación inmediata)</option>
              <option value="Efectivo">Pago en recepción al llegar</option>
              <option value="Transferencia">Transferencia SPEI</option>
            </select>
          </div>
        </div>

        <div id="modal-card-fields" class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
          <div class="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Pago seguro con tarjeta</span>
            <span>Visa · Mastercard · Amex</span>
          </div>
          <input type="text" placeholder="Número de tarjeta (4242 •••• •••• 4242)" maxlength="19"
            class="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs font-mono">
          <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="MM/AA" maxlength="5" class="px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs font-mono">
            <input type="text" placeholder="CVV" maxlength="4" class="px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs font-mono">
          </div>
        </div>
      </form>
    `,
    footerHtml: `
      <div class="flex items-center justify-between gap-3">
        <div>
          <span class="text-xs text-stone-500 block">Total a pagar</span>
          <span class="text-lg font-black text-vital-green">$${court.price}.00 MXN</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100">
            Cancelar
          </button>
          <button type="submit" form="modal-booking-form" class="px-5 py-2.5 rounded-xl bg-vital-green text-vital-lime text-xs font-bold hover:bg-vital-turf transition shadow-sm">
            Confirmar Reserva
          </button>
        </div>
      </div>
    `
  });
}

function toggleCardInputs(val) {
  const el = document.getElementById('modal-card-fields');
  if (!el) return;
  if (val === 'Tarjeta') {
    el.classList.remove('is-hidden');
  } else {
    el.classList.add('is-hidden');
  }
}

function submitModalBooking(e) {
  e.preventDefault();
  const customer = document.getElementById('modal-bk-name').value.trim();
  const phone = document.getElementById('modal-bk-phone').value.trim();
  const notes = document.getElementById('modal-bk-notes').value;
  const paymentMethod = document.getElementById('modal-bk-payment').value;
  const court = COURTS.find((c) => c.id === currentSelection.courtId) || COURTS[0];

  const existing = getSlotInfo(state.selectedDate, court.id, currentSelection.hour);
  if (existing) {
    showToast('Este horario ya fue ocupado.');
    closeModal();
    return;
  }

  const newBooking = {
    id: 'bk-' + Date.now(),
    date: state.selectedDate,
    courtId: court.id,
    hour: currentSelection.hour,
    customer,
    phone,
    price: court.price,
    status: paymentMethod === 'Efectivo' ? 'Pendiente en Club' : 'Pagado',
    paymentMethod,
    type: 'booking',
    notes
  };

  state.bookings.push(newBooking);

  const nowTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  state.transactions.unshift({
    id: 'tx-' + Date.now(),
    timestamp: nowTime,
    concept: `Reserva ${court.name} (${currentSelection.hour}) - ${customer}`,
    category: 'Canchas',
    method: paymentMethod,
    amount: court.price
  });

  saveState();
  renderAll();
  closeModal();
  showToast(`¡Cancha reservada para ${customer} a las ${currentSelection.hour}!`);
}

function openOccupiedSlotInfoModal(bookingId) {
  const slot = state.bookings.find((b) => b.id === bookingId);
  if (!slot) return;
  const court = COURTS.find((c) => c.id === slot.courtId) || COURTS[0];

  if (slot.type === 'class') {
    const cls = state.classes.find((c) => c.id === slot.classId);
    openModal({
      badge: 'HORARIO CON CLASE PROGRAMADA',
      title: slot.customer.replace('CLASE: ', ''),
      subtitle: `${court.name} · ${slot.hour} hrs`,
      bodyHtml: `
        <div class="space-y-3 text-sm text-stone-600">
          <p>${cls ? cls.description : 'Sesión guiada por coach certificado en cancha techada.'}</p>
          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-amber-900">${cls ? cls.coach : 'Coach Vital Club'}</p>
              <p class="text-xs text-amber-700">${cls ? `${cls.spots - cls.enrolled} lugares disponibles` : 'Inscripciones abiertas'}</p>
            </div>
            <span class="text-base font-black text-amber-900">$${slot.price} MXN</span>
          </div>
        </div>
      `,
      footerHtml: `
        <div class="flex justify-end gap-2">
          <button onclick="closeModal()" class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600">Cerrar</button>
          ${cls ? `<button onclick="closeModal(); openClassEnrollModal('${cls.id}')" class="px-4 py-2 rounded-xl bg-vital-green text-vital-lime text-xs font-bold">Inscribirme a esta clase</button>` : ''}
        </div>
      `
    });
    return;
  }

  openModal({
    badge: slot.type === 'maintenance' ? 'MANTENIMIENTO DE CANCHA' : 'HORARIO RESERVADO',
    title: `${court.name} · ${slot.hour} hrs`,
    subtitle: `Estado: ${slot.status}`,
    bodyHtml: `
      <p class="text-sm text-stone-600">
        Este horario ya se encuentra apartado (${slot.type === 'maintenance' ? slot.customer : 'Reserva confirmada'}). 
        Selecciona cualquiera de los botones en color verde claro para apartar tu cancha al instante.
      </p>
    `,
    footerHtml: `
      <div class="flex justify-end">
        <button onclick="closeModal()" class="px-4 py-2 rounded-xl bg-vital-green text-white text-xs font-bold">Entendido</button>
      </div>
    `
  });
}

// ==========================================
// 2. CLASES Y TORNEOS (TARJETAS LIMPIAS + MODAL)
// ==========================================
function renderClassesGrid() {
  const grid = document.getElementById('classes-grid');
  if (!grid) return;

  grid.innerHTML = state.classes.map((cls) => {
    const remaining = Math.max(0, cls.spots - cls.enrolled);
    return `
      <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${cls.badgeColor}">${cls.category}</span>
            <span class="text-xs font-semibold text-stone-400">${remaining} cupos libres</span>
          </div>
          <h3 class="font-serif text-lg font-bold text-vital-green mb-1">${cls.title}</h3>
          <p class="text-xs font-semibold text-stone-500 mb-2">${cls.schedule} · ${cls.coach}</p>
          <p class="text-xs text-stone-600 leading-relaxed mb-4">${cls.description}</p>
        </div>

        <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase tracking-wider text-stone-400 block">Inscripción</span>
            <span class="text-base font-black text-vital-green">$${cls.price} <span class="text-xs font-normal text-stone-400">MXN</span></span>
          </div>
          <button onclick="openClassEnrollModal('${cls.id}')"
            class="px-4 py-2 rounded-xl bg-vital-green text-white hover:bg-vital-turf text-xs font-bold transition">
            Inscribirme
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openClassEnrollModal(classId) {
  const cls = state.classes.find((c) => c.id === classId);
  if (!cls) return;

  openModal({
    badge: `INSCRIPCIÓN · ${cls.category.toUpperCase()}`,
    title: cls.title,
    subtitle: `${cls.schedule} · ${cls.coach}`,
    bodyHtml: `
      <form id="modal-class-form" onsubmit="submitClassEnrollment(event, '${cls.id}')" class="space-y-4">
        <p class="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/80">${cls.description}</p>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Nombre del Alumno(a) o Pareja</label>
          <input type="text" id="enroll-student-name" required placeholder="Ej. Sofía Hernández (9 años)"
            class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium">
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">WhatsApp de contacto</label>
            <input type="tel" id="enroll-student-phone" required placeholder="715 123 4567"
              class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium">
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Método de pago</label>
            <select id="enroll-payment-method" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium">
              <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
              <option value="Efectivo">Pago en Recepción</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>
      </form>
    `,
    footerHtml: `
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs text-stone-500 block">Cuota de recuperación</span>
          <span class="text-lg font-black text-vital-green">$${cls.price}.00 MXN</span>
        </div>
        <div class="flex gap-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600">Cancelar</button>
          <button type="submit" form="modal-class-form" class="px-5 py-2 rounded-xl bg-vital-green text-vital-lime text-xs font-bold">Confirmar Inscripción</button>
        </div>
      </div>
    `
  });
}

function submitClassEnrollment(e, classId) {
  e.preventDefault();
  const cls = state.classes.find((c) => c.id === classId);
  if (!cls) return;

  const studentName = document.getElementById('enroll-student-name').value.trim();
  const method = document.getElementById('enroll-payment-method').value;

  cls.enrolled = Math.min(cls.spots, cls.enrolled + 1);
  if (!cls.students) cls.students = [];
  cls.students.push(studentName);
  if (!cls.attendance) cls.attendance = {};
  cls.attendance[studentName] = true;

  const nowTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  state.transactions.unshift({
    id: 'tx-' + Date.now(),
    timestamp: nowTime,
    concept: `Inscripción ${cls.title} - ${studentName}`,
    category: 'Clases',
    method,
    amount: cls.price
  });

  saveState();
  renderAll();
  closeModal();
  showToast(`¡${studentName} inscrito(a) en ${cls.title}!`);
}

// ==========================================
// 3. ZONA DE COMIDA Y CARRITO EN MODAL
// ==========================================
function filterFoodCategory(cat) {
  state.selectedFoodCategory = cat;
  document.querySelectorAll('.food-cat-btn').forEach((btn) => {
    if (btn.dataset.cat === cat) {
      btn.className = 'food-cat-btn px-4 py-2 rounded-full text-xs font-bold bg-vital-green text-white transition';
    } else {
      btn.className = 'food-cat-btn px-4 py-2 rounded-full text-xs font-bold bg-white text-stone-600 border border-stone-200 hover:border-vital-green transition';
    }
  });
  renderFoodMenuGrid();
}

function renderFoodMenuGrid() {
  const grid = document.getElementById('food-menu-grid');
  if (!grid) return;

  const items = state.selectedFoodCategory === 'all'
    ? state.foodMenu
    : state.foodMenu.filter((item) => item.category === state.selectedFoodCategory);

  grid.innerHTML = items.map((item) => `
    <div class="bg-white rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between gap-4 hover:border-vital-green/40 transition">
      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold uppercase">${item.badge || item.category}</span>
          <span class="text-sm font-black text-vital-green">$${item.price}</span>
        </div>
        <h4 class="font-bold text-sm text-vital-dark truncate">${item.name}</h4>
        <p class="text-xs text-stone-500 line-clamp-2 mt-0.5">${item.desc}</p>
      </div>
      <button onclick="addToClientCart('${item.id}')"
        class="shrink-0 px-3.5 py-2 rounded-xl bg-vital-cream hover:bg-vital-lime text-vital-green font-bold text-xs border border-stone-200/80 transition">
        + Agregar
      </button>
    </div>
  `).join('');
}

function addToClientCart(itemId) {
  const item = state.foodMenu.find((f) => f.id === itemId);
  if (!item) return;

  const existing = state.clientCart.find((c) => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.clientCart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }
  saveState();
  updateClientCartBadge();
  showToast(`${item.name} agregado a tu pedido.`);
}

function updateClientCartBadge() {
  const btn = document.getElementById('client-cart-btn');
  const countEl = document.getElementById('client-cart-count');
  if (!btn || !countEl) return;

  const totalItems = state.clientCart.reduce((acc, item) => acc + item.qty, 0);
  countEl.textContent = totalItems;

  if (currentMode === 'client' && totalItems > 0) {
    btn.classList.remove('is-hidden');
  } else {
    btn.classList.add('is-hidden');
  }
}

function openClientCartModal() {
  const total = state.clientCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (state.clientCart.length === 0) {
    openModal({
      badge: 'ZONA DE COMIDA & SNACK BAR',
      title: 'Tu pedido está vacío',
      subtitle: 'Agrega sándwiches, smoothies o bebidas desde el menú.',
      bodyHtml: `<p class="text-sm text-stone-500">Elige tus alimentos y los tendremos listos al terminar tu set de pádel.</p>`,
      footerHtml: `<div class="flex justify-end"><button onclick="closeModal()" class="px-4 py-2 rounded-xl bg-vital-green text-white text-xs font-bold">Ver Menú</button></div>`
    });
    return;
  }

  const itemsHtml = state.clientCart.map((c) => `
    <div class="flex items-center justify-between py-2.5 border-b border-stone-100 text-sm">
      <div>
        <p class="font-bold text-vital-dark">${c.name}</p>
        <p class="text-xs text-stone-400">$${c.price} MXN c/u</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="changeClientCartQty('${c.id}', -1)" class="w-7 h-7 rounded-lg bg-stone-100 font-bold text-xs">-</button>
        <span class="font-bold text-xs w-5 text-center">${c.qty}</span>
        <button onclick="changeClientCartQty('${c.id}', 1)" class="w-7 h-7 rounded-lg bg-stone-100 font-bold text-xs">+</button>
        <span class="font-extrabold text-vital-green ml-2">$${c.price * c.qty}</span>
      </div>
    </div>
  `).join('');

  openModal({
    badge: 'PEDIDO EN ZONA DE COMIDA',
    title: 'Confirmar Orden de Snack Bar',
    subtitle: 'Entrega en terraza o mesa junto a canchas techadas',
    bodyHtml: `
      <div class="space-y-4">
        <div class="max-h-52 overflow-y-auto pr-1">${itemsHtml}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <input type="text" id="food-order-name" placeholder="Tu nombre o mesa (Ej. Cancha 1)"
            class="px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm">
          <select id="food-order-method" class="px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm">
            <option value="Tarjeta">Pago con Tarjeta</option>
            <option value="Efectivo">Efectivo en Barra</option>
          </select>
        </div>
      </div>
    `,
    footerHtml: `
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs text-stone-500 block">Total Orden</span>
          <span class="text-lg font-black text-vital-green">$${total}.00 MXN</span>
        </div>
        <div class="flex gap-2">
          <button onclick="closeModal()" class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600">Seguir viendo</button>
          <button onclick="submitClientFoodOrder()" class="px-5 py-2 rounded-xl bg-vital-orange text-white text-xs font-bold hover:bg-orange-600">Enviar Pedido a Cocina</button>
        </div>
      </div>
    `
  });
}

function changeClientCartQty(itemId, delta) {
  const item = state.clientCart.find((c) => c.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.clientCart = state.clientCart.filter((c) => c.id !== itemId);
  }
  saveState();
  updateClientCartBadge();
  openClientCartModal();
}

function submitClientFoodOrder() {
  if (state.clientCart.length === 0) return;
  const customer = document.getElementById('food-order-name')?.value.trim() || 'Cliente Terraza';
  const method = document.getElementById('food-order-method')?.value || 'Tarjeta';
  const total = state.clientCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const summary = state.clientCart.map((i) => `${i.qty}x ${i.name}`).join(', ');

  const nowTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  state.transactions.unshift({
    id: 'tx-' + Date.now(),
    timestamp: nowTime,
    concept: `Comida (${customer}): ${summary}`,
    category: 'Comida',
    method,
    amount: total
  });

  state.clientCart = [];
  saveState();
  updateClientCartBadge();
  renderAdminAll();
  closeModal();
  showToast(`¡Pedido enviado a cocina para ${customer}!`);
}

// ==========================================
// 4. NOSOTROS Y ENTRENADORES
// ==========================================
function renderCoachesGrid() {
  const grid = document.getElementById('coaches-grid');
  if (!grid) return;

  grid.innerHTML = state.coaches.map((coach) => `
    <div class="bg-vital-cream/60 rounded-3xl p-5 border border-stone-200/80 flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-3.5 mb-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${coach.avatarBg} text-white font-serif font-bold text-base flex items-center justify-center shadow-sm">
            ${coach.initials}
          </div>
          <div>
            <h4 class="font-serif font-bold text-base text-vital-green">${coach.name}</h4>
            <p class="text-xs font-semibold text-vital-orange">${coach.role}</p>
          </div>
        </div>
        <p class="text-xs text-stone-600 leading-relaxed mb-3">${coach.bio}</p>
      </div>
      <div class="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
        <span>${coach.specialty}</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 5. VISTA COACH (AGENDA POR HORA Y ASISTENCIA)
// ==========================================
function renderCoachView() {
  const select = document.getElementById('coach-selector');
  if (select) {
    select.innerHTML = state.coaches.map((c) => `
      <option value="${c.id}" ${c.id === state.selectedCoachId ? 'selected' : ''}>${c.name} — ${c.role}</option>
    `).join('');
  }

  const datePicker = document.getElementById('coach-date-picker');
  if (datePicker && datePicker.value !== state.selectedDate) {
    datePicker.value = state.selectedDate;
  }

  const coachClasses = state.classes.filter((c) => c.coachId === state.selectedCoachId);
  const totalStudents = coachClasses.reduce((acc, c) => acc + (c.enrolled || 0), 0);

  const kpiRow = document.getElementById('coach-kpi-row');
  if (kpiRow) {
    kpiRow.innerHTML = `
      <div class="bg-white p-4 rounded-2xl border border-stone-200/80">
        <span class="text-xs text-stone-400 font-semibold">Clases Asignadas Hoy</span>
        <p class="text-2xl font-black text-vital-green mt-0.5">${coachClasses.length}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-stone-200/80">
        <span class="text-xs text-stone-400 font-semibold">Alumnos Inscritos</span>
        <p class="text-2xl font-black text-vital-green mt-0.5">${totalStudents}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-stone-200/80">
        <span class="text-xs text-stone-400 font-semibold">Estado de Canchas</span>
        <p class="text-sm font-bold text-emerald-700 mt-1.5">2 Techadas Operando 100%</p>
      </div>
    `;
  }

  const hourlyGrid = document.getElementById('coach-hourly-grid');
  if (!hourlyGrid) return;

  hourlyGrid.innerHTML = HOURS.map((hour) => {
    const cls = coachClasses.find((c) => c.hour === hour);
    const courtBooking = state.bookings.find((b) => b.date === state.selectedDate && b.hour === hour && b.coachId === state.selectedCoachId);

    if (cls || courtBooking) {
      const targetCls = cls || state.classes[0];
      const courtName = targetCls.courtId === 'cancha-2' ? 'Cancha 2' : 'Cancha 1';
      return `
        <button onclick="openCoachClassModal('${targetCls.id}')"
          class="text-left p-4 rounded-2xl bg-amber-50/90 hover:bg-amber-100/80 border border-amber-300 transition flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
              <span>${hour} hrs</span>
              <span class="px-2 py-0.5 rounded-md bg-amber-200/80 text-[10px]">${courtName}</span>
            </div>
            <h4 class="font-bold text-sm text-vital-green">${targetCls.title}</h4>
          </div>
          <div class="mt-3 pt-2 border-t border-amber-200/70 flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>${targetCls.enrolled}/${targetCls.spots} alumnos</span>
            <span class="underline">Pasar lista →</span>
          </div>
        </button>
      `;
    }

    return `
      <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col justify-between text-stone-400">
        <div class="flex items-center justify-between text-xs font-bold">
          <span>${hour} hrs</span>
          <span class="text-[10px] uppercase">Libre de clase</span>
        </div>
        <p class="text-xs mt-2">Disponible para clase particular</p>
      </div>
    `;
  }).join('');
}

function openCoachClassModal(classId) {
  const cls = state.classes.find((c) => c.id === classId);
  if (!cls) return;

  const students = cls.students || [];
  const attendance = cls.attendance || {};

  const listHtml = students.map((st) => {
    const present = attendance[st] !== false;
    return `
      <label class="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
        <span class="text-sm font-semibold text-vital-dark">${st}</span>
        <input type="checkbox" ${present ? 'checked' : ''} onchange="toggleStudentAttendance('${cls.id}', '${st}', this.checked)"
          class="w-4 h-4 accent-vital-green rounded">
      </label>
    `;
  }).join('');

  openModal({
    badge: `CONTROL DEL COACH · ${cls.hour} HRS`,
    title: cls.title,
    subtitle: `${cls.schedule} · Cupo: ${cls.enrolled}/${cls.spots} alumnos`,
    bodyHtml: `
      <div class="space-y-3">
        <p class="text-xs font-bold uppercase tracking-wider text-stone-400">Lista de Asistencia Hoy</p>
        <div class="space-y-2 max-h-60 overflow-y-auto">${listHtml || '<p class="text-xs text-stone-400">Sin alumnos registrados aún.</p>'}</div>
      </div>
    `,
    footerHtml: `
      <div class="flex justify-end gap-2">
        <button onclick="closeModal()" class="px-5 py-2 rounded-xl bg-vital-green text-vital-lime text-xs font-bold">Guardar Asistencia</button>
      </div>
    `
  });
}

function toggleStudentAttendance(classId, studentName, isPresent) {
  const cls = state.classes.find((c) => c.id === classId);
  if (!cls) return;
  if (!cls.attendance) cls.attendance = {};
  cls.attendance[studentName] = isPresent;
  saveState();
}

// ==========================================
// 6. VISTA ADMIN — DASHBOARD, POS, REGISTRO, CATÁLOGO
// ==========================================
function renderAdminAll() {
  renderAdminDashboard();
  renderPosCatalog();
  renderPosCart();
  renderAdminMasterCalendar();
  renderAdminCatalogLists();
}

function renderAdminDashboard() {
  const kpiGrid = document.getElementById('dashboard-kpi-grid');
  if (!kpiGrid) return;

  const totalIncome = state.transactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const courtIncome = state.transactions.filter((t) => t.category === 'Canchas').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const classIncome = state.transactions.filter((t) => t.category === 'Clases').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const foodIncome = state.transactions.filter((t) => t.category === 'Comida').reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalSlots = HOURS.length * COURTS.length;
  const occupiedSlots = state.bookings.filter((b) => b.date === state.selectedDate).length;
  const occupancyPct = Math.round((occupiedSlots / totalSlots) * 100);

  kpiGrid.innerHTML = `
    <div class="bg-vital-green text-white p-5 rounded-3xl shadow-sm">
      <span class="text-[11px] uppercase tracking-wider text-vital-lime font-bold">Ingresos Totales del Día</span>
      <p class="text-3xl font-black mt-1">$${totalIncome.toLocaleString('es-MX')}</p>
      <span class="text-xs text-white/70">${state.transactions.length} movimientos registrados</span>
    </div>
    <div class="bg-white p-5 rounded-3xl border border-stone-200/80">
      <span class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Renta de Canchas</span>
      <p class="text-2xl font-black text-vital-green mt-1">$${courtIncome.toLocaleString('es-MX')}</p>
      <span class="text-xs text-emerald-700 font-semibold">Ocupación hoy: ${occupancyPct}% (${occupiedSlots}/${totalSlots})</span>
    </div>
    <div class="bg-white p-5 rounded-3xl border border-stone-200/80">
      <span class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Clases & Torneos</span>
      <p class="text-2xl font-black text-vital-green mt-1">$${classIncome.toLocaleString('es-MX')}</p>
      <span class="text-xs text-stone-500">${state.classes.length} programas activos</span>
    </div>
    <div class="bg-white p-5 rounded-3xl border border-stone-200/80">
      <span class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Zona de Comida & Pro-Shop</span>
      <p class="text-2xl font-black text-vital-orange mt-1">$${foodIncome.toLocaleString('es-MX')}</p>
      <span class="text-xs text-stone-500">Sándwiches, bebidas y rentas</span>
    </div>
  `;

  const barsContainer = document.getElementById('dashboard-revenue-bars');
  if (barsContainer) {
    const safeTotal = Math.max(1, totalIncome);
    const items = [
      { label: 'Canchas Techadas (1 y 2)', amount: courtIncome, color: 'bg-vital-green' },
      { label: 'Academia de Clases y Torneos', amount: classIncome, color: 'bg-amber-500' },
      { label: 'Zona de Comida (Sándwiches y Bebidas)', amount: foodIncome, color: 'bg-vital-orange' }
    ];

    barsContainer.innerHTML = items.map((row) => {
      const pct = Math.round((row.amount / safeTotal) * 100);
      return `
        <div>
          <div class="flex justify-between text-xs font-bold mb-1.5">
            <span class="text-vital-dark">${row.label}</span>
            <span class="text-vital-green">$${row.amount.toLocaleString('es-MX')} MXN (${pct}%)</span>
          </div>
          <div class="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div class="${row.color} h-full rounded-full transition-all" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// PUNTO DE VENTA (POS)
function getPosItems() {
  const courtItems = COURTS.map((c) => ({
    id: `pos-${c.id}`,
    name: `Hora ${c.name}`,
    category: 'canchas',
    price: c.price
  }));
  const classItems = state.classes.map((c) => ({
    id: `pos-${c.id}`,
    name: c.title,
    category: 'clases',
    price: c.price
  }));
  const foodItems = state.foodMenu.map((f) => ({
    id: `pos-${f.id}`,
    name: f.name,
    category: f.category === 'renta' ? 'renta' : 'comida',
    price: f.price
  }));
  return [...courtItems, ...classItems, ...foodItems];
}

function filterPosCategory(cat) {
  state.selectedPosCategory = cat;
  document.querySelectorAll('.pos-cat-btn').forEach((btn) => {
    if (btn.dataset.poscat === cat) {
      btn.className = 'pos-cat-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-vital-green text-white';
    } else {
      btn.className = 'pos-cat-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 text-stone-600';
    }
  });
  renderPosCatalog();
}

function renderPosCatalog() {
  const grid = document.getElementById('pos-catalog-grid');
  if (!grid) return;

  const all = getPosItems();
  const filtered = state.selectedPosCategory === 'all'
    ? all
    : all.filter((i) => i.category === state.selectedPosCategory);

  grid.innerHTML = filtered.map((item) => `
    <button onclick="addToPosCart('${item.id}')"
      class="p-3.5 rounded-2xl bg-stone-50 hover:bg-vital-lime/30 border border-stone-200/80 text-left transition flex flex-col justify-between">
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">${item.category}</span>
        <h4 class="font-bold text-xs text-vital-dark mt-0.5 line-clamp-2">${item.name}</h4>
      </div>
      <span class="text-sm font-black text-vital-green mt-2 block">$${item.price}</span>
    </button>
  `).join('');
}

function addToPosCart(posItemId) {
  const item = getPosItems().find((i) => i.id === posItemId);
  if (!item) return;

  const existing = state.posCart.find((c) => c.id === posItemId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.posCart.push({ ...item, qty: 1 });
  }
  saveState();
  renderPosCart();
}

function renderPosCart() {
  const list = document.getElementById('pos-ticket-items');
  const totalEl = document.getElementById('pos-total');
  if (!list || !totalEl) return;

  const total = state.posCart.reduce((acc, i) => acc + i.price * i.qty, 0);
  totalEl.textContent = `$${total.toLocaleString('es-MX')}.00`;

  if (state.posCart.length === 0) {
    list.innerHTML = `<p class="text-xs text-stone-400 text-center py-8">Toca cualquier producto para armar la cuenta.</p>`;
  } else {
    list.innerHTML = state.posCart.map((c) => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
        <div class="min-w-0 pr-2">
          <p class="font-bold text-vital-dark truncate">${c.name}</p>
          <p class="text-stone-400">$${c.price} x ${c.qty}</p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="changePosQty('${c.id}', -1)" class="w-6 h-6 rounded bg-white border border-stone-200 font-bold">-</button>
          <span class="font-bold w-4 text-center">${c.qty}</span>
          <button onclick="changePosQty('${c.id}', 1)" class="w-6 h-6 rounded bg-white border border-stone-200 font-bold">+</button>
        </div>
      </div>
    `).join('');
  }
  updatePosCashChange();
}

function changePosQty(id, delta) {
  const item = state.posCart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.posCart = state.posCart.filter((c) => c.id !== id);
  }
  saveState();
  renderPosCart();
}

function clearPosCart() {
  state.posCart = [];
  saveState();
  renderPosCart();
}

function selectPosPaymentMethod(method) {
  state.posPaymentMethod = method;
  document.querySelectorAll('.pos-pay-btn').forEach((btn) => {
    if (btn.dataset.pay === method) {
      btn.className = 'pos-pay-btn py-2 rounded-xl text-xs font-bold border-2 border-vital-green bg-vital-green text-white';
    } else {
      btn.className = 'pos-pay-btn py-2 rounded-xl text-xs font-bold border border-stone-200 text-stone-600';
    }
  });
  updatePosCashChange();
}

function updatePosCashChange() {
  const cashRow = document.getElementById('pos-cash-row');
  const changeEl = document.getElementById('pos-cash-change');
  const cashInput = document.getElementById('pos-cash-received');
  if (!cashRow || !changeEl || !cashInput) return;

  if (state.posPaymentMethod !== 'Efectivo') {
    cashRow.classList.add('is-hidden');
    return;
  }
  cashRow.classList.remove('is-hidden');
  const total = state.posCart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const received = Number(cashInput.value || 0);
  const diff = Math.max(0, received - total);
  changeEl.textContent = `$${diff.toLocaleString('es-MX')}.00`;
}

function checkoutPosSale() {
  if (state.posCart.length === 0) {
    showToast('Agrega al menos un concepto al ticket.');
    return;
  }
  const customer = document.getElementById('pos-customer-name')?.value.trim() || 'Mostrador';
  const total = state.posCart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const summary = state.posCart.map((i) => `${i.qty}x ${i.name}`).join(', ');

  const hasCourt = state.posCart.some((i) => i.category === 'canchas');
  const hasClass = state.posCart.some((i) => i.category === 'clases');
  const category = hasCourt ? 'Canchas' : hasClass ? 'Clases' : 'Comida';

  const nowTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  state.transactions.unshift({
    id: 'tx-' + Date.now(),
    timestamp: nowTime,
    concept: `POS (${customer}): ${summary}`,
    category,
    method: state.posPaymentMethod,
    amount: total
  });

  state.posCart = [];
  if (document.getElementById('pos-customer-name')) document.getElementById('pos-customer-name').value = '';
  if (document.getElementById('pos-cash-received')) document.getElementById('pos-cash-received').value = '';
  saveState();
  renderAdminAll();
  showToast(`Venta registrada por $${total}.00 MXN`);
}

// ==========================================
// CALENDARIO MAESTRO DEL ADMIN (CON MODALES)
// ==========================================
function renderAdminMasterCalendar() {
  const dateInput = document.getElementById('admin-calendar-date');
  if (dateInput && dateInput.value !== state.selectedDate) {
    dateInput.value = state.selectedDate;
  }

  const grid = document.getElementById('admin-master-calendar-grid');
  if (!grid) return;

  grid.innerHTML = COURTS.map((court) => {
    const slotsHtml = HOURS.map((hour) => {
      const slot = getSlotInfo(state.selectedDate, court.id, hour);
      if (!slot) {
        return `
          <button onclick="openAdminSlotModal('${court.id}', '${hour}')"
            class="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200 text-left transition flex items-center justify-between">
            <div>
              <span class="text-xs font-black text-vital-green">${hour} hrs</span>
              <p class="text-[11px] text-emerald-700 font-semibold">Libre · Clic para asignar</p>
            </div>
            <span class="text-xs font-bold text-vital-green">+</span>
          </button>
        `;
      }

      const colorMap = {
        booking: 'bg-sky-50 border-sky-200 text-sky-900',
        class: 'bg-amber-50 border-amber-300 text-amber-900',
        maintenance: 'bg-stone-200 border-stone-300 text-stone-700'
      };
      const clsStyle = colorMap[slot.type] || colorMap.booking;

      return `
        <button onclick="openAdminEditSlotModal('${slot.id}')"
          class="p-3 rounded-xl border ${clsStyle} text-left transition flex items-center justify-between">
          <div class="min-w-0 pr-2">
            <span class="text-xs font-black block">${hour} hrs · ${slot.status}</span>
            <p class="text-[11px] font-semibold truncate">${slot.customer}</p>
          </div>
          <span class="text-[10px] font-bold underline shrink-0">Editar</span>
        </button>
      `;
    }).join('');

    return `
      <div class="bg-stone-50 rounded-2xl p-4 border border-stone-200">
        <h4 class="font-serif font-bold text-base text-vital-green mb-3">${court.name}</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${slotsHtml}</div>
      </div>
    `;
  }).join('');
}

function openAdminSlotModal(courtId = 'cancha-1', hour = '10:00') {
  openModal({
    badge: 'CONTROL DE CANCHAS · ADMIN',
    title: 'Asignar Horario o Mantenimiento',
    subtitle: 'Bloquea por mantenimiento, programa clase o registra reserva telefónica',
    bodyHtml: `
      <form id="admin-slot-form" onsubmit="submitAdminSlotForm(event)" class="space-y-3.5">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-500 mb-1">Cancha</label>
            <select id="adm-slot-court" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold">
              ${COURTS.map((c) => `<option value="${c.id}" ${c.id === courtId ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-stone-500 mb-1">Hora</label>
            <select id="adm-slot-hour" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold">
              ${HOURS.map((h) => `<option value="${h}" ${h === hour ? 'selected' : ''}>${h} hrs</option>`).join('')}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 mb-1">Tipo de bloqueo / registro</label>
          <select id="adm-slot-type" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold">
            <option value="booking">Reserva de Cliente ($350 MXN)</option>
            <option value="maintenance">Mantenimiento / Limpieza ($0 - Bloquea cancha)</option>
            <option value="class">Clase con Coach ($250 MXN)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 mb-1">Concepto / Nombre del Cliente o Motivo</label>
          <input type="text" id="adm-slot-customer" required placeholder="Ej. Mantenimiento de red / Familia Ruiz"
            class="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm">
        </div>
      </form>
    `,
    footerHtml: `
      <div class="flex justify-end gap-2">
        <button onclick="closeModal()" class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600">Cancelar</button>
        <button type="submit" form="admin-slot-form" class="px-5 py-2 rounded-xl bg-vital-green text-vital-lime text-xs font-bold">Guardar en Calendario</button>
      </div>
    `
  });
}

function submitAdminSlotForm(e) {
  e.preventDefault();
  const courtId = document.getElementById('adm-slot-court').value;
  const hour = document.getElementById('adm-slot-hour').value;
  const type = document.getElementById('adm-slot-type').value;
  const customerRaw = document.getElementById('adm-slot-customer').value.trim();

  // Reemplazar si ya existía
  state.bookings = state.bookings.filter((b) => !(b.date === state.selectedDate && b.courtId === courtId && b.hour === hour));

  const price = type === 'maintenance' ? 0 : type === 'class' ? 250 : 350;
  const prefix = type === 'maintenance' ? 'MANTENIMIENTO: ' : type === 'class' ? 'CLASE: ' : '';

  state.bookings.push({
    id: 'bk-' + Date.now(),
    date: state.selectedDate,
    courtId,
    hour,
    customer: prefix + customerRaw,
    phone: '715 131 7443',
    price,
    status: type === 'maintenance' ? 'Bloqueado' : 'Confirmado',
    paymentMethod: type === 'maintenance' ? '-' : 'Recepción',
    type,
    coachId: 'coach-1'
  });

  saveState();
  renderAll();
  closeModal();
  showToast('Horario actualizado en el calendario.');
}

function openAdminEditSlotModal(bookingId) {
  const slot = state.bookings.find((b) => b.id === bookingId);
  if (!slot) return;
  const court = COURTS.find((c) => c.id === slot.courtId) || COURTS[0];

  openModal({
    badge: 'GESTIÓN DE HORARIO · ADMIN',
    title: `${court.name} · ${slot.hour} hrs`,
    subtitle: slot.customer,
    bodyHtml: `
      <div class="space-y-2 text-sm text-stone-600">
        <p><strong>Estado:</strong> ${slot.status}</p>
        <p><strong>Teléfono:</strong> ${slot.phone || '-'}</p>
        <p><strong>Monto:</strong> $${slot.price} MXN</p>
      </div>
    `,
    footerHtml: `
      <div class="flex justify-between">
        <button onclick="deleteBookingSlot('${slot.id}')" class="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold">
          Liberar Cancha / Eliminar
        </button>
        <button onclick="closeModal()" class="px-4 py-2 rounded-xl bg-vital-green text-white text-xs font-bold">Cerrar</button>
      </div>
    `
  });
}

function deleteBookingSlot(bookingId) {
  state.bookings = state.bookings.filter((b) => b.id !== bookingId);
  saveState();
  renderAll();
  closeModal();
  showToast('Horario liberado. Ahora aparece disponible para clientes.');
}

// ==========================================
// FLUJO DE CAJA Y CATÁLOGO ADMIN
// ==========================================
function renderAdminCatalogLists() {
  const foodList = document.getElementById('admin-food-catalog-list');
  if (foodList) {
    foodList.innerHTML = state.foodMenu.map((f) => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
        <div>
          <span class="font-bold text-vital-dark">${f.name}</span>
          <span class="text-stone-400 ml-1">(${f.category})</span>
        </div>
        <span class="font-black text-vital-green">$${f.price}</span>
      </div>
    `).join('');
  }

  const txBody = document.getElementById('transactions-table-body');
  if (txBody) {
    txBody.innerHTML = state.transactions.map((t) => `
      <tr class="hover:bg-stone-50">
        <td class="py-2.5 px-3 text-xs text-stone-400">${t.timestamp}</td>
        <td class="py-2.5 px-3 text-xs font-semibold text-vital-dark">${t.concept}</td>
        <td class="py-2.5 px-3 text-xs"><span class="px-2 py-0.5 rounded bg-stone-100 font-bold text-[10px]">${t.category}</span></td>
        <td class="py-2.5 px-3 text-xs text-stone-500">${t.method}</td>
        <td class="py-2.5 px-3 text-xs font-black text-vital-green text-right">$${Number(t.amount).toLocaleString('es-MX')}</td>
      </tr>
    `).join('');
  }
}

function openAddCatalogItemModal() {
  openModal({
    badge: 'CATÁLOGO ADMINISTRABLE',
    title: 'Agregar Producto, Alimento o Clase',
    subtitle: 'Se agregará inmediatamente al menú de clientes y al Punto de Venta',
    bodyHtml: `
      <form id="add-catalog-form" onsubmit="submitNewCatalogItem(event)" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-stone-500 mb-1">Tipo de registro</label>
          <select id="cat-item-type" class="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold">
            <option value="sandwiches">Comida · Sándwich / Alimento</option>
            <option value="bebidas">Comida · Bebida / Smoothie</option>
            <option value="snacks">Comida · Snack</option>
            <option value="clase">Nueva Clase o Torneo</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-500 mb-1">Nombre del producto o clase</label>
          <input type="text" id="cat-item-name" required placeholder="Ej. Baguette Pavo & Arándano / Clínica Barre"
            class="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-500 mb-1">Precio ($ MXN)</label>
            <input type="number" id="cat-item-price" required min="10" placeholder="120"
              class="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-stone-500 mb-1">Etiqueta / Horario</label>
            <input type="text" id="cat-item-desc" required placeholder="Ej. Recién horneado / Sáb 10am"
              class="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm">
          </div>
        </div>
      </form>
    `,
    footerHtml: `
      <div class="flex justify-end gap-2">
        <button onclick="closeModal()" class="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600">Cancelar</button>
        <button type="submit" form="add-catalog-form" class="px-5 py-2 rounded-xl bg-vital-green text-vital-lime text-xs font-bold">Guardar en Catálogo</button>
      </div>
    `
  });
}

function submitNewCatalogItem(e) {
  e.preventDefault();
  const type = document.getElementById('cat-item-type').value;
  const name = document.getElementById('cat-item-name').value.trim();
  const price = Number(document.getElementById('cat-item-price').value);
  const desc = document.getElementById('cat-item-desc').value.trim();

  if (type === 'clase') {
    state.classes.push({
      id: 'cls-' + Date.now(),
      title: name,
      category: 'Familiar',
      schedule: desc,
      hour: '10:00',
      courtId: 'cancha-1',
      coachId: 'coach-1',
      coach: 'Coach Alejandro Morales',
      price,
      spots: 8,
      enrolled: 1,
      students: ['Alumno Inaugural'],
      attendance: { 'Alumno Inaugural': true },
      description: `Sesión especial en cancha techada: ${desc}`,
      badgeColor: 'bg-lime-200 text-vital-green'
    });
  } else {
    state.foodMenu.unshift({
      id: 'fd-' + Date.now(),
      name,
      category: type,
      price,
      desc,
      badge: 'Nuevo'
    });
  }

  saveState();
  renderAll();
  closeModal();
  showToast(`"${name}" agregado al catálogo.`);
}

// ==========================================
// TOAST E INICIALIZACIÓN
// ==========================================
function showToast(msg) {
  const toast = document.getElementById('vital-toast');
  const text = document.getElementById('vital-toast-text');
  if (!toast || !text) return;
  text.textContent = msg;
  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }, 3400);
}

function renderAll() {
  renderBookingGrid();
  renderClassesGrid();
  renderFoodMenuGrid();
  renderCoachesGrid();
  updateClientCartBadge();
  if (currentMode === 'coach') renderCoachView();
  if (currentMode === 'admin') renderAdminAll();
}

document.addEventListener('DOMContentLoaded', () => {
  const bookingDate = document.getElementById('booking-date-picker');
  if (bookingDate) {
    bookingDate.value = state.selectedDate;
    bookingDate.addEventListener('change', (e) => {
      state.selectedDate = e.target.value;
      saveState();
      renderAll();
    });
  }

  const coachDate = document.getElementById('coach-date-picker');
  if (coachDate) {
    coachDate.value = state.selectedDate;
    coachDate.addEventListener('change', (e) => {
      state.selectedDate = e.target.value;
      saveState();
      renderCoachView();
    });
  }

  const coachSelector = document.getElementById('coach-selector');
  if (coachSelector) {
    coachSelector.addEventListener('change', (e) => {
      state.selectedCoachId = e.target.value;
      saveState();
      renderCoachView();
    });
  }

  const adminDate = document.getElementById('admin-calendar-date');
  if (adminDate) {
    adminDate.value = state.selectedDate;
    adminDate.addEventListener('change', (e) => {
      state.selectedDate = e.target.value;
      saveState();
      renderAdminMasterCalendar();
    });
  }

  renderAll();
});
