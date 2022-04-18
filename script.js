let nomeContato
let visibilidade
let usuario
let identificador = 0
let mensagens = []
let contatos = []

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

function criarChat() {
  axios
    .get('https://mock-api.driven.com.br/api/v6/uol/messages')
    .then(function (response) {
      for (let i = 0; i < response.data.length; i++) {
        mensagens.push(response.data[i])
      }
      renderizarMensagens(mensagens)
    })
}

function verificarChat() {
  axios
    .get('https://mock-api.driven.com.br/api/v6/uol/messages')
    .then(function (response) {
      function verificaSeAsMensagensSaoIguais(num) {
        if (
          mensagens[mensagens.length - 1 + num].from !==
            response.data[response.data.length - 1 + num].from ||
          mensagens[mensagens.length - 1 + num].text !==
            response.data[response.data.length - 1 + num].text ||
          mensagens[mensagens.length - 1 + num].time !==
            response.data[response.data.length - 1 + num].time ||
          mensagens[mensagens.length - 1 + num].to !==
            response.data[response.data.length - 1 + num].to ||
          mensagens[mensagens.length - 1 + num].type !==
            response.data[response.data.length - 1 + num].type
        ) {
          return false
        }
        return true
      }
      if (!verificaSeAsMensagensSaoIguais(0)) {
        const chat = document.querySelector('.chat')
        let numeroMensagensNovas = 0
        let mensagensNovas = []
        for (let i = 0; i < mensagens.length; i++) {
          if (
            mensagens[99].time === response.data[99 - i].time &&
            mensagens[99].text === response.data[99 - i].text
          ) {
            break
          }
          numeroMensagensNovas++
        }
        for (let i = numeroMensagensNovas; i > 0; i--) {
          chat.querySelector('div:first-child').remove()
          mensagensNovas.push(response.data[100 - i])
        }
        renderizarMensagens(mensagensNovas)
        for (let i = 0; i < numeroMensagensNovas; i++) {
          mensagens.shift()
          mensagens.push(mensagensNovas[i])
        }
      }
    })
}

function tratarSucesso() {
  document.querySelector('.login').value = ''
  criarChat()
  buscarContatos()
  setInterval(verificarChat, 3000)
  setInterval(function () {
    const reenviar = axios.post(
      'https://mock-api.driven.com.br/api/v6/uol/status',
      usuario
    )
    reenviar.then()
    reenviar.catch()
  }, 3000)
  setInterval(buscarContatos, 10000)
  document.querySelector('.loading').classList.add('escondido')
  document.querySelector('.container').classList.remove('escondido')
}

function tratarFalha() {
  document.querySelector('.loading').classList.add('escondido')
  document.querySelector('.telaLogin').classList.remove('escondido')
  alert('Esse nome já está em uso\nTente outro nome')
}

