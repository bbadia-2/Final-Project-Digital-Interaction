/* Menú de navegació */

const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const headerMenu = document.querySelector(".header-menu");

function closeMenu() {
  headerMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", function () {
  headerMenu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuClose.focus();
});

menuClose.addEventListener("click", function () {
  closeMenu();
  menuToggle.focus();
});

headerMenu.querySelectorAll(".nav a").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && headerMenu.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

window.matchMedia("(max-width: 768px)").addEventListener("change", function () {
  closeMenu();
});

/* Idiomes */

const languageSelect = document.querySelector(".language-select");

fetch("lang/translations.json")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("No s’ha pogut carregar el fitxer de traduccions.");
    }

    return response.json();
  })
  .then(function (translations) {
    function changeLanguage(language) {
      const texts = translations[language];

      document.querySelectorAll("[data-traduccio]").forEach(function (element) {
        const key = element.dataset.traduccio;

        if (element.querySelector("img")) {
          element.childNodes.forEach(function (node) {
            if (
              node.nodeType === Node.TEXT_NODE &&
              node.textContent.trim() !== ""
            ) {
              node.textContent = texts[key];
            }
          });
        } else {
          element.textContent = texts[key];
        }
      });

      document
        .querySelectorAll("[data-traduccio-label]")
        .forEach(function (element) {
          const key = element.dataset.traduccioLabel;
          element.setAttribute("aria-label", texts[key]);
        });

      document
        .querySelectorAll("[data-traduccio-alt]")
        .forEach(function (element) {
          const key = element.dataset.traduccioAlt;
          element.setAttribute("alt", texts[key]);
        });

      document.documentElement.lang = language;
      languageSelect.value = language;
      localStorage.setItem("language", language);
    }

    languageSelect.addEventListener("change", function () {
      changeLanguage(languageSelect.value);
    });

    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage && translations[savedLanguage]) {
      changeLanguage(savedLanguage);
    } else {
      changeLanguage("ca");
    }
  })
  .catch(function (error) {
    console.error(error);
  });
