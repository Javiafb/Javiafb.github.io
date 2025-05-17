// INICIO DE FUCIONALIDADES
// 1.animaciones de entrada
// 2.contadores
// 3.parallax
// 4.validación de formularios
// 5.lazy loading
// 6.accesibilidad carga de imagenes
// 7.lightbox
//

document.addEventListener("DOMContentLoaded", function () {
  // Configuración del observer para animaciones de entrada
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  // Crear el observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target); // Dejar de observar después de animar
      }
    });
  }, observerOptions);

  // Observar todos los elementos con la clase 'animate-on-scroll'
  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    observer.observe(element);
  });
});

function setupCounters() {
  const counters = document.querySelectorAll(".counter");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000; // 2 segundos
        const step = Math.ceil(target / (duration / 16)); // 60fps

        let current = 0;
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = current;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

// Inicializar contadores
document.addEventListener("DOMContentLoaded", setupCounters);

function setupParallax() {
  const parallaxElements = document.querySelectorAll(".parallax");

  window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-speed")) || 0.05;
      const x = (mouseX - 0.5) * speed * 100;
      const y = (mouseY - 0.5) * speed * 100;

      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// Inicializar parallax
if (window.innerWidth > 768) {
  setupParallax();
}

function setupFormValidation() {
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");

  if (!form) return;

  formInputs.forEach((input) => {
    // Validación en tiempo real
    input.addEventListener("input", () => {
      validateInput(input);
    });

    // Validación al perder el foco
    input.addEventListener("blur", () => {
      validateInput(input);
    });
  });

  function validateInput(input) {
    const parent = input.parentElement;

    // Eliminar mensajes de error anteriores
    const existingError = parent.querySelector(".error-message");
    if (existingError) {
      parent.removeChild(existingError);
    }

    // Validar el input
    if (!input.checkValidity()) {
      input.classList.add("invalid");
      input.classList.remove("valid");

      // Crear mensaje de error
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.textContent = getErrorMessage(input);
      parent.appendChild(errorMessage);
    } else {
      input.classList.remove("invalid");
      input.classList.add("valid");
    }
  }

  function getErrorMessage(input) {
    if (input.validity.valueMissing) {
      return "Este campo es obligatorio";
    } else if (input.validity.typeMismatch) {
      return input.type === "email"
        ? "Por favor, introduce un email válido"
        : "Formato inválido";
    } else if (input.validity.tooShort) {
      return `Debe tener al menos ${input.minLength} caracteres`;
    }

    return "Valor inválido";
  }

  // Animación de envío
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("[data-form-btn]");
    submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
    submitBtn.disabled = true;

    // Simular envío (reemplazar con tu lógica de envío real)
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML =
        '<ion-icon name="checkmark-outline"></ion-icon> Enviado';

      setTimeout(() => {
        submitBtn.innerHTML =
          '<ion-icon name="paper-plane"></ion-icon> Enviar mensaje';
        submitBtn.disabled = false;

        // Resetear clases de validación
        formInputs.forEach((input) => {
          input.classList.remove("valid");
        });
      }, 3000);
    }, 2000);
  });
}

// Inicializar validación del formulario
document.addEventListener("DOMContentLoaded", setupFormValidation);

function setupLazyLoading() {
  // Convertir imágenes normales a lazy loading
  const images = document.querySelectorAll("img:not([loading])");

  images.forEach((img) => {
    // No aplicar a imágenes pequeñas o críticas
    if (
      !img.classList.contains("critical-image") &&
      img.id !== "github-avatar"
    ) {
      img.setAttribute("loading", "lazy");

      // Guardar la URL original
      const originalSrc = img.src;

      // Establecer un placeholder
      img.src = "./assets/images/iconos/placeholder.svg";

      // Añadir clase para efecto de fade-in
      img.classList.add("lazy-image");

      // Configurar observador para cargar la imagen cuando sea visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;

              // Cargar la imagen real
              img.src = originalSrc;

              // Añadir clase cuando la imagen esté cargada
              img.onload = () => {
                img.classList.add("lazy-loaded");
              };

              // Dejar de observar
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "200px",
        }
      );

      observer.observe(img);
    }
  });
}

// Inicializar lazy loading
document.addEventListener("DOMContentLoaded", setupLazyLoading);

