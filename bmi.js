

const calculateBtn = document.getElementById("calculateBtn");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const resultBox = document.getElementById("resultBox");
const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");
const bmiMessage = document.getElementById("bmiMessage");

calculateBtn.addEventListener("click", function () {
  const weight = parseFloat(weightInput.value);
  const heightCm = parseFloat(heightInput.value);

  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    alert("Please enter valid weight and height.");
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const roundedBMI = bmi.toFixed(1);

  let category = "";
  let message = "";
  let categoryBg = "";
  let categoryColor = "";

  if (bmi < 18.5) {
    category = "Underweight";
    message = "Your weight is below the healthy range.";
    categoryBg = "#f5e7b9";
    categoryColor = "#7a6020";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = "Normal";
    message = "You are in a healthy weight range.";
    categoryBg = "#d9eccf";
    categoryColor = "#386b2b";
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = "Overweight";
    message = "Your weight is above the healthy range.";
    categoryBg = "#f6dfc0";
    categoryColor = "#8b5a17";
  } else {
    category = "Obese";
    message = "It is recommended to manage your weight carefully.";
    categoryBg = "#f6d3d3";
    categoryColor = "#9f2d2d";
  }

  bmiValue.textContent = `Your BMI is: ${roundedBMI}`;
  bmiCategory.textContent = `Category: ${category}`;
  bmiCategory.style.background = categoryBg;
  bmiCategory.style.color = categoryColor;
  bmiMessage.textContent = message;

  resultBox.classList.add("show");
});