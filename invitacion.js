/* ============================================
   INVITACIÓN XV AÑOS – NATALY
   Script principal: pétalos, countdown, 
   scroll reveal, sobre animado y WhatsApp
   ============================================ */


/* ============================================
   1. PÉTALOS ANIMADOS (Canvas API)
   ============================================ */

/* *** IIFE (Immediately Invoked Function Expression): es una función
   que se ejecuta sola al instante. Se escribe así: (function(){ })()
   Sirve para aislar el código y que sus variables no choquen
   con las de otras partes del programa */
(function () {

    /* *** getContext('2d') activa el modo de dibujo 2D del canvas.
       ctx es el "lápiz" con el que dibujamos en el lienzo */
    var canvas = document.getElementById('petals-canvas');
    var ctx    = canvas.getContext('2d');
    var W, H;
    var petals = [];

    /* Ajusta el tamaño del canvas al de la ventana */
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    /* Cada vez que el usuario cambia el tamaño de la ventana se reajusta */
    window.addEventListener('resize', resize);

    var colors = ['#F8BBD0', '#F48FB1', '#F06292', '#E91E63', '#C2185B', '#FCE4EC'];

    /* Crea un pétalo con posición, tamaño y movimiento aleatorio */
    function createPetal() {
        return {
            x:       Math.random() * W,
            y:       -20,
            size:    4 + Math.random() * 8,
            speed:   0.6 + Math.random() * 1.4,
            /* *** Math.PI es el número pi (3.14...). Se usa para
               calcular ángulos en radianes (el canvas trabaja con radianes,
               no con grados). Math.random() da un número entre 0 y 1 */
            angle:   Math.random() * Math.PI * 2,
            spin:    (Math.random() - 0.5) * 0.04,
            drift:   (Math.random() - 0.5) * 0.8,
            opacity: 0.4 + Math.random() * 0.4,
            /* *** Math.floor() redondea hacia abajo (ej: 2.9 → 2)
               Se usa para obtener un índice entero del arreglo de colores */
            color:   colors[Math.floor(Math.random() * colors.length)]
        };
    }

    /* Crea 30 pétalos iniciales distribuidos por toda la pantalla */
    for (var i = 0; i < 30; i++) {
        var p  = createPetal();
        p.y    = Math.random() * H;
        petals.push(p);
    }

    /* Dibuja un pétalo individual en el canvas */
    function drawPetal(p) {
        /* *** ctx.save() guarda el estado actual del canvas (posición,
           rotación, opacidad). ctx.restore() lo regresa a ese estado.
           Así las transformaciones de un pétalo no afectan a los demás */
        ctx.save();
        ctx.globalAlpha = p.opacity;
        /* *** ctx.translate mueve el "origen" del dibujo a la posición
           del pétalo. ctx.rotate lo rota sobre ese punto */
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        /* *** ctx.ellipse dibuja una elipse. Parámetros: x, y, 
           radio horizontal, radio vertical, rotación, ángulo inicio, fin */
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
    }

    /* Bucle de animación: borra el canvas y redibuja todo cada frame */
    function loop() {
        ctx.clearRect(0, 0, W, H);

        /* Agrega nuevos pétalos aleatoriamente si hay menos de 40 */
        if (petals.length < 40 && Math.random() < 0.05) {
            petals.push(createPetal());
        }

        /* Recorre los pétalos al revés para poder eliminar sin bugs */
        for (var i = petals.length - 1; i >= 0; i--) {
            var p  = petals[i];
            p.y   += p.speed;
            p.x   += p.drift;
            p.angle += p.spin;
            drawPetal(p);
            /* Cuando el pétalo sale de la pantalla se elimina del arreglo */
            if (p.y > H + 20) {
                /* *** splice(índice, cuántos) elimina elementos de un arreglo */
                petals.splice(i, 1);
            }
        }
        /* *** requestAnimationFrame llama a loop() ~60 veces por segundo
           sincronizado con la pantalla. Es más eficiente que setInterval
           para animaciones porque el navegador lo optimiza automáticamente */
        requestAnimationFrame(loop);
    }
    loop();

})();


/* ============================================
   2. CUENTA REGRESIVA
   ============================================ */

(function () {
    /* *** new Date('fecha') crea un objeto de fecha/hora en JS.
       Se puede restar para obtener milisegundos de diferencia */
    var target = new Date('2026-07-18T15:00:00');

    function update() {
        var diff = target - new Date(); /* diferencia en milisegundos */

        /* Si ya llegó la fecha, muestra emojis de fiesta */
        if (diff <= 0) {
            document.getElementById('cd-days').textContent  = '¡HOY!';
            document.getElementById('cd-hours').textContent = '🎉';
            document.getElementById('cd-mins').textContent  = '🎂';
            document.getElementById('cd-secs').textContent  = '👑';
            return;
        }

        /* Convierte los milisegundos a días, horas, minutos y segundos */
        var d = Math.floor(diff / 86400000);          /* ms en un día */
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000)  / 60000);
        var s = Math.floor((diff % 60000)    / 1000);

        /* *** String(n).padStart(2,'0') convierte el número a texto
           y agrega un cero a la izquierda si tiene menos de 2 dígitos
           Ej: 5 → "05",  12 → "12" */
        document.getElementById('cd-days').textContent  = String(d).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
        document.getElementById('cd-mins').textContent  = String(m).padStart(2, '0');
        document.getElementById('cd-secs').textContent  = String(s).padStart(2, '0');
    }

    update();
    /* *** setInterval(función, ms) ejecuta la función cada X milisegundos.
       1000ms = 1 segundo. Así el contador se actualiza cada segundo */
    setInterval(update, 1000);

})();