function setupAccessibility() {
  // Mejorar el foco visible para navegación por teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-user");
    }
  });

  // Quitar la clase cuando se use el ratón
  document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-user");
  });

  // Añadir atributos ARIA a elementos interactivos
  const interactiveElements = document.querySelectorAll("button, a");

  interactiveElements.forEach((el) => {
    // Añadir roles si no los tienen
    if (!el.hasAttribute("role")) {
      if (el.tagName === "BUTTON") {
        el.setAttribute("role", "button");
      } else if (el.tagName === "A" && !el.hasAttribute("href")) {
        el.setAttribute("role", "button");
      }
    }

    // Asegurar que los botones sean accesibles por teclado
    if (el.tagName === "DIV" && el.getAttribute("role") === "button") {
      if (!el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "0");
      }

      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.click();
        }
      });
    }
  });
}

// Inicializar mejoras de accesibilidad
document.addEventListener("DOMContentLoaded", setupAccessibility);

function setupLightbox() {
  // Crear elementos del lightbox con diseño mejorado
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Cerrar">
        <ion-icon name="close-outline"></ion-icon>
      </button>
      
      <div class="lightbox-container">
        <div class="lightbox-gallery">
          <div class="lightbox-main-image-container">
            <img class="lightbox-main-image" src="http://127.0.0.1:5500/assets/images/iconos/placeholder.svg" alt="">
            <div class="lightbox-loader">
              <div class="spinner-large"></div>
            </div>
          </div>
          
          <div class="lightbox-thumbnails">
            <!-- Thumbnails se generarán dinámicamente -->
          </div>
        </div>
        
        <div class="lightbox-info">
          <h2 class="lightbox-title"></h2>
          
          <div class="lightbox-meta">
            <div class="lightbox-category">
              <ion-icon name="folder-outline"></ion-icon>
              <span></span>
            </div>
            <div class="lightbox-date">
              <ion-icon name="calendar-outline"></ion-icon>
              <span></span>
            </div>
            <div class="lightbox-client">
              <ion-icon name="person-outline"></ion-icon>
              <span></span>
            </div>
          </div>
          
          <div class="lightbox-description"></div>
          
          <div class="lightbox-tech">
            <h3>Tecnologías</h3>
            <div class="lightbox-tech-tags">
              <!-- Tags se generarán dinámicamente -->
            </div>
          </div>

     <!-- video tutoriales -->
          <div class="lightbox-video">
            <h3>Video tutorial</h3>
            <iframe
            width="350"
            height="200"
            src=""
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
            </iframe>
          </div>
          
          <div class="lightbox-links">
            <a href="#" class="lightbox-link demo-link" target="_blank">
              <ion-icon name="globe-outline"></ion-icon>
              Ver Demo
            </a>
            <a href="#" class="lightbox-link code-link" target="_blank">
              <ion-icon name="logo-github"></ion-icon>
              Ver Código
            </a>
          </div>
        </div>
      </div>
      
      <div class="lightbox-navigation">
        <button class="lightbox-prev" aria-label="Proyecto anterior">
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        <div class="lightbox-pagination">
          <span class="current-index">1</span> / <span class="total-count">4</span>
        </div>
        <button class="lightbox-next" aria-label="Proyecto siguiente">
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Obtener elementos del lightbox
  const lightboxContent = lightbox.querySelector(".lightbox-content");
  const lightboxOverlay = lightbox.querySelector(".lightbox-overlay");
  const lightboxMainImage = lightbox.querySelector(".lightbox-main-image");
  const lightboxLoader = lightbox.querySelector(".lightbox-loader");
  const lightboxThumbnails = lightbox.querySelector(".lightbox-thumbnails");
  const lightboxTitle = lightbox.querySelector(".lightbox-title");
  const lightboxCategory = lightbox.querySelector(".lightbox-category span");
  const lightboxDate = lightbox.querySelector(".lightbox-date span");
  const lightboxClient = lightbox.querySelector(".lightbox-client span");
  const lightboxDescription = lightbox.querySelector(".lightbox-description");
  const lightboxTechTags = lightbox.querySelector(".lightbox-tech-tags");
  const lightboxDemoLink = lightbox.querySelector(".demo-link");
  const lightboxMediaLink = lightbox.querySelector(".lightbox-video");
  const lightboxCodeLink = lightbox.querySelector(".code-link");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");
  const lightboxCurrentIndex = lightbox.querySelector(".current-index");
  const lightboxTotalCount = lightbox.querySelector(".total-count");

  // Variables para el lightbox
  let currentIndex = 0;
  let galleryItems = [];

  // Datos de ejemplo para los proyectos (reemplazar con datos reales)
  // Estos datos deberían venir de tu HTML o de un archivo JSON
  const projectsData = [
    {
      id: "project1",
      title: "convertidor de youtube",
      category: "Desarrollo Web",
      date: "Junio 2022",
      client: "Proyecto personal",
      description:
        "una pagina web que permite a los usuarios convertir videos de YouTube a diferentes formatos de audio y video. Incluye una interfaz intuitiva y opciones de calidad personalizadas.",
      technologies: ["javascript", "HTML", "CSS"],
      images: [
        "./assets/images/project/project-1/modo_oscuro.png",
        "./assets/images/project/project-1/modo_claro.png",
        "./assets/images/project/project-1/video_carga.png",
      ],
      demoLink: "https://example.com/demo1",
      codeLink: "https://github.com/username/project1",
    },
    {
      id: "project2",
      title: "CMS WSP",
      category: "Desarrollo web",
      date: "Marzo 2023",
      client: "Autonomo",
      description:
        "Un sistema de gestión de contenidos (CMS) diseñado para administrar y mostrar grupos de WhatsApp organizados por categorías. Permite añadir, editar y eliminar grupos, así como gestionar sus descripciones, enlaces de invitación y otras características. Ideal para páginas que comparten enlaces de grupos según intereses como tecnología, estudio, entretenimiento, entre otros.",
      technologies: ["PHP", "Chart.js","html","css"],
      images: [
        "./assets/images/project/project-2/cms1.png",
        "./assets/images/project/project-2/cms2.png",
        "./assets/images/project/project-2/cms3.png",
      ],
      demoLink: "https://example.com/demo2",
      codeLink: "https://github.com/username/project2",
    },
    {
      id: "project3",
      title: "Noticias blog",
      category: "noticias",
      date: "Diciembre 2022",
      client: "DataViz Corp",
      description:
        "Es una pagina web de noticias que permite a los usuarios explorar y visualizar datos de manera interactiva. Incluye gráficos, mapas y análisis en tiempo real para ayudar a los usuarios a comprender mejor la información presentada.",
      technologies: ["PHP", "css", "javascript", "mysql"],
      images: [
        "./assets/images/project/project-3/blognoti.png",
        "./assets/images/project/project-3/blognoti1.png",
        "./assets/images/project/project-3/blognoti2.png",
      ],
      demoLink: "https://example.com/demo3",
      codeLink: "https://github.com/username/project3",
    },
    {
      id: "project4",
      title: "tienda virtual",
      category: "Desarrollo Web",
      date: "Junio 2021",
      client: "Mavis store",
      description:
        "Una plataforma de comercio electrónico completa con carrito de compras, pasarela de pagos y panel de administración. Diseñada para ofrecer una experiencia de usuario fluida y responsive en todos los dispositivos.",
      technologies: ["php", "javascript", "bootstrap", "mysql", "jQuery"],
      images: [
        "./assets/images/project/project-4/store2.png",
        "./assets/images/project/project-4/store3.png",
        "./assets/images/project/project-4/store4.png",
      ],
      demoLink: "https://example.com/demo4",
      codeLink: "https://github.com/username/project4",
    },
    {
      id: "project5",
      title: "Mesa de ayuda virtual (help desk)",
      category: "Educación",
      date: "mayo 2023",
      client: "Alcadia de valledupar",
      description:
        "Una plataforma de mesa de ayuda virtual para la gestión de tickets de soporte técnico. Permite a los usuarios crear, rastrear y resolver tickets de manera eficiente, mejorando la comunicación entre el equipo de soporte y los usuarios finales.",
      technologies: ["php", "javascript", "bootstrap", "mysql", "jQuery"],
      video:
        "https://drive.google.com/file/d/18hEKrWAwwa7NRAV4PRAOwfBEZ8xwSrCz/preview",
      images: [
        "./assets/images/project/project-5/helpdesk1.png",
        "./assets/images/project/project-5/helpdesk2.png",
        "./assets/images/project/project-5/helpdesk3.png",
      ],
      demoLink: "https://example.com/demo4",
      codeLink: "https://github.com/username/project5",
    },
  ];

  // Añadir eventos a los proyectos
  const projectItems = document.querySelectorAll(".project-item");
  projectItems.forEach((item, index) => {
    const projectLink = item.querySelector("a");
    const projectId =
      item.getAttribute("data-project-id") || `project${index + 1}`;

    // Buscar datos del proyecto
    const projectData =
      projectsData.find((p) => p.id === projectId) ||
      projectsData[index % projectsData.length];

    // Guardar información para el lightbox
    galleryItems.push(projectData);

    // Modificar el comportamiento del enlace
    projectLink.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Actualizar el contador total
  lightboxTotalCount.textContent = galleryItems.length;

  // Función para abrir el lightbox
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();

    // Añadir clase para animación de entrada
    lightbox.classList.add("active");
    setTimeout(() => {
      lightboxContent.classList.add("active");
    }, 50);

    document.body.style.overflow = "hidden";
  }

  // Función para cerrar el lightbox
  function closeLightbox() {
    lightboxContent.classList.remove("active");

    setTimeout(() => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }, 300);
  }

  // Función para actualizar el contenido del lightbox
  function updateLightboxContent() {
    const item = galleryItems[currentIndex];

    // Mostrar loader
    lightboxLoader.classList.add("active");

    // Actualizar índice actual
    lightboxCurrentIndex.textContent = currentIndex + 1;

    // Cargar imagen principal
    const newImage = new Image();
    newImage.src = item.images[0];
    newImage.onload = () => {
      lightboxMainImage.src = item.images[0];
      lightboxMainImage.alt = item.title;
      lightboxLoader.classList.remove("active");
    };

    // Actualizar información del proyecto
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.category;
    lightboxDate.textContent = item.date;
    lightboxClient.textContent = item.client;
    lightboxDescription.innerHTML = `<p>${item.description}</p>`;
    iframe = lightboxMediaLink.querySelector("iframe");

    if (item.video && item.video.trim() !== "") {
      iframe.src = item.video;
      lightboxMediaLink.style.display = "block";
    } else {
      lightboxMediaLink.style.display = "none";
    }

    // Actualizar tecnologías
    lightboxTechTags.innerHTML = "";
    item.technologies.forEach((tech) => {
      const tag = document.createElement("span");
      tag.className = "tech-tag";
      tag.textContent = tech;
      lightboxTechTags.appendChild(tag);
    });

    // Actualizar enlaces
    lightboxDemoLink.href = item.demoLink;
    lightboxCodeLink.href = item.codeLink;

    // Generar miniaturas
    lightboxThumbnails.innerHTML = "";
    item.images.forEach((imgSrc, imgIndex) => {
      const thumbnail = document.createElement("div");
      thumbnail.className = "lightbox-thumbnail";
      if (imgIndex === 0) thumbnail.classList.add("active");

      const thumbImg = document.createElement("img");
      thumbImg.src = imgSrc;
      thumbImg.alt = `${item.title} - Vista ${imgIndex + 1}`;

      thumbnail.appendChild(thumbImg);
      lightboxThumbnails.appendChild(thumbnail);

      // Evento para cambiar la imagen principal
      thumbnail.addEventListener("click", () => {
        // Actualizar clase activa
        lightboxThumbnails
          .querySelectorAll(".lightbox-thumbnail")
          .forEach((thumb) => {
            thumb.classList.remove("active");
          });
        thumbnail.classList.add("active");

        // Mostrar loader
        lightboxLoader.classList.add("active");

        // Cargar nueva imagen
        const newMainImage = new Image();
        newMainImage.src = imgSrc;
        newMainImage.onload = () => {
          // Animación de fade para cambiar la imagen
          lightboxMainImage.style.opacity = "0";
          setTimeout(() => {
            lightboxMainImage.src = imgSrc;
            lightboxMainImage.style.opacity = "1";
            lightboxLoader.classList.remove("active");
          }, 300);
        };
      });
    });

    // Actualizar visibilidad de los botones de navegación
    lightboxPrev.style.visibility = currentIndex > 0 ? "visible" : "hidden";
    lightboxNext.style.visibility =
      currentIndex < galleryItems.length - 1 ? "visible" : "hidden";
  }

  // Eventos de navegación
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxOverlay.addEventListener("click", closeLightbox);

  lightboxPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightboxContent();
    }
  });

  lightboxNext.addEventListener("click", () => {
    if (currentIndex < galleryItems.length - 1) {
      currentIndex++;
      updateLightboxContent();
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    } else if (e.key === "ArrowLeft" && lightbox.classList.contains("active")) {
      if (currentIndex > 0) {
        currentIndex--;
        updateLightboxContent();
      }
    } else if (
      e.key === "ArrowRight" &&
      lightbox.classList.contains("active")
    ) {
      if (currentIndex < galleryItems.length - 1) {
        currentIndex++;
        updateLightboxContent();
      }
    }
  });
}

// Inicializar lightbox
document.addEventListener("DOMContentLoaded", setupLightbox);
