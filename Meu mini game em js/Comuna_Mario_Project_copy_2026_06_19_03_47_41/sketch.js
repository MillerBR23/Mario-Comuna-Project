//best score da fase 1(a unica na vdd kkk)
var bestScoreFase1 = 0
//parte da barra de vida (penultima implementação)
var vidaMax = 100
var vidaAtual = vidaMax
var tempoInvencivel=1000
var ultimoDano=0
// fim da fase
var fimDaFaseX = 2500

// parte dos buracos
var buracos = []
for(var x=600; x < fimDaFaseX; x += 400){
  buracos.push({x: x})
}

// rolagem infinita
var cameraX = 0

// chefe da fase1
var chefe = {x: 700, y: 520, largura: 40, altura: 40, ativo: false, direcao: -1, velocidade: 2}
var chefeFrameZero = 0
var chefeFrameUltimo = 0
var chefeIntervalo = 200
var tirosChefe=[]
var intervaloTiro=1500
var ultimoTiro=0

// inimigos secundários (eles vão rodear os buracos)
var inimigos = []
var inimigoFrameZero = 0
var inimigoFrameUltimo = 0
var inimigoIntervalo = 200

// parte das moedinhas ("rublos")
var rublos = []
for(var x=200; x < fimDaFaseX; x += 200) {
  var y = 480 + Math.random()*40
  rublos.push({x: x, y: y, coletada: false})
}
var points = 0

// parte do personagem e movimentação
var jogadorX = 100
var jogadorY = 500
var jogadorVY = 0
var jogadornochao = false
var chaoimg
var direcao = 1
var selected
var state
var frameZero = 0
var frameUltimo = 0
var intervalo = 150

// parte do menu e sprites
var img, img1, img2, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13,img14
var imgBuraco

function preload(){
  img = loadImage("Project Game 1.png")
  img1 = loadImage("New Image.png")
  img2 = loadImage("Phantom.png")
  img4 = loadImage("Teozin777.png")
  img5 = loadImage("Instruções.png")
  img6 = loadImage("gama.png")
  img7 = loadImage("chao2.png")
  img8 = loadImage("comunasteo.png")
  img9 = loadImage("art of pixel.png")
  img10 = loadImage("Rublo.png")
  img11 = loadImage("chefe 2.png")
  img12 = loadImage("inimigos21.png")
  img13 = loadImage("telaFim2.png")
  imgBuraco = loadImage("buraco.png")
  img14 = loadImage("cifrao.png")
}

// helper de colisão AABB (retângulo x retângulo), usado por tiros, inimigos e chefe
function colidiuAABB(x1, y1, w1, h1, x2, y2, w2, h2){
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}

function setup(){
  createCanvas(600,600)
  rectMode(CENTER)
  textAlign(CENTER,CENTER)
  selected = 0
  state = "Instruções"
  carregarBestScoreFase1()
  console.log("Best score carregado:", bestScoreFase1)

  // parte da movimentação dos inimigos secundarios
  for(let i=0; i<buracos.length; i++){
    let b = buracos[i]
    inimigos.push({x: b.x + 40, y: 535, largura: 40, altura: 40, direcao: 1, velocidade: 2, limiteEsquerda: b.x + 20, limiteDireita: b.x + 60})
    inimigos.push({x: b.x - 40, y: 535, largura: 40, altura: 40, direcao: -1, velocidade: 2, limiteEsquerda: b.x - 60, limiteDireita: b.x - 20})
  }
}

function draw(){
  background(img6)
  if(state == "menu"){
    drawMenu()
  }else if(state == "creditos"){
    drawCredits()
  }else if(state == "Instruções"){
    drawInstructions()
  }else if(state == "fase1"){
    drawFase1()
  }else if(state == "fim"){
    drawFim()
  }
}
function perderVida(dano){
  vidaAtual-=dano
  if(vidaAtual<0)vidaAtual=0
}
// toda a parte de score global
function salvarBestScoreFase1(pontos){
  let best = localStorage.getItem("bestScoreFase1")
  best = best ? Number(best) : 0
  console.log("Salvando score. Pontos:", pontos, "Melhor até agora:", best)
  if(pontos > best){
    localStorage.setItem("bestScoreFase1", pontos);
    bestScoreFase1 = pontos;
    console.log("Novo melhor score salvo:", pontos)
  } else {
    bestScoreFase1 = best;
    console.log("Score não atualizado, melhor permanece:", best)
  }
}
function carregarBestScoreFase1(){
  let best = localStorage.getItem("bestScoreFase1");
  bestScoreFase1 = best ? Number(best) : 0;
}
// toda a parte de barra de vida aqui
function desenharBarraVida(){
  var barraLargura = 120
  var barraAltura = 15
  var x = width-barraLargura/2 - 20
  var y = 20+barraAltura/2
   fill(150); 
  rect(x,y,barraLargura,barraAltura)
  fill(255,0,0);
  var larguraVida = map(vidaAtual,0,vidaMax,0,barraLargura)
  rect(x-barraLargura/2+larguraVida/2,y,larguraVida,barraAltura)
  fill(255)
  textSize(10)
  textAlign(CENTER,CENTER)
  text(floor(vidaAtual)+" / "+vidaMax,x,y)
}
function drawMenu(){
  if(selected == 0){
    image(img1, 245, 240, 110, 110)
  }else{
    image(img1, 250, 245, 100, 100)
  }
  if(selected == 1){
    image(img2, 245, 310, 110, 110)
  }else{
    image(img2, 250, 315, 100, 100)
  }
}

