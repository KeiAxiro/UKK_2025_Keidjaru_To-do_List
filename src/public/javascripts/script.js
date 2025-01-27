const containerLoading = document.getElementById("container-loading");

onload = function () {
  containerLoading.style.display = "none";
};

document.body.addEventListener("htmx:configRequest", (event) => {
  console.log("HTMX Request Configured:", event.detail.errors);
});

document.body.addEventListener("htmx:afterRequest", (event) => {
  console.log("HTMX Request Completed:", event.detail);
});

document.body.addEventListener("htmx:responseError", (event) => {
  console.error("HTMX Response Error:", event.detail);
});

const theme = async (from) => {
  await ui("theme", from);
};

const mode = () => {
  let newMode = ui("mode") == "dark" ? "light" : "dark";
  ui("mode", newMode);
};
