// ================================================
// Variables Globales y Configuración
// ================================================

let currentSection = 0;
let totalSections = 0;
let isScrolling = false;
let currentSlide = 0;
let totalSlides = 0;
let touchStartY = 0;
let touchStartX = 0;
let touchStartTime = 0;
let countdownInterval;

// ================================================
// Inicialización Principal
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    
    setTimeout(() => {
        initializeApp();
        hideLoadingScreen();
    }, 2000);
});

function initializeApp() {
    totalSections = document.querySelectorAll('.section').length;
    totalSlides = document.querySelectorAll('.slide').length;
    
    initializeCountdown();
    initializeNavigation();
    initializeForms();
    initializeScrolling();
    initializeCarousel();
    initializeProgressBar();
    initializePerformanceOptimizations();
}

// ================================================
// Loading Screen
// ================================================

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ================================================
// Sistema de Navegación Mejorado
// ================================================

function initializeNavigation() {
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isScrolling) {
                goToSection(index);
            }
        });
        
        // Efecto hover mejorado
        dot.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.2)';
            }
        });
        
        dot.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
}

function goToSection(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= totalSections || isScrolling) return;
    
    isScrolling = true;
    
    // Actualizar barra de progreso
    updateProgressBar(sectionIndex);
    
    // Desactivar sección actual
    const currentSectionElement = document.querySelector('.section.active');
    const currentDot = document.querySelector('.dot.active');
    
    if (currentSectionElement) {
        currentSectionElement.classList.remove('active');
    }
    
    if (currentDot) {
        currentDot.classList.remove('active');
        currentDot.style.transform = 'scale(1)';
    }
    
    // Actualizar sección actual
    currentSection = sectionIndex;
    
    // Activar nueva sección con animación suave
    requestAnimationFrame(() => {
        const newSection = document.querySelector(`[data-section="${sectionIndex}"]`);
        const newDot = document.querySelector(`.dot[data-section="${sectionIndex}"]`);
        
        if (newSection) {
            newSection.classList.add('active');
            triggerSectionAnimations(newSection);
        }
        
        if (newDot) {
            newDot.classList.add('active');
            newDot.style.transform = 'scale(1)';
        }
        
        // Permitir nuevo scroll después de la transición
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    });
}

function triggerSectionAnimations(section) {
    const animatedElements = section.querySelectorAll('.countdown-item, .date-card, .location-card, .guideline-card');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.style.animation = 'slideUp 0.6s ease-out both';
    });
}

function updateProgressBar(sectionIndex) {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((sectionIndex + 1) / totalSections) * 100;
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

// ================================================
// Sistema de Scroll Optimizado
// ================================================

function initializeScrolling() {
    let scrollTimeout;
    let isWheelScrolling = false;
    
    // Scroll con rueda del mouse (desktop) - throttled
    window.addEventListener('wheel', throttle((e) => {
        e.preventDefault();
        
        if (isScrolling || isWheelScrolling) return;
        
        isWheelScrolling = true;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 30) {
                // Scroll hacia abajo
                if (currentSection < totalSections - 1) {
                    goToSection(currentSection + 1);
                }
            } else if (e.deltaY < -30) {
                // Scroll hacia arriba
                if (currentSection > 0) {
                    goToSection(currentSection - 1);
                }
            }
            
            setTimeout(() => {
                isWheelScrolling = false;
            }, 100);
        }, 50);
    }, 100), { passive: false });
    
    // Eventos táctiles optimizados para móviles
    let touchEventOptions = { passive: true };
    
    window.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartY = touch.clientY;
        touchStartX = touch.clientX;
        touchStartTime = Date.now();
    }, touchEventOptions);
    
    window.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        const touch = e.changedTouches[0];
        const touchEndY = touch.clientY;
        const touchEndX = touch.clientX;
        const touchDuration = Date.now() - touchStartTime;
        
        const touchDistanceY = Math.abs(touchStartY - touchEndY);
        const touchDistanceX = Math.abs(touchStartX - touchEndX);
        
        // Solo procesar swipes verticales válidos
        if (touchDistanceY > 50 && 
            touchDistanceX < touchDistanceY && 
            touchDuration < 800) {
            
            if (touchStartY > touchEndY + 50) {
                // Swipe hacia arriba (siguiente sección)
                if (currentSection < totalSections - 1) {
                    goToSection(currentSection + 1);
                }
            } else if (touchStartY < touchEndY - 50) {
                // Swipe hacia abajo (sección anterior)
                if (currentSection > 0) {
                    goToSection(currentSection - 1);
                }
            }
        }
    }, touchEventOptions);
    
    // Prevenir scroll nativo en el body
    document.body.addEventListener('touchmove', (e) => {
        if (e.target.closest('.carousel-container, .form-group, input, select, textarea')) {
            return; // Permitir scroll en carrusel y formularios
        }
        e.preventDefault();
    }, { passive: false });
    
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
            case 'ArrowLeft':
                if (currentSection === 4) { // Sección de fotos
                    e.preventDefault();
                    changeSlide(-1);
                }
                break;
            case 'ArrowRight':
                if (currentSection === 4) { // Sección de fotos
                    e.preventDefault();
                    changeSlide(1);
                }
                break;
        }
    });
}

