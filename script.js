document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("section");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-links");
  const navBackdrop = document.querySelector(".nav-backdrop");
  const themeSwitcher = document.querySelector(".theme-switcher");
  const themeToggle = document.querySelector(".theme-toggle");
  const themePanel = document.querySelector(".theme-panel");
  const themeOptions = document.querySelectorAll(".theme-option");

  const progressBar = document.createElement("div");
  progressBar.style.position = "fixed";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "4px";
  progressBar.style.zIndex = "9999";
  progressBar.style.transition = "width 0.2s ease";
  document.body.appendChild(progressBar);

  const getBrandColor = () => {
    return getComputedStyle(document.body).getPropertyValue("--brand").trim() || "#79b8ff";
  };

  const setThemeOptionState = (activeTheme) => {
    themeOptions.forEach((option) => {
      const isActive = option.dataset.theme === activeTheme;
      option.classList.toggle("active", isActive);
      option.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const initParticles = () => {
    if (typeof particlesJS !== "function") {
      return;
    }

    if (window.pJSDom && window.pJSDom.length) {
      window.pJSDom.forEach((instance) => {
        if (instance?.pJS?.fn?.vendors?.destroypJS) {
          instance.pJS.fn.vendors.destroypJS();
        }
      });
      window.pJSDom = [];
    }

    const brandColor = getBrandColor();
    particlesJS("particle-background", {
      particles: {
        number: { value: 180 },
        size: { value: 3 },
        move: { speed: 3 },
        color: { value: brandColor },
        line_linked: { enable: true, distance: 10, color: brandColor },
      },
    });
  };

  const applyTheme = (themeName) => {
    const allowedThemes = ["blue", "silver", "spotify"];
    const nextTheme = allowedThemes.includes(themeName) ? themeName : "blue";
    document.body.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    setThemeOptionState(nextTheme);
    progressBar.style.backgroundColor = getBrandColor();
    initParticles();
  };

  const closeThemePanel = () => {
    if (!themePanel || !themeToggle) {
      return;
    }
    themePanel.hidden = true;
    themeToggle.setAttribute("aria-expanded", "false");
  };

  const openThemePanel = () => {
    if (!themePanel || !themeToggle) {
      return;
    }
    themePanel.hidden = false;
    themeToggle.setAttribute("aria-expanded", "true");
  };

  if (themeToggle && themePanel) {
    themePanel.hidden = true;
    themeToggle.addEventListener("click", () => {
      if (themePanel.hidden) {
        openThemePanel();
      } else {
        closeThemePanel();
      }
    });

    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        applyTheme(option.dataset.theme || "blue");
        closeThemePanel();
      });
    });

    document.addEventListener("click", (event) => {
      if (themeSwitcher && !themeSwitcher.contains(event.target)) {
        closeThemePanel();
      }
    });
  }

  const savedTheme = localStorage.getItem("portfolio-theme") || "blue";
  applyTheme(savedTheme);

  const skillsStrip = document.querySelector(".skills");
  const skillTiles = skillsStrip ? Array.from(skillsStrip.querySelectorAll(".skill")) : [];
  const supportsDockEffect = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (skillsStrip && skillTiles.length && supportsDockEffect) {
    const resetSkillDock = () => {
      skillTiles.forEach((skill) => {
        skill.style.transform = "";
        skill.style.zIndex = "";
      });
    };

    const applySkillDock = (clientX) => {
      skillTiles.forEach((skill) => {
        const rect = skill.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(clientX - centerX);
        const influenceRadius = rect.width * 2.1;
        const normalizedDistance = distance / influenceRadius;
        const proximity = Math.exp(-(normalizedDistance * normalizedDistance) * 2.4);
        const scale = 1 + proximity * 0.22;
        const lift = -(proximity * 6);
        const shiftX = (clientX - centerX) * proximity * 0.09;

        skill.style.transform = `translateX(${shiftX.toFixed(2)}px) translateY(${lift.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        skill.style.zIndex = String(Math.round(scale * 100));
      });
    };

    let dockFrame = null;

    skillsStrip.addEventListener("pointermove", (event) => {
      const pointerX = event.clientX;

      if (dockFrame) {
        window.cancelAnimationFrame(dockFrame);
      }

      dockFrame = window.requestAnimationFrame(() => {
        applySkillDock(pointerX);
        dockFrame = null;
      });
    });

    skillsStrip.addEventListener("pointerleave", resetSkillDock);
    window.addEventListener("resize", resetSkillDock);
  }

  if (!navbar || sections.length === 0) {
    return;
  }

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
    if (navBackdrop) {
      navBackdrop.hidden = true;
    }
  };

  const openNav = () => {
    document.body.classList.add("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "true");
    }
    if (navBackdrop) {
      navBackdrop.hidden = false;
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (!targetSection) {
        return;
      }

      const navbarHeight = navbar.offsetHeight;
      const sectionPosition = targetSection.offsetTop - navbarHeight;

      setActiveLink(targetId.replace("#", ""));

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth",
      });

      closeNav();
    });
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (navBackdrop) {
      navBackdrop.hidden = true;
      navBackdrop.addEventListener("click", closeNav);
    }

    document.addEventListener("click", (event) => {
      const clickedInsideNav = navbar.contains(event.target);
      if (!clickedInsideNav && document.body.classList.contains("nav-open")) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        closeNav();
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

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
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
