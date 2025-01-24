document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
    data: {
      isMenuOpen: false,
    },
    computed: {
      // Properti yang akan mengubah ikon sesuai status menu
      listsIconContent() {
        return this.isMenuOpen ? "menu_open" : "menu"; // Ganti "menu" dengan isi awal ikon
      },
    },
    methods: {
      toggleMainMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
    },
  });
});
