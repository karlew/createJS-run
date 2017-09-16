var stage , C_W , C_H , loader ,heartNum;
var doll , ground , sky;

function init(){
    stage = new createjs.Stage("mycanvas");
    stage.canvas.width = document.body.clientWidth;
    stage.canvas.height = document.body.clientHeight;
    C_W = stage.canvas.width;
    C_H = stage.canvas.height;
    heartNum = 3;

    var manifest = [
        {src:"image/doll.png" , id:"doll"},
        {src:"image/platform.png" , id:"platform"}
    ]

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete" , imgComplete);
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

//地图数据 A为无台阶，B为低台阶，C为中台阶，D为高台阶
var mapData = [
    "DABAACACABACAADACA",
    "DABACACABACADACABA",
    "DABACACABACADACADA"
]

function imgComplete(){		//当图片素材load完后执行该方法
    var dollImage = loader.getResult("doll"),
        platform = loader.getResult("platform");

    sky = new createjs.Shape();
    sky.graphics.beginFill("#61beef").drawRect(0,0,C_W,C_H);
    stage.addChild(sky);

    mapHandle(platform);
    doll = createDoll(0,100,dollImage);

    //该框为判定角色的判定区域
    coverage = new createjs.Shape();
    coverage.graphics.beginStroke("rgba(255,0,0,0.5)").drawRect(0 , 0 , doll.size().w , doll.picsize().h*1);

    

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);

    window.addEventListener("keydown" , function(event){
        event = event||window.event;
        if(event.keyCode===32&&doll.jumpNum<doll.jumpMax){
            doll.jump();
        }
    })

    stage.canvas.addEventListener("touchstart" , function(e){
        e.preventDefault();
        e.stopPropagation();
        if(doll.jumpNum<doll.jumpMax){
            doll.jump();
        }
    })
}


var mapIndex = 0,		//地图序列
    Mix = 0,			//地图数组的索引
    allPlatforms = [],		//存放所有的石头
    lastPlatform = null;	//存放最后一个石头

function mapHandle(platform){		//初始化地图
    allPlatforms.length = 0;
    var platformImage = platform,kind = null;
    for(var i=0;i<40;i++){			//把需要用到的石头预先放入容器中准备好
        switch(i){
            case 0:kind="A";break;
            case 10:kind="B";break;
            case 20:kind="C";break;
            case 30:kind="D";break;
        }
        var st = createPlatform(C_W , kind , platformImage);
        allPlatforms.push(st)
    }
    
    Mix = Math.floor(Math.random()*mapData.length);			//随机地图序列
    for(var i=0;i<16;i++){
        setPlatform(false)
    }
}

function setPlatform(remove){		//添加陆地的平台
    var arg = mapData[Mix].charAt(mapIndex)

    for(var z=0;z<allPlatforms.length;z++){
        if(!allPlatforms[z].shape.visible&&allPlatforms[z].kind===arg){
            var st = allPlatforms[z];
            st.shape.visible = true;
            st.shape.x = lastPlatform===null?0:lastPlatform.shape.x+lastPlatform.w;

            lastPlatform = st;
            break;
        }
    }

    mapIndex++;
    if(mapIndex>=mapData[Mix].length){
        Mix = Math.floor(Math.random()*mapData.length)
        mapIndex=0;
    }
}

function tick(event){		//舞台逐帧处理
    doll.update();

    coverage.x = doll.sprite.x+(doll.picsize().w*1.5-doll.size().w)/2;	
    coverage.y = doll.sprite.y;

    doll.ground.length=0;
    var stepOn = platformHandle();

    if(doll.ground[0]&&!stepOn) {
        doll.ground.sort(function(a,b){return b.h-a.h});
        doll.endy = doll.ground[0].y-doll.picsize().h*1.5;
    }

    stage.update(event)
}

//平台逐帧处理
function platformHandle(){		
    // stepOn为判断当前角色是否处于平台落点，overPlatform为需要从stage移除的平台
    var stepOn = false , 
    overPlatform = null;
    allPlatforms.forEach(function(s){ 
        if(s.shape.visible){
            s.update();

            if(s.shape.visible&&s.shape.x<=-s.w){
                overPlatform = s;
            }

            var distance = Math.abs((coverage.x+doll.size().w/2)-(s.shape.x+s.w/2));
            if(distance<=(doll.size().w+s.w)/2 && doll.ground.indexOf(s)===-1){
                doll.ground.push(s);

                if(s.y<(coverage.y+doll.size().h-10)){
                    stepOn = true;
                }
            }
        }
    });
    if(overPlatform) {
        setPlatform(true);
        overPlatform.shape.visible = false;
    }
    return stepOn;
}

var endFun = function() {
    console.log("game over")
}

init();