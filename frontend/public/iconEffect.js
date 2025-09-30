const loginLink = document.getElementById("loginLink");
const logout = document.getElementById("iconLogout");

loginLink.addEventListener("mouseenter", () => {
  logout.src = "../public/assets/logout2.png";
  logout.style.transition = "all 500ms ease-in-out;";
});

loginLink.addEventListener("mouseleave", () => {
  logout.src = "../public/assets/logout.png";
});
