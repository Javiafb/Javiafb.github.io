// INICIO DE FUCIONALIDADES
// 1. Efecto de partículas de fondo
// 2. Efecto de escritura
// 3. Línea de tiempo
// 4. Integración con GitHub
// 5. Formulario de contacto avanzado
//

function setupParticlesBackground() {
  // Crear el canvas para las partículas
  const particlesCanvas = document.createElement("canvas");
  particlesCanvas.id = "particles-canvas";
  document.body.insertBefore(particlesCanvas, document.body.firstChild);

  // Configuración de partículas
  const particlesConfig = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim(),
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim(),
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.8,
          },
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  };

  // Cargar la biblioteca particles.js y aplicar configuración
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
  script.onload = function () {
    particlesJS("particles-canvas", particlesConfig);

    // Actualizar color de partículas cuando cambia el tema
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", function () {
        setTimeout(() => {
          const newColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--accent")
            .trim();
          particlesJS("particles-canvas", {
            ...particlesConfig,
            particles: {
              ...particlesConfig.particles,
              color: { value: newColor },
              line_linked: {
                ...particlesConfig.particles.line_linked,
                color: newColor,
              },
            },
          });
        }, 300);
      });
    }
  };
  document.body.appendChild(script);
}

// Inicializar partículas
document.addEventListener("DOMContentLoaded", setupParticlesBackground);

function setupTypingEffect() {
  const typingElement = document.querySelector(".typing-text");
  if (!typingElement) return;

  const phrases = JSON.parse(typingElement.getAttribute("data-phrases"));
  let currentPhraseIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
      // Borrar caracteres
      typingElement.textContent = currentPhrase.substring(
        0,
        currentCharIndex - 1
      );
      currentCharIndex--;
      typingSpeed = 50; // Más rápido al borrar
    } else {
      // Escribir caracteres
      typingElement.textContent = currentPhrase.substring(
        0,
        currentCharIndex + 1
      );
      currentCharIndex++;
      typingSpeed = 100; // Normal al escribir
    }

    // Cambiar dirección o frase
    if (!isDeleting && currentCharIndex === currentPhrase.length) {
      // Pausa al final de la escritura
      typingSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      // Cambiar a la siguiente frase
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      // Pausa antes de empezar nueva frase
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  // Iniciar efecto de typing
  setTimeout(type, 1000);
}

// Inicializar efecto de typing
document.addEventListener("DOMContentLoaded", setupTypingEffect);

function setupTimeline() {
  const timelineItems = document.querySelectorAll(".timeline-item-enhanced");

  // Configurar observador para animaciones
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  // Observar elementos de la línea de tiempo
  timelineItems.forEach((item) => {
    observer.observe(item);

    // Añadir evento para expandir/contraer detalles
    const toggleBtn = item.querySelector(".timeline-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const details = item.querySelector(".timeline-details");
        const isExpanded = details.classList.contains("expanded");

        // Contraer todos los detalles primero
        document.querySelectorAll(".timeline-details").forEach((detail) => {
          detail.classList.remove("expanded");
          detail.style.maxHeight = null;
        });

        document.querySelectorAll(".timeline-toggle-btn").forEach((btn) => {
          btn.classList.remove("active");
          btn
            .querySelector("ion-icon")
            .setAttribute("name", "chevron-down-outline");
        });

        // Expandir el actual si no estaba expandido
        if (!isExpanded) {
          details.classList.add("expanded");
          details.style.maxHeight = details.scrollHeight + "px";
          toggleBtn.classList.add("active");
          toggleBtn
            .querySelector("ion-icon")
            .setAttribute("name", "chevron-up-outline");
        }
      });
    }
  });
}

// Inicializar línea de tiempo
document.addEventListener("DOMContentLoaded", setupTimeline);

