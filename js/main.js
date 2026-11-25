/*
 * Ichae Semos — dependency-free replacement for jQuery + wow.js +
 * jquery.inview + shuffle.js + jquery.imagesloaded + masonry.pkgd +
 * mousescroll(smoothScroll) + owl.carousel.
 *
 * The mobile menu, the scroll-spy nav highlight and the testimonial slider
 * are Bootstrap 5's own (data-bs-toggle="collapse", data-bs-spy="scroll",
 * .carousel) and need no script here at all. What is left: the back-to-top
 * button v1's own common.js already faded in and out but never added to the
 * markup, the skill-bar reveal on scroll, the portfolio filter, and the
 * contact form's client-side check.
 */
(function () {
  "use strict";

  /* ---- close the mobile menu after tapping an in-page nav link (a
     same-page anchor jump never triggers the page load that would
     otherwise close it) ---- */
  var navCollapseEl = document.getElementById("myNavbar");
  if (navCollapseEl && window.bootstrap) {
    navCollapseEl.querySelectorAll("a.nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (navCollapseEl.classList.contains("show")) {
          bootstrap.Collapse.getOrCreateInstance(navCollapseEl).hide();
        }
      });
    });
  }

  /* ---- back to top ---- */
  var toTop = document.getElementById("back-to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > 100);
    });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- skill bars: fade the row in and fill each bar once, on first
     scroll into view (v1: jquery.inview + wow.js on the same element) ---- */
  var skillLists = document.querySelectorAll(".tv-skill-list");
  if (skillLists.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var list = entry.target;
        list.classList.add("is-visible");
        list.querySelectorAll(".progress-bar[data-skill]").forEach(function (bar) {
          bar.style.width = bar.getAttribute("data-skill") + "%";
        });
        obs.unobserve(list);
      });
    }, { threshold: 0.3 });
    skillLists.forEach(function (list) { io.observe(list); });
  } else {
    // no IntersectionObserver: show the bars at full width immediately
    document.querySelectorAll(".progress-bar[data-skill]").forEach(function (bar) {
      bar.style.width = bar.getAttribute("data-skill") + "%";
    });
  }

  /* ---- portfolio filter (replaces shuffle.js) ---- */
  var filterBar = document.querySelector(".tv-portfolio-filter");
  var grid = document.getElementById("grid");
  if (filterBar && grid) {
    var items = grid.querySelectorAll("li[data-groups]");
    filterBar.addEventListener("click", function (event) {
      var btn = event.target.closest("button[data-group]");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      var group = btn.getAttribute("data-group");
      items.forEach(function (item) {
        var groups = JSON.parse(item.getAttribute("data-groups"));
        var show = group === "all" || groups.indexOf(group) > -1;
        item.classList.toggle("is-filtered-out", !show);
      });
    });
  }

  /* ---- contact form: no backend here, so validate and show the note the
     buyer's own form handler will eventually replace ---- */
  var form = document.querySelector(".tv-contact-form form");
  if (form) {
    var note = form.querySelector(".tv-form-note");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (note) { note.hidden = false; note.focus(); }
      form.reset();
    });
  }
})();
