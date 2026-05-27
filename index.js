document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL ACTION ---
  const header = document.getElementById('main-header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once at load


  // --- MOBILE NAV TOGGLE ---
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navLinksMenu = document.getElementById('nav-links-menu');
  const navLinks = navLinksMenu.querySelectorAll('a');

  menuToggleBtn.addEventListener('click', () => {
    menuToggleBtn.classList.toggle('active');
    navLinksMenu.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.classList.remove('active');
      navLinksMenu.classList.remove('active');
    });
  });


  // --- ACTIVE LINK SECTIONS SCROLL TRACKING ---
  const sections = document.querySelectorAll('section');
  
  const scrollSpyOptions = {
    root: null,
    threshold: 0.25, // Trigger when 25% of the section is visible
    rootMargin: '0px'
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });


  // --- REVEAL ON SCROLL INTERACTIVE ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.1, // Trigger when 10% is visible
    rootMargin: '0px 0px -50px 0px' // Adjust trigger point slightly above bottom viewport
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track it further
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // --- FORM VALIDATION & INTERACTIVE STATE ---
  const contactForm = document.getElementById('contact-form');
  const formName = document.getElementById('form-name');
  const formEmail = document.getElementById('form-email');
  const formMessage = document.getElementById('form-message');
  const btnSubmit = document.getElementById('btn-form-submit');
  const successToast = document.getElementById('success-toast');

  // Input focus outline highlight and validity check
  const inputs = [formName, formEmail, formMessage];
  
  inputs.forEach(input => {
    // Basic real-time validation feedback styling (optional extension)
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        input.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      }
    });
  });

  // Validate email format
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  // Handle Form Submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;

    // Reset styles
    inputs.forEach(input => {
      input.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    });

    // 1. Name validation
    if (formName.value.trim() === '') {
      formName.style.borderColor = '#ff453a';
      isFormValid = false;
    }

    // 2. Email validation
    if (!isValidEmail(formEmail.value.trim())) {
      formEmail.style.borderColor = '#ff453a';
      isFormValid = false;
    }

    // 3. Message validation
    if (formMessage.value.trim() === '') {
      formMessage.style.borderColor = '#ff453a';
      isFormValid = false;
    }

    // If validated, proceed with submitting loading state
    if (isFormValid) {
      const originalBtnText = btnSubmit.innerHTML;
      
      // Loading status
      btnSubmit.disabled = true;
      btnSubmit.style.opacity = '0.8';
      btnSubmit.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 38 38" stroke="currentColor" style="animation: spin 1s linear infinite;">
          <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)" stroke-width="3">
              <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
              <path d="M36 18c0-9.94-8.06-18-18-18"></path>
            </g>
          </g>
        </svg>
        <span>Enviando...</span>
      `;

      // CSS keyframe injector for loader spinner
      if (!document.getElementById('spinner-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spinner-keyframes';
        style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }

      // Simulate API submit latency (1.5 seconds)
      setTimeout(() => {
        // Reset form inputs
        contactForm.reset();
        
        // Restore button state
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1';
        btnSubmit.innerHTML = originalBtnText;

        // Show elegant success notification toast
        successToast.classList.add('show');

        // Hide success toast after 4 seconds
        setTimeout(() => {
          successToast.classList.remove('show');
        }, 4000);

      }, 1500);
    }
  });
});
