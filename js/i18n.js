(function () {
  "use strict";

  var DEFAULT_LANG = "lo";
  var STORAGE_KEY = "gpos-lang";

  function getLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "lo" || saved === "en") {
      return saved;
    }
    return DEFAULT_LANG;
  }

  function t(lang, key) {
    var translations = window.TRANSLATIONS;
    if (!translations || !translations[lang]) {
      return null;
    }
    return translations[lang][key] || null;
  }

  function applyTranslation(el, lang) {
    var key = el.getAttribute("data-i18n");
    if (!key) {
      return;
    }

    var text = t(lang, key);
    if (text === null) {
      console.warn("[i18n] Missing translation:", lang, key);
      return;
    }

    var attr = el.getAttribute("data-i18n-attr");
    if (attr) {
      el.setAttribute(attr, text);
    } else {
      el.textContent = text;
    }
  }

  function updateLangSwitcher(lang) {
    document.querySelectorAll(".lang-switcher__btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setLang(lang) {
    if (lang !== "lo" && lang !== "en") {
      lang = DEFAULT_LANG;
    }

    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      applyTranslation(el, lang);
    });
    updateLangSwitcher(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: lang } }));
  }

  function initLangSwitcher() {
    var switcher = document.querySelector(".lang-switcher");
    if (!switcher) {
      return;
    }

    switcher.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-lang]");
      if (!btn) {
        return;
      }
      setLang(btn.getAttribute("data-lang"));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitcher();
    setLang(getLang());
  });

  window.i18n = {
    getLang: getLang,
    setLang: setLang,
    t: t
  };
})();