function renderizarMensagens(mensagens) {
  let localizar = document.querySelector('.chat')
  for (let i = 0; i < mensagens.length; i++) {
    if (mensagens[i].type === 'status') {
      localizar.innerHTML += `
        <div class = "status">
          <p><span style = "color: #afaeac;">(${mensagens[i].time})&nbsp;&nbsp;&nbsp;</span><span class = "nomeContato" onclick = "mensagemPrivada(this)" style = "cursor: pointer;"><strong>${mensagens[i].from}</strong></span>&nbsp;&nbsp;${mensagens[i].text}</p>
        </div>
      `
    }
    if (mensagens[i].type === 'message') {
      localizar.innerHTML += `
       <div class = "message">
         <p><span style = "color: #afaeac;">(${mensagens[i].time})&nbsp;&nbsp;&nbsp;</span><span class = "nomeContato" onclick = "mensagemPrivada(this)" style = "cursor: pointer;"><strong>${mensagens[i].from}</strong></span>&nbsp;para&nbsp;<strong>${mensagens[i].to}:</strong>&nbsp;${mensagens[i].text}</p>
       </div>
     `
    }
    if (mensagens[i].type === 'private_message') {
      localizar.innerHTML += `
       <div class = "private_message">
         <p><span style = "color: #afaeac;">(${mensagens[i].time})&nbsp;&nbsp;&nbsp;</span><span class = "nomeContato" onclick = "mensagemPrivada(this)" style = "cursor: pointer;"><strong>${mensagens[i].from}</strong></span>&nbsp;reservadamente&nbsp;para&nbsp;<strong>${mensagens[i].to}:</strong>&nbsp;${mensagens[i].text}</p>
       </div>
     `
    }
  }
  localizar
    .querySelector('div:last-child')
    .scrollIntoView({ behavior: 'smooth' })
}
function buscarContatos() {
  identificador++
  const promisse = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/participants'
  )
  promisse.then(function (response) {
    if (contatos.length === 0) {
      for (let i = 0; i < response.data.length; i++) {
        contatos.push(response.data[i])
      }
      for (let i = 0; i < contatos.length; i++) {
        contatos[i].id = `id${identificador}${i}`
      }
      renderizarContatos(contatos)
      return
    }
    const elementosQueIraoFicar = contatos.filter(function (arr) {
      for (let i = 0; i < response.data.length; i++) {
        if (arr.name === response.data[i].name) {
          return true
        }
      }
      return false
    })
    const removerContatosQueSairao = contatos.filter(function (arr) {
      for (let i = 0; i < elementosQueIraoFicar.length; i++) {
        if (elementosQueIraoFicar[i].name === arr.name) {
          return false
        }
      }
      return true
    })
    const renderizarNovosContatos = response.data.filter(function (arr) {
      for (let i = 0; i < elementosQueIraoFicar.length; i++) {
        if (elementosQueIraoFicar[i].name === arr.name) {
          return false
        }
      }
      return true
    })
    for (let i = 0; i < renderizarNovosContatos.length; i++) {
      renderizarNovosContatos[i].id = `id${identificador}${i}`
    }
    for (let i = 0; i < removerContatosQueSairao.length; i++) {
      document.querySelector(`.${removerContatosQueSairao[i].id}`).remove()
    }
    renderizarContatos(renderizarNovosContatos)
    contatos = []
    for (let i = 0; i < elementosQueIraoFicar.length; i++) {
      contatos.push(elementosQueIraoFicar[i])
    }
    for (let i = 0; i < renderizarNovosContatos.length; i++) {
      contatos.push(renderizarNovosContatos[i])
    }
  })
}
function renderizarContatos(contatos) {
  const localizar = document.querySelector('.contatos')
  if (identificador === 1) {
    localizar.innerHTML = `
    <div onclick="selecionarContato(this)">
      <div>
        <ion-icon name="people-sharp"></ion-icon>
        <h5>Todos</h5>
      </div>
      <ion-icon class="setinha selecionado1 defaultContatos" name="checkmark-sharp"></ion-icon>
    </div>
  `
  }
  for (let i = 0; i < contatos.length; i++) {
    localizar.innerHTML += `
      <div onclick = "selecionarContato(this)" class = "${contatos[i].id}">
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
  if (mensagem.value === '') {
    return
  }
  if (document.querySelector('.selecionado1') === null) {
    document.querySelector('.defaultContatos').classList.add('selecionado1')
    document.querySelector('.selecionado2').classList.remove('selecionado2')
    documento
      .querySelector('.defaultVisibilidade')
      .classList.add('selecionado2')
    alert(
      `${nomeContato} saiu da sala\nSua mensagem não será enviada\n\nConfiguração da mensagem: Todos (público)`
    )
    visibilidade = 'público'
    document.querySelector('.visibilidade').innerHTML = '(público)'
    document.querySelector('.contato').innerHTML = `Todos`
    nomeContato = 'Todos'
    mensagem.value = ''
    return
  }
  let para = 'Todos'
  let tipo = 'message'
  if (nomeContato !== undefined) {
    para = nomeContato
  }
  if (visibilidade === 'Reservadamente') {
    tipo = 'private_message'
  }
  let envio = {
    from: usuario.name,
    to: para,
    text: mensagem.value,
    type: tipo
  }
  const response = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/messages',
    envio
  )
  mensagem.value = ''
  response.then(verificarChat)
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
function selecionarContato(elemento) {
  if (elemento.querySelector('.setinha').classList.contains('selecionado1')) {
    elemento.querySelector('.setinha').classList.remove('selecionado1')
    document.querySelector('.defaultContatos').classList.add('selecionado1')
    document.querySelector('.contato').innerHTML = `Todos`
    nomeContato = 'Todos'
  } else {
    elemento.parentNode
      .querySelector('.selecionado1')
      .classList.remove('selecionado1')
    elemento.querySelector('.setinha').classList.add('selecionado1')
    nomeContato = elemento.querySelector('h5').innerHTML
    document.querySelector('.contato').innerHTML = `${nomeContato}`
  }
}
function selecionarVisibilidade(elemento) {
  if (elemento.querySelector('.setinha').classList.contains('selecionado2')) {
    elemento.querySelector('.setinha').classList.remove('selecionado2')
    document.querySelector('.defaultVisibilidade').classList.add('selecionado2')
    visibilidade = 'público'
    document.querySelector('.visibilidade').innerHTML = '(público)'
  } else {
    elemento.parentNode
      .querySelector('.selecionado2')
      .classList.remove('selecionado2')
    elemento.querySelector('.setinha').classList.add('selecionado2')
    visibilidade = elemento.querySelector('h5').innerHTML
    document.querySelector('.visibilidade').innerHTML = `(${visibilidade})`
  }
}
function mensagemPrivada(elemento) {
  const nomeContatoPrivado = elemento.querySelector('strong').innerHTML
  for (let i = 0; i < contatos.length; i++) {
    if (nomeContatoPrivado === contatos[i].name) {
      nomeContato = nomeContatoPrivado
      visibilidade = 'Reservadamente'
      document.querySelector('.contato').innerHTML = `${nomeContato}`
      document.querySelector('.visibilidade').innerHTML = `(${visibilidade})`
      if (document.querySelector('.selecionado1') === null) {
        document
          .querySelector('.contatos')
          .querySelector(`.${contatos[i].id}`)
          .querySelector('.setinha')
          .classList.add('selecionado1')
      }
      document.querySelector('.selecionado1').classList.remove('selecionado1')
      document
        .querySelector('.contatos')
        .querySelector(`.${contatos[i].id}`)
        .querySelector('.setinha')
        .classList.add('selecionado1')
      document.querySelector('.selecionado2').classList.remove('selecionado2')
      document
        .querySelector('.ajuste3')
        .querySelector('.setinha')
        .classList.add('selecionado2')
      return
    }
  }
}
