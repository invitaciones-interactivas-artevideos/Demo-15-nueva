const config = {
    fechaEvento: "2026-12-15T21:30:00", 
    opciones: {
        musicaAutoplay: true,
        galeriaFotos: true,
        regalos: true,
        playlist: true,
        albumCompartido: true,
        instagram: true
    },
    links: {
        playlist: "https://forms.gle/TU_FORMULARIO_PLAYLIST",
        album: "https://forms.gle/TU_FORMULARIO_ALBUM",
        instagram: "https://instagram.com/tu_usuario"
    },
    galeria: {
        cantidadFotos: 5
    },
    datosBancarios: `Banco: Banco República\nTitular: Victoria Apellido\nCuenta: 123456789`
};

document.addEventListener('DOMContentLoaded', () => {
    aplicarConfiguracion();
    iniciarCuentaRegresiva();
    configurarAnimacionesScroll();
});

function aplicarConfiguracion() {
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
    if (config.opciones.regalos) {
        document.getElementById('sec-gifts').classList.remove('hidden-section');
        document.getElementById('bank-text').innerText = config.datosBancarios;
    }
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

const cover = document.getElementById('cover');
const mainInvitation = document.getElementById('main-invitation');
const bgMusic = document.getElementById('bg-music');

cover.addEventListener('click', () => {
    cover.style.opacity = '0';
    setTimeout(() => {
        cover.style.display = 'none';
        mainInvitation.classList.remove('hidden');
        configurarAnimacionesScroll();
    }, 1000);

    if (config.opciones.musicaAutoplay) {
        bgMusic.play().catch(error => {
            console.log("Autoplay bloqueado por el navegador.", error);
        });
    }
});

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

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

function abrirLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
    window.history.pushState({ modalOpen: true }, "", "#foto");
}

function cerrarLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
}

closeLightbox.addEventListener('click', () => {
    window.history.back();
});

window.addEventListener('popstate', (event) => {
    if (!event.state || !event.state.modalOpen) {
        cerrarLightbox();
    }
});

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
