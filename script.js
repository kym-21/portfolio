document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("section");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-links");
  const navBackdrop = document.querySelector(".nav-backdrop");
  const floatingSocial = document.querySelector(".floating-social");
  const socialToggle = document.querySelector(".social-toggle");
  const themeSwitcher = document.querySelector(".theme-switcher");
  const themeToggle = document.querySelector(".theme-toggle");
  const themePanel = document.querySelector(".theme-panel");
  const themeOptions = document.querySelectorAll(".theme-option");
  const modeToggle = document.querySelector(".mode-toggle");

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
    const allowedThemes = ["blue", "silver", "spotify", "verdict", "marble", "library"];
    const nextTheme = allowedThemes.includes(themeName) ? themeName : "blue";
    document.body.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    setThemeOptionState(nextTheme);
    progressBar.style.backgroundColor = getBrandColor();
    initParticles();
  };

  const applyMode = (modeName) => {
    const nextMode = modeName === "light" ? "light" : "dark";
    document.body.dataset.mode = nextMode;
    localStorage.setItem("portfolio-mode", nextMode);

    if (modeToggle) {
      const isLight = nextMode === "light";
      modeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
      modeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      modeToggle.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
    }
  };

  const setSocialMenuState = (isOpen) => {
    if (!floatingSocial || !socialToggle) {
      return;
    }

    floatingSocial.classList.toggle("is-open", isOpen);
    socialToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    socialToggle.setAttribute("aria-label", isOpen ? "Close social links" : "Open social links");
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

  const savedMode = localStorage.getItem("portfolio-mode") || "dark";
  applyMode(savedMode);

  if (socialToggle && floatingSocial) {
    socialToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!window.matchMedia("(max-width: 768px)").matches) {
        return;
      }

      setSocialMenuState(!floatingSocial.classList.contains("is-open"));
    });

    floatingSocial.addEventListener("click", (event) => {
      if (!window.matchMedia("(max-width: 768px)").matches) {
        return;
      }

      if (event.target.closest("a")) {
        setSocialMenuState(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (!window.matchMedia("(max-width: 768px)").matches) {
        return;
      }

      if (!floatingSocial.contains(event.target)) {
        setSocialMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 768px)").matches) {
        setSocialMenuState(false);
      }
    });
  }

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const nextMode = document.body.dataset.mode === "light" ? "dark" : "light";

      modeToggle.classList.remove("is-spinning");
      void modeToggle.offsetWidth;
      modeToggle.classList.add("is-spinning");

      window.setTimeout(() => {
        modeToggle.classList.remove("is-spinning");
      }, 320);

      applyMode(nextMode);
    });
  }

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

  const projectCards = document.querySelectorAll(".project-card");
  const projectStackContainer = document.querySelector(".projects-container");
  const projectsSection = document.querySelector("#projects");
  const projectStackToggle = document.querySelector(".project-stack-toggle");
  const projectsMobileMq = window.matchMedia("(max-width: 768px)");
  let projectStackExpanded = !projectsMobileMq.matches;
  let projectStackActiveIndex = 0;
  const projectDragState = {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    cardIndex: 0,
  };

  const resetProjectCardVars = (card) => {
    card.style.removeProperty("--stack-x");
    card.style.removeProperty("--stack-y");
    card.style.removeProperty("--stack-rotate");
    card.style.removeProperty("--stack-scale");
    card.style.removeProperty("--stack-opacity");
    card.style.removeProperty("--stack-z");
    card.style.removeProperty("--drag-x");
    card.style.removeProperty("--drag-y");
    card.style.removeProperty("--drag-rotate");
    card.style.removeProperty("--drag-scale");
  };

  const updateProjectStackLayout = () => {
    if (!projectsSection || !projectStackToggle) {
      return;
    }

    if (!projectsMobileMq.matches) {
      projectsSection.classList.remove("projects-stack-mobile", "projects-stack-open");
      projectStackToggle.hidden = true;
      projectDragState.active = false;
      projectDragState.pointerId = null;

      projectCards.forEach((card) => {
        resetProjectCardVars(card);
        card.style.removeProperty("transform");
        card.style.removeProperty("z-index");
        card.style.removeProperty("opacity");
        card.style.removeProperty("pointer-events");
      });

      return;
    }

    projectStackToggle.hidden = false;
    projectsSection.classList.add("projects-stack-mobile");
    projectsSection.classList.toggle("projects-stack-open", projectStackExpanded);
    projectStackToggle.setAttribute("aria-expanded", projectStackExpanded ? "true" : "false");
    projectStackToggle.setAttribute("aria-label", projectStackExpanded ? "Collapse project stack" : "Open project stack");

    projectCards.forEach((card, index) => {
      const relativeIndex = index - projectStackActiveIndex;
      const depth = Math.abs(relativeIndex);
      const fanOffset = projectStackExpanded ? 1 : 0.35;
      const xShift = relativeIndex * (projectStackExpanded ? 18 : 11);
      const yShift = relativeIndex * (projectStackExpanded ? 15 : 12) + depth * 5;
      const rotation = relativeIndex === 0 ? (projectStackExpanded ? -4 : -2) : relativeIndex > 0 ? 14 : -14;
      const scale = index === projectStackActiveIndex ? 1 : 0.94 - depth * 0.03;
      const opacity = index === projectStackActiveIndex ? 1 : depth > 1 ? 0.82 : 0.96;
      const zIndex = 50 - depth;
      const isDraggedCard = projectDragState.active && index === projectDragState.cardIndex;
      const dragRotate = isDraggedCard ? Math.max(Math.min(projectDragState.deltaX * 0.18, 28), -28) : 0;
      const dragScale = isDraggedCard ? Math.max(0.9, 1 - Math.abs(projectDragState.deltaX) / 760) : 1;

      card.style.setProperty("--stack-x", `${xShift}px`);
      card.style.setProperty("--stack-y", `${yShift}px`);
      card.style.setProperty("--stack-rotate", `${rotation * fanOffset}deg`);
      card.style.setProperty("--stack-scale", scale.toFixed(3));
      card.style.setProperty("--stack-opacity", opacity.toFixed(3));
      card.style.setProperty("--stack-z", String(zIndex));
      card.style.setProperty("--drag-x", isDraggedCard ? `${projectDragState.deltaX.toFixed(2)}px` : "0px");
      card.style.setProperty("--drag-y", isDraggedCard ? `${projectDragState.deltaY.toFixed(2)}px` : "0px");
      card.style.setProperty("--drag-rotate", `${dragRotate.toFixed(2)}deg`);
      card.style.setProperty("--drag-scale", dragScale.toFixed(3));

      card.style.transform = "";
      card.style.zIndex = String(zIndex);
      card.style.opacity = String(opacity);
      card.style.pointerEvents = "auto";
      card.style.touchAction = "none";
      card.classList.toggle("is-stack-active", index === projectStackActiveIndex);
    });
  };

  const activateProjectCard = (index) => {
    projectStackActiveIndex = index;
    projectStackExpanded = true;
    updateProjectStackLayout();
  };

  const finishProjectDrag = (event) => {
    if (!projectDragState.active || event.pointerId !== projectDragState.pointerId) {
      return;
    }

    const dragDistance = Math.hypot(projectDragState.deltaX, projectDragState.deltaY);
    const shouldAdvance = dragDistance > 50;

    projectDragState.active = false;
    projectDragState.pointerId = null;
    projectDragState.deltaX = 0;
    projectDragState.deltaY = 0;

    if (shouldAdvance && projectCards.length > 1) {
      const direction = projectDragState.startX - event.clientX > 0 ? 1 : -1;
      const nextIndex = (projectStackActiveIndex + direction + projectCards.length) % projectCards.length;
      projectStackActiveIndex = nextIndex;
      projectStackExpanded = true;
    }

    updateProjectStackLayout();
  };

  if (projectStackToggle && projectsSection && projectCards.length) {
    projectStackToggle.hidden = true;

    projectStackToggle.addEventListener("click", () => {
      projectStackExpanded = !projectStackExpanded;
      updateProjectStackLayout();
    });

    projectCards.forEach((card, index) => {
      card.addEventListener("pointerdown", (event) => {
        if (!projectsMobileMq.matches || event.button !== 0) {
          return;
        }

        if (event.target.closest("a")) {
          return;
        }

        projectStackExpanded = true;
        projectDragState.active = true;
        projectDragState.pointerId = event.pointerId;
        projectDragState.startX = event.clientX;
        projectDragState.startY = event.clientY;
        projectDragState.deltaX = 0;
        projectDragState.deltaY = 0;
        projectDragState.cardIndex = index;

        card.setPointerCapture(event.pointerId);
        updateProjectStackLayout();
      });

      card.addEventListener("pointermove", (event) => {
        if (!projectDragState.active || event.pointerId !== projectDragState.pointerId) {
          return;
        }

        projectDragState.deltaX = event.clientX - projectDragState.startX;
        projectDragState.deltaY = event.clientY - projectDragState.startY;
        updateProjectStackLayout();
      });

      card.addEventListener("pointerup", finishProjectDrag);
      card.addEventListener("pointercancel", finishProjectDrag);
    });

    if (projectStackContainer) {
      projectStackContainer.addEventListener("pointerdown", (event) => {
        if (!projectsMobileMq.matches || event.button !== 0) {
          return;
        }

        if (event.target.closest("a, button")) {
          return;
        }

        const activeCard = projectCards[projectStackActiveIndex] || projectCards[0];
        if (!activeCard) {
          return;
        }

        projectStackExpanded = true;
        projectDragState.active = true;
        projectDragState.pointerId = event.pointerId;
        projectDragState.startX = event.clientX;
        projectDragState.startY = event.clientY;
        projectDragState.deltaX = 0;
        projectDragState.deltaY = 0;
        projectDragState.cardIndex = projectStackActiveIndex;

        activeCard.setPointerCapture(event.pointerId);
        updateProjectStackLayout();
      });
    }

    projectsMobileMq.addEventListener("change", () => {
      projectStackExpanded = !projectsMobileMq.matches;
      projectStackActiveIndex = 0;
      projectDragState.active = false;
      projectDragState.pointerId = null;
      projectDragState.deltaX = 0;
      projectDragState.deltaY = 0;
      updateProjectStackLayout();
    });

    updateProjectStackLayout();
  }

  if (projectCards.length && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    projectCards.forEach((card) => {
      const resetProjectCard = () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--card-lift", "0px");
        card.style.setProperty("--card-scale", "1");
        card.style.setProperty("--card-offset-x", "0px");
        card.style.setProperty("--card-offset-y", "0px");
      };

      const updateProjectCardTilt = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const xRatio = (clientX - rect.left) / rect.width;
        const yRatio = (clientY - rect.top) / rect.height;
        const clampedX = Math.min(Math.max(xRatio, 0), 1);
        const clampedY = Math.min(Math.max(yRatio, 0), 1);
        const rotateY = (clampedX - 0.5) * 40;
        const rotateX = (0.5 - clampedY) * 32;
        const offsetX = (clampedX - 0.5) * 12;
        const offsetY = (clampedY - 0.5) * 10;
        const lift = -3 - (1 - Math.abs(clampedY - 0.5) * 2) * 2;
        const scale = 1.01 + (1 - Math.abs(clampedX - 0.5) * 2) * 0.01;

        card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        card.style.setProperty("--card-lift", `${lift.toFixed(2)}px`);
        card.style.setProperty("--card-scale", scale.toFixed(3));
        card.style.setProperty("--card-offset-x", `${offsetX.toFixed(2)}px`);
        card.style.setProperty("--card-offset-y", `${offsetY.toFixed(2)}px`);
      };

      let tiltFrame = null;

      card.addEventListener("pointermove", (event) => {
        const clientX = event.clientX;
        const clientY = event.clientY;

        if (tiltFrame) {
          window.cancelAnimationFrame(tiltFrame);
        }

        tiltFrame = window.requestAnimationFrame(() => {
          updateProjectCardTilt(clientX, clientY);
          tiltFrame = null;
        });
      });

      card.addEventListener("pointerleave", resetProjectCard);
      card.addEventListener("blur", resetProjectCard, true);
      resetProjectCard();
    });
  }

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
