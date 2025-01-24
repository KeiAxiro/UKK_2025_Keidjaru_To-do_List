// document.addEventListener("DOMContentLoaded", function () {
//   new Vue({
//     el: "#app",
//     data: {
//       isMenuOpen: false,
//     },
//     computed: {
//       // Properti yang akan mengubah ikon sesuai status menu
//       listsIconContent() {
//         return this.isMenuOpen ? "menu_open" : "menu"; // Ganti "menu" dengan isi awal ikon
//       },
//     },
//     methods: {
//       toggleMainMenu() {
//         this.isMenuOpen = !this.isMenuOpen;
//       },
//     },
//   });
// });

const indicatorBar = document.getElementById("indicator-bar");

window.onload = function () {
  indicatorBar.style.display = "none";
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
