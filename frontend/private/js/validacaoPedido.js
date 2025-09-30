document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPedido");
  const nome = document.getElementById("nomeUsuario");
  const cpf = document.getElementById("cpf");
  const titulo = document.getElementById("tituloLivro");
  const autor = document.getElementById("autorLivro");

  //máscara campo CPF
  cpf.addEventListener("input", function (e) {
    let valor = e.target.value;
    let cpfPattern = valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1-$2")
      .replace(/(-\d{2})(\d+?$)/, "$1");
    e.target.value = cpfPattern;
  });

  function validarFormulario() {
    const formValidado = form.checkValidity();
    if (formValidado) {
      form.classList.remove("was-validated");
    } else {
      form.classList.add("was-validated");
    }
    return formValidado;
  }

  form.onsubmit = gravarUsuario;

  function gravarUsuario(evento) {
    if (validarFormulario()) {
      console.log("olá");
    }

    evento.stopPropagation();
    evento.preventDefault();
  }
});