/* ============================================
   3. SCROLL REVEAL (aparece al hacer scroll)
   ============================================ */

(function () {
    /* Selecciona todos los elementos con la clase .reveal */
    var elements = document.querySelectorAll('.reveal');

    /* *** IntersectionObserver "observa" elementos y ejecuta una función
       cuando entran o salen del área visible de la pantalla.
       Es más eficiente que escuchar el evento scroll manualmente */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            /* Si el elemento es visible en pantalla, agrega .visible */
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                /* Deja de observar ese elemento para no repetir la animación */
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 }); /* 0.15 = se activa cuando el 15% es visible */

    elements.forEach(function (el) {
        observer.observe(el);
    });

})();


/* ============================================
   4. BURST DEL SOBRE (animación al tocar)
   ============================================ */

function burstEnvelope(el) {

    /* *** getBoundingClientRect() devuelve la posición exacta
       del elemento en la pantalla (top, left, width, height).
       Se usa para saber desde dónde lanzar las partículas */
    var rect = el.getBoundingClientRect();
    var cx   = rect.left + rect.width  / 2; /* centro X */
    var cy   = rect.top  + rect.height / 2; /* centro Y */

    var items = ['✉️', '💌', '💵', '💴', '💶', '💸', '🌸', '💕', '✨', '🪙', '💛', '🎀'];
    var count = 18; /* número de partículas que salen */

    for (var i = 0; i < count; i++) {

        /* *** document.createElement('div') crea un elemento HTML nuevo
           pero aún no está en la página. Se le asignan estilos y luego
           se agrega al documento con appendChild */
        var particle   = document.createElement('div');
        particle.className = 'burst-particle';

        /* Calcula el ángulo y la distancia de vuelo de cada partícula */
        var angle = (i / count) * 360 + (Math.random() * 20 - 10);
        var dist  = 120 + Math.random() * 160;
        /* *** Math.cos y Math.sin convierten el ángulo en coordenadas X/Y
           para que las partículas vuelen en todas las direcciones */
        var rad   = angle * Math.PI / 180;
        var tx    = Math.cos(rad) * dist;
        var ty    = Math.sin(rad) * dist - 60;
        var rot   = (Math.random() - 0.5) * 720;
        var dur   = 0.7 + Math.random() * 0.6;

        particle.textContent = items[Math.floor(Math.random() * items.length)];

        /* *** cssText asigna múltiples estilos de golpe como texto.
           También se asignan las variables CSS (--tx, --ty, etc.)
           que usa @keyframes burst-fly en el CSS */
        particle.style.cssText =
            'left:' + cx + 'px; top:' + cy + 'px;' +
            '--tx:' + tx + 'px; --ty:' + ty + 'px;' +
            '--rot:' + rot + 'deg; --dur:' + dur + 's;';

        /* *** appendChild agrega el elemento al final del body */
        document.body.appendChild(particle);

        /* *** setTimeout ejecuta código después de X milisegundos (una sola vez).
           Aquí elimina la partícula del DOM cuando la animación termina */
        setTimeout(function (p) {
            return function () { p.remove(); };
        }(particle), dur * 1000 + 100);
    }

    /* Pequeño rebote visual en el ícono del sobre */
    el.style.transform = 'scale(1.2)';
    setTimeout(function () {
        el.style.transform = '';
    }, 300);
}


/* ============================================
   5. CARRUSEL DE FOTOS
   ============================================ */

