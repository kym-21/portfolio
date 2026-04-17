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

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth",
      });
    });
  });

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

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const currentId = section.getAttribute("id");
        setActiveLink(currentId);
      }
    });
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
});


