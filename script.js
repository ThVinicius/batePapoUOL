let nome = prompt('Qual é seu nome?')
let usuario = { name: nome }
entrarSala()
carregarMensagem()
function entrarSala() {
  const enviar = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants',
    usuario
  )
  enviar.then(tratarSucesso)
  enviar.catch(tratarFalha)
  setInterval(function () {
    const reenviar = axios.post(
      'https://mock-api.driven.com.br/api/v6/uol/status',
      usuario
    )
    reenviar.then(tratarSucesso)
    reenviar.catch(tratarFalha)
  }, 3000)
}
function tratarSucesso() {
  console.log('enviado')
}
function tratarFalha() {
  console.log('deu ruim')
}
function carregarMensagem() {
  const promisse = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/messages'
  )
  promisse.then(renderizar)
}
setInterval(function atulizarChat() {
  console.log('chat novo')
  axios
    .get('https://mock-api.driven.com.br/api/v6/uol/messages')
    .then(renderizar)
}, 3000)

function renderizar(texto) {
  let localizar = document.querySelector('.chat')
  localizar.innerHTML = ''
  for (let i = 0; i < texto.data.length; i++) {
    if (texto.data[i].type === 'status') {
      localizar.innerHTML += `
        <div class = "status">
          <p><span>(${texto.data[i].time})&nbsp;&nbsp;&nbsp;</span><strong>${texto.data[i].from}</strong>&nbsp;&nbsp;${texto.data[i].text}</p>
        </div>
      `
    }
    if (texto.data[i].type === 'message') {
      localizar.innerHTML += `
       <div class = "message">
         <p><span>(${texto.data[i].time})&nbsp;&nbsp;&nbsp;</span><strong> ${texto.data[i].from} </strong>&nbsp;para&nbsp;<strong>${texto.data[i].to}:</strong>&nbsp;${texto.data[i].text}</p>
       </div>
     `
    }
    if (texto.data[i].type === 'private_message') {
      localizar.innerHTML += `
       <div class = "private_message">
         <p><span>(${texto.data[i].time})&nbsp;&nbsp;&nbsp;</span><strong>${texto.data[i].from}</strong>&nbsp;reservadamente&nbsp;para&nbsp;<strong>${texto.data[i].to}:</strong>&nbsp;${texto.data[i].text}</p>
       </div>
     `
    }
  }
}
function enviarMensagem() {
  let mensagem = document.querySelector('input')
  let envio = {
    from: usuario.name,
    to: 'todos',
    text: mensagem.value,
    type: 'message'
  }
  const response = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/messages',
    envio
  )
  mensagem.value = ''
  response.then(carregarMensagem)
  response.catch(atualizarPagina)
}
function atualizarPagina() {
  window.location.reload()
}