function drawCredits(){
  background(img4)
  fill("white")
  textSize(30)
  text("Feito Por:", 300, 200)
  text("Teozin777", 300, 250)
  text("Esc para voltar", 300, 350)
}

function drawInstructions(){
  background(img5)
}

function drawFim(){
  background(img13)
  fill("yellow")
  textSize(18)
  text("Pressione ESC para voltar ao Menu", width/2, height/2 + 20)
  textSize(24)
  text("Melhor Pontuação: "+bestScoreFase1,width/2,height/2-20)
  console.log("Melhor pontuação mostrada na tela fim:", bestScoreFase1)
}

function drawFase1(){
  background(img9)
  desenharBarraVida()
  // chefe
  if(chefe.ativo){
    if(millis()-ultimoTiro>intervaloTiro){
      tirosChefe.push({
        x:chefe.x,
        y:jogadorY-20,
        largura:10,
        altura:10,
        velocidade:4
      })
      ultimoTiro=millis()
    }
    chefe.x += chefe.velocidade * chefe.direcao
    if(chefe.x > 1150) chefe.direcao = -1
    if(chefe.x < 1050) chefe.direcao = 1
    var chefeFrameLargura = img11.width / 4
    var chefeFrameAltura = img11.height
    image(img11, chefe.x - cameraX - chefe.largura/2, chefe.y - chefe.altura, chefe.largura, chefe.altura, chefeFrameZero * chefeFrameLargura, 0, chefeFrameLargura, chefeFrameAltura)
    chefeFrameUltimo += deltaTime
    if(chefeFrameUltimo > chefeIntervalo){
      chefeFrameZero = (chefeFrameZero + 1) % 4
      chefeFrameUltimo = 0
    }
  }

  // movimentação dos inimigos com os obsatculos(essa parte aqui é a dos buracos)
  var inimigoFrameLargura = img12.width / 4
  var inimigoFrameAltura = img12.height
  for (var i = 0; i < inimigos.length; i++) {
    var inimigo = inimigos[i]
    image(img12, inimigo.x - cameraX - inimigo.largura / 2, inimigo.y - inimigo.altura, inimigo.largura, inimigo.altura, inimigoFrameZero * inimigoFrameLargura, 0, inimigoFrameLargura, inimigoFrameAltura)
    inimigo.x += inimigo.velocidade * inimigo.direcao
    if (inimigo.x < inimigo.limiteEsquerda || inimigo.x > inimigo.limiteDireita) {
      inimigo.direcao *= -1
    }
  }
  inimigoFrameUltimo += deltaTime
  if (inimigoFrameUltimo > inimigoIntervalo) {
    inimigoFrameZero = (inimigoFrameZero + 1) % 4
    inimigoFrameUltimo = 0
  }
  fill(255,100,100)
  // parte dos tiros do chefe
  for(var i=tirosChefe.length-1;i>=0;i--){
    var tiro = tirosChefe[i]
    tiro.x-= tiro.velocidade
    var tiroXNaTela = tiro.x-cameraX 
    image(img14,tiro.x-cameraX,tiro.y,tiro.largura,tiro.altura)
    var jogadorAltura=32
    var bateu = colidiuAABB(
      jogadorX - 16, jogadorY - jogadorAltura, 32, jogadorAltura,
      tiroXNaTela - tiro.largura/2, tiro.y - tiro.altura, tiro.largura, tiro.altura
    )
    if(bateu){
      if(millis()-ultimoDano>tempoInvencivel){
        perderVida(15)
        ultimoDano=millis()
      }
      tirosChefe.splice(i,1)
    }
    if(tiro.x-cameraX<-50){
      tirosChefe.splice(i,1)
    }
  }
   
  // chão rolando (desenha só os tiles necessários pra cobrir a tela)
  var chaoOffset = cameraX % img7.width
  for(var i = -chaoOffset; i < width; i += img7.width){
    image(img7, i, 520, 600, 80)
  }

  // desenha buracos
  for(var i = 0; i < buracos.length; i++){
    var b = buracos[i]
    var xTela = b.x - cameraX
    image(imgBuraco, xTela - 32, 520, 64, 32)
  }

  // moedinhas ("rublos")
  for(var i=0; i < rublos.length; i++){
    var rublo = rublos[i]
    if(!rublo.coletada){
      image(img10, rublo.x - cameraX - 10, rublo.y - 10, 20, 20)
    }
    var d = dist(jogadorX, jogadorY, rublo.x - cameraX, rublo.y)
    if(d < 20 && !rublo.coletada){
      rublo.coletada = true
      points += 1
      console.log("Rublo coletado! points:", points)
    }
  }

  if(cameraX>=1500 && !chefe.ativo){
    chefe.ativo = true
    chefe.x = fimDaFaseX-100
  }
  fill("white")
  textSize(16)
  text("Rublos: " + points, 60, 27)

  jogadorVY += 1
  jogadorY += jogadorVY
  jogadornochao = false

  // limite chão
  if(jogadorY > 535){
    jogadorY = 535
    jogadorVY = 0
    jogadornochao = true
  }

  // colisão com buracos (se cair no buraco, reseta o jogo)
  for(var i=0; i < buracos.length; i++){
    var b = buracos[i]
    var buracoEsq = b.x - 32 - cameraX
    var buracoDir = b.x + 32 - cameraX
    if(jogadorX > buracoEsq && jogadorX < buracoDir && jogadorY >= 535){
      resetarJogo()
    }
  }

  // colisão com inimigos secundários
  if(!chefe.ativo){
    for(var i=0; i < inimigos.length; i++){
      var inimigo = inimigos[i]
      var inimigoXNaTela = inimigo.x-cameraX
      var jogadorAltura = 32
      var bateu = colidiuAABB(
        jogadorX - 16, jogadorY - jogadorAltura, 32, jogadorAltura,
        inimigoXNaTela - inimigo.largura/2, inimigo.y - inimigo.altura, inimigo.largura, inimigo.altura
      )
      if(bateu){
        let agora = millis()
        if(agora-ultimoDano>tempoInvencivel){
          perderVida(10)
          ultimoDano=agora
        }
      }
    }
  }

  // colisão com chefe
  if(chefe.ativo){
    var chefeXNaTela = chefe.x-cameraX
    var jogadorAltura = 32
    var bateuNoChefe = colidiuAABB(
      jogadorX - 16, jogadorY - jogadorAltura, 32, jogadorAltura,
      chefeXNaTela - chefe.largura/2, chefe.y - chefe.altura, chefe.largura, chefe.altura
    )
    if(bateuNoChefe){
      state = "fim"
    }
  }

  // controle do personagem
  var andar = false
  if(keyIsDown(LEFT_ARROW)){
    cameraX = max(0, cameraX - 5)
    andar = true
    direcao = -1
  }
  if(keyIsDown(RIGHT_ARROW)){
    cameraX += 5
    andar = true
    direcao = 1
  }
  if(keyIsDown(UP_ARROW) && jogadornochao){
    jogadorVY = -15
    jogadornochao = false
  }

  if(andar){
    frameUltimo += deltaTime
    if(frameUltimo > intervalo){
      frameZero = (frameZero + 1) % 4
      frameUltimo = 0
    }
  }

  // desenha personagem
  var frameLargura = img8.width / 4
  var frameAltura = img8.height
  push()
  translate(jogadorX, jogadorY)
  scale(direcao, 1)
  image(img8, -16 * direcao, -32, 32 * direcao, 32, frameZero * frameLargura, 0, frameLargura, frameAltura)
  pop()

  fill("white")
  textSize(16)
  text("ESC volta pro menu", width/2, 27)

  if(cameraX >= fimDaFaseX - 100&&state!="fim"){
    salvarBestScoreFase1(points)
    state = "fim"
  }
}

