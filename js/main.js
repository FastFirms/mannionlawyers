/* Mannion Lawyers — minimal, deferred JS.
   Everything here is progressive enhancement: the site is fully usable without it. */

(function () {
  "use strict";

  /* ----- Mobile navigation toggle ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  /* ----- Services mega menu -----
     Opens on hover for mouse users (with a close delay so the pointer can
     travel into the panel), toggles on click/Enter via the chevron button,
     closes on Escape or an outside click. */
  var mega = document.querySelector(".has-mega");
  if (mega) {
    var megaBtn = mega.querySelector(".mega-toggle");
    var hoverable = window.matchMedia("(min-width: 801px) and (hover: hover)");
    var closeTimer;

    function setMega(open) {
      mega.classList.toggle("open", open);
      megaBtn.setAttribute("aria-expanded", String(open));
    }

    megaBtn.addEventListener("click", function () {
      setMega(!mega.classList.contains("open"));
    });

    mega.addEventListener("mouseenter", function () {
      if (!hoverable.matches) return;
      clearTimeout(closeTimer);
      setMega(true);
    });
    mega.addEventListener("mouseleave", function () {
      if (!hoverable.matches) return;
      closeTimer = setTimeout(function () { setMega(false); }, 160);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mega.classList.contains("open")) {
        setMega(false);
        megaBtn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!mega.contains(e.target)) setMega(false);
    });
  }

  /* ----- Scroll reveal (skipped entirely under reduced motion) ----- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    // No animation: make everything visible immediately.
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- Sticky mobile CTA: appears after the visitor scrolls past the hero ----- */
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero, .page-hero");
  if (sticky && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        sticky.classList.toggle("show", !entries[0].isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px" }
    ).observe(hero);
  }

  /* ----- Video facade: inject the player iframe only on demand ----- */
  var facade = document.querySelector(".video-facade");
  if (facade) {
    facade.addEventListener("click", function () {
      if (facade.querySelector("iframe")) return;
      var iframe = document.createElement("iframe");
      iframe.src = facade.getAttribute("data-video-src");
      iframe.title = "A message from Mannion Lawyers";
      iframe.allow = "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      facade.appendChild(iframe);
      facade.querySelector(".video-play").style.display = "none";
      facade.querySelector(".video-caption").style.display = "none";
    });
  }

  /* ----- Forms: client-side validation + Formspree submission via fetch.
     Targets both the main booking form and sidebar forms on article pages. ----- */
  function wireForm(form) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".field");
        var ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
        if (field.type === "email" && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        if (wrap) wrap.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        var firstInvalid = form.querySelector(".invalid input, .invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var btn = form.querySelector("[type=submit]");
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        if (res.ok) {
          var isResource = window.location.pathname.indexOf("/resources/") !== -1;
          window.location.href = isResource ? "../thank-you.html" : "thank-you.html";
        } else {
          if (btn) { btn.disabled = false; btn.textContent = "Request a consultation"; }
          alert("Something went wrong. Please try again or call us directly.");
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = "Request a consultation"; }
        alert("Could not send. Please call us on (02) 4704 9977.");
      });
    });
  }

  wireForm(document.querySelector("#booking-form"));
  wireForm(document.querySelector("#sidebar-form"));
})();
