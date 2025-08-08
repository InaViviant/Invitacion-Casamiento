// Variables globales
let currentSection = 0;
const totalSections = 8;
let isScrolling = false;

// Inicia la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCountdown();
    initializeForm();
    initializeScrolling();
});

// Función de navegación
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

// Smooth scroll
function initializeScrolling() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Scroll
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        e.preventDefault();
        
        if (e.deltaY > 0) {
            // Scroll down
            nextSection();
        } else {
            // Scroll up
            previousSection();
        }
    }, { passive: false });
    
    // Eventos para celular
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        if (Math.abs(touchDiff) > 50) {
            if (touchDiff > 0) {
                nextSection();
            } else {
                previousSection();
            }
        }
    });
    
    // Navegación teclado
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                nextSection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                previousSection();
                break;
        }
    });
}

function nextSection() {
    if (currentSection < totalSections - 1) {
        goToSection(currentSection + 1);
    }
}

function previousSection() {
    if (currentSection > 0) {
        goToSection(currentSection - 1);
    }
}

function goToSection(sectionIndex) {
    if (sectionIndex === currentSection || isScrolling) return;
    
    isScrolling = true;
    
    // Elimina la clase activa
    const currentSectionElement = document.querySelector(`.section[data-section="${currentSection}"]`);
    const currentDot = document.querySelector(`.dot[data-section="${currentSection}"]`);
    
    if (currentSectionElement) {
        currentSectionElement.classList.remove('active');
    }
    if (currentDot) {
        currentDot.classList.remove('active');
    }
    
    // Agrega nueva clase a la sección
    const newSectionElement = document.querySelector(`.section[data-section="${sectionIndex}"]`);
    const newDot = document.querySelector(`.dot[data-section="${sectionIndex}"]`);
    
    if (newSectionElement) {
        newSectionElement.classList.add('active');
    }
    if (newDot) {
        newDot.classList.add('active');
    }
    
    currentSection = sectionIndex;
    
    // Reestablecer después de la animación
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// Función de cuenta atras
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

// Función del formulario
function initializeForm() {
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guestsGroup');
    const form = document.getElementById('rsvpForm');
    
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'si') {
            guestsGroup.style.display = 'block';
            guestsGroup.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            guestsGroup.style.display = 'none';
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Agrega la validación
        if (!validateForm(data)) {
            return;
        }
        
        // Simula la validación
        showSuccessMessage();
    });
}

function validateForm(data) {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const attendance = document.getElementById('attendance').value;
    
    if (!firstName || !lastName || !dni || !attendance) {
        showErrorMessage('Por favor, completa todos los campos obligatorios.');
        return false;
    }
    
    // Validar DNI
    const dniPattern = /^\d{1,2}\.?\d{3}\.?\d{3}$/;
    if (!dniPattern.test(dni)) {
        showErrorMessage('Por favor, ingresa un DNI válido.');
        return false;
    }
    
    return true;
}

function showSuccessMessage() {
    const button = document.querySelector('.submit-button');
    const originalText = button.textContent;
    
    button.textContent = '¡Confirmación enviada!';
    button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
        button.disabled = false;
    }, 3000);
}

function showErrorMessage(message) {
    // Crea un mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        animation: fadeInUp 0.3s ease-out;
    `;
    
    const form = document.getElementById('rsvpForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Función del calendario
function addToCalendar() {
    const title = 'Casamiento de Iñaki y Melany';
    const details = 'Celebración de la boda de Iñaki y Melany en Estancia la Mimosa';
    const location = 'Estancia la Mimosa';
    const startDate = '20301021T210000Z';
    const endDate = '20301022T040000Z';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
}

// Función de regalo
function handleGiftClick() {
    const modal = createGiftModal();
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createGiftModal() {
    const modal = document.createElement('div');
    modal.className = 'gift-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeGiftModal()">&times;</button>
                <h3>Información para Transferencia</h3>
                <div class="bank-info">
                    <div class="bank-detail">
                        <strong>Banco:</strong> Banco Ejemplo
                    </div>
                    <div class="bank-detail">
                        <strong>Titular:</strong> Iñaki y Melany
                    </div>
                    <div class="bank-detail">
                        <strong>CBU:</strong> 1234567890123456789012
                    </div>
                    <div class="bank-detail">
                        <strong>Alias:</strong> BODA.INAKI.MELANY
                    </div>
                </div>
                <p class="modal-note">¡Gracias por tu generosidad!</p>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.cssText = `
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 1px solid rgba(30, 58, 138, 0.3);
        border-radius: 15px;
        padding: 2rem;
        max-width: 500px;
        width: 100%;
        position: relative;
        text-align: center;
    `;
    
    return modal;
}

function closeGiftModal() {
    const modal = document.querySelector('.gift-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// CSS en modal
const modalStyles = `
    .gift-modal.active {
        opacity: 1 !important;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: #1e3a8a;
        font-size: 2rem;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .modal-close:hover {
        color: #3b82f6;
    }
    
    .bank-info {
        margin: 2rem 0;
        text-align: left;
    }
    
    .bank-detail {
        margin: 1rem 0;
        padding: 0.5rem;
        background: rgba(30, 58, 138, 0.1);
        border-radius: 5px;
        color: #e5e7eb;
    }
    
    .bank-detail strong {
        color: #1e3a8a;
    }
    
    .modal-note {
        color: #1e3a8a;
        font-style: italic;
        margin-top: 2rem;
    }
`;

// Estilos al encabezado
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);