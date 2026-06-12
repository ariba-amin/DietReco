document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const downloadBtn = document.getElementById("downloadBtn");
  const planSection = document.getElementById("planSection");
  const noPlanMessage = document.getElementById("noPlanMessage");

  let isDownloading = false;

  // =========================
  // MOBILE NAVIGATION CONTROLS
  // =========================
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("show");
    });

    const navItems = navLinks.querySelectorAll(".nav-link");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navLinks.classList.remove("show");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove("show");
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        navLinks.classList.remove("show");
      }
    });
  }

  // =========================
  // CONTENT HYDRATION PIPELINE
  // =========================
  const rawData = localStorage.getItem("latest_diet_plan");
  
  if (!rawData) {
    // If no plan context exists, adjust visibility structures to show fallback message
    if (planSection) planSection.style.display = "none";
    if (noPlanMessage) noPlanMessage.style.display = "block";
    return;
  }

  // Parse cached data safely
  const plan = JSON.parse(rawData);

  // Hydrate DOM text fields
  document.getElementById("generatedDateText").textContent = plan.generatedDate || "N/A";
  document.getElementById("generatedDateSmall").textContent = plan.generatedDate || "N/A";
  document.getElementById("caloriesText").textContent = `${plan.targetCalories || "—"} kcal`;
  document.getElementById("planCaloriesText").textContent = `${plan.estimatedPlanCalories || "—"} kcal`;
  document.getElementById("balanceText").textContent = plan.dietRecommendation || "Balanced Diet";
  document.getElementById("activityText").textContent = plan.activityLevel || "Sedentary";
  document.getElementById("notesText").textContent = plan.notes || "None";

  // List processing interpolation helper function
  function fillMealList(elementId, itemsArray) {
    const listElement = document.getElementById(elementId);
    if (!listElement) return;
    listElement.innerHTML = ""; // Clear existing placeholder nodes

    if (!itemsArray || itemsArray.length === 0) {
      listElement.innerHTML = `<li class="meal-list-item"><div class="meal-item-name">No structural items specified</div></li>`;
      return;
    }

    itemsArray.forEach(meal => {
      const li = document.createElement("li");
      li.className = "meal-list-item";
      li.innerHTML = `
        <div class="meal-item-name">${meal.item}</div>
        <div class="meal-item-meta">
          <span class="meal-qty">Qty: ${meal.quantity}</span>
          <span class="meal-kcal">${meal.calories} kcal</span>
        </div>
      `;
      listElement.appendChild(li);
    });
  }

  // Populate meal grids dynamically
  fillMealList("breakfastList", plan.breakfastItems);
  fillMealList("lunchList", plan.lunchItems);
  fillMealList("dinnerList", plan.dinnerItems);
  fillMealList("snacksList", plan.snacksItems);

  // =========================
  // CLIENT-SIDE PDF COMPILER
  // =========================
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (isDownloading) return;

      if (!planSection) {
        alert("Render Error: Plan structure missing from active viewport viewport mapping.");
        return;
      }

      isDownloading = true;
      const originalText = downloadBtn.innerHTML;
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = "Generating PDF Document... ⏳";

      try {
        const canvas = await html2canvas(planSection, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          scrollY: -window.scrollY
        });

        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 8;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);

        while (heightLeft > 0) {
          position = heightLeft - imgHeight + margin;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
          heightLeft -= (pageHeight - margin * 2);
        }

        pdf.save("my-personalized-diet-plan.pdf");
      } catch (error) {
        console.error("PDF generation execution breakdown tracking:", error);
        alert("An extraction variance occurred while processing PDF layouts.");
      } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
        isDownloading = false;
      }
    });
  }
});