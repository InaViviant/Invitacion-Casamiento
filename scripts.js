  function handleGiftClick() {
            alert('¡Gracias por tu generosidad! En un caso real, aquí se redirigiría a una plataforma de pagos o se mostrarían los datos bancarios para la transferencia.');
        }

        // Animación suave al cargar
        window.addEventListener('load', function() {
            const card = document.querySelector('.invitation-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });