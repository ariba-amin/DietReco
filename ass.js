

// =========================
// WIZARD STATE
// =========================
const stepCards = document.querySelectorAll(".step-card");
const stepItems = document.querySelectorAll(".step-item");
const nextButtons = document.querySelectorAll("[data-next]");
const backButtons = document.querySelectorAll("[data-back]");
const reviewTableBody = document.querySelector("#reviewTable tbody");

let currentStep = 1;
const totalSteps = stepCards.length;

function showStep(step) {
  if (step < 1 || step > totalSteps) return;

  currentStep = step;

  stepCards.forEach((card) => {
    const cardStep = Number(card.dataset.step);
    card.classList.toggle("active-step", cardStep === step);
  });

  stepItems.forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle("active", itemStep === step);
    item.classList.toggle("completed", itemStep < step);
  });

  backButtons.forEach((btn) => {
    btn.disabled = currentStep === 1;
  });
}

// Explicit button routing mapping
nextButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      if (nextStep === 4) {
        populateReview();
      }
      showStep(nextStep);
    }
  });
});

backButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
});

stepItems.forEach((item) => {
  item.addEventListener("click", () => {
    const step = Number(item.dataset.step);
    showStep(step);
    if (step === 4) {
      populateReview();
    }
  });
});

// =========================
// HELPERS & ACQUISITION
// =========================
function getValueById(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function getSelectedGender() {
  const active = document.querySelector(".pill-group .pill.active");
  return active ? active.textContent.trim() : "Female";
}

function getSelectedActivity() {
  const hiddenEl = document.getElementById("activityHidden");
  if (hiddenEl && hiddenEl.value) return hiddenEl.value;
  const selected = document.querySelector(".activity-card.selected");
  return selected ? selected.dataset.activity : "Sedentary";
}

function getCheckedAllergies() {
  const boxes = document.querySelectorAll('.allergy-group input[type="checkbox"]');
  let selected = [];
  boxes.forEach(cb => {
    if (cb.checked) selected.push(cb.value);
  });
  return selected.length > 0 ? selected.join(", ") : "None";
}

function populateReview() {
  if (!reviewTableBody) return;
  reviewTableBody.innerHTML = "";

  const severityRadio = document.querySelector('input[name="severity"]:checked');
  const severityVal = severityRadio ? severityRadio.value : "N/A";

  const rows = [
    ["Age", getValueById("ageInput")],
    ["Gender", getSelectedGender()],
    ["Height (cm)", getValueById("heightInput")],
    ["Weight (kg)", getValueById("weightInput")],
    ["Cuisine Preferred", getValueById("cuisineSelect")],
    ["Target Goal", getValueById("goalSelect")],
    ["Budget Tier", getValueById("budgetSelect")],
    ["Activity Profile", getSelectedActivity()],
    ["Weekly Workouts", getValueById("exerciseSelect")],
    ["Sleep (Hours)", getValueById("sleepInput")],
    ["Medical Diagnostics", getValueById("diseaseSelect")],
    ["Condition Severity", getValueById("diseaseSelect") !== "None" ? severityVal : "N/A"],
    ["Allergies Profile", getCheckedAllergies()]
  ];

  rows.forEach(([lbl, val]) => {
    const tr = document.createElement("tr");
    const tdL = document.createElement("td");
    tdL.style.padding = "8px";
    tdL.style.fontWeight = "bold";
    tdL.style.borderBottom = "1px solid #d1d5db";
    tdL.textContent = lbl;

    const tdV = document.createElement("td");
    tdV.style.padding = "8px";
    tdV.style.borderBottom = "1px solid #d1d5db";
    tdV.textContent = val || "—";

    tr.appendChild(tdL);
    tr.appendChild(tdV);
    reviewTableBody.appendChild(tr);
  });
}

// =========================
// INPUT SELECTION HANDLERS
// =========================
const ageInput = document.getElementById("ageInput");
const ageButtons = document.querySelectorAll(".age-btn");
if (ageInput && ageButtons.length) {
  ageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const change = Number(btn.dataset.ageChange);
      let val = Number(ageInput.value || 18);
      val += change;
      if (val < 13) val = 13;
      if (val > 60) val = 60;
      ageInput.value = val;
    });
  });
}

const genderPills = document.querySelectorAll(".pill-group .pill");
const genderHidden = document.getElementById("genderHidden");
genderPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    genderPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    if (genderHidden) genderHidden.value = pill.textContent.trim();
  });
});

