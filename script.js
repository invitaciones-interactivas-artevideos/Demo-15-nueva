/* =========================================
   1. CONFIGURACIÓN GENERAL (Edita los true/false y datos aquí)
========================================= */
const config = {
    // Formato de fecha: AAAA-MM-DDTHH:mm:ss
    fechaEvento: "2026-12-15T21:30:00", 
    
    // Activar o desactivar módulos (true para mostrar, false para ocultar)
    opciones: {
        musicaAutoplay: true,
        galeriaFotos: true,
        regalos: true,
        playlist: true,
        albumCompartido: true,
        instagram: true
    },

    // Enlaces de Google Forms e Instagram
    links: {
        playlist: "https://forms.gle/TU_FORMULARIO_PLAYLIST",
        album: "https://forms.gle/TU_FORMULARIO_ALBUM",
        instagram: "https://instagram.com/tu_usuario"
    },

    // Configuración de la Galería
    galeria: {
        cantidadFotos: 5 // Generará foto1.jpg, foto2.jpg, hasta foto5.jpg
    },

    // Datos Bancarios
    datosBancarios: `Banco: Banco República\nTitular: Victoria Apellido\nCuenta: 123456789\nCBU/Alias: mis.15.victoria`
};

/* =========================================
   2. INICIALIZACIÓN DE LA INTERFAZ
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    aplicarConfiguracion();
    iniciarCuentaRegresiva();
    configurarAnimacionesScroll();
});

function aplicarConfiguracion() {
    // Configurar Extras
    if (config.opciones.playlist) {
        document.getElementById('sec-playlist').classList.remove('hidden-section');
        document.getElementById('link-playlist').href = config.links.playlist;
    }
    if (config.opciones.albumCompartido) {
        document.getElementById('sec-album').classList.remove('hidden-section');
        document.getElementById('link-album').href = config.links.album;
    }
    if (config.opciones.instagram) {
        document.getElementById('sec-instagram').classList.remove('hidden-section');
        document.getElementById('link-ig').href = config.links.instagram;
    }

    // Configurar Regalos
    if (config.opciones.regalos) {
        document.getElementById('sec-gifts').classList.remove('hidden-section');
        document.getElementById('bank-text').innerText = config.datosBancarios;
    }

    // Configurar Galería
    if (config.opciones.galeriaFotos) {
        document.getElementById('sec-gallery').classList.remove('hidden-section');
        const carousel = document.getElementById('photo-carousel');
        for (let i = 1; i <= config.galeria.cantidadFotos; i++) {
            const img = document.createElement('img');
            img.src = `foto${i}.jpg`;
            img.alt = `Foto ${i}`;
            img.addEventListener('click', () => abrirLightbox(img.src));
            carousel.appendChild(img);
        }
    }
}

/* =========================================
   3. PORTADA Y MÚSICA
========================================= */
const cover = document.getElementById('cover');
const mainInvitation = document.getElementById('main-invitation');
const bgMusic = document.getElementById('bg-music');

cover.addEventListener('click', () => {
    // Ocultar portada
    cover.style.opacity = '0';
    setTimeout(() => {
        cover.style.display = 'none';
        mainInvitation.classList.remove('hidden');
        // Disparar las animaciones de los elementos ya visibles
        configurarAnimacionesScroll();
    }, 1000);

    // Intentar reproducir música
    if (config.opciones.musicaAutoplay) {
        bgMusic.play().catch(error => {
            console.log("Autoplay bloqueado por el navegador, requiere interacción previa.", error);
        });
    }
});

/* =========================================
   4. CUENTA REGRESIVA
========================================= */
function iniciarCuentaRegresiva() {
    const fechaDestino = new Date(config.fechaEvento).getTime();

    const intervalo = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaDestino - ahora;

        if (distancia < 0) {
            clearInterval(intervalo);
            document.getElementById('countdown').classList.add('hidden');
            document.getElementById('countdown-finished').classList.remove('hidden');
            return;
        }

        document.getElementById('days').innerText = Math.floor(distancia / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById('minutes').innerText = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById('seconds').innerText = Math.floor((distancia % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);
}

/* =========================================
   5. BOTÓN DE REGALOS (Copiar Portapapeles)
========================================= */
const btnShowBank = document.getElementById('btn-show-bank');
const bankDetails = document.getElementById('bank-details');
const btnCopyBank = document.getElementById('btn-copy-bank');

btnShowBank.addEventListener('click', () => {
    bankDetails.classList.toggle('hidden');
});

btnCopyBank.addEventListener('click', () => {
    navigator.clipboard.writeText(config.datosBancarios).then(() => {
        const originalText = btnCopyBank.innerHTML;
        btnCopyBank.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
        setTimeout(() => {
            btnCopyBank.innerHTML = originalText;
        }, 3000);
    });
});

/* =========================================
   6. LIGHTBOX PARA IMÁGENES (Con soporte para botón "Atrás")
========================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

function abrirLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
    // Agregamos un estado al historial del navegador para que funcione el botón "atrás"
    window.history.pushState({ modalOpen: true }, "", "#foto");
}

function cerrarLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
}

closeLightbox.addEventListener('click', () => {
    // Al tocar la cruz, simulamos ir hacia atrás en el navegador
    window.history.back();
});

// Detectar cuando el usuario usa el botón de "Atrás" del celular/navegador
window.addEventListener('popstate', (event) => {
    if (!event.state || !event.state.modalOpen) {
        cerrarLightbox();
    }
});

/* =========================================
   7. ANIMACIONES AL HACER SCROLL (Fade In)
========================================= */
function configurarAnimacionesScroll() {
    const elementos = document.querySelectorAll('.fade-in');
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach(el => observador.observe(el));
}