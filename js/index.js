var stage , C_W , C_H , loader ,heartNum = 3 ,canPlay = true;
var doll ,sky ,platform ,platformArr=[] ,platformX=0 ,platformS=-3 ,startPlatformX;

var stay = false;
var stayPlatform;

function init(){
    stage = new createjs.Stage("mycanvas");
    stage.canvas.width = document.body.clientWidth;
    stage.canvas.height = document.body.clientHeight;
    C_W = stage.canvas.width;
    C_H = stage.canvas.height;

    var manifest = [
        {src:"image/doll.png" , id:"doll"},
        {src:"image/platform.png" , id:"platform"}
    ]

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete" , handleComplete);
    loader.loadManifest(manifest);

    drawLoading();
}

function drawLoading(){
    var ctx = stage.canvas.getContext("2d");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#61beef";
    ctx.fillRect(0,0,C_W,C_H);
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Arial";
    ctx.fillText("Loading",C_W/2,C_H/2)
}

function handleComplete(){		//当图片素材load完后执行该方法
    var dollImage = loader.getResult("doll");
    var platformImage = loader.getResult("platform");

    sky = new createjs.Shape();
    sky.graphics.beginFill("#61beef").drawRect(0,0,C_W,C_H);
    stage.addChild(sky);

    for (var i = 0; i < 6; i++) {
        
        platform = createPlatform(platformX,platformImage);

        platformArr.push(platform);
        
    }

    doll = createDoll(0,C_H*0.4,dollImage);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", handleTick);

    window.addEventListener("keydown" , function(event){
        event = event||window.event;
        if(event.keyCode===32&&doll.jumpNum<doll.jumpMax){
            doll.jump();
            stay = false;
        }
    })

    stage.canvas.addEventListener("touchstart" , function(e){
        e.preventDefault();
        e.stopPropagation();
        if(doll.jumpNum<doll.jumpMax){
            doll.jump();
            stay = false;
        }
    })
}

function handleTick(){
    if(canPlay){
        platformX += platformS;

        platformArr.forEach(function(i){
            var dy = i.shape.y-doll.sprite.y-doll.picsize().h;
            var dx = Math.abs(i.shape.x+i.picsize().w/2-doll.sprite.x-doll.picsize().w/2);
            if(!stay){
                if(doll.vy>0&&dy>0&&dy<8&&dx<(i.picsize().w+doll.picsize().w)/2&&doll.sprite.currentAnimation!="run"){
                    doll.run();
                    stay = true;
                    stayPlatform = i;
                    console.log("stay")
                }
            }else{
                if(stayPlatform == i &&dx>(i.picsize().w+doll.picsize().w)/2&&doll.sprite.currentAnimation=="run"){
                    doll.vy = 0;
                    doll.jumpNum = 1;
                    doll.fall();
                    stay = false;
                }
            }

            i.update();

        });

        if(doll.sprite.currentAnimation!="run"){
            doll.update();
        }

        if(doll.sprite.y>C_H){
            document.getElementById("heart_img"+heartNum).style.display="none";
            if(heartNum>1){
                heartNum--;
                doll.reset();
            }else{
                endFun()
            }
        }

        stage.update(event)
    }
}

var endFun = function() {
    canPlay = false;
    console.log("game over")
}

init();