function start() {

    $("#inicio").hide();
    
    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();
    
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    reiniciarInimigo1();
    reiniciarInimigo2();
	reiniciarAmigo();
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    
    let jogo = {};
    let deslocamentoInimigo = 4;
    let deslocamentoJogador = 5;
    let deslocamentoAmigo = 1;
    let direcaoYInimigo1 = "Cima";
    let podeAtirar = true;
    let fimdejogo = false;
    let pontos = 0;
    let salvos = 0;
    let perdidos = 0;
    let energiaAtual=3;
    let TECLA = {
        UP: 38,
        DOWN: 40,
        RIGHT: 39,
        LEFT: 37,
        W: 87,
        S: 83,
        A: 65,
        D: 68,
        SPACE: 32
    };
    jogo.pressionou = [];

    let somDisparo = document.getElementById("somDisparo");
    let somExplosao = document.getElementById("somExplosao");
    let musica = document.getElementById("musica");
    let somGameover = document.getElementById("somGameover");
    let somPerdido = document.getElementById("somPerdido");
    let somResgate = document.getElementById("somResgate");

    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

	$(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
    
    jogo.timer = setInterval(loop, 30);

    function loop() {
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }

    function movefundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esquerda - 1);
    } 
    
    function movejogador() {
        if (jogo.pressionou[TECLA.W] || jogo.pressionou[TECLA.UP]) {
            moveCima("jogador");
        }

        if (jogo.pressionou[TECLA.S] || jogo.pressionou[TECLA.DOWN]) {
            moveBaixo("jogador");
        }

        if (jogo.pressionou[TECLA.D] || jogo.pressionou[TECLA.RIGHT]) {
            moveDireita("jogador");
        }

        if (jogo.pressionou[TECLA.A] || jogo.pressionou[TECLA.LEFT]) {
            moveEsquerda("jogador");
        }
        
        if (jogo.pressionou[TECLA.SPACE]) {
            disparo();
        }
    } 

    function moveinimigo1() {
        
        let posicaoX = parseInt($("#inimigo1").css("left"));
        let posicaoJogadorY = parseInt($("#jogador").css("top"));
        let posicaoY = parseInt($("#inimigo1").css("top"));
        
        if (posicaoJogadorY >= (posicaoY + 50)) {
            direcaoYInimigo1 = "Baixo";
        }

        if (posicaoJogadorY <= (posicaoY - 50)) {
            direcaoYInimigo1 = "Cima";
        }

        moveEsquerda("inimigo1", 2);
        if (direcaoYInimigo1 === "Baixo") {
            moveBaixo("inimigo1", 2);
        }
        else if (direcaoYInimigo1 === "Cima") {
            moveCima("inimigo1", 2);
        }

        if (posicaoX <= 15) {
            $("#inimigo1").remove();
            reiniciarInimigo1();
        }
    }

    
    function moveinimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        moveEsquerda("inimigo2", 2);
        if (posicaoX <= 10) {
            $("#inimigo2").remove();
            reiniciarInimigo2();
        }
    }

    function moveamigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        moveDireita("amigo", 3);
        if (posicaoX > 906) {
            $("#amigo").remove();
            reiniciarAmigo();
        }
    }

    function disparo() {
	
        if (podeAtirar === true) {
            somDisparo.play();
            podeAtirar = false;
            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);
            let tempoDisparo = window.setInterval(executaDisparo, 30);
        }
     
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15); 
            if (posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    function colisao() {

        let colisao1 = ($("#jogador").collision($("#inimigo1")));
        let colisao2 = ($("#jogador").collision($("#inimigo2")));
        let colisao3 = ($("#disparo").collision($("#inimigo1")));
        let colisao4 = ($("#disparo").collision($("#inimigo2")));
        let colisao5 = ($("#jogador").collision($("#amigo")));
        let colisao6 = ($("#inimigo2").collision($("#amigo")));
        let colisao7 = ($("#inimigo1").collision($("#amigo")));

        if (colisao1.length > 0) {
            somExplosao.play();
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
        }

        if (colisao2.length > 0) {
            somExplosao.play();
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
        }

        if (colisao3.length > 0) {
            somExplosao.play();
            deslocamentoInimigo += 0.2;
            pontos = pontos + 100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);
        }

        if (colisao4.length > 0) {
            somExplosao.play();
            deslocamentoInimigo += 0.2;
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);
        }

        if (colisao5.length > 0) {
            somResgate.play();
            salvos++;
            $("#amigo").remove();
            reiniciarAmigo();
        }

        if (colisao6.length > 0) {
            somPerdido.play();
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
        }

        if (colisao7.length > 0) {
            somPerdido.play();
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
        }
    }

    function explosao1(inimigo1X,inimigo1Y) {
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(img/explosao.png)");
        let div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");
        $("#inimigo1").remove();
        let tempoExplosao = window.setInterval(removeExplosao, 1000);
        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao=null;
            reiniciarInimigo1();
        }
        
    }

    function explosao2(inimigo2X,inimigo2Y) {
	
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(img/explosao.png)");
        let div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        $("#inimigo2").remove();
        let tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
        
        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2=null;
            reiniciarInimigo2();
        }
    }

    function explosao3(amigoX,amigoY) {
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        $("#amigo").remove();
        let tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3=null;
            $("#inimigo2").remove();
            reiniciarInimigo2();
            reiniciarAmigo();
        }
    } 

    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    function energia() {
		if (energiaAtual==3) {
			$("#energia").css("background-image", "url(img/energia3.png)");
		}
		if (energiaAtual==2) {
			$("#energia").css("background-image", "url(img/energia2.png)");
		}
		if (energiaAtual==1) {
			$("#energia").css("background-image", "url(img/energia1.png)");
		}
		if (energiaAtual==0) {
			$("#energia").css("background-image", "url(img/energia0.png)");
			gameOver();
		}
    }
    
    function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick='reiniciaJogo()'><h3>Jogar Novamente</h3></div>");
    }

    function reiniciarInimigo1() {
        $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
        $("#inimigo1").css("left", 900);
    }

    function reiniciarInimigo2() {
        $("#fundoGame").append("<div id='inimigo2'></div>");
        $("#inimigo2").css("left", 950);
    }

    function reiniciarAmigo() {
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
        $("#amigo").css("left", 0);
    }

    function moveCima(frame, tipo=1){
        let topo = parseInt($("#" + frame).css("top"));
        let deslocamento = retornaDelocamento(tipo);
        if (topo > 10) {
            $("#" + frame).css("top", topo - deslocamento);
        }
    }

    function moveBaixo(frame, tipo=1){
        let topo = parseInt($("#" + frame).css("top"));
        let deslocamento = retornaDelocamento(tipo);
        if (topo < 420) {
            $("#" + frame).css("top", topo + deslocamento);
        }
    }

    function moveDireita(frame, tipo=1){
        let left = parseInt($("#" + frame).css("left"));
        let deslocamento = retornaDelocamento(tipo);
        if (left < 680) {
            $("#" + frame).css("left", left + deslocamento);	
        }
    }

    function moveEsquerda(frame, tipo=1){
        let left = parseInt($("#" + frame).css("left"));
        let deslocamento = retornaDelocamento(tipo);
        if (left > 5) {
            $("#" + frame).css("left", left - deslocamento);	
        }
    }

    function retornaDelocamento(tipo) {
        return tipo===1?deslocamentoJogador:(tipo===2?deslocamentoInimigo:deslocamentoAmigo);
    }
}

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}