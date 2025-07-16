const daysEl = document.getElementById('days').querySelector('h2');
const hoursEl = document.getElementById('hours').querySelector('h2');
const minutesEl = document.getElementById('minutes').querySelector('h2');
const secondsEl = document.getElementById('seconds').querySelector('h2');

const targetDate = new Date('July 7, 2025 12:00:00').getTime();

// Позитивные сообщения для отображения
const positiveMessages = [
    "люблю тебя",
];

let currentMessageIndex = 0;

function updateTimerElement(element, value) {
    const currentValue = element.innerText;
    if (currentValue !== value) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        setTimeout(() => {
            element.innerText = value;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateTimer() {
    const now = new Date().getTime();
    const distance = now - targetDate;
    
    if (distance < 0) {
        daysEl.innerText = '00';
        hoursEl.innerText = '00';
        minutesEl.innerText = '00';
        secondsEl.innerText = '00';
        return;
    }
    
    const days = Math.floor(Math.max(0, distance) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const formatTime = (time) => (time < 10 ? `0${time}` : String(time));

    updateTimerElement(daysEl, formatTime(days));
    updateTimerElement(hoursEl, formatTime(hours));
    updateTimerElement(minutesEl, formatTime(minutes));
    updateTimerElement(secondsEl, formatTime(seconds));
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.transition = 'all 3s ease-out';
    heart.style.opacity = '0.8';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.top = '-50px';
        heart.style.opacity = '0';
    }, 100);
    
    setTimeout(() => {
        document.body.removeChild(heart);
    }, 3000);
}

function updatePositiveMessage() {
    const messageBottom = document.querySelector('.message-bottom');
    if (messageBottom) {
        messageBottom.style.opacity = '0';
        messageBottom.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            messageBottom.textContent = positiveMessages[currentMessageIndex];
            messageBottom.style.opacity = '1';
            messageBottom.style.transform = 'translateY(0)';
            currentMessageIndex = (currentMessageIndex + 1) % positiveMessages.length;
        }, 500);
    }
}

// Initialize and set up interval
function initialize() {
    updateTimer();
    setInterval(updateTimer, 1000);
    
    // Обновляем позитивное сообщение каждые 5 секунд
    setInterval(updatePositiveMessage, 5000);
    
    // Создаем летающие сердечки каждые 2 секунды
    setInterval(createFloatingHeart, 2000);
    
    // Add a subtle pulse animation to the timer block
    const timerBlock = document.getElementById('timer-block');
    if (timerBlock) {
        setTimeout(() => {
            timerBlock.classList.add('active');
        }, 1000);
    }
    
    // Добавляем интерактивность - клик по таймеру создает взрыв сердечек
    timerBlock.addEventListener('click', () => {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createFloatingHeart(), i * 100);
        }
    });
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);