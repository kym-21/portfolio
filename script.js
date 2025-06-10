// Smooth Scrolling for Navigation
const navLinks = document.querySelectorAll(".nav-links a");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");

// Smooth Scroll with Error Handling
navLinks.forEach(link => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    // Get the target section (from href attribute, e.g. #about)
    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    // Error handling for undefined sections
    if (!targetSection) {
      console.error(`⚠️ Section with ID '${targetId}' not found.`);
      return;
    }

    // Adjust for the fixed navbar's height
    const navbarHeight = navbar.offsetHeight;
    const sectionPosition = targetSection.offsetTop - navbarHeight;

    // Smooth scroll to the section
    window.scrollTo({
      top: sectionPosition,
      behavior: "smooth",
    });
  });
});

// Debounce Scroll Event Listener
let scrollTimeout; // To minimize firing handleScroll on every pixel
window.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(handleScroll, 50); // Runs every 50ms
});

// Active Link Highlighting While Scrolling
function handleScroll() {
  const scrollPosition = window.scrollY + navbar.offsetHeight; // Compensate for sticky navbar height

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      const currentId = section.getAttribute("id"); // Section's ID (e.g., "about", "projects")
      setActiveLink(currentId); // Highlight nav link corresponding to this section
    }
  });
}

// Highlight the Active Navigation Link
function setActiveLink(activeId) {
  navLinks.forEach(link => {
    link.classList.remove("active"); // Remove "active" class from all links
    link.removeAttribute("aria-current"); // Remove ARIA current attribute

    // Add "active" class and ARIA attribute to the matching link
    if (link.getAttribute("href") === `#${activeId}`) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

// Set Active Link on Initial Page Load
window.addEventListener("DOMContentLoaded", handleScroll); // Trigger handleScroll once on page load

// Add a Scroll Progress Bar (Optional)
const progressBar = document.createElement("div");
progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "4px";
progressBar.style.backgroundColor = "#58a6ff";
progressBar.style.zIndex = "9999";
progressBar.style.transition = "width 0.2s ease";
document.body.appendChild(progressBar); // Append the progress bar to the body

// Update Progress Bar Width on Scroll
window.addEventListener("scroll", () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight; // Max scroll height
  const scrollTop = window.scrollY; // Current scroll position
  const scrollProgress = (scrollTop / scrollHeight) * 100; // % scrolled
  progressBar.style.width = `${scrollProgress}%`; // Dynamically update bar width
});