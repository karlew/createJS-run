var stage , C_W , C_H , loader ,heartNum;
var man , ground , sky;

function init(){
    stage = new createjs.Stage("mycanvas");
    stage.canvas.width = document.body.clientWidth;
    stage.canvas.height = document.body.clientHeight;
    C_W = stage.canvas.width;
    C_H = stage.canvas.height;
    heartNum = 3;

    var manifest = [
        {src:"image/doll.png" , id:"man"},
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
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,C_W,C_H);
    ctx.fillStyle = "#FFF";
    ctx.font = "25px";
    ctx.fillText("Loading...",C_W/2,C_H/2)
}

//地图数据 A为无台阶，B为低台阶，C为中台阶，D为高台阶
var mapData = [
    "DABAACACABACAADACA",
    "DABACACABACADACA",
    "DABACACABACADACA"
]

function handleComplete(){		//当图片素材load完后执行该方法
    var manImage = loader.getResult("man"),
        platform = loader.getResult("platform");

    sky = new createjs.Shape();
    sky.graphics.beginFill("#61beef").drawRect(0,0,C_W,C_H);
    stage.addChild(sky);

    mapHandle(platform);
    man = createMan(0,100,manImage);

    //该框为判定角色的判定区域
    kuang = new createjs.Shape();
    kuang.graphics.beginStroke("rgba(255,0,0,0.5)").drawRect(0 , 0 , man.size().w , man.picsize().h*1);

    

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);

    window.addEventListener("keydown" , function(event){
        event = event||window.event;
        if(event.keyCode===32&&man.jumpNum<man.jumpMax){
            man.jump();
        }
    })

    window.addEventListener("touchstart" , function(e){
        e.preventDefault();
        e.stopPropagation();
        if(man.jumpNum<man.jumpMax){
            man.jump();
        }
    })
}


var mapIndex = 0,		//地图序列
    Mix = 0,			//地图数组的索引
    allStones = [],		//存放所有的石头
    lastStone = null;	//存放最后一个石头

function mapHandle(platform){		//初始化地图
    allStones.length = 0;
    var stoneImage = platform,kind = null;
    for(var i=0;i<40;i++){			//把需要用到的石头预先放入容器中准备好
        switch(i){
            case 0:kind="A";break;
            case 10:kind="B";break;
            case 20:kind="C";break;
            case 30:kind="D";break;
        }
        var st = createStone(C_W , kind , stoneImage);
        allStones.push(st)
    }
    
    Mix = Math.floor(Math.random()*mapData.length);			//随机地图序列
    for(var i=0;i<8;i++){
        setStone(false)
    }
}

function setStone(remove){		//添加陆地的平台
    var arg = mapData[Mix].charAt(mapIndex)

    for(var z=0;z<allStones.length;z++){
        if(!allStones[z].shape.visible&&allStones[z].kind===arg){
            var st = allStones[z];
            st.shape.visible = true;
            st.shape.x = lastStone===null?0:lastStone.shape.x+lastStone.w;

            lastStone = st;
            break;
        }
    }

    mapIndex++;
    if(mapIndex>=mapData[Mix].length){
        Mix = Math.floor(Math.random()*mapData.length)
        mapIndex=0;
    }
}

function tick(event){		//舞台逐帧逻辑处理函数
    man.update();

    kuang.x = man.sprite.x+(man.picsize().w*1.5-man.size().w)/2;	//参考框
    kuang.y = man.sprite.y;

    man.ground.length=0;
    var cg = stoneHandle();

    if(man.ground[0]&&!cg) {
        man.ground.sort(function(a,b){return b.h-a.h});
        man.endy = man.ground[0].y-man.picsize().h*1.5;
    }

    stage.update(event)
}


function stoneHandle(){		//石头的逐帧处理  cg为判断当前角色的位置是否被阻挡，overStone是保存离开stage的石头块
    var cg = false , overStone = null;
    allStones.forEach(function(s){   //遍历石头，确定玩家落点
        if(s.shape.visible){
            s.update();

            if(s.shape.visible&&s.shape.x<=-s.w){
                overStone = s;
            }

            var distance = Math.abs((kuang.x+man.size().w/2)-(s.shape.x+s.w/2));
            if(distance<=(man.size().w+s.w)/2 && man.ground.indexOf(s)===-1){
                man.ground.push(s);

                if(s.y<(kuang.y+man.size().h-10)){
                    // man.sprite.x = s.shape.x-man.picsize().w-8;
                    cg = true;
                }
            }
        }
    });
    if(overStone) {
        setStone(true);
        overStone.shape.visible = false;
    }
    return cg;
}

init();