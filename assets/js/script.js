// INICIO DE FUCIONALIDADES
// 1. Cargar imagen de perfil de GitHub
// 2. Configuración del carrusel de habilidades
// 3. Configuración del tema claro/oscuro
// 4. Funcionalidad del sidebar
// 5. Funcionalidad del modal de testimonios
// 6. Funcionalidad del select personalizado
// 7. Funcionalidad del filtro de proyectos
// 8. Funcionalidad del formulario de contacto
//

document.addEventListener("DOMContentLoaded", function () {
  // Nombre de usuario de tu perfil de GitHub
  const githubUsername = "Javiafb";
  const githubAPIUrl = `https://api.github.com/users/${githubUsername}?callback=processResponse`;
  let imageLoaded = false;

  function handleImageLoad() {
    imageLoaded = true;
  }

  // Función para manejar el tiempo de espera
  function handleTimeout() {
    
    if (!imageLoaded) {
      let imagen_erro = document.getElementById("github-avatar");
      imagen_erro.style.display = "none";

      // Cargar imagen por defecto
      imagen_erro.src = "./assets/images/avatar/avat2.png";
      imagen_erro.style.display = "block";
    }
  }

  window.processResponse = function (data) {
    // Obtener la URL de la imagen de perfil del usuario de GitHub
    const githubAvatarUrl = data.data.avatar_url;

    // Obtener la referencia al elemento de imagen
    const img = document.getElementById("github-avatar");

    // Cambiar la fuente de la imagen una vez que se haya cargado la imagen de perfil
    img.onload = handleImageLoad;

    // Establecer la fuente de la imagen de perfil (esto puede activar el evento onload si la imagen ya está en caché)
    img.src = githubAvatarUrl;
  };

  // Crear un elemento <script> para realizar la solicitud JSONP
  const script = document.createElement("script");
  script.src = githubAPIUrl;

  // Agregar el script al final del documento para que se ejecute
  document.body.appendChild(script);

  // Configurar un tiempo de espera de 10 segundos (10000 milisegundos)
  setTimeout(handleTimeout, 10000);

  // Configuración del carrusel de habilidades
  setupSkillsCarousel();

  // Configuración del tema claro/oscuro
  setupThemeToggle();
});

// Configuración del carrusel de habilidades
function setupSkillsCarousel() {
  // Datos de las habilidades
  const skills = [
    { name: "HTML", image: "./assets/images/logos/html3.png" },
    { name: "CSS", image: "./assets/images/logos/css.png" },
    { name: "JavaScript", image: "./assets/images/logos/javascript.png" },
    { name: "PHP", image: "./assets/images/logos/php.png" },
    { name: "BOOTSTRAP", image: "./assets/images/logos/BOOTSTRAP.png" },
    { name: "LARAVEL", image: "./assets/images/logos/LARAVEL.png" },
    { name: "NODE JS", image: "./assets/images/logos/NODE.png" },
    { name: "TAILWIND", image: "./assets/images/logos/TAILWIND.png" },
    { name: "REACT", image: "./assets/images/logos/REACT.png" },
    { name: "MYSQL", image: "./assets/images/logos/mysql.png" },
  ];

  // Número de habilidades por slide (responsive)
  let skillsPerSlide = window.innerWidth < 768 ? 4 : 6;

  // Calcular el número de slides
  const numSlides = Math.ceil(skills.length / skillsPerSlide);

  // Obtener elementos del DOM
  const carouselTrack = document.querySelector(".carousel-track");
  const indicators = document.querySelector(".carousel-indicators");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  // Variables de control
  let currentSlide = 0;

  // Crear slides
  for (let i = 0; i < numSlides; i++) {
    // Crear slide
    const slide = document.createElement("div");
    slide.className = "carousel-slide";

    // Añadir habilidades al slide
    for (let j = 0; j < skillsPerSlide; j++) {
      const index = i * skillsPerSlide + j;
      if (index < skills.length) {
        const skill = skills[index];

        // Crear contenedor de habilidad
        const skillContainer = document.createElement("div");
        skillContainer.className = "skill-container";

        // Crear imagen
        const img = document.createElement("img");
        img.src = skill.image;
        img.alt = skill.name;
        img.title = skill.name;

        // Crear nombre
        const name = document.createElement("p");
        name.textContent = skill.name;
        name.className = "skill-name";

        // Añadir elementos al contenedor
        skillContainer.appendChild(img);
        skillContainer.appendChild(name);
        slide.appendChild(skillContainer);
      }
    }

    // Añadir slide al track
    carouselTrack.appendChild(slide);

    // Crear indicador
    const indicator = document.createElement("div");
    indicator.className = "carousel-indicator";
    if (i === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(i));
    indicators.appendChild(indicator);
  }

  // Función para ir a un slide específico
  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Actualizar indicadores
    document
      .querySelectorAll(".carousel-indicator")
      .forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentSlide);
      });
  }

  // Event listeners para los botones
  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + numSlides) % numSlides;
    goToSlide(currentSlide);
  });

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % numSlides;
    goToSlide(currentSlide);
  });

  // Autoplay
  let autoplayInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % numSlides;
    goToSlide(currentSlide);
  }, 5000);

  // Detener autoplay al interactuar
  const carousel = document.querySelector(".skills-carousel");
  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoplayInterval);
  });

  carousel.addEventListener("mouseleave", () => {
    autoplayInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % numSlides;
      goToSlide(currentSlide);
    }, 5000);
  });

  // Responsive
  window.addEventListener("resize", () => {
    const newSkillsPerSlide = window.innerWidth < 768 ? 2 : 3;
    if (newSkillsPerSlide !== skillsPerSlide) {
      skillsPerSlide = newSkillsPerSlide;
      // Reconstruir el carrusel
      carouselTrack.innerHTML = "";
      indicators.innerHTML = "";
      setupSkillsCarousel();
    }
  });
}

// Configuración del toggle de tema claro/oscuro
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const htmlElement = document.documentElement;

  // Comprobar si hay un tema guardado en localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    htmlElement.className = savedTheme;
  }

  themeToggleBtn.addEventListener("click", () => {
    // Toggle entre temas
    if (htmlElement.classList.contains("dark-mode")) {
      htmlElement.classList.remove("dark-mode");
      htmlElement.classList.add("light-mode");
      localStorage.setItem("theme", "light-mode");
    } else {
      htmlElement.classList.remove("light-mode");
      htmlElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark-mode");
    }
  });
}

("use strict");

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "todo") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}










