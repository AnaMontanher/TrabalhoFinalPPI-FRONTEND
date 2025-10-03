const formulario = document.getElementById("formUsuario");

const divMenu = document.getElementById("divMenu");

exibirTabelaClientes();

//FUNÇÕES BOTÕES
document.getElementById("btnAtualizar").onclick = () => {
  const cpf = document.getElementById("cpf").value;
  atualizarCliente(cpf);
};
document.getElementById("btnReset").onclick = resetFormulario;
formulario.onsubmit = gravarUsuario;

function formularioInputs() {
  return {
    cpf: document.getElementById("cpf").value,
    nome: document.getElementById("nomeUsuario").value,
    telefone: document.getElementById("fone").value,
    dataNasc: document.getElementById("dataNasc").value,
    sexo: document.getElementById("formSexo").value,
    email: document.getElementById("email").value,
    senha: document.getElementById("senha").value,
  };
}

//MÉTODOS HTTP - CRUD
//POST - DELETE - PUT/PATCH - GET

function gravarUsuario(evento) {
  if (validarFormulario()) {
    const valores = formularioInputs();

    fetch("http://localhost:4000/cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valores),
    })
      .then((resposta) => {
        return resposta.json();
      })
      .then((dados) => {
        if (dados.status) {
          resetFormulario();
          exibirTabelaClientes();
          mensagemAlerta("Cliente gravado com sucesso!", "success");
        } else {
          mensagemAlerta(
            "Cliente não foi atualizado erro" + dados.mensagem,
            "danger"
          );
        }
      })
      .catch((erro) => {
        alert("Não foi possível gravar o cliente" + erro.message);
      });
  }
  evento.stopPropagation();
  evento.preventDefault();
}

function excluirCliente(cpf) {
  if (confirm(`Deseja realmente excluir o cliente (cpf: ${cpf})?`)) {
    fetch("http://localhost:4000/cliente/" + cpf, { method: "DELETE" })
      .then((resposta) => {
        if (resposta.ok) {
          return resposta.json();
        }
      })
      .then((dados) => {
        if (dados.status) {
          exibirTabelaClientes();
          mensagemAlerta("Cliente excluído com sucesso!", "success");
        } else {
          mensagemAlerta(
            "Cliente não foi atualizado erro" + dados.mensagem,
            "danger"
          );
        }
      })
      .catch((erro) => {
        alert("Não foi possível excluir o cliente." + erro.message);
      });
  }
}
function atualizarCliente(cpf) {
  validarFormulario();
  const valores = formularioInputs();
  fetch("http://localhost:4000/cliente/" + cpf, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(valores),
  })
    .then((resposta) => {
      return resposta.json();
    })
    .then((dados) => {
      if (dados.status) {
        resetFormulario();
        exibirTabelaClientes();
        mensagemAlerta("Cliente atualizado com sucesso!", "success");
      } else {
        mensagemAlerta(
          "Cliente não foi atualizado erro" + dados.mensagem,
          "danger"
        );
      }
    })
    .catch((erro) => {
      alert("Não foi possível atualizar o cliente" + erro.message);
    });
}

//FORMULÁRIO RECUPERA OS DADOS DO USUARIO ESPECÍFICO
function recuperaDadosCliente(cliente) {
  document.getElementById("cpf").value = cliente.cpf;
  document.getElementById("nomeUsuario").value = cliente.nome;
  document.getElementById("fone").value = cliente.telefone;
  document.getElementById("dataNasc").value = formularioData(cliente.dataNasc);
  document.getElementById("formSexo").value = cliente.sexo;
  document.getElementById("email").value = cliente.email;
  document.getElementById("senha").value = cliente.senha;
  document.getElementById("confSenha").value = cliente.senha;
}

function prepararFormulario(cpf) {
  // Busca dados do Cliente
  fetch("http://localhost:4000/cliente/" + cpf, { method: "GET" })
    .then((resposta) => resposta.json())
    .then((dados) => {
      if (dados.status || dados.resposta) {
        const cliente = dados.cliente;

        // Preenchendo o formulário com os dados da tabela
        recuperaDadosCliente(cliente);

        // Após preenchimento, envia alteração direto
        if (confirm(`Deseja atualizar o cliente (CPF: ${cliente.cpf})?`)) {
        } else {
          resetFormulario;
        }
      }
    })
    .catch((erro) => {
      alert("Erro ao buscar dados do cliente: " + erro.message);
    });
}

