document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    // Toggle menu visibility
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      navLinks.classList.toggle("open");
    });

    // Close the mobile menu if a link inside it is clicked
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });

    // Close menu when clicking anywhere else outside on the document
    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove("open");
      }
    });
  }

  // Handle browser window resize adjustments cleanly
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860 && navLinks) {
      navLinks.classList.remove("open");
    }
  });
});