// ================================================
// Cuenta Regresiva Mejorada
// ================================================

function initializeCountdown() {
    const weddingDate = new Date('2030-10-21T21:00:00').getTime();
    const circumference = 2 * Math.PI * 45; // Radio de 45px
    
    // Configurar los círculos SVG
    const progressCircles = document.querySelectorAll('.countdown-progress');
    progressCircles.forEach(circle => {
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
    });
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown-text').textContent = '¡Ya nos casamos! 🎉';
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Actualizar números
        document.getElementById('days').textContent = days.toString().padStart(3, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Actualizar círculos de progreso
        updateProgressCircle('days-progress', days, 365);
        updateProgressCircle('hours-progress', hours, 24);
        updateProgressCircle('minutes-progress', minutes, 60);
        updateProgressCircle('seconds-progress', seconds, 60);
    }
    
    function updateProgressCircle(id, value, max) {
        const circle = document.getElementById(id);
        if (circle) {
            const progress = (value / max) * circumference;
            const offset = circumference - progress;
            circle.style.strokeDashoffset = offset;
        }
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// ================================================
// Carrusel de Fotos
// ================================================

function initializeCarousel() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot-photo');
    
    if (slides.length === 0) return;
    
    // Auto-play del carrusel
    setInterval(() => {
        if (currentSection === 4) { // Solo si estamos en la sección de fotos
            changeSlide(1);
        }
    }, 5000);
    
    // Eventos táctiles para el carrusel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        let carouselTouchStartX = 0;
        
        carouselContainer.addEventListener('touchstart', (e) => {
            carouselTouchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchDistance = Math.abs(carouselTouchStartX - touchEndX);
            
            if (touchDistance > 50) {
                if (carouselTouchStartX > touchEndX) {
                    changeSlide(1); // Siguiente
                } else {
                    changeSlide(-1); // Anterior
                }
            }
        }, { passive: true });
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot-photo');
    
    if (slides.length === 0) return;
    
    // Remover clase active actual
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Calcular nuevo slide
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Activar nuevo slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Actualizar posición del carrusel
    const slidesContainer = document.getElementById('carouselSlides');
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot-photo');
    
    if (slideIndex < 0 || slideIndex >= slides.length) return;
    
    // Remover clase active actual
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Activar nuevo slide
    currentSlide = slideIndex;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Actualizar posición del carrusel
    const slidesContainer = document.getElementById('carouselSlides');
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

// ================================================
// Formularios Mejorados
// ================================================

function initializeForms() {
    // Formulario RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const guestsGroup = document.getElementById('guestsGroup');
    
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'si') {
                guestsGroup.style.display = 'block';
                guestsGroup.style.animation = 'slideUp 0.5s ease-out';
            } else {
                guestsGroup.style.display = 'none';
            }
        });
    });
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validaciones adicionales
            if (validateRSVPForm(data)) {
                showNotification('¡Gracias por confirmar tu asistencia! 💕', 'success');
                
                // Efecto de confetti
                createConfetti();
                
                // Limpiar formulario
                this.reset();
                guestsGroup.style.display = 'none';
                
                // Scroll automático a la siguiente sección después de un delay
                setTimeout(() => {
                    if (currentSection < totalSections - 1) {
                        goToSection(currentSection + 1);
                    }
                }, 2000);
            }
        });
    }
    
    // Formulario de música
    const musicForm = document.getElementById('musicForm');
    if (musicForm) {
        musicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const songName = document.getElementById('songName').value;
            const guestName = document.getElementById('guestName').value;
            
            if (songName.trim()) {
                const message = guestName ? 
                    `¡Gracias ${guestName}! Tu canción "${songName}" será considerada para nuestra playlist. 🎵` :
                    `¡Gracias por sugerir "${songName}"! La consideraremos para nuestra playlist. 🎵`;
                
                showNotification(message, 'success');
                this.reset();
            } else {
                showNotification('Por favor, ingresa el nombre de una canción.', 'error');
            }
        });
    }
    
    // Validación en tiempo real
    initializeRealTimeValidation();
}

