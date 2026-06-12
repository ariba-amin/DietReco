// FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const currentItem = question.parentElement;
      
      // Closes any other open FAQ items when a new one is clicked
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== currentItem) {
          item.classList.remove('active');
        }
      });

      // Toggles the clicked item
      currentItem.classList.toggle('active');
    });
  });
});