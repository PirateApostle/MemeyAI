document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu Toggle ---
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function () {
            navbarToggle.classList.toggle('is-active');
            navbarMenu.classList.toggle('is-active');

            const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
            navbarToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // --- Accessible Dropdown Toggle ---
    // This script ensures dropdowns are accessible, especially on mobile
    // where hover is not an option. It also manages ARIA attributes.
    const dropdowns = document.querySelectorAll('.dropdown > .main-navbar__link');

    dropdowns.forEach(function(dropdownToggle) {
        // Check if the dropdown is a link that should not navigate on first click
        // For this example, the main 'Services' link is just a toggle, not a destination page
        dropdownToggle.addEventListener('click', function(event) {
            // Prevent navigation if it's just for opening the dropdown
            event.preventDefault();
            
            const parentDropdown = dropdownToggle.parentElement;
            parentDropdown.classList.toggle('is-active');

            const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
            dropdownToggle.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // Optional: Close dropdowns if user clicks outside of them
    document.addEventListener('click', function(event) {
        const openDropdown = document.querySelector('.dropdown.is-active');
        if (openDropdown && !openDropdown.contains(event.target)) {
            openDropdown.classList.remove('is-active');
            const toggle = openDropdown.querySelector('[aria-expanded="true"]');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});



(function(){
    const carouselContainer = document.querySelector('.carousel-hero-container');
    if (!carouselContainer) return;

    const track = carouselContainer.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carouselContainer.querySelector('.carousel-button.next');
    const prevButton = carouselContainer.querySelector('.carousel-button.prev');
    const nav = carouselContainer.querySelector('.carousel-nav');
    
    // Create nav dots
    slides.forEach((slide, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        nav.appendChild(dot);
        
        dot.addEventListener('click', e => {
            const currentSlide = track.querySelector('.is-selected');
            const currentIndex = slides.findIndex(slide => slide === currentSlide);
            moveToSlide(currentIndex, i);
        });
    });

    const dots = Array.from(nav.children);
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    // Initially arrange slides side-by-side, but this is handled by Flexbox
    // slides.forEach(setSlidePosition);

    // Initial setup
    slides[0].classList.add('is-selected');

    const moveToSlide = (current, target) => {
        const targetSlide = slides[target];
        const currentSlide = slides[current];
        
        track.style.transform = `translateX(-${targetSlide.style.left || (target * slideWidth)}px)`;
        currentSlide.classList.remove('is-selected');
        targetSlide.classList.add('is-selected');

        const currentDot = nav.querySelector('.active');
        currentDot.classList.remove('active');
        dots[target].classList.add('active');

        // Show/hide prev/next buttons at ends
        if (target === 0) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'block';
        } else if (target === slides.length - 1) {
            prevButton.style.display = 'block';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
        }
    };
    
    // Initial button state
    prevButton.style.display = 'none';
    
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.is-selected');
        const currentIndex = slides.findIndex(slide => slide === currentSlide);
        const prevIndex = currentIndex - 1;
        moveToSlide(currentIndex, prevIndex);
    });
    
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.is-selected');
        const currentIndex = slides.findIndex(slide => slide === currentSlide);
        const nextIndex = currentIndex + 1;
        moveToSlide(currentIndex, nextIndex);
    });

    // Recalculate width on resize to be robust
    window.addEventListener('resize', () => {
        const currentSlide = track.querySelector('.is-selected');
        const currentIndex = slides.findIndex(slide => slide === currentSlide);
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'none'; // Disable transition for instant adjustment
        track.style.transform = `translateX(-${currentIndex * newSlideWidth}px)`;
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
        }, 10);
    });

})();