function validateRSVPForm(data) {
    if (!data.firstName || !data.firstName.trim()) {
        showNotification('Por favor, ingresa tu nombre.', 'error');
        return false;
    }
    
    if (!data.lastName || !data.lastName.trim()) {
        showNotification('Por favor, ingresa tu apellido.', 'error');
        return false;
    }
    
    if (!data.dni || !data.dni.trim()) {
        showNotification('Por favor, ingresa tu DNI.', 'error');
        return false;
    }
    
    if (!data.attendance) {
        showNotification('Por favor, confirma tu asistencia.', 'error');
        return false;
    }
    
    return true;
}

function initializeRealTimeValidation() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ff4444';
            } else {
                this.style.borderColor = '#d4af37';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#d4af37';
            }
        });
    });
}

// ================================================
// Barra de Progreso
// ================================================

function initializeProgressBar() {
    updateProgressBar(currentSection);
}

// ================================================
// Funciones de Utilidad
// ================================================

function addToCalendar() {
    const startDate = '20301021T210000';
    const endDate = '20301022T040000';
    const title = 'Casamiento Iñaki y Melany';
    const details = 'Celebración de la boda de Iñaki y Melany en Estancia la Mimosa';
    const location = 'Estancia la Mimosa';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    showNotification('Abriendo Google Calendar... 📅', 'info');
}

function handleGiftClick() {
    const bankInfo = {
        cbu: '0000003100010000000001',
        alias: 'IÑAKI.MELANY.BODA',
        titular: 'Iñaki y Melany',
        banco: 'Banco Ejemplo'
    };
    
    // Copiar CBU al portapapeles si es posible
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(bankInfo.cbu).then(() => {
            showNotification('CBU copiado al portapapeles 💳', 'success');
        }).catch(() => {
            showBankInfo(bankInfo);
        });
    } else {
        showBankInfo(bankInfo);
    }
    
    function showBankInfo(info) {
        const bankInfoText = `
🏦 Datos para transferencia:

💳 CBU: ${info.cbu}
🏷️ Alias: ${info.alias}
👤 Titular: ${info.titular}
🏛️ Banco: ${info.banco}

💖 ¡Gracias por tu generosidad!
        `;
        
        showNotification('Información bancaria mostrada', 'info');
        
        // Crear modal personalizado
        createBankInfoModal(bankInfoText, info.cbu);
    }
}

