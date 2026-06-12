

const blogData = {
  blog1: {
    title: "Top Benefits of Following a Proper Diet Plan",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    content: `
      <div class="modal-article">
        <img src="${"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"}" alt="Diet plan benefits" />
        <h2>Top Benefits of Following a Proper Diet Plan</h2>
        <p>
          Following a proper diet plan makes healthy eating much easier because it gives your day structure.
          Instead of making random food choices, you already know what to eat and when to eat it.
        </p>
        <p>
          A good diet plan can improve your energy, support better digestion, help with healthy weight management,
          and reduce unhealthy eating habits. It can also help you stay focused on your goal.
        </p>
        <ul>
          <li>Improves energy and daily performance</li>
          <li>Helps control portion size</li>
          <li>Supports healthy digestion</li>
          <li>Makes routine and consistency easier</li>
          <li>Encourages healthier food choices</li>
        </ul>
        <p>
          The main benefit is consistency. When your plan is simple and realistic, it becomes easier to follow for a longer time.
        </p>
      </div>
    `
  },

  blog2: {
    title: "Why Consistency Matters in Healthy Eating",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    content: `
      <div class="modal-article">
        <img src="${"https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80"}" alt="Consistency in diet" />
        <h2>Why Consistency Matters in Healthy Eating</h2>
        <p>
          Healthy eating does not mean being perfect every day. It means making better choices again and again.
          Small consistent efforts usually work better than short-term strict plans.
        </p>
        <p>
          If you eat balanced meals regularly, drink enough water, and avoid skipping meals, your body responds better over time.
        </p>
        <ul>
          <li>Builds better habits</li>
          <li>Reduces cravings and overeating</li>
          <li>Helps maintain routine</li>
          <li>Makes long-term results possible</li>
        </ul>
      </div>
    `
  },

  blog3: {
    title: "How a Balanced Diet Improves Your Energy",
    image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=80",
    content: `
      <div class="modal-article">
        <img src="${"https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=80"}" alt="Energy from balanced diet" />
        <h2>How a Balanced Diet Improves Your Energy</h2>
        <p>
          A balanced diet gives your body the nutrients it needs to perform well. When meals include proteins,
          healthy carbs, fruits, vegetables, and enough water, you feel more active and refreshed.
        </p>
        <p>
          Poor food choices often make people feel tired, heavy, or low in energy. Better nutrition supports better daily performance.
        </p>
        <ul>
          <li>Supports physical activity</li>
          <li>Helps reduce tiredness</li>
          <li>Improves focus and mood</li>
          <li>Supports better routine and sleep</li>
        </ul>
      </div>
    `
  },

  blog4: {
    title: "5 Tips for Staying on Track with Your Diet",
    image: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?auto=format&fit=crop&w=1200&q=80",
    content: `
      <div class="modal-article">
        <img src="${"https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?auto=format&fit=crop&w=1200&q=80"}" alt="Diet tips" />
        <h2>5 Tips for Staying on Track with Your Diet</h2>
        <p>
          Following a diet plan becomes easier when it is practical and simple. You do not need to make huge changes all at once.
        </p>
        <ul>
          <li>Plan your meals in advance</li>
          <li>Drink enough water daily</li>
          <li>Do not skip breakfast or important meals</li>
          <li>Keep healthy snacks available</li>
          <li>Stay patient and consistent</li>
        </ul>
        <p>
          Small steps can make a big difference when you keep following them daily.
        </p>
      </div>
    `
  }
};

const modal = document.getElementById("blogModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const readMoreButtons = document.querySelectorAll(".read-more-btn");

readMoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const blogKey = button.getAttribute("data-blog");
    const selectedBlog = blogData[blogKey];

    if (!selectedBlog) return;

    modalContent.innerHTML = selectedBlog.content;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });
});

function hideModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

if (closeModal) {
  closeModal.addEventListener("click", hideModal);
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    hideModal();
  }
});