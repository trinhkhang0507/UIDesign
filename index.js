document.addEventListener("DOMContentLoaded", function () {

    fetch("components/header.html")
.then(res => res.text())
.then(data => {
    document.getElementById("header").innerHTML = data;

    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");
    const closeMenu = document.querySelector(".close-menu");

    if(menuToggle){
        menuToggle.addEventListener("click", () => {
            navbar.classList.add("active");
        });
    }

    if(closeMenu){
        closeMenu.addEventListener("click", () => {
            navbar.classList.remove("active");
        });
    }

});

    fetch("components/footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });

});

const slider = document.querySelector(".slider");

if (slider) {
  const slides = document.querySelectorAll(".slider img");

  const firstClone = slides[0].cloneNode(true);
  slider.appendChild(firstClone);

  let index = 0;
  const total = slider.children.length;

  function updateSlider() {
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  setInterval(() => {
    index++;
    updateSlider();

    if (index === total - 1) {
      setTimeout(() => {
        slider.style.transition = "none";
        index = 0;
        updateSlider();

        setTimeout(() => {
          slider.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    }
  }, 3000);

  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  if (next) next.onclick = () => {
    index = (index + 1) % total;
    updateSlider();
  };

  if (prev) prev.onclick = () => {
    index = (index - 1 + total) % total;
    updateSlider();
  };
}

document.addEventListener("DOMContentLoaded", function () {

  const minus = document.querySelector(".minus");
  const plus = document.querySelector(".plus");
  const input = document.querySelector(".qty-input");

  if (minus && plus && input) {

    minus.addEventListener("click", () => {
      let value = parseInt(input.value) || 1;
      if (value > 1) input.value = value - 1;
    });

    plus.addEventListener("click", () => {
      let value = parseInt(input.value) || 1;
      input.value = value + 1;
    });

  }

});

const filterTitles = document.querySelectorAll(".filter-title");

filterTitles.forEach(title => {

    title.addEventListener("click", () => {

        title.classList.toggle("active");

        const content = title.nextElementSibling;

        content.classList.toggle("show");

    });

});