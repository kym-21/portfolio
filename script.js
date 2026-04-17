document.addEventListener("DOMContentLoaded", () => {
  if (typeof particlesJS === "function") {
    particlesJS("particle-background", {
      particles: {
        number: { value: 180 },
        size: { value: 3 },
        move: { speed: 3 },
        color: { value: "#58a6ff" },
        line_linked: { enable: true, distance: 10, color: "#58a6ff" },
      },
    });
  }

  const navLinks = document.querySelectorAll(".nav-links a");
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("section");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (!navbar || sections.length === 0) {
    return;
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (!targetSection) {
        console.error(`Section with ID '${targetId}' not found.`);
        return;
      }

      const navbarHeight = navbar.offsetHeight;
      const sectionPosition = targetSection.offsetTop - navbarHeight;

      setActiveLink(targetId.replace("#", ""));

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth",
      });

      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNav = navbar.contains(event.target);
      if (!clickedInsideNav && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setActiveLink(activeId) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");

      if (link.getAttribute("href") === `#${activeId}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function handleScroll() {
    const scrollPosition = window.scrollY + navbar.offsetHeight;
    const isAtPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let activeId = sections[0].getAttribute("id");

    if (isAtPageBottom) {
      activeId = sections[sections.length - 1].getAttribute("id");
      setActiveLink(activeId);
      return;
    }

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbar.offsetHeight;

      if (scrollPosition >= sectionTop) {
        activeId = section.getAttribute("id");
      }
    });

    setActiveLink(activeId);
  }

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 50);
  });

  const progressBar = document.createElement("div");
  progressBar.style.position = "fixed";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "4px";
  progressBar.style.backgroundColor = "#58a6ff";
  progressBar.style.zIndex = "9999";
  progressBar.style.transition = "width 0.2s ease";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrollProgress}%`;
  });

  handleScroll();

  const heroBtn = document.querySelector(".hero .btn");
  if (heroBtn) {
    heroBtn.addEventListener("click", (event) => {
      event.preventDefault();
      heroBtn.classList.add("blob");

      const targetId = heroBtn.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        const sectionPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: sectionPosition,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        heroBtn.classList.remove("blob");
      }, 1500);
    });
  }

  const revealTargets = document.querySelectorAll("section, .project-card, .skill, .about-container, #contact-form");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealTargets.forEach((target) => {
      target.classList.add("reveal-up");
      revealObserver.observe(target);
    });
  }

  const contactForm = document.querySelector("#contact-form");
  const submitButton = contactForm ? contactForm.querySelector("button[type='submit']") : null;

  if (contactForm && submitButton) {
    const defaultLabel = submitButton.textContent;

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitButton.classList.add("is-sending");
      submitButton.textContent = "Sending...";

      window.setTimeout(() => {
        submitButton.classList.remove("is-sending");
        submitButton.textContent = defaultLabel;
      }, 1200);
    });
  }
});


