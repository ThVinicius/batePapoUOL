// let nome = prompt('Qual é seu nome?')
let usuario
function login() {
  document.querySelector('.loading').classList.remove('escondido')
  document.querySelector('.telaLogin').classList.add('escondido')
  let nome = document.querySelector('.login')
  usuario = { name: nome.value }
  const enviar = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants',
    usuario
  )
  enviar.then(tratarSucesso)
  enviar.catch(tratarFalha)
}
let mensagens = []
let contatos = []
// entrarSala()
function criarChat() {
  axios
    .get('https://mock-api.driven.com.br/api/v6/uol/messages')
    .then(function (response) {
      for (let i = 0; i < 100; i++) {
        mensagens.push(response.data[i])
      }
      renderizarMensagens(mensagens)
    })
}
function verificarArray() {
  axios
    .get('https://mock-api.driven.com.br/api/v6/uol/messages')
    .then(function (response) {
      if (
        mensagens[0].from !== response.data[0].from ||
        mensagens[0].text !== response.data[0].text ||
        mensagens[0].time !== response.data[0].time ||
        mensagens[0].to !== response.data[0].to ||
        mensagens[0].type !== response.data[0].type
      ) {
        for (let i = mensagens.length; i > 0; i--) {
          mensagens.pop()
        }
        for (let i = 0; i < response.data.length; i++) {
          mensagens.push(response.data[i])
        }
        renderizarMensagens(mensagens)
      }
    })
}
function tratarSucesso() {
  document.querySelector('.login').value = ''
  document.querySelector('.loading').classList.add('escondido')
  document.querySelector('.container').classList.remove('escondido')
  criarChat()
  buscarContatos()
  setInterval(verificarArray, 3000)
  setInterval(function () {
    const reenviar = axios.post(
      'https://mock-api.driven.com.br/api/v6/uol/status',
      usuario
    )
    reenviar.then()
    reenviar.catch()
  }, 3500)
  setInterval(buscarContatos, 10000)
}
function tratarFalha() {
  document.querySelector('.loading').classList.add('escondido')
  document.querySelector('.telaLogin').classList.remove('escondido')
  alert('Esse nome já está em uso\nTente outro nome')
}

function renderizarMensagens(mensagens) {
  let localizar = document.querySelector('.chat')
  localizar.innerHTML = ''
  for (let i = 0; i < mensagens.length; i++) {
    if (mensagens[i].type === 'status') {
      localizar.innerHTML += `
        <div class = "status">
          <p><span>(${mensagens[i].time})&nbsp;&nbsp;&nbsp;</span><strong>${mensagens[i].from}</strong>&nbsp;&nbsp;${mensagens[i].text}</p>
        </div>
      `
    }
    if (mensagens[i].type === 'message') {
      localizar.innerHTML += `
       <div class = "message">
         <p><span>(${mensagens[i].time})&nbsp;&nbsp;&nbsp;</span><strong> ${mensagens[i].from} </strong>&nbsp;para&nbsp;<strong>${mensagens[i].to}:</strong>&nbsp;${mensagens[i].text}</p>
       </div>
     `
    }
    if (mensagens[i].type === 'private_message') {
      localizar.innerHTML += `
       <div class = "private_message">
         <p><span>(${mensagens[i].time})&nbsp;&nbsp;&nbsp;</span><strong>${mensagens[i].from}</strong>&nbsp;reservadamente&nbsp;para&nbsp;<strong>${mensagens[i].to}:</strong>&nbsp;${mensagens[i].text}</p>
       </div>
     `
    }
  }
  localizar
    .querySelector('div:last-child')
    .scrollIntoView({ behavior: 'smooth' })
}
function buscarContatos() {
  if (contatos.length > 0) {
    for (let i = contatos.length; i > 0; i--) {
      contatos.pop()
    }
  }
  const promisse = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/participants'
  )
  promisse.then(function (response) {
    for (let i = 0; i < response.data.length; i++) {
      contatos.push(response.data[i])
    }
    renderizarContatos(contatos)
  })
}
function renderizarContatos(contatos) {
  const localizar = document.querySelector('.contatos')
  localizar.innerHTML = ''
  for (let i = 0; i < contatos.length; i++) {
    localizar.innerHTML += `
      <div onclick = "selecionar(this)">
        <div>
          <ion-icon name="person-circle"></ion-icon>
          <h5>${contatos[i].name}</h5>
        </div>
        <ion-icon class="setinha" name="checkmark-sharp"></ion-icon>
      </div>
    `
  }
}
function enviarMensagem() {
  let mensagem = document.querySelector('.mensagem')
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
  response.then(verificarArray)
  response.catch(atualizarPagina)
}
function atualizarPagina() {
  window.location.reload()
}

function esconder() {
  document.querySelector('.menu').classList.toggle('escondido')
}
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const btn = document
      .querySelector('.caixaMensagem')
      .querySelector('ion-icon')
    btn.click()
  }
})
function compararContatos(arr) {
  if (contatos[0] !== arr.data[0]) {
    for (let i = 0; i < contatos.length; i++) {
      contatos.shift()
    }
  }
}
function selecionar(elemento) {
  elemento.querySelector('.setinha').classList.add('selecionado')
}