const activityCards = document.querySelectorAll(".activity-card");
const activityHidden = document.getElementById("activityHidden");
activityCards.forEach((card) => {
  card.addEventListener("click", () => {
    activityCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    if (activityHidden) activityHidden.value = card.dataset.activity || "Sedentary";
  });
});

// Allergy Mutex Isolation Filter
const allergyBoxes = document.querySelectorAll('.allergy-group input[type="checkbox"]');
allergyBoxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    if (cb.value === "None" && cb.checked) {
      allergyBoxes.forEach((other) => { if (other !== cb) other.checked = false; });
    } else if (cb.checked) {
      allergyBoxes.forEach((other) => { if (other.value === "None") other.checked = false; });
    }
  });
});

const diseaseSelect = document.getElementById("diseaseSelect");
const severitySection = document.getElementById("severitySection");
if (diseaseSelect) {
  diseaseSelect.addEventListener("change", () => {
    if (diseaseSelect.value === "None" || diseaseSelect.value === "") {
      severitySection.style.display = "none";
    } else {
      severitySection.style.display = "block";
    }
  });
}

// =========================
// ALGORITHM ENGINE & GENERATION
// =========================
const generatePlanBtn = document.getElementById("generatePlanBtn");
if (generatePlanBtn) {
  generatePlanBtn.addEventListener("click", () => {
    // Basic Bounds Check Validation
    const age = parseInt(document.getElementById("ageInput").value) || 0;
    const height = parseFloat(document.getElementById("heightInput").value) || 0;
    const weight = parseFloat(document.getElementById("weightInput").value) || 0;

    if (age < 13 || age > 60) {
      alert("Age constraint error: Must be within 13 to 60.");
      showStep(1);
      return;
    }
    if (!height || !weight) {
      alert("Missing numerical parameter metrics: Height and Weight are mandatory inputs.");
      showStep(1);
      return;
    }

    // Capture state variables
    const goal = getValueById("goalSelect");
    const cuisine = getValueById("cuisineSelect");
    const budget = getValueById("budgetSelect");
    const activity = getSelectedActivity();
    const disease = getValueById("diseaseSelect");
    const allergies = getCheckedAllergies();

    // BMR Calculation using Harris-Benedict Formula
    const gender = getSelectedGender();
    let bmr = 0;
    if (gender === "Male") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity Coefficient Multiplexing
    let actMultiplier = 1.2;
    if (activity === "Moderate") actMultiplier = 1.4;
    if (activity === "Active") actMultiplier = 1.6;
    let tdee = Math.round(bmr * actMultiplier);

    // Goal Modification
    let targetCalories = tdee;
    if (goal === "Weight Loss") targetCalories -= 450;
    if (goal === "Weight Gain") targetCalories += 400;

    // Rule-Based Combinatorial Diet Matrices
    let breakfast = [], lunch = [], dinner = [], snacks = [];
    let dietType = "Standard Balanced Plan";

    if (disease === "Diabetes") {
      dietType = "Low Glycemic Diabetic Specific Plan";
      breakfast = [
        { item: "Oatmeal with chia seeds & cinnamon", quantity: "1 bowl", calories: 280 },
        { item: "Boiled Egg Whites", quantity: "2 units", calories: 34 }
      ];
      lunch = [
        { item: "Grilled Chicken Breast with Quinoa salad", quantity: "200g", calories: 420 },
        { item: "Steamed Broccoli & Asparagus", quantity: "1 cup", calories: 65 }
      ];
      dinner = [
        { item: "Baked Salmon fillet or Tofu", quantity: "150g", calories: 310 },
        { item: "Sautéed Spinach in Olive Oil", quantity: "1 plate", calories: 120 }
      ];
      snacks = [{ item: "Handful of Roasted Chickpeas or Walnuts", quantity: "30g", calories: 140 }];
    } else if (disease === "Hypertension") {
      dietType = "Low-Sodium High-Potassium DASH Diet";
      breakfast = [
        { item: "Skimmed Milk with Whole Grain Flakes", quantity: "1 bowl", calories: 240 },
        { item: "Fresh Banana", quantity: "1 medium", calories: 105 }
      ];
      lunch = [
        { item: "Brown Rice with Low-salt Lentil soup (Daal)", quantity: "1.5 cups", calories: 380 },
        { item: "Mixed Green Salad with Lemon juice dressing", quantity: "1 bowl", calories: 50 }
      ];
      dinner = [
        { item: "Baked Chicken breast or Lean Cottage Cheese", quantity: "150g", calories: 290 },
        { item: "Mashed Sweet Potatoes without Salt", quantity: "1 cup", calories: 160 }
      ];
      snacks = [{ item: "Unsalted pumpkin seeds or carrot sticks", quantity: "40g", calories: 110 }];
    } else {
      // General Objective Categorization
      if (cuisine === "Indian") {
        breakfast = [
          { item: "Poha or Vegetable Upma cooked with light oil", quantity: "1.5 plates", calories: 320 },
          { item: "Low fat Yogurt Greek Style", quantity: "1 cup", calories: 110 }
        ];
        lunch = [
          { item: "Whole Wheat Roti / Chapatis with Mixed Vegetable Sabzi", quantity: "2 units", calories: 340 },
          { item: "Dal / Kidney Beans Soup", quantity: "1 bowl", calories: 180 }
        ];
        dinner = [
          { item: "Jeera Rice with Lean Chicken Curry or Paneer Tikka", quantity: "1 plate", calories: 460 },
          { item: "Fresh Cucumber & Tomato slices", quantity: "1 plate", calories: 45 }
        ];
        snacks = [{ item: "Roasted Makhana / Foxnuts", quantity: "1 cup", calories: 90 }];
      } else {
        breakfast = [
          { item: "Whole Wheat Toast with Avocado paste", quantity: "2 slices", calories: 310 },
          { item: "Freshly Brewed Green Tea", quantity: "1 cup", calories: 5 }
        ];
        lunch = [
          { item: "Mediterranean Chickpea Grilled Wrap", quantity: "1 large", calories: 410 },
          { item: "Clear Vegetable Broth", quantity: "1 cup", calories: 70 }
        ];
        dinner = [
          { item: "Grilled Turkey / Tofu Cutlets with Veggie Stir Fry", quantity: "200g", calories: 390 },
          { item: "Boiled Sweet Corn mix", quantity: "0.5 cup", calories: 80 }
        ];
        snacks = [{ item: "Sliced Red Apples with minimal Almond butter", quantity: "1 unit", calories: 130 }];
      }
    }

    // Apply Allergy Filtration Overrides
    if (allergies.includes("Dairy")) {
      const dairyFilter = (m) => !m.item.toLowerCase().includes("yogurt") && !m.item.toLowerCase().includes("milk") && !m.item.toLowerCase().includes("cheese");
      breakfast = breakfast.filter(dairyFilter);
      lunch = lunch.filter(dairyFilter);
      dinner = dinner.filter(dairyFilter);
      snacks = snacks.filter(dairyFilter);
      // Fallback injection if empty
      if (breakfast.length === 0) breakfast.push({ item: "Fresh Fruit Salad", quantity: "1 plate", calories: 150 });
    }
    if (allergies.includes("Nuts")) {
      const nutFilter = (m) => !m.item.toLowerCase().includes("walnut") && !m.item.toLowerCase().includes("nut") && !m.item.toLowerCase().includes("almond");
      snacks = snacks.filter(nutFilter);
      if (snacks.length === 0) snacks.push({ item: "Baked Rice Crackers", quantity: "5 units", calories: 80 });
    }

    // Budget Adjustment Quantities Multipliers
    if (budget === "Low") {
      breakfast.forEach(m => { m.item = "[Budget Choice] " + m.item; m.calories = Math.round(m.calories * 0.9); });
      lunch.forEach(m => { m.item = "[Budget Choice] " + m.item; m.calories = Math.round(m.calories * 0.9); });
    } else if (budget === "High") {
      breakfast.push({ item: "Premium Organic Whey / Superfood Supplement", quantity: "1 scoop", calories: 120 });
    }

    // Calculate aggregated runtime calorie targets
    let totalCalculatedPlanCalories = 0;
    [breakfast, lunch, dinner, snacks].forEach(list => {
      list.forEach(m => { totalCalculatedPlanCalories += m.calories; });
    });

    // Compile into output schema
    const payload = {
      generatedDate: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
      targetCalories: targetCalories,
      estimatedPlanCalories: totalCalculatedPlanCalories,
      dietRecommendation: dietType,
      activityLevel: activity,
      notes: disease !== "None" ? `Optimized restriction mapping for evaluated ${disease} risk factor.` : "Standard monitoring constraints applied successfully.",
      breakfastItems: breakfast,
      lunchItems: lunch,
      dinnerItems: dinner,
      snacksItems: snacks
    };

    // Save payload context to localStorage database safely
    localStorage.setItem("latest_diet_plan", JSON.stringify(payload));

    // Redirect control directly to the my-plan UI view page
    window.location.href = "my-plan.html";
  });
}

// Initialize layout 
document.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep);
});