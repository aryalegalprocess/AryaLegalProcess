let currentIndex = 0;
const images = document.querySelectorAll('.herosection .image-container img');
const dots = document.querySelectorAll('.dots .dot');
let interval;

// Function to change image
function changeImage() {
    currentIndex++;

    // If we reach the last image (clone), loop back to Image 1 smoothly
    if (currentIndex >= images.length - 1) {
        currentIndex = 0; // Reset to the first image
        // Disable the transition momentarily to avoid jumping
        document.querySelector('.image-container').style.transition = 'none';
        document.querySelector('.image-container').style.transform = `translateX(0%)`;
        
        // Re-enable transition after a brief delay to reset the position
        setTimeout(() => {
            document.querySelector('.image-container').style.transition = 'transform 1s ease-in-out';
            document.querySelector('.image-container').style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 50); // Delay to allow the jump to the first image
    } else {
        document.querySelector('.image-container').style.transition = 'transform 1s ease-in-out';
        document.querySelector('.image-container').style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Update the active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

// Set interval for automatic image change
function startCarousel() {
    interval = setInterval(changeImage, 2000); // Change image every 2 seconds
}

startCarousel();

// Initialize the first dot as active
dots[currentIndex].classList.add('active');

// Handle dot click event
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(interval); // Stop the automatic scroll when a dot is clicked
        currentIndex = index;
        document.querySelector('.image-container').style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
        startCarousel(); // Restart the interval after clicking a dot
    });
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('open');

  // Toggle the icon
  if (hamburger.classList.contains('open')) {
    hamburger.innerHTML = '&times;'; // ✖
  } else {
    hamburger.innerHTML = '&#9776;'; // ☰
  }
});



