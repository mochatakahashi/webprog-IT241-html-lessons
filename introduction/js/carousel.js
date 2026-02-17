// Carousel functionality for Education page
let currentSlideIndex = [0, 0]; // Track current slide for each carousel

function moveCarousel(carouselIndex, direction) {
    const carousels = document.querySelectorAll('.carousel-slides');
    const slides = carousels[carouselIndex].querySelectorAll('.carousel-slide');
    const dots = carousels[carouselIndex].parentElement.querySelectorAll('.dot');
    
    // Hide current slide
    slides[currentSlideIndex[carouselIndex]].classList.remove('active');
    dots[currentSlideIndex[carouselIndex]].classList.remove('active');
    
    // Calculate new slide index
    currentSlideIndex[carouselIndex] += direction;
    
    // Loop around if at the end or beginning
    if (currentSlideIndex[carouselIndex] >= slides.length) {
        currentSlideIndex[carouselIndex] = 0;
    } else if (currentSlideIndex[carouselIndex] < 0) {
        currentSlideIndex[carouselIndex] = slides.length - 1;
    }
    
    // Show new slide
    slides[currentSlideIndex[carouselIndex]].classList.add('active');
    dots[currentSlideIndex[carouselIndex]].classList.add('active');
}

function currentSlide(carouselIndex, slideIndex) {
    const carousels = document.querySelectorAll('.carousel-slides');
    const slides = carousels[carouselIndex].querySelectorAll('.carousel-slide');
    const dots = carousels[carouselIndex].parentElement.querySelectorAll('.dot');
    
    // Hide current slide
    slides[currentSlideIndex[carouselIndex]].classList.remove('active');
    dots[currentSlideIndex[carouselIndex]].classList.remove('active');
    
    // Update to selected slide
    currentSlideIndex[carouselIndex] = slideIndex;
    
    // Show selected slide
    slides[currentSlideIndex[carouselIndex]].classList.add('active');
    dots[currentSlideIndex[carouselIndex]].classList.add('active');
}

// Optional: Auto-advance carousel every 5 seconds
function autoAdvanceCarousel() {
    const carousels = document.querySelectorAll('.carousel-slides');
    carousels.forEach((carousel, index) => {
        moveCarousel(index, 1);
    });
}

// Uncomment the line below to enable auto-advance
// setInterval(autoAdvanceCarousel, 5000);
