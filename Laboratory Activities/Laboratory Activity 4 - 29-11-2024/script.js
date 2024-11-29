// Add hover effects and click handlers for the links
document.addEventListener('DOMContentLoaded', () => {
    const linkItems = document.querySelectorAll('.link-item');
    
    linkItems.forEach(item => {
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
            item.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
        
        // Add click handler
        item.addEventListener('click', () => {
            // You can add specific actions here when links are clicked
            const text = item.textContent.trim();
            if (text.includes('resume')) {
                console.log('Resume requested');
                // Add your resume download/view logic here
            } else if (text.includes('chat')) {
                console.log('Chat requested');
                // Add your chat initiation logic here
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    // Prevent default browser behavior
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1; // Slightly larger particles
            this.isDragging = false;
        }
        
        update() {
            if (!this.isDragging) {
                this.x += this.vx;
                this.y += this.vy;
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.isDragging ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)';
            ctx.fill();
        }
    }
    
    // Create particles
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw connecting lines
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 0, 0, ${0.5 * (1 - distance/150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    let draggedParticle = null;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Find clicked particle
        for (let particle of particles) {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < particle.radius * 3) {
                draggedParticle = particle;
                draggedParticle.isDragging = true;
                lastMouseX = mouseX;
                lastMouseY = mouseY;
                canvas.style.cursor = 'grabbing';
                break;
            }
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (draggedParticle) {
            draggedParticle.x = mouseX;
            draggedParticle.y = mouseY;
            
            // Update velocity based on mouse movement
            draggedParticle.vx = (mouseX - lastMouseX) * 0.1;
            draggedParticle.vy = (mouseY - lastMouseY) * 0.1;
            
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }
    });
    
    window.addEventListener('mouseup', () => {
        if (draggedParticle) {
            draggedParticle.isDragging = false;
            draggedParticle = null;
            canvas.style.cursor = 'default';
        }
    });
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawLines();
        requestAnimationFrame(animate);
    }
    
    animate();
});

// Navigation dots functionality
const sections = document.querySelectorAll('section');
const navDots = document.querySelectorAll('.nav-dot');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentDot = document.querySelector(`.nav-dot[href="#${entry.target.id}"]`);
            navDots.forEach(dot => dot.classList.remove('active'));
            currentDot.classList.add('active');
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

// Smooth scroll for navigation dots
navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = dot.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll handling
let isScrolling = false;

window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (isScrolling) return;
    
    const sections = document.querySelectorAll('section');
    const currentSection = Array.from(sections).find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top >= -100 && rect.top <= 100;
    });
    
    if (!currentSection) return;
    
    const currentIndex = Array.from(sections).indexOf(currentSection);
    let targetSection;
    
    if (e.deltaY > 0 && currentIndex < sections.length - 1) { // Scrolling down
        targetSection = sections[currentIndex + 1];
    } else if (e.deltaY < 0 && currentIndex > 0) { // Scrolling up
        targetSection = sections[currentIndex - 1];
    }
    
    if (targetSection) {
        isScrolling = true;
        targetSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => isScrolling = false, 1000);
    }
}, { passive: false });

// Scroll animation for about section
function handleScroll() {
    const aboutSection = document.querySelector('.about-section');
    const rect = aboutSection.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.8;

    if (rect.top <= triggerPoint) {
        aboutSection.classList.add('visible');
        window.removeEventListener('scroll', handleScroll);
    }
}

window.addEventListener('scroll', handleScroll);

// Scroll-based animations
const animatedSections = document.querySelectorAll('.section-animate');
const animatedContent = document.querySelectorAll('.content-animate');

const animationOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.classList.remove('animate-out');
            
            // Animate content elements within the section
            const contentElements = entry.target.querySelectorAll('.content-animate');
            contentElements.forEach(element => {
                element.classList.add('visible');
            });
        } else {
            // Only apply outro animation if the section was previously visible
            if (entry.target.classList.contains('animate-in')) {
                entry.target.classList.add('animate-out');
                entry.target.classList.remove('animate-in');
                
                // Reset content animations
                const contentElements = entry.target.querySelectorAll('.content-animate');
                contentElements.forEach(element => {
                    element.classList.remove('visible');
                });
            }
        }
    });
}, animationOptions);

// Observe all sections for animation
animatedSections.forEach(section => {
    sectionObserver.observe(section);
});