// Función para configurar la integración con GitHub
function setupGitHubIntegration() {
  const githubContainer = document.getElementById("github-repos");
  if (!githubContainer) return;

  const username = githubContainer.getAttribute("data-username") || "Javiafb";
  const repoCount = parseInt(githubContainer.getAttribute("data-count") || "6");

  // Mostrar cargando
  githubContainer.innerHTML = `
    <div class="github-loading">
      <div class="spinner"></div>
      <p>Cargando repositorios...</p>
    </div>
  `;

  // Función para obtener repositorios
  async function fetchGitHubRepos() {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=${repoCount}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar repositorios");
      }

      const repos = await response.json();

      // Limpiar contenedor
      githubContainer.innerHTML = "";

      // Crear tarjetas para cada repositorio
      repos.forEach((repo) => {
        // Crear elemento para el repositorio
        const repoElement = document.createElement("div");
        repoElement.className = "github-repo";

        // Determinar lenguaje principal y su color
        const language = repo.language || "Sin especificar";
        const languageColor = getLanguageColor(language);

        // Formatear fecha de actualización
        const updatedAt = new Date(repo.updated_at);
        const formattedDate = updatedAt.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        // Crear HTML para el repositorio
        repoElement.innerHTML = `
          <div class="repo-header">
            <div class="repo-name-container">
              <ion-icon name="git-branch-outline"></ion-icon>
              <h3 class="repo-name">${repo.name}</h3>
            </div>
            <span class="repo-visibility">${
              repo.private ? "Privado" : "Público"
            }</span>
          </div>
          
          <p class="repo-description">${
            repo.description || "Sin descripción"
          }</p>
          
          <div class="repo-meta">
            <div class="repo-language">
              <span class="language-color" style="background-color: ${languageColor}"></span>
              <span>${language}</span>
            </div>
            
            <div class="repo-stats">
              <div class="repo-stat">
                <ion-icon name="star-outline"></ion-icon>
                <span>${repo.stargazers_count}</span>
              </div>
              
              <div class="repo-stat">
                <ion-icon name="git-network-outline"></ion-icon>
                <span>${repo.forks_count}</span>
              </div>
            </div>
            
            <div class="repo-updated">
              <ion-icon name="time-outline"></ion-icon>
              <span>Actualizado el ${formattedDate}</span>
            </div>
          </div>
          
          <a href="${repo.html_url}" class="repo-link" target="_blank">
            Ver repositorio <ion-icon name="open-outline"></ion-icon>
          </a>
        `;

        // Añadir al contenedor
        githubContainer.appendChild(repoElement);
      });

      // Añadir enlace a perfil completo
      const profileLink = document.createElement("a");
      profileLink.href = `https://github.com/${username}`;
      profileLink.className = "github-profile-link";
      profileLink.target = "_blank";
      profileLink.innerHTML = `
        Ver todos los repositorios <ion-icon name="logo-github"></ion-icon>
      `;
      githubContainer.appendChild(profileLink);
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      githubContainer.innerHTML = `
        <div class="github-error">
          <ion-icon name="alert-circle-outline"></ion-icon>
          <p>No se pudieron cargar los repositorios. Inténtalo de nuevo más tarde.</p>
        </div>
      `;
    }
  }

  // Función para obtener color según lenguaje
  function getLanguageColor(language) {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Python: "#3572A5",
      Java: "#b07219",
      PHP: "#4F5D95",
      "C#": "#178600",
      "C++": "#f34b7d",
      Ruby: "#701516",
      Go: "#00ADD8",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Rust: "#dea584",
    };

    return colors[language] || "#8f8f8f";
  }

  // Cargar repositorios
  fetchGitHubRepos();
}

// Inicializar integración con GitHub
document.addEventListener("DOMContentLoaded", setupGitHubIntegration);
function setupAdvancedContactForm() {
  const form = document.querySelector(".contact-form-advanced");
  if (!form) return;

  const inputs = form.querySelectorAll(".form-input-advanced");
  const submitBtn = form.querySelector(".form-btn-advanced");

  // Añadir eventos a los inputs
  inputs.forEach((input) => {
    const inputContainer = input.parentElement;
    const label = inputContainer.querySelector("label");
    const errorElement = document.createElement("div");
    errorElement.className = "input-error";
    inputContainer.appendChild(errorElement);

    // Evento focus
    input.addEventListener("focus", () => {
      inputContainer.classList.add("focused");
    });

    // Evento blur
    input.addEventListener("blur", () => {
      inputContainer.classList.remove("focused");

      if (input.value.trim() !== "") {
        inputContainer.classList.add("has-value");
      } else {
        inputContainer.classList.remove("has-value");
      }

      validateInput(input);
    });

    // Evento input
    input.addEventListener("input", () => {
      if (inputContainer.classList.contains("invalid")) {
        validateInput(input);
      }
    });
  });

  // Función para validar input
  function validateInput(input) {
    const inputContainer = input.parentElement;
    const errorElement = inputContainer.querySelector(".input-error");

    // Resetear estado
    inputContainer.classList.remove("invalid");
    errorElement.textContent = "";

    // Validar según el tipo
    if (input.hasAttribute("required") && input.value.trim() === "") {
      inputContainer.classList.add("invalid");
      errorElement.textContent = "Este campo es obligatorio";
      return false;
    }

    if (input.type === "email" && input.value.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        inputContainer.classList.add("invalid");
        errorElement.textContent = "Por favor, introduce un email válido";
        return false;
      }
    }

    if (input.id === "phone" && input.value.trim() !== "") {
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(input.value.trim().replace(/\s/g, ""))) {
        inputContainer.classList.add("invalid");
        errorElement.textContent =
          "Por favor, introduce un número de teléfono válido";
        return false;
      }
    }

    return true;
  }

  // Validar formulario completo
  function validateForm() {
    let isValid = true;

    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Evento submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Cambiar estado del botón
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';

      // Simular envío (reemplazar con tu lógica real)
      setTimeout(() => {
        // Mostrar mensaje de éxito
        form.classList.add("success");
        submitBtn.innerHTML =
          '<ion-icon name="checkmark-outline"></ion-icon> ¡Mensaje enviado!';

        // Resetear formulario después de un tiempo
        setTimeout(() => {
          form.reset();
          form.classList.remove("success");
          submitBtn.disabled = false;
          submitBtn.classList.remove("loading");
          submitBtn.innerHTML =
            '<ion-icon name="paper-plane-outline"></ion-icon> Enviar mensaje';

          // Resetear estados de los inputs
          inputs.forEach((input) => {
            input.parentElement.classList.remove("has-value");
          });
        }, 3000);
      }, 2000);
    }
  });
}

// Inicializar formulario de contacto avanzado
document.addEventListener("DOMContentLoaded", setupAdvancedContactForm);
