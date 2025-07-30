// Portfolio Website JavaScript
// Cross-browser compatible vanilla JavaScript

(function() {
    'use strict';

    // Wait for DOM to load
    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation();
        initializeScrollEffects();
        initializeAnimations();
    });

    // Navigation functionality
    function initializeNavigation() {
        var hamburger = document.getElementById('hamburger');
        var navMenu = document.getElementById('nav-menu');
        var navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                var isClickInsideNav = hamburger.contains(event.target) || navMenu.contains(event.target);
                if (!isClickInsideNav && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // Smooth scroll for navigation links (fallback for older browsers)
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    var target = document.querySelector(href);
                    if (target) {
                        smoothScrollTo(target.offsetTop - 70);
                    }
                }
            });
        });

        // Active navigation highlighting
        window.addEventListener('scroll', updateActiveNavigation);
    }

    // Scroll effects
    function initializeScrollEffects() {
        var navbar = document.getElementById('navbar');
        var lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Navbar background opacity
            if (navbar) {
                if (scrollTop > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                }
            }

            // Parallax effect for hero section
            var hero = document.querySelector('.hero');
            if (hero && scrollTop < window.innerHeight) {
                hero.style.transform = 'translateY(' + scrollTop * 0.5 + 'px)';
            }

            lastScrollTop = scrollTop;
        });
    }

    // Animation on scroll
    function initializeAnimations() {
        var animatedElements = document.querySelectorAll('.project-card, .skill-category, .principle-card, .contact-item, .experience-item');
        
        function checkAnimation() {
            animatedElements.forEach(function(element) {
                var elementTop = element.getBoundingClientRect().top;
                var elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }

        // Set initial styles for animated elements
        animatedElements.forEach(function(element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        // Check animations on scroll
        window.addEventListener('scroll', throttle(checkAnimation, 100));
        
        // Initial check
        checkAnimation();
    }

    // Update active navigation based on scroll position
    function updateActiveNavigation() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link');
        var scrollPos = window.pageYOffset + 100;

        sections.forEach(function(section) {
            var top = section.offsetTop;
            var bottom = top + section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Smooth scroll function (fallback)
    function smoothScrollTo(target) {
        var start = window.pageYOffset;
        var distance = target - start;
        var duration = 800;
        var startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var run = ease(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Throttle function for performance
    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    // Contact form validation (if needed in future)
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Utility function to detect if element is in viewport
    function isInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Counter animation for stats
    function animateCounters() {
        var counters = document.querySelectorAll('.stat-number, .accomplishment-metric');
        
        counters.forEach(function(counter) {
            if (isInViewport(counter)) {
                var target = parseInt(counter.textContent);
                if (!isNaN(target)) {
                    animateCounter(counter, 0, target, 2000);
                }
            }
        });
    }

    function animateCounter(element, start, end, duration) {
        var startTime = null;
        var startValue = start;
        
        function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            var currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Initialize counter animations on scroll
    window.addEventListener('scroll', throttle(animateCounters, 200));

    // Preload images for better performance
    function preloadImages() {
        var images = [
            // Add any future image paths here
        ];
        
        images.forEach(function(src) {
            var img = new Image();
            img.src = src;
        });
    }

    // Initialize preloading
    preloadImages();

    // Browser compatibility checks
    function checkBrowserSupport() {
        // Check for CSS Grid support
        if (!CSS.supports('display', 'grid')) {
            // Fallback for older browsers
            var grids = document.querySelectorAll('.projects-grid, .skills-grid, .leadership-principles');
            grids.forEach(function(grid) {
                grid.style.display = 'block';
            });
        }

        // Check for flexbox support
        if (!CSS.supports('display', 'flex')) {
            // Fallback for very old browsers
            var flexElements = document.querySelectorAll('.nav-menu, .hero-buttons, .contact-item');
            flexElements.forEach(function(element) {
                element.style.display = 'block';
            });
        }
    }

    // Initialize browser compatibility
    checkBrowserSupport();

    // Error handling
    window.addEventListener('error', function(e) {
        console.warn('Portfolio script error:', e.message);
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                var navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
                }
            }, 0);
        });
    }

})();