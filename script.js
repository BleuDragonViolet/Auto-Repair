
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('recrutement-btn');
    
    let timeout;
    let isLongPress = false;  // Pour détecter si c'est un appui long

    // Fonction pour redirection
    const redirectToLink = () => {
        window.location.href = 'https://forms.gle/ZqTbYiLLFPvCe3Vh9';
    };

    // Détecter un appui long
    button.addEventListener('mousedown', function() {
        isLongPress = false;
        button.classList.add('pressed'); // Commence l'animation
        timeout = setTimeout(function() {
            isLongPress = true;  // Marquer qu'il s'agit d'un appui long
            redirectToLink();  // Redirection après 3 secondes
        }, 3000);  // Délai de 3 secondes avant la redirection
    });

    // Si l'utilisateur relâche avant 3 secondes (clic normal)
    button.addEventListener('mouseup', function() {
        clearTimeout(timeout);  // Annule l'animation si l'appui est court
        button.classList.remove('pressed');  // Stoppe l'animation
        if (!isLongPress) {
            redirectToLink();  // Redirection immédiate pour un clic normal
        }
    });

    // Si l'utilisateur déplace la souris en dehors du bouton
    button.addEventListener('mouseleave', function() {
        clearTimeout(timeout);  // Annule la redirection si on sort du bouton
        button.classList.remove('pressed');  // Stoppe l'animation
    });
});


function navigateTo(page) {
    window.location.href = page;
}

// Ajout du code pour l'animation et la musique

let logo = document.getElementById('logo');
let music = new Audio('songs/Vroum Vroum.mp3'); // Utilise le chemin de ton fichier audio
let rotation = 0;
let scale = 1; // Échelle initiale
let rotationSpeed = 0; // Vitesse initiale
let maxSpeed = 150; // Vitesse maximale plus rapide
let interval;
let rotationActive = false;
let slowDown = false; // Flag pour savoir si on est en phase de ralentissement
let scalingActive = false; // Flag pour savoir si on est en phase d'agrandissement

// Fonction pour contrôler la rotation et l'échelle
function updateRotation() {
    if (rotationActive) {
        rotation += rotationSpeed;
        logo.style.transform = `rotate(${rotation}deg) scale(${scale})`; // Applique la rotation et l'échelle
    }
}

// Démarrer la musique au survol de l'image
logo.addEventListener('mouseover', () => {
    // Vérifie si la musique n'est pas déjà en train de jouer, puis démarre
    if (music.paused) {
        music.play();
    }

    rotationActive = true;
    slowDown = false; // Réinitialise le ralentissement
    scale = 1; // Réinitialise l'échelle

    // Agrandissement progressif pendant 1,8 seconde
    scalingActive = true;
    let scaleInterval = setInterval(() => {
        if (scale < 1.5) { // Échelle maximale
            scale += 0.01; // Augmente l'échelle progressivement
        } else {
            clearInterval(scaleInterval); // Arrête l'intervalle quand on atteint l'échelle maximale
        }
    }, 50); // Rafraîchit l'échelle toutes les 50ms

    // Après 1.8 secondes, commencer à augmenter la vitesse de rotation
    setTimeout(() => {
        interval = setInterval(() => {
            let currentTime = music.currentTime;

            if (currentTime < 25) { // Augmentation jusqu'à 25 secondes
                if (rotationSpeed < maxSpeed) {
                    rotationSpeed += 5; // Augmente la vitesse progressivement
                }
            } else if (currentTime >= 25 && currentTime < 36) {
                // Phase de ralentissement après 25 secondes
                if (rotationSpeed > 1) {
                    rotationSpeed -= 2; // Diminue la vitesse progressivement
                } else {
                    slowDown = true;
                }
            }

            // Si on est en phase de ralentissement
            if (slowDown) {
                if (rotationSpeed > 0) {
                    rotationSpeed -= 0.5; // Ralentissement plus progressif
                } else {
                    rotationSpeed = 0; // Arrête la rotation
                    rotationActive = false;
                    clearInterval(interval); // Arrête l'intervalle
                }
            }

            updateRotation();
        }, 50); // Rafraîchit la vitesse toutes les 50ms pour plus de fluidité
    }, 1800); // Délai de 1,8 seconde avant de commencer l'animation
});

// Réinitialiser quand la souris quitte l'image
logo.addEventListener('mouseout', () => {
    rotationActive = false; // Arrêter la rotation lorsque la souris quitte l'image
    clearInterval(interval);
    logo.style.transform = 'rotate(0deg) scale(1)'; // Réinitialise la rotation et l'échelle
    music.pause(); // Arrête la musique si la souris sort
    music.currentTime = 0; // Réinitialise la musique à 0
});
