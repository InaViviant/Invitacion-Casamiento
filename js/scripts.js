// Variables globales
let currentSection = 0;
const totalSections = document.querySelectorAll('.section').length;
let isScrolling = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
    initializeNavigation();
    initializeForms();
    initializeScrolling();
});

// Sistema de navegación por secciones
function initializeNavigation() {
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isScrolling) {
                goToSection(index);
            }
        });
    });
}

function goToSection(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= totalSections || isScrolling) return;
    
    isScrolling = true;
    
    // Remover clase active de la sección actual
    const currentSectionElement = document.querySelector('.section.active');
    if (currentSectionElement) {
        currentSectionElement.classList.remove('active');
    }
    
    // Remover clase active del dot actual
    const currentDot = document.querySelector('.dot.active');
    if (currentDot) {
        currentDot.classList.remove('active');
    }
    
    // Actualizar sección actual
    currentSection = sectionIndex;
    
    // Activar nueva sección con delay para la transición
    setTimeout(() => {
        const newSection = document.querySelector(`[data-section="${sectionIndex}"]`);
        const newDot = document.querySelector(`.dot[data-section="${sectionIndex}"]`);
        
        if (newSection) newSection.classList.add('active');
        if (newDot) newDot.classList.add('active');
        
        // Permitir nuevo scroll después de la transición
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }, 100);
}

// Sistema de scroll mejorado con soporte táctil
function initializeScrolling() {
    let scrollTimeout;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    
    // Scroll con rueda del mouse (desktop)
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                // Scroll hacia abajo
                if (currentSection < totalSections - 1) {
                    goToSection(currentSection + 1);
                }
            } else {
                // Scroll hacia arriba
                if (currentSection > 0) {
                    goToSection(currentSection - 1);
                }
            }
        }, 50);
    }, { passive: false });
    
    // Eventos táctiles para móviles
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    window.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const touchDuration = Date.now() - touchStartTime;
        const touchDistance = Math.abs(touchStartY - touchEndY);
        
        // Solo procesar si es un swipe válido
        // Mínimo 50px de distancia y máximo 800ms de duración
        if (touchDistance > 50 && touchDuration < 800) {
            if (touchStartY > touchEndY + 50) {
                // Swipe hacia arriba (ir a siguiente sección)
                if (currentSection < totalSections - 1) {
                    goToSection(currentSection + 1);
                }
            } else if (touchStartY < touchEndY - 50) {
                // Swipe hacia abajo (ir a sección anterior)
                if (currentSection > 0) {
                    goToSection(currentSection - 1);
                }
            }
        }
    }, { passive: true });
    
    // Prevenir el scroll nativo en toda la página
    document.body.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Permitir scroll en formularios y inputs
    const allowScrollElements = document.querySelectorAll('input, select, textarea');
    allowScrollElements.forEach(element => {
        element.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    });
    
    // Navegación con teclado
    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                if (currentSection < totalSections - 1) {
                    goToSection(currentSection + 1);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentSection > 0) {
                    goToSection(currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                goToSection(totalSections - 1);
                break;
        }
    });
}

// Cuenta regresiva
function initializeCountdown() {
    const weddingDate = new Date('2030-10-21T21:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown-text').textContent = '¡Ya nos casamos!';
            document.getElementById('days').textContent = '000';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(3, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Inicializar formularios
function initializeForms() {
    // Formulario RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guestsGroup');
    
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'si') {
            guestsGroup.style.display = 'block';
            guestsGroup.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            guestsGroup.style.display = 'none';
        }
    });
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simular envío de datos
        showNotification('¡Gracias por confirmar tu asistencia!', 'success');
        
        // Limpiar formulario
        this.reset();
        guestsGroup.style.display = 'none';
    });
    
    // Formulario de música
    const musicForm = document.getElementById('musicForm');
    musicForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const songName = document.getElementById('songName').value;
        const guestName = document.getElementById('guestName').value;
        
        if (songName.trim()) {
            showNotification(`¡Gracias ${guestName || 'por tu sugerencia'}! Consideraremos "${songName}" para nuestra playlist.`, 'success');
            this.reset();
        }
    });
}

// Funciones para botones
function addToCalendar() {
    const startDate = '20301021T210000';
    const endDate = '20301022T040000';
    const title = 'Casamiento Iñaki y Melany';
    const details = 'Celebración de la boda de Iñaki y Melany en Estancia la Mimosa';
    const location = 'Estancia la Mimosa';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    showNotification('Abriendo Google Calendar...', 'info');
}

function handleGiftClick() {
    const bankInfo = `
Datos para transferencia:
CBU: 0000003100010000000001
Alias: IÑAKI.MELANY.BODA
Titular: Iñaki y Melany
Banco: Banco Ejemplo

¡Gracias por tu generosidad!
    `;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText('0000003100010000000001').then(() => {
            showNotification('CBU copiado al portapapeles', 'success');
        });
    }
    
    alert(bankInfo);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#2d5a3d' : type === 'error' ? '#5a2d2d' : '#2d3d5a'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Efectos adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de partículas en el hero
    createFloatingHearts();
    
    // Animaciones de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.date-item, .time-item, .countdown-item, .dress-item').forEach(el => {
        observer.observe(el);
    });
});

function createFloatingHearts() {
    const heroSection = document.querySelector('.hero-section');
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '♥';
        heart.style.cssText = `
            position: absolute;
            color: rgba(212, 175, 55, 0.3);
            font-size: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}%;
            top: 100%;
            pointer-events: none;
            animation: floatUp ${Math.random() * 3 + 4}s linear forwards;
            z-index: 1;
        `;
        
        heroSection.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 7000);
    }
    
    // Crear corazones flotantes cada cierto tiempo
    setInterval(createHeart, 3000);
}

// Agregar animación de corazones flotantes
const floatingHeartsStyle = document.createElement('style');
floatingHeartsStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatingHeartsStyle);