const daysEl = document.getElementById('days').querySelector('h2');
const hoursEl = document.getElementById('hours').querySelector('h2');
const minutesEl = document.getElementById('minutes').querySelector('h2');
const secondsEl = document.getElementById('seconds').querySelector('h2');

const targetDate = new Date('June 28, 2022 00:00:00').getTime();

function updateTimerElement(element, value) {
    const currentValue = element.innerText;
    if (currentValue !== value) {
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerText = value;
            element.style.opacity = '1';
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

// Initialize and set up interval
function initialize() {
    updateTimer();
    setInterval(updateTimer, 1000);
    
    // Add a subtle pulse animation to the timer block
    const timerBlock = document.getElementById('timer-block');
    if (timerBlock) {
        setTimeout(() => {
            timerBlock.classList.add('active');
        }, 1000);
    }
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);