//FUNÇÕES DE MANIPULAÇÃO DE DOM
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", function (e) {
  const valor = e.target.value;
  console.log(valor.length);
  if (valor.length === 14) {
    fetch("http://localhost:4000/cliente/" + valor, { method: "GET" })
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (dados.status || dados.resposta) {
          const cliente = dados.cliente;
          // Preenchendo o formulário com os dados da tabela
          recuperaDadosCliente(cliente);
          document
            .getElementById("btnCadastrar")
            .setAttribute("disabled", "disabled");
          mensagemAlerta("Cliente já está cadastrado no sistema", "primary");
        }
      });
  } else {
    document.getElementById("nomeUsuario").value = "";
    document.getElementById("fone").value = "";
    document.getElementById("dataNasc").value = "";
    document.getElementById("formSexo").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("confSenha").value = "";
    document.getElementById("btnCadastrar").removeAttribute("disabled");
  }
});

function validarFormulario() {
  const formValidado = formulario.checkValidity();
  if (formValidado) {
    formulario.classList.remove("was-validated");
  } else {
    formulario.classList.add("was-validated");
    document.getElementById("invalidForm").style.display = "block";
  }

  return formValidado;
}
function resetFormulario() {
  document.getElementById("cpf").value = "";
  document.getElementById("nomeUsuario").value = "";
  document.getElementById("fone").value = "";
  document.getElementById("dataNasc").value = "";
  document.getElementById("formSexo").value = "";
  document.getElementById("email").value = "";
  document.getElementById("senha").value = "";
  document.getElementById("confSenha").value = "";
  formulario.classList.remove("was-validated");
  document.getElementById("invalidForm").style.display = "none";
}

function mensagemAlerta(mensagem, tipo) {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} fade mt-3`;
  alerta.setAttribute("role", "alert");
  alerta.id = "alertaMensagem";
  alerta.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-3" viewBox="0 0 16 16">  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg> ${mensagem}`;
  divMenu.appendChild(alerta);
  setTimeout(() => {
    alerta.classList.add("show");
  }, 10);
  setTimeout(() => {
    alerta.classList.remove("show");
    setTimeout(() => {
      if (alerta.parentElement) {
        alerta.remove();
      }
    }, 3000);
  }, 4500);
}

//FUNÇÕES DATAS
const formularioData = (data) => {
  if (!data) return "";
  return data.split("T")[0];
};

const formatarData = (data) => {
  if (!data) return "";
  const dataInvertida = data.split("T")[0];
  const vetor = dataInvertida.split("-");
  return `${vetor[2]}/${vetor[1]}/${vetor[0]}`;
};

//MÉTODO GET = EXIBE TABELA DE CLIENTES CADASTRADOS
function exibirTabelaClientes() {
  const espacoTabela = document.getElementById("tabela");
  espacoTabela.innerHTML = "";

  fetch("http://localhost:4000/cliente", { method: "GET" })
    .then((resposta) => {
      if (resposta.ok) {
        return resposta.json();
      } //retorna dados
    })
    .then((dados) => {
      if (dados.status) {
        const tabela = document.createElement("table");
        tabela.className = "table table-stripped tabela table-hover";
        const cabecalho = document.createElement("thead");
        cabecalho.innerHTML = `
          <tr>
          <th>CPF</th>
          <th>NOME</th>
          <th>TELEFONE</th>
          <th>DTNASC</th>
          <th>SEXO</th>
         <th>EMAIL</th>
          <th class = "d-none">SENHA</th>
          <th>AÇÕES</th>
          </tr>
          `;
        tabela.appendChild(cabecalho);
        const corpoTabela = document.createElement("tbody");

        for (const cliente of dados.clientes) {
          const linhaDados = document.createElement("tr");
          linhaDados.innerHTML = `<td>${cliente.cpf}</td>
          <td>${cliente.nome}</td>
          <td>${cliente.telefone}</td>
          <td>${formatarData(cliente.dataNasc)}</td>
          <td>${cliente.sexo}</td>
          <td>${cliente.email}</td>
          <td class = "d-none">${cliente.senha}</td>
          <td><div class="d-flex gap-2">
          <button type="button" class="btn btn-danger" onclick="excluirCliente('${
            cliente.cpf
          }')" >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
          </svg></button>
          <button type="button" class="btn btn-secondary" onclick="prepararFormulario('${
            cliente.cpf
          }')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>   <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg></button>  </div>
          </td>`;
          corpoTabela.appendChild(linhaDados);
        }
        tabela.appendChild(corpoTabela);
        espacoTabela.appendChild(tabela);
      }
    })
    .catch((erro) => {
      alert("Não foi possível recuperar os dados do backend." + erro.message);
    });
}
