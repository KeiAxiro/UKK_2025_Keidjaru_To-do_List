document.addEventListener("DOMContentLoaded", () => {
  const UItheme = (from) => ui("theme", from);

  const UImode = (from) => ui("mode", from);
  UImode("dark");
});

const logHTMXEvent = (type, detail) =>
  console[type](`HTMX ${type.replace("htmx:", "")}:`, detail);

["configRequest", "afterRequest", "responseError"].forEach((event) => {
  document.body.addEventListener(`htmx:${event}`, (e) =>
    logHTMXEvent(event === "responseError" ? "error" : "log", e.detail)
  );
});

document
  .querySelectorAll("i")
  .forEach((el) => el.setAttribute("translate", "no"));

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("translatePrompted")) {
    localStorage.setItem("translatePrompted", "true");
    window.location.reload(); // Refresh agar Chrome mendeteksi bahasa
  }
});
