document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPedido");
  const cpf = document.getElementById("cpf");

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


});