function createBankInfoModal(text, cbu) {
    const modal = document.createElement('div');
    modal.className = 'bank-modal';
    modal.innerHTML = `
        <div class="bank-modal-content">
            <button class="bank-modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            <pre class="bank-info-text">${text}</pre>
            <div class="bank-modal-buttons">
                <button class="elegant-button" onclick="copyToClipboard('${cbu}')">
                    📋 Copiar CBU
                </button>
                <button class="elegant-button" onclick="this.parentElement.parentElement.parentElement.remove()">
                    ✓ Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Estilos para el modal
    const modalStyles = `
        .bank-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .bank-modal-content {
            background: linear-gradient(135deg, #1a3d2e, #0f2419);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            margin: 1rem;
            position: relative;
            animation: slideUp 0.4s ease;
        }
        
        .bank-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            color: #ffffff;
            cursor: pointer;
            font-size: 1.2rem;
        }
        
        .bank-info-text {
            color: #ffffff;
            font-family: 'Montserrat', sans-serif;
            font-size: 1rem;
            line-height: 1.6;
            white-space: pre-line;
            margin-bottom: 1.5rem;
        }
        
        .bank-modal-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .bank-modal-buttons .elegant-button {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('bank-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'bank-modal-styles';
        style.textContent = modalStyles;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    
    // Cerrar con Escape
    const closeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeHandler);
        }
    };
    document.addEventListener('keydown', closeHandler);
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('CBU copiado al portapapeles 💳', 'success');
        });
    } else {
        // Fallback para navegadores sin soporte
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('CBU copiado 💳', 'success');
        } catch (e) {
            showNotification('No se pudo copiar automáticamente', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// ================================================
// Sistema de Notificaciones Mejorado
// ================================================

function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    // Estilos para la notificación
    const colors = {
        success: { bg: 'rgba(45, 90, 61, 0.95)', border: '#2d5a3d' },
        error: { bg: 'rgba(90, 45, 45, 0.95)', border: '#5a2d2d' },
        info: { bg: 'rgba(45, 61, 90, 0.95)', border: '#2d3d5a' },
        warning: { bg: 'rgba(90, 75, 45, 0.95)', border: '#5a4b2d' }
    };
    
    const colorScheme = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${colorScheme.bg};
        border: 1px solid ${colorScheme.border};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        z-index: 10001;
        animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        max-width: 350px;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 1rem;
        font-family: 'Montserrat', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove después del tiempo especificado
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 400);
        }
    }, duration);
}

// ================================================
// Efectos Especiales
// ================================================

function createConfetti() {
    const colors = ['#d4af37', '#f4d464', '#ffffff', '#ffed4e'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 10000;
                animation: confettiFall ${Math.random() * 2 + 3}s linear forwards;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentElement) {
                    confetti.remove();
                }
            }, 5000);
        }, i * 50);
    }
}

// ================================================
// Optimizaciones de Rendimiento
// ================================================

function initializePerformanceOptimizations() {
    // Throttle para eventos que pueden dispararse muy frecuentemente
    window.addEventListener('resize', throttle(handleResize, 250));
    
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
    
    // Precargar siguiente sección
    preloadNextSection();
}

function handleResize() {
    // Ajustar elementos según el tamaño de pantalla
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Optimizaciones específicas para móvil
        document.body.classList.add('mobile-optimized');
    } else {
        document.body.classList.remove('mobile-optimized');
    }
}

function preloadNextSection() {
    const nextSection = currentSection + 1;
    if (nextSection < totalSections) {
        const nextSectionElement = document.querySelector(`[data-section="${nextSection}"]`);
        if (nextSectionElement) {
            nextSectionElement.style.willChange = 'transform, opacity';
        }
    }
}

// ================================================
// Funciones Auxiliares
// ================================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================================
// Agregar Estilos de Animaciones Dinámicas
// ================================================

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .notification {
        font-family: 'Montserrat', sans-serif !important;
    }
    
    .notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .notification-message {
        flex-grow: 1;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        margin-left: 0.5rem;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
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
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .mobile-optimized .navigation-dots {
        right: 0.5rem;
    }
    
    .mobile-optimized .notification {
        right: 1rem;
        left: 1rem;
        max-width: none;
    }
`;

document.head.appendChild(dynamicStyles);

// ================================================
// Cleanup al cerrar
// ================================================

window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});