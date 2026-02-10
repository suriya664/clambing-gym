// ========================================
// CLIMBING GYM - JAVASCRIPT UTILITIES
// Core functionality for navigation, theme, and interactions
// ========================================

// ========================================
// THEME MANAGEMENT (Dark/Light Mode)
// ========================================
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    }
}

// ========================================
// NAVIGATION MANAGEMENT
// ========================================
class NavigationManager {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.navbar-menu');
        this.navLinks = document.querySelectorAll('.navbar-menu a');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.init();
    }

    init() {
        // Hamburger menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close if it's a dropdown parent
                if (!link.parentElement.classList.contains('dropdown')) {
                    this.closeMenu();
                }
            });
        });

        // Mobile dropdown toggle
        this.dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-menu') && !e.target.closest('.hamburger')) {
                this.closeMenu();
            }
        });

        // Highlight active page
        this.highlightActivePage();

        // Handle scroll
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
        // Close all dropdowns
        this.dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }

    highlightActivePage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        this.navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPage ||
                (currentPage === '' && linkPath === 'index.html') ||
                (currentPage === 'index.html' && linkPath === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = 'var(--shadow-md)';
            } else {
                navbar.style.boxShadow = 'var(--shadow-sm)';
            }
        }
    }
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        this.reveal();
        window.addEventListener('scroll', () => this.reveal());
    }

    reveal() {
        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
}

// ========================================
// FORM VALIDATION
// ========================================
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.submitForm();
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        // Clear previous errors
        this.clearError(field);

        // Required field validation
        if (required && !value) {
            this.showError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Password validation
        if (type === 'password' && value && value.length < 6) {
            this.showError(field, 'Password must be at least 6 characters');
            return false;
        }

        // Phone validation
        if (field.name === 'phone' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        return true;
    }

    showError(field, message) {
        field.classList.add('error');
        field.style.borderColor = 'var(--danger)';

        // Create or update error message
        let errorElement = field.parentElement.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';

        const errorElement = field.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    submitForm() {
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        console.log('Form submitted:', data);

        // Show success message
        this.showSuccess('Form submitted successfully!');

        // Reset form
        this.form.reset();
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background-color: var(--success);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      animation: slideInRight 0.3s ease-out;
    `;
        successDiv.textContent = message;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// MODAL MANAGEMENT
// ========================================
class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.init();
    }

    init() {
        // Close modal on backdrop click
        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close(modal);
                }
            });

            // Close button
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(modal));
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    }

    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeAll() {
        this.modals.forEach(modal => this.close(modal));
    }
}

// ========================================
// BOOKING SYSTEM (Frontend Only)
// ========================================
class BookingManager {
    constructor() {
        this.bookingButtons = document.querySelectorAll('[data-booking]');
        this.init();
    }

    init() {
        this.bookingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const classType = button.getAttribute('data-booking');
                this.openBookingModal(classType);
            });
        });
    }

    openBookingModal(classType) {
        console.log('Booking:', classType);
        // In a real application, this would open a booking modal
        // For now, we'll show an alert
        alert(`Booking system for "${classType}" would open here. This requires backend integration.`);
    }
}

// ========================================
// DASHBOARD NAVIGATION (Mobile)
// ========================================
class DashboardNav {
    constructor() {
        this.sidebar = document.querySelector('.dashboard-sidebar');
        this.toggleBtn = document.querySelector('.dashboard-toggle');
        this.filterBtn = document.querySelector('.filter-toggle');
        this.filterPanel = document.querySelector('.filter-panel');
        this.init();
    }

    init() {
        if (!this.sidebar) return;

        // Toggle sidebar on mobile
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.sidebar.classList.toggle('active');
            });
        }

        // Toggle filter panel
        if (this.filterBtn && this.filterPanel) {
            this.filterBtn.addEventListener('click', () => {
                this.filterPanel.classList.toggle('active');
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!e.target.closest('.dashboard-sidebar') && !e.target.closest('.dashboard-toggle')) {
                    this.sidebar?.classList.remove('active');
                }
                if (!e.target.closest('.filter-panel') && !e.target.closest('.filter-toggle')) {
                    this.filterPanel?.classList.remove('active');
                }
            }
        });

        // Highlight active dashboard page
        this.highlightActivePage();
    }

    highlightActivePage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop();

        const navLinks = this.sidebar?.querySelectorAll('a');
        navLinks?.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// ========================================
// INITIALIZE ALL COMPONENTS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const themeManager = new ThemeManager();

    // Theme toggle buttons (desktop and mobile)
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => themeManager.toggle());
    });

    // Initialize navigation
    new NavigationManager();

    // Initialize scroll reveal
    new ScrollReveal();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize forms
    const contactForm = new FormValidator('#contact-form');
    const loginForm = new FormValidator('#login-form');
    const signupForm = new FormValidator('#signup-form');

    // Initialize modals
    new ModalManager();

    // Initialize booking
    new BookingManager();

    // Initialize dashboard navigation
    new DashboardNav();

    // Add fade-in animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        FormValidator,
        ModalManager,
        BookingManager,
        DashboardNav
    };
}
