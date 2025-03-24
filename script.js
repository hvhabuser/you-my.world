document.addEventListener("DOMContentLoaded", () => {
  // Get timer elements
  const daysElement = document.getElementById("days")
  const hoursElement = document.getElementById("hours")
  const minutesElement = document.getElementById("minutes")
  const secondsElement = document.getElementById("seconds")

  // Set the start date (December 29, 2024)
  const startDate = new Date("December 29, 2024")

  // Function to update the timer
  function updateTimer() {
    // Get current date and time
    const now = new Date()

    // Calculate the difference in milliseconds
    const difference = now.getTime() - startDate.getTime()

    // Don't show negative time if current date is before start date
    if (difference < 0) {
      daysElement.textContent = "00"
      hoursElement.textContent = "00"
      minutesElement.textContent = "00"
      secondsElement.textContent = "00"
      return
    }

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    // Update the DOM with the calculated values
    daysElement.textContent = padZero(days)
    hoursElement.textContent = padZero(hours)
    minutesElement.textContent = padZero(minutes)
    secondsElement.textContent = padZero(seconds)
  }

  // Helper function to pad single digits with a leading zero
  function padZero(number) {
    return number.toString().padStart(2, "0")
  }

  // Update the timer immediately and then every second
  updateTimer()
  setInterval(updateTimer, 1000)
})

