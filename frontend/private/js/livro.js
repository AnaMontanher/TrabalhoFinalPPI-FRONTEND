const formulario = document.getElementById("formPedido");

const divMenu = document.getElementById("divMenu");

exibirTabelaPedidos();

//FUNÇÕES BOTÕES
document.getElementById("btnAtualizar").onclick = () => {
  const id = document.getElementById("id").value;
  atualizarPedido(id);
};
document.getElementById("btnReset").onclick = resetFormulario;

function botoesEstado(padrao) {
  if (padrao) {
    document
      .getElementById("btnAtualizar")
      .setAttribute("disabled", "disabled");
    document.getElementById("btnCadastrar").removeAttribute("disabled");
  } else {
    document.getElementById("btnAtualizar").removeAttribute("disabled");
    document
      .getElementById("btnCadastrar")
      .setAttribute("disabled", "disabled");
  }
}
formulario.onsubmit = gravarPedido;

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
          document.getElementById("nomeUsuario").value = cliente.nome;
        } else {
          botoesEstado(false);

          mensagemAlerta(
            "Cliente não possui cadastro no sistema" + erro.message,
            "danger"
          );
        }
      })
      .catch(() => {
        mensagemAlerta("Cliente não possui cadastro no sistema", "danger");
      });
  } else {
    document.getElementById("nomeUsuario").value = "";
  }
});

function formularioInputs() {
  return {
    titulo: document.getElementById("tituloLivro").value,
    autor: document.getElementById("autorLivro").value,
    cliente: document.getElementById("cpf").value,
  };
}

function gravarPedido(evento) {
  const cpf = document.getElementById("cpf").value;
  const valores = formularioInputs();

  if (validarFormulario()) {
    verificarCliente(cpf);

    fetch("http://localhost:4000/livro", {
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
          exibirTabelaPedidos();
          mensagemAlerta("Livro gravado com sucesso!", "success");
        } else {
          mensagemAlerta(
            "Livro não foi gravado erro" + dados.mensagem,
            "danger"
          );
        }
      })
      .catch((erro) => {
        alert("Não foi possível gravar o pedido" + erro.message);
      });
  }

  evento.stopPropagation();
  evento.preventDefault();
}

function excluirPedido(id) {
  if (confirm(`Deseja realmente excluir o pedido (id: ${id})?`)) {
    fetch("http://localhost:4000/livro/" + id, { method: "DELETE" })
      .then((resposta) => {
        if (resposta.ok) {
          return resposta.json();
        }
      })
      .then((dados) => {
        if (dados.status) {
          exibirTabelaPedidos();
          mensagemAlerta("Livro excluído com sucesso!", "success");
        } else {
          mensagemAlerta(
            "Livro não foi excluído erro" + dados.mensagem,
            "danger"
          );
        }
      })
      .catch((erro) => {
        alert("Não foi possível excluir o pedido." + erro.message);
      });
  }
}

function atualizarPedido(id) {
  validarFormulario();
  const valores = formularioInputs();
  fetch("http://localhost:4000/livro/" + id, {
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
        exibirTabelaPedidos();
        mensagemAlerta("Livro atualizado com sucesso!", "success");
      } else {
        mensagemAlerta(
          "Livro não foi atualizado erro" + dados.mensagem,
          "danger"
        );
      }
    })
    .catch((erro) => {
      alert("Não foi possível atualizar o pedido." + erro.message);
    });
}
function mensagemAlerta(mensagem, tipo) {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} fade mt-3`;
  alerta.setAttribute("role", "alert");
  alerta.id = "alertaMensagem";
  alerta.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-3" viewBox="0 0 16 16">  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>${mensagem} `;
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

//FORMULÁRIO RECUPERA OS DADOS DO livro do USUARIO ESPECÍFICO
function prepararFormulario(id) {
  // Busca dados do Cliente
  fetch("http://localhost:4000/livro/id/" + id, { method: "GET" })
    .then((resposta) => resposta.json())
    .then((dados) => {
      if (dados.status || dados.resposta) {
        const livro = dados.livro;
        // Preenchendo o formulário com os dados da tabela
        document.getElementById("id").value = livro.id;
        document.getElementById("cpf").value = livro.cliente.cpf;
        document.getElementById("nomeUsuario").value = livro.cliente.nome;
        document.getElementById("tituloLivro").value = livro.titulo;
        document.getElementById("autorLivro").value = livro.autor;
        // Após preenchimento, envia alteração direto
        if (
          confirm(
            `Deseja atualizar o pedido do cliente  CPF: ${livro.cliente.cpf}?`
          )
        ) {
          botoesEstado(false);
        } else {
          resetFormulario;
        }
      }
    })
    .catch((erro) => {
      alert("Erro ao buscar dados do cliente: " + erro.message);
    });
}

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
  document.getElementById("id").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("nomeUsuario").value = "";
  document.getElementById("tituloLivro").value = "";
  document.getElementById("autorLivro").value = "";
  document.getElementById("invalidForm").style.display = "none";
  botoesEstado(true);
}

function exibirTabelaPedidos() {
  const espacoTabela = document.getElementById("tabela");
  espacoTabela.innerHTML = "";
  const cpf = document.getElementById("cpf").value;

  if (cpf.length === 14) {
    var rota = `http://localhost:4000/livro/cpf/${cpf}`;
  } else {
    var rota = "http://localhost:4000/livro";
  }
  fetch(rota, { method: "GET" })
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
          <th>COD</th>
          <th>TITULO</th>
          <th>AUTOR</th>
          <th>CPF-CLIENTE</th>
          <th>NOME-CLIENTE</th>
          <th>AÇÕES</th>
          </tr>
          `;
        tabela.appendChild(cabecalho);
        const corpoTabela = document.createElement("tbody");

        for (const livro of dados.livros) {
          const linhaDados = document.createElement("tr");
          linhaDados.innerHTML = `<td>${livro.id}</td>
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.cliente.cpf}</td>
          <td>${livro.cliente.nome}</td>
          <td><div class="d-flex gap-2">
          <button type="button" class="btn btn-danger" onclick="excluirPedido('${livro.id}')" >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
          </svg></button>
          <button type="button" class="btn btn-secondary" onclick="prepararFormulario('${livro.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>   <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg></button>  </div>
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
