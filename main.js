const canvas = document.getElementById('sparkles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let fireworks = [];

class Fireworks {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height / 2);
        this.speed = Math.random() * 3 + 5;
        this.angle = Math.atan2(this.targetY - this.y, 0);
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.explode();
            }
        }
    }

    explode() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particles(this.x, this.y, true));
        }
    }
}

class Particles {
    constructor(x, y, isFirework = false) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.8;
        this.gravity = isFirework ? 0.05 : 0;
        this.speedY = Math.random() * 1 - 0.3;
        this.color = `rgba(255,250,0,${Math.random()})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY + this.gravity;
        if (this.size > 0.1) {
            this.size -= 0.01;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 3);
        ctx.fill();
    }
}

// Funzione che aggiorna il countdown
function updateCountdown() {
    const now = new Date().getTime(); // Ottieni l'orario attuale
    const nextYear = new Date("Dec 31, 2025 23:59:59").getTime(); // Imposta l'orario di Capodanno
    const gap = nextYear - now; // Calcola la differenza

    const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;

    if (gap > 0) {
        // Calcola il tempo rimanente in giorni, ore, minuti e secondi
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        // Mostra il countdown
        document.getElementById('timer').innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        document.getElementById("status").innerText = "COUNTDOWN"; // Mostra "COUNTDOWN" finché non è Capodanno
    } else {
        // Quando il countdown è scaduto, cambia lo stato e avvia la celebrazione
        document.getElementById("status").innerText = "HAPPY";
        document.getElementById("timer").innerHTML = "NEW YEAR";
        
        // Solo se non è già attiva, aggiungi la classe celebration-mode
        if (!document.body.classList.contains("celebration-mode")) {
            document.body.classList.add("celebration-mode");
        }

        // Aggiungi fuochi d'artificio con una probabilità
        if (Math.random() < 0.05) {
            fireworks.push(new Fireworks());
        }
    }
}

// Funzione per gestire le particelle
function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.2) {
            particles.splice(i, 1); // Rimuovi la particella corrente
            i--;
        }
    }
}

// Funzione principale di animazione
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(0,0,0,.1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateCountdown(); // Aggiorna il countdown

    // Aggiungi nuove particelle se necessario
    if (particles.length < 100) {
        particles.push(new Particles(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    handleParticles(); // Gestisci le particelle
    requestAnimationFrame(animate); // Chiamata ricorsiva per continuare l'animazione
}

animate(); // Avvia l'animazione
setInterval(updateCountdown, 1000);  // Aggiorna ogni secondo
updateCountdown();  // Esegui una prima volta per inizializzare

// Aggiungi un listener per il ridimensionamento del canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
