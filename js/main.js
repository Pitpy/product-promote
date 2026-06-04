(function () {
  "use strict";

  var header = document.getElementById("header");
  var navToggle = document.getElementById("navToggle");
  var headerActions = document.querySelector(".header__actions");
  var scrollSelector = ".nav__link, .footer__nav a, .hero__actions a, .package__content a, .cta__actions a";

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  function toggleNav() {
    var isOpen = headerActions.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  function closeNav() {
    if (headerActions) {
      headerActions.classList.remove("is-open");
    }
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", toggleNav);

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href^='#']");
    if (!link || !link.matches(scrollSelector)) {
      return;
    }

    var href = link.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    var target = document.querySelector(href);
    if (!target) {
      return;
    }

    e.preventDefault();
    closeNav();

    var headerOffset = header.offsetHeight;
    var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeNav();
    }
  });

  var animatedElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Vertical industry tabs */
  var verticalTabs = document.querySelectorAll(".verticals__tab");
  var verticalPanels = document.querySelectorAll(".verticals__panel");

  function activateVerticalTab(tab) {
    var vertical = tab.getAttribute("data-vertical");

    verticalTabs.forEach(function (t) {
      var isActive = t === tab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", String(isActive));
    });

    verticalPanels.forEach(function (panel) {
      var isActive = panel.getAttribute("data-panel") === vertical;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  }

  verticalTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activateVerticalTab(tab);
    });

    tab.addEventListener("keydown", function (e) {
      var tabs = Array.prototype.slice.call(verticalTabs);
      var index = tabs.indexOf(tab);
      var nextIndex = -1;

      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        tabs[nextIndex].focus();
        activateVerticalTab(tabs[nextIndex]);
      }
    });
  });
})();
