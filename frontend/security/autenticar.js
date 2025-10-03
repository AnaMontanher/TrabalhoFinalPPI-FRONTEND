//Implementação de um função capaz de autenticar um usuário

export default function verificarAutenticacao(requisicao, resposta, proximo) {
  if (requisicao?.session?.autenticado) {
    // ?mesma coisa que: if(requisicao.session !=== undefined)
    proximo(); //permitir que o processamento continue
  } else {
    resposta.redirect("/login.html");
  }
}
