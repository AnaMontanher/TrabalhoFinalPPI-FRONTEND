const formulario = document.getElementById("formUsuario");

function validarFormulario() {
  const formValidado = formulario.checkValidity();
  if (formValidado) {
    formulario.classList.remove("was-validated");
  } else {
    formulario.classList.add("was-validated");
  }

  return formValidado;
}

formulario.onsubmit = gravarUsuario;

function gravarUsuario(evento) {
  if (validarFormulario()) {
    console.log("olá");
  }

  evento.stopPropagation();
  evento.preventDefault();
}