function resetarJogo(){
  points = 0
  for(var j=0; j < rublos.length; j++){
    rublos[j].coletada = false
  }
  chefe.ativo = false
  jogadorX = 100
  jogadorY = 500
  jogadorVY = 0
  jogadornochao = false
  cameraX = 0
  }
 //voltar para a fase 1
  function iniciarFase(){
    resetarJogo()
    vidaAtual = vidaMax
    tirosChefe = []
    ultimoDano = 0
    ultimoTiro = 0
    chefe.ativo = false
    frameUltimo = 0
    state = "fase1"

  // recriar inimigos ao redor dos buracos
  inimigos = []
  for(let i=0; i<buracos.length; i++){
    let b = buracos[i]
    inimigos.push({x: b.x + 40, y: 535, largura: 40, altura: 40, direcao: 1, velocidade: 2, limiteEsquerda: b.x + 20, limiteDireita: b.x + 60})
    inimigos.push({x: b.x - 40, y: 535, largura: 40, altura: 40, direcao: -1, velocidade: 2, limiteEsquerda: b.x - 60, limiteDireita: b.x - 20})
  }
}

function keyPressed(){
  if(state == "menu"){
    if(keyCode == UP_ARROW){
      selected = (selected - 1 + 2) % 2
    } else if(keyCode == DOWN_ARROW){
      selected = (selected + 1) % 2
    } else if(keyCode == ENTER){
      if(selected == 0){
        iniciarFase()
      } else if(selected == 1){
        state = "creditos"
      }
    }
  } else if(keyCode == ESCAPE){
    state = "menu"
  } else if(state == "Instruções"){
    if(keyCode == ENTER){
      state = "menu"
    }
  }
  if(state=="fim"&&keyCode==ENTER){
    iniciarFase()
  }
}