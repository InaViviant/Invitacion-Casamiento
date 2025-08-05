// Handle gift button click
function handleGiftClick() {
    alert('¡Gracias por tu generosidad! En un caso real, aquí se redirigiría a una plataforma de pagos o se mostrarían los datos bancarios para la transferencia.');
}

// Add to Calendar function
function addToCalendar() {
    // Wedding details
    const eventDetails = {
        title: 'Casamiento de Iñaki y Melany',
        startDate: '20301021T210000', // October 21, 2030, 21:00 (9 PM)
        endDate: '20301022T040000',   // October 22, 2030, 04:00 (4 AM) - assuming 7 hour event
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

// Smooth loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Intersection Observer for smooth section reveals
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Add gentle hover effects
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