(function () {

    var track          = document.getElementById('carousel-track');
    var dotsContenedor = document.getElementById('carousel-dots');

    if (!track) return;

    var slides = track.querySelectorAll('.carousel-slide');
    var total  = slides.length;
    var actual = 0;

    /* Crea los puntitos indicadores dinámicamente */
    for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        /* *** data-index guarda el número de cada puntito
           para saber a qué foto ir al hacer clic */
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', function () {
            irA(parseInt(this.getAttribute('data-index')));
        });
        dotsContenedor.appendChild(dot);
    }

    /* Mueve el carrusel al slide con ese índice */
    function irA(indice) {
        actual = indice;
        /* Cada slide ocupa 100% → foto 3 = translateX(-200%) */
        track.style.transform = 'translateX(-' + (actual * 100) + '%)';
        actualizarDots();
    }

    /* Marca el puntito de la foto activa */
    function actualizarDots() {
        var todos = dotsContenedor.querySelectorAll('.carousel-dot');
        todos.forEach(function (d, i) {
            if (i === actual) { d.classList.add('activo'); }
            else              { d.classList.remove('activo'); }
        });
    }

    irA(0);

    /* Expone moverCarrusel al scope global para los botones del HTML */
    window.moverCarrusel = function (direccion) {
        var nuevo = actual + direccion;
        if (nuevo >= total) nuevo = 0;
        if (nuevo < 0)      nuevo = total - 1;
        irA(nuevo);
        reiniciarAuto();
    };

    /* ── Avance automático ──
       *** CAMBIA 4000 para velocidad: 2000 = 2s, 6000 = 6s
       Borra el setInterval y reiniciarAuto si no quieres auto-avance */
    var intervaloAuto = setInterval(function () {
        window.moverCarrusel(1);
    }, 4000);

    function reiniciarAuto() {
        clearInterval(intervaloAuto);
        intervaloAuto = setInterval(function () {
            window.moverCarrusel(1);
        }, 4000);
    }

})();


/* ============================================
   6. CONFIRMACIÓN POR WHATSAPP
   ============================================ */

function confirmar() {
    var nombre     = document.getElementById('nombre').value.trim();
    var asistentes = document.getElementById('asistentes').value;
    var mensaje    = document.getElementById('mensaje').value.trim();

    if (!nombre)     { alert('Por favor escribe tu nombre 💕');           return; }
    if (!asistentes) { alert('¿Cuántas personas van a asistir? 💕');      return; }

    /* *** Los backticks (` `) permiten escribir texto con variables adentro
       usando ${variable}. Se llaman Template Literals.
       \n agrega un salto de línea dentro del texto */
    var texto = '¡Confirmo mi asistencia a tus XV años!.\n\n' +
            'Nombre: '   + nombre     + '\n' +
            'Personas: ' + asistentes;

    if (mensaje) {
        texto += '\nMensaje: ' + mensaje;
    }

    /* *** encodeURIComponent convierte el texto a formato URL seguro.
       Los espacios, acentos y emojis no son válidos en una URL directa,
       así que se convierten: ej. espacio → %20, ñ → %C3%B1 */
    var urlWhatsApp = 'https://wa.me/525591097733?text=' + encodeURIComponent(texto);

    /* *** window.open(url, '_blank') abre el enlace en una pestaña nueva */
    window.open(urlWhatsApp, '_blank');

    document.getElementById('rsvp-form').style.display     = 'none';
    document.getElementById('confirm-success').style.display = 'block';
}

// canciom
// cancion
function abrirSobre() {
    const sobre = document.getElementById('sobre');
    const overlay = document.getElementById('overlayEntrada');
    
    // Activa música
    if (document.getElementById('miAudio')) {
        document.getElementById('miAudio').play();
    }

    setTimeout(() => {
    document.querySelectorAll('.hero *').forEach(el => {
        el.style.animationPlayState = 'running';
    });
}, 800); // espera a que el sobre desaparezca
    // Animación del sobre
    sobre.classList.add('abriendo');
    
    // Desvanece overlay
    setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    overlay.classList.add('cerrando');
    setTimeout(() => overlay.style.display = 'none', 1500);
}, 600);
}

/* ── FLORES DE FONDO ── */
(function () {
    var flores = ['🌸', '🌺', '✿', '❀', '🌷'];
    var cantidad = 18; /* cambia este número para más o menos flores */

    for (var i = 0; i < cantidad; i++) {
        var flor = document.createElement('div');
        flor.className = 'flor-fondo';

        /* emoji aleatorio */
        flor.textContent = flores[Math.floor(Math.random() * flores.length)];

        /* posición aleatoria en toda la pantalla */
        flor.style.left = Math.random() * 100 + 'vw';
        flor.style.top  = Math.random() * 100 + 'vh';

        /* tamaño aleatorio */
        flor.style.fontSize = (1 + Math.random() * 1.5) + 'rem';

        /* duración y delay distintos para que no respiren igual */
        flor.style.setProperty('--duracion', (2.5 + Math.random() * 3) + 's');
        flor.style.setProperty('--delay',    (Math.random() * 4) + 's');

        document.body.appendChild(flor);
    }
})();
// ---------------------------
// flores en el overlay
// ---------------------------
(function () {
    var flores = ['🌸', '🌺', '✿', '❀', '🌷'];
    var cantidad = 18;

    for (var i = 0; i < cantidad; i++) {
        var flor = document.createElement('div');
        flor.className = 'flor-fondo';
        flor.textContent = flores[Math.floor(Math.random() * flores.length)];
        flor.style.left = Math.random() * 100 + '%';
        flor.style.top  = Math.random() * 100 + '%';
        flor.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        flor.style.setProperty('--duracion', (2.5 + Math.random() * 3) + 's');
        flor.style.setProperty('--delay',    (Math.random() * 4) + 's');
        document.getElementById('overlayEntrada').appendChild(flor);
    }
})();