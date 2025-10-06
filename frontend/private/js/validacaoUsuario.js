document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formUsuario");
  const nome = document.getElementById("nomeUsuario");
  const cpf = document.getElementById("cpf");
  const tel = document.getElementById("fone");
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const confSenha = document.getElementById("confSenha");

  //mascara nome
  nome.addEventListener("input", function (e) {
    let valor = e.target.value;
    let nomePattern = valor.replace(/\d/g, "").replace();
    e.target.value = nomePattern;
  });

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

  //máscara campo telefone
  tel.addEventListener("input", function (e) {
    let value = e.target.value;
    let telPattern = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})(\d+?$)/, "$1");
    e.target.value = telPattern;
  });
  //validar data de nascimento
  function dataMax() {
    let dataAtual = new Date();
    let dia = dataAtual.getDate();
    let mes = dataAtual.getMonth();
    let ano = dataAtual.getFullYear();
    let data = ano + "-" + mes + "-" + dia;
    document.getElementById("dataNasc").max = data;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    function aplicaClasse(input, isValid) {
      input.classList.toggle("is-valid", isValid);
      input.classList.toggle("is-invalid", !isValid);
    }
    //validação de e-mail
    const validarEmail = function () {
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
      aplicaClasse(email, emailValido);
      if (!emailValido) isValid = false;

      //função alterar classes para campos de confirmar informaçao
      const classeIncorreto = function (input) {
        input.classList.remove("is-valid");
        input.classList.remove("form-control:valid");
        input.classList.add("is-invalid");
      };
      const classeCorreto = function (input) {
        input.classList.remove("is-invalid");
        input.classList.remove("feedback-invalid");
        input.classList.add("is-valid");
      };
    };

    email.addEventListener("input", function () {
      validarEmail();
    });

    confSenha.addEventListener("input", function () {
      if (senha.value !== confSenha.value || confSenha === "") {
        classeIncorreto(confSenha);
      } else {
        classeCorreto(confSenha);
      }
    });
  });
});
