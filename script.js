const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTop');
const counters = document.querySelectorAll('.counter');
const slides = Array.from(document.querySelectorAll('.slide'));
const quizQuestions = document.getElementById('quizQuestions');
const quizForm = document.getElementById('quizForm');
const resetQuizButton = document.getElementById('resetQuiz');
const quizResult = document.getElementById('quizResult');
const resourceSearch = document.getElementById('resourceSearch');
const resourceCards = document.querySelectorAll('.resource-card');
const faqItems = document.querySelectorAll('.faq-item');

const isDarkTheme = () => root.getAttribute('data-theme') === 'dark';

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('cyber-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(isDarkTheme() ? 'dark' : 'light');
  }
}

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = `${target}`;
        clearInterval(timer);
      } else {
        counter.textContent = `${current}`;
      }
    }, 25);
  });
}

function startCarousel() {
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === current);
    });
    current = (current + 1) % slides.length;
  }, 4000);
}

function renderQuiz() {
  if (!quizQuestions) return;

  const questions = [
    {
      question: 'What is the safest action when you receive an unexpected email asking for your password?',
      options: ['Click the link immediately', 'Reply with your password', 'Delete it and report it', 'Forward it to everyone'],
      answer: 'Delete it and report it'
    },
    {
      question: 'Which of these is the strongest password practice?',
      options: ['Using the same password everywhere', 'A short word with your birth year', 'A long unique password stored in a password manager', 'A simple pattern like 123456'],
      answer: 'A long unique password stored in a password manager'
    },
    {
      question: 'What does MFA add to account security?',
      options: ['A second layer of verification', 'A longer login page', 'A password reset only', 'Nothing new'],
      answer: 'A second layer of verification'
    },
    {
      question: 'What should you do before downloading software from the internet?',
      options: ['Download from any pop-up', 'Verify the source and trustworthiness', 'Ignore warnings', 'Allow all permissions'],
      answer: 'Verify the source and trustworthiness'
    },
    {
      question: 'Why are software updates important?',
      options: ['They add ads', 'They can patch security vulnerabilities', 'They slow down devices', 'They remove all passwords'],
      answer: 'They can patch security vulnerabilities'
    },
    {
      question: 'What is phishing?',
      options: ['A secure browser feature', 'A fraudulent attempt to trick you into revealing information', 'A safe backup method', 'A Wi-Fi standard'],
      answer: 'A fraudulent attempt to trick you into revealing information'
    },
    {
      question: 'Which is a safer way to browse on public Wi-Fi?',
      options: ['Use it for banking without caution', 'Avoid sensitive tasks and use a VPN', 'Share your password with nearby users', 'Turn off your firewall'],
      answer: 'Avoid sensitive tasks and use a VPN'
    },
    {
      question: 'What is the best reason to back up important files?',
      options: ['To make them easier to lose', 'To recover from data loss or ransomware', 'To increase spam', 'To remove antivirus'],
      answer: 'To recover from data loss or ransomware'
    },
    {
      question: 'What is social engineering?',
      options: ['A coding language', 'A way to persuade people into revealing information', 'A type of firewall', 'A safe password manager feature'],
      answer: 'A way to persuade people into revealing information'
    },
    {
      question: 'Which action is most likely to protect your accounts?',
      options: ['Ignoring suspicious login alerts', 'Using the same password on every site', 'Enabling MFA and monitoring unusual activity', 'Sharing your recovery codes online'],
      answer: 'Enabling MFA and monitoring unusual activity'
    }
  ];

  quizQuestions.innerHTML = questions.map((item, index) => `
    <fieldset>
      <legend>${index + 1}. ${item.question}</legend>
      ${item.options.map((option) => `
        <label>
          <input type="radio" name="q${index}" value="${option}" required />
          ${option}
        </label>
      `).join('')}
    </fieldset>
  `).join('');
}

function evaluateQuiz(event) {
  event.preventDefault();
  const questions = quizQuestions.querySelectorAll('fieldset');
  let score = 0;
  questions.forEach((fieldset, index) => {
    const selected = fieldset.querySelector('input:checked');
    if (selected) {
      const answer = selected.value;
      const correctAnswer = ['Delete it and report it', 'A long unique password stored in a password manager', 'A second layer of verification', 'Verify the source and trustworthiness', 'They can patch security vulnerabilities', 'A fraudulent attempt to trick you into revealing information', 'Avoid sensitive tasks and use a VPN', 'To recover from data loss or ransomware', 'A way to persuade people into revealing information', 'Enabling MFA and monitoring unusual activity'][index];
      if (answer === correctAnswer) score += 1;
    }
  });
  const percent = Math.round((score / questions.length) * 100);
  quizResult.textContent = `You scored ${score} out of ${questions.length} (${percent}%). ${percent >= 8 ? 'Excellent work!' : percent >= 5 ? 'Good job—keep learning!' : 'Keep practicing and review the resources section.'}`;
  quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetQuiz() {
  quizForm.reset();
  quizResult.textContent = '';
  renderQuiz();
}

function filterResources() {
  const term = resourceSearch.value.trim().toLowerCase();
  resourceCards.forEach((card) => {
    const text = `${card.dataset.title} ${card.dataset.tags}`.toLowerCase();
    card.style.display = text.includes(term) ? 'block' : 'none';
  });
}

function toggleFaq(event) {
  if (!event.target.classList.contains('faq-question')) return;
  const item = event.target.closest('.faq-item');
  const isActive = item.classList.contains('active');
  faqItems.forEach((faq) => faq.classList.remove('active'));
  if (!isActive) item.classList.add('active');
}

function handleScroll() {
  if (window.scrollY > 400) {
    scrollTopBtn.style.display = 'grid';
  } else {
    scrollTopBtn.style.display = 'none';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = isDarkTheme() ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('cyber-theme', nextTheme);
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMenu);
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', handleScroll);
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  startCarousel();
  renderQuiz();
  if (counters.length) animateCounters();
  handleScroll();
});

if (quizForm) {
  quizForm.addEventListener('submit', evaluateQuiz);
}

if (resetQuizButton) {
  resetQuizButton.addEventListener('click', resetQuiz);
}

if (resourceSearch) {
  resourceSearch.addEventListener('input', filterResources);
}

if (faqItems.length) {
  document.addEventListener('click', toggleFaq);
}
