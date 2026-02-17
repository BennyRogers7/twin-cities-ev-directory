// EV Charger Cost Calculator
(function() {
  'use strict';

  // ZIP code to city mapping for permit costs
  const ZIP_PERMIT_MAP = {
    // Woodbury
    '55125': { city: 'Woodbury', permit: 237 },
    '55129': { city: 'Woodbury', permit: 237 },
    // Minneapolis (554xx)
    '55401': { city: 'Minneapolis', permit: 200 },
    '55402': { city: 'Minneapolis', permit: 200 },
    '55403': { city: 'Minneapolis', permit: 200 },
    '55404': { city: 'Minneapolis', permit: 200 },
    '55405': { city: 'Minneapolis', permit: 200 },
    '55406': { city: 'Minneapolis', permit: 200 },
    '55407': { city: 'Minneapolis', permit: 200 },
    '55408': { city: 'Minneapolis', permit: 200 },
    '55409': { city: 'Minneapolis', permit: 200 },
    '55410': { city: 'Minneapolis', permit: 200 },
    '55411': { city: 'Minneapolis', permit: 200 },
    '55412': { city: 'Minneapolis', permit: 200 },
    '55413': { city: 'Minneapolis', permit: 200 },
    '55414': { city: 'Minneapolis', permit: 200 },
    '55415': { city: 'Minneapolis', permit: 200 },
    '55416': { city: 'Minneapolis', permit: 200 },
    '55417': { city: 'Minneapolis', permit: 200 },
    '55418': { city: 'Minneapolis', permit: 200 },
    '55419': { city: 'Minneapolis', permit: 200 },
    '55420': { city: 'Minneapolis', permit: 200 },
    '55421': { city: 'Minneapolis', permit: 200 },
    '55422': { city: 'Minneapolis', permit: 200 },
    '55423': { city: 'Minneapolis', permit: 200 },
    '55424': { city: 'Minneapolis', permit: 200 },
    '55425': { city: 'Minneapolis', permit: 200 },
    '55426': { city: 'Minneapolis', permit: 200 },
    '55427': { city: 'Minneapolis', permit: 200 },
    '55428': { city: 'Minneapolis', permit: 200 },
    '55429': { city: 'Minneapolis', permit: 200 },
    '55430': { city: 'Minneapolis', permit: 200 },
    '55431': { city: 'Minneapolis', permit: 200 },
    '55432': { city: 'Minneapolis', permit: 200 },
    '55433': { city: 'Minneapolis', permit: 200 },
    '55434': { city: 'Minneapolis', permit: 200 },
    '55435': { city: 'Minneapolis', permit: 200 },
    '55436': { city: 'Minneapolis', permit: 200 },
    '55437': { city: 'Minneapolis', permit: 200 },
    '55438': { city: 'Minneapolis', permit: 200 },
    '55439': { city: 'Minneapolis', permit: 200 },
    '55440': { city: 'Minneapolis', permit: 200 },
    '55441': { city: 'Minneapolis', permit: 200 },
    '55442': { city: 'Minneapolis', permit: 200 },
    '55443': { city: 'Minneapolis', permit: 200 },
    '55444': { city: 'Minneapolis', permit: 200 },
    '55445': { city: 'Minneapolis', permit: 200 },
    '55446': { city: 'Minneapolis', permit: 200 },
    '55447': { city: 'Minneapolis', permit: 200 },
    '55448': { city: 'Minneapolis', permit: 200 },
    '55449': { city: 'Minneapolis', permit: 200 },
    '55450': { city: 'Minneapolis', permit: 200 },
    '55454': { city: 'Minneapolis', permit: 200 },
    '55455': { city: 'Minneapolis', permit: 200 },
    // St. Paul (551xx)
    '55101': { city: 'St. Paul', permit: 237 },
    '55102': { city: 'St. Paul', permit: 237 },
    '55103': { city: 'St. Paul', permit: 237 },
    '55104': { city: 'St. Paul', permit: 237 },
    '55105': { city: 'St. Paul', permit: 237 },
    '55106': { city: 'St. Paul', permit: 237 },
    '55107': { city: 'St. Paul', permit: 237 },
    '55108': { city: 'St. Paul', permit: 237 },
    '55109': { city: 'St. Paul', permit: 237 },
    '55110': { city: 'St. Paul', permit: 237 },
    '55111': { city: 'St. Paul', permit: 237 },
    '55112': { city: 'St. Paul', permit: 237 },
    '55113': { city: 'St. Paul', permit: 237 },
    '55114': { city: 'St. Paul', permit: 237 },
    '55115': { city: 'St. Paul', permit: 237 },
    '55116': { city: 'St. Paul', permit: 237 },
    '55117': { city: 'St. Paul', permit: 237 },
    '55118': { city: 'St. Paul', permit: 237 },
    '55119': { city: 'St. Paul', permit: 237 },
    '55120': { city: 'St. Paul', permit: 237 },
    '55121': { city: 'St. Paul', permit: 237 },
    '55122': { city: 'St. Paul', permit: 237 },
    '55123': { city: 'St. Paul', permit: 237 },
    '55124': { city: 'St. Paul', permit: 237 },
    '55126': { city: 'St. Paul', permit: 237 },
    '55127': { city: 'St. Paul', permit: 237 },
    '55128': { city: 'St. Paul', permit: 237 },
    '55130': { city: 'St. Paul', permit: 237 },
    '55133': { city: 'St. Paul', permit: 237 },
  };

  // Get permit info from ZIP code
  function getPermitInfo(zip) {
    if (ZIP_PERMIT_MAP[zip]) {
      return ZIP_PERMIT_MAP[zip];
    }
    // Check patterns
    if (zip.startsWith('554')) {
      return { city: 'Minneapolis', permit: 200 };
    }
    if (zip.startsWith('551')) {
      return { city: 'St. Paul', permit: 237 };
    }
    // Default
    return { city: 'Twin Cities Area', permit: 225 };
  }

  // Calculate costs
  function calculateCosts() {
    const form = document.getElementById('calc-form');
    if (!form) return;

    const panelSituation = form.querySelector('input[name="panel"]:checked')?.value;
    const evBrand = form.querySelector('#ev-brand')?.value;
    const zipCode = form.querySelector('#zip-code')?.value?.trim();

    // Validate ZIP
    if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      showError('Please enter a valid 5-digit ZIP code');
      return;
    }

    // Get permit info
    const permitInfo = getPermitInfo(zipCode);

    // Calculate costs
    const baseInstall = 1200;
    const subPanelCost = panelSituation === 'sub-panel' ? 800 : 0;
    const permitCost = permitInfo.permit;
    const subtotal = baseInstall + subPanelCost + permitCost;

    // Rebates
    const xcelRebate = 500;
    const federalCreditPercent = 0.30;
    const federalCreditMax = 1000;
    const federalCredit = Math.min(subtotal * federalCreditPercent, federalCreditMax);
    const netCost = subtotal - xcelRebate - federalCredit;

    // Store values for modal
    window.calcData = {
      zipCode,
      evBrand,
      panelSituation,
      permitInfo,
      baseInstall,
      subPanelCost,
      permitCost,
      subtotal,
      xcelRebate,
      federalCredit,
      netCost
    };

    // Display results
    displayResults({
      baseInstall,
      subPanelCost,
      permitCost,
      permitCity: permitInfo.city,
      subtotal,
      xcelRebate,
      federalCredit,
      netCost
    });
  }

  // Display calculation results
  function displayResults(data) {
    const resultsDiv = document.getElementById('calc-results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `
      <div class="calc-breakdown">
        <div class="calc-row">
          <span>Base installation</span>
          <span>$${data.baseInstall.toLocaleString()}</span>
        </div>
        ${data.subPanelCost > 0 ? `
        <div class="calc-row">
          <span>Sub-panel installation</span>
          <span>$${data.subPanelCost.toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="calc-row">
          <span>Permit (${data.permitCity})</span>
          <span>$${data.permitCost.toLocaleString()}</span>
        </div>
        <div class="calc-row calc-subtotal">
          <span>Subtotal</span>
          <span>$${data.subtotal.toLocaleString()}</span>
        </div>
        <div class="calc-row calc-rebate">
          <span>Less Xcel Energy rebate</span>
          <span>-$${data.xcelRebate.toLocaleString()}</span>
        </div>
        <div class="calc-row calc-rebate">
          <span>Less federal credit (30%)</span>
          <span>-$${Math.round(data.federalCredit).toLocaleString()}</span>
        </div>
        <div class="calc-row calc-total">
          <span>NET COST</span>
          <span>$${Math.round(data.netCost).toLocaleString()}</span>
        </div>
      </div>
      <button type="button" class="btn-primary calc-cta" onclick="openContactModal()">
        Get Comprehensive Bid
      </button>
    `;

    resultsDiv.classList.add('visible');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Show error message
  function showError(message) {
    const resultsDiv = document.getElementById('calc-results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `
      <div class="calc-error">
        <p>${message}</p>
      </div>
    `;
    resultsDiv.classList.add('visible');
  }

  // Open contact modal
  window.openContactModal = function() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    // Pre-fill form with calculator data
    if (window.calcData) {
      const zipInput = modal.querySelector('#modal-zip');
      const brandInput = modal.querySelector('#modal-brand');
      if (zipInput) zipInput.value = window.calcData.zipCode || '';
      if (brandInput) brandInput.value = window.calcData.evBrand || '';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // Close contact modal
  window.closeContactModal = function() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Handle contact form submission
  async function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const modalContent = document.querySelector('.modal-content');

    const lead = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      zip: formData.get('zip'),
      evBrand: formData.get('evBrand'),
      message: formData.get('message'),
      calcData: window.calcData || null
    };

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show success
        if (modalContent) {
          modalContent.innerHTML = `
            <div class="modal-success">
              <span class="success-icon">✓</span>
              <h3>Request Submitted!</h3>
              <p>A licensed installer will contact you within 24 hours.</p>
              <button type="button" class="btn-primary" onclick="closeContactModal()">Close</button>
            </div>
          `;
        }
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Show error
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="modal-success">
            <span class="success-icon" style="background:#ef4444;">✕</span>
            <h3>Something went wrong</h3>
            <p>Please try again or call us directly.</p>
            <button type="button" class="btn-primary" onclick="location.reload()">Try Again</button>
          </div>
        `;
      }
    }
  }

  // Initialize calculator
  function initCalculator() {
    const calcForm = document.getElementById('calc-form');
    if (calcForm) {
      calcForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCosts();
      });
    }

    // Modal close on background click
    const modal = document.getElementById('contact-modal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeContactModal();
        }
      });
    }

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Close modal on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeContactModal();
      }
    });
  }

  // Carousel functionality
  function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track) return;

    const cards = track.querySelectorAll('.carousel-card');
    if (cards.length === 0) return;

    let currentIndex = 0;

    function showCard(index) {
      cards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
          card.classList.add('active');
        }
      });
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      cards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.addEventListener('click', () => {
          currentIndex = i;
          showCard(currentIndex);
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showCard(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        showCard(currentIndex);
      });
    }

    // Initialize
    showCard(0);

    // Auto-advance every 6 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      showCard(currentIndex);
    }, 6000);
  }

  // FAQ toggle functionality
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('active') || item.classList.contains('open');

        // Close all other items
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('active');
          i.classList.remove('open');
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('active');
          item.classList.add('open');
        }
      });
    });
  }

  // Initialize all functionality when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
    initCarousel();
    initFAQ();
  });

})();
