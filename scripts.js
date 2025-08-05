// Handle gift button click
function handleGiftClick() {
    alert('¡Gracias por tu generosidad! En un caso real, aquí se redirigiría a una plataforma de pagos o se mostrarían los datos bancarios para la transferencia.');
}

// Optimized countdown with requestAnimationFrame
let countdownFrame;
let lastUpdate = 0;

function updateCountdown() {
    const now = Date.now();
    
    // Throttle updates to once per second
    if (now - lastUpdate < 1000) {
        countdownFrame = requestAnimationFrame(updateCountdown);
        return;
    }
    
    lastUpdate = now;
    
    // Wedding date: October 21, 2030 at 21:00 (9 PM) Argentina time
    const weddingDate = new Date('2030-10-21T21:00:00-03:00').getTime();
    const timeLeft = weddingDate - now;

    // Calculate time units
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Update the display using textContent (faster than innerHTML)
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(3, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

    // Update message based on time left
    const messageElement = document.getElementById('countdown-text');
    
    if (messageElement) {
        if (timeLeft < 0) {
            messageElement.textContent = '¡Ya nos casamos! 🎉💕';
            if (daysEl) daysEl.textContent = '000';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            // Stop the countdown
            cancelAnimationFrame(countdownFrame);
            return;
        } else if (days === 0) {
            messageElement.textContent = '¡Es hoy! 💍✨';
        } else if (days === 1) {
            messageElement.textContent = '¡Mañana nos casamos! 💕';
        } else if (days <= 7) {
            messageElement.textContent = '¡Esta semana nos casamos! 🥰';
        } else if (days <= 30) {
            messageElement.textContent = '¡Este mes nos casamos! 💐';
        } else {
            messageElement.textContent = '¡Nos casamos en...';
        }
    }
    
    // Continue the countdown
    countdownFrame = requestAnimationFrame(updateCountdown);
}

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCountdown();
});

// Stop countdown when page is hidden (battery optimization)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (countdownFrame) {
            cancelAnimationFrame(countdownFrame);
        }
    } else {
        updateCountdown();
    }
});

// Add to Calendar function - optimized
function addToCalendar() {
    // Wedding details
    const eventDetails = {
        title: 'Casamiento de Iñaki y Melany',
        startDate: '20301021T210000',
        endDate: '20301022T040000',
        location: 'Estancia la Mimosa',
        description: 'Celebración del casamiento de Iñaki y Melany. ¡No olvides el código de vestimenta: vestido largo para mujeres y traje con corbata para hombres!'
    };

    // Detect device/browser and create appropriate calendar link
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
        // iOS Calendar
        const iosUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${eventDetails.startDate}
DTEND:${eventDetails.endDate}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;
        
        const element = document.createElement('a');
        element.setAttribute('href', iosUrl);
        element.setAttribute('download', 'casamiento-inaki-melany.ics');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } else if (isAndroid) {
        // Android Calendar Intent
        const androidUrl = `intent://calendar/add?` + 
            `title=${encodeURIComponent(eventDetails.title)}` +
            `&startTime=${new Date('2030-10-21T21:00:00').getTime()}` +
            `&endTime=${new Date('2030-10-22T04:00:00').getTime()}` +
            `&location=${encodeURIComponent(eventDetails.location)}` +
            `&description=${encodeURIComponent(eventDetails.description)}` +
            `#Intent;scheme=https;package=com.google.android.calendar;end`;
        
        window.location.href = androidUrl;
    } else {
        // Desktop - Google Calendar
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(eventDetails.title)}` +
            `&dates=${eventDetails.startDate}/${eventDetails.endDate}` +
            `&location=${encodeURIComponent(eventDetails.location)}` +
            `&details=${encodeURIComponent(eventDetails.description)}`;
        
        window.open(googleUrl, '_blank');
    }
}

// Optimized loading - no fade effect to improve performance
window.addEventListener('load', function() {
    // Preload critical elements
    const criticalElements = document.querySelectorAll('.wedding-frame, .info-card');
    criticalElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0)';
    });
});

// Simplified intersection observer - only for desktop
if (window.innerWidth > 768) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections only on desktop
    document.addEventListener('DOMContentLoaded', function() {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(section);
        });
    });
}

// Optimized hover effects only for desktop
if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.info-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    });
}

// Passive scroll listener for better performance
let ticking = false;

function updateOnScroll() {
    // Minimal scroll effects only if needed
    ticking = false;
}

document.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}, { passive: true });

// Optimize for mobile browsers
if (/Mobi|Android/i.test(navigator.userAgent)) {
    // Disable hover effects on mobile
    const style = document.createElement('style');
    style.textContent = `
        .info-card:hover,
        .countdown-item:hover,
        .calendar-button:hover,
        .location-link:hover,
        .gift-button:hover {
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}