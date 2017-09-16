(function(w){
	var FRAME_RATE = 13,	//精灵表播放速度
		SCALE_X = 1.5,	//X轴缩放
		SCALE_Y = 1.5,	//Y轴缩放
		GRAVITY = 15,	//重力加速度
		JUMP_SPEED = 5,		//垂直速度
		WIDTH = 40,			//序列帧人物的判定有效区域宽
		HEIGHT = 96,		//序列帧人物的判定有效区域宽
		PICWIDTH = 300,		//序列帧每张动作的宽
		PICHEIGHT = 300,	//序列帧每张动作的高
		SCALE_DOLL = 0.2,	//人物的缩放比例
		PROPORTION = 150/1;  //游戏与实际的距离比例

	var Doll = function(x , y , img){
		this.x = x;
		this.y = y;
		this.endy = y;
		this.vx = 0.5;
		this.vy = 0;
		this.ground = [];
		this.state = "run";
		this.jumpNum = 0;
		this.jumpMax = 2;
		this.init(img);
	}

	Doll.prototype = {
		constructors:Doll,

		init:function(img){
			//动作序列设置
			var dollSpriteSheet = new createjs.SpriteSheet({
				"images":[img],
				"frames":{"regX":0,"regY":1,"width":PICWIDTH,"height":PICHEIGHT,"count":13},
				"animations":{
					"run":{
						frames:[0,1,2,3,4,5,6,7,8,9],
						next:"run",
						speed:1,
					}, 
					"jump":{
						frames:[10,10,10,11,11,12,12,12,12,12,12,12,12,12],
						next:"jump",
						speed:1,
					},
					"fall":{
						frames:[12],
						next:"fall",
						speed:1,
					}
				}
			});
			this.sprite = new createjs.Sprite(dollSpriteSheet , this.state);
			this.sprite.framerate = FRAME_RATE;
			this.sprite.setTransform(this.x, this.y, SCALE_X*SCALE_DOLL, SCALE_Y*SCALE_DOLL);
			stage.addChild(this.sprite);
		},

		update:function(){
			var sprite = this.sprite;
			var time = createjs.Ticker.getInterval()/1000;

			if(this.state==="run"){
				if(sprite.x<this.x){
					sprite.x +=this.vx;
				}else {
					sprite.x = this.x
				}
			}
			if(this.endy>sprite.y||this.state==="jump"){
				if(this.state!="jump"&&this.state!="fall"){
					this.state = "fall";
					this.fall()
				}
				var nexty = sprite.y+time*this.vy*PROPORTION;
				this.vy += time*GRAVITY;
				sprite.y += time*this.vy*PROPORTION;
				if(Math.abs(sprite.y-this.endy)<10&&this.vy>0){
					this.state = "run";
					this.run()
					sprite.y=this.endy;
					this.vy = 0;
				}
			}
			
			if(sprite.y>C_H+60){
				document.getElementById("heart_img"+heartNum).style.display="none";
				heartNum--;
				if(heartNum == 0){
					this.state = "die";
					createjs.Ticker.reset();
					endFun()	
				}else{
					sprite.x = 0;
					sprite.y = 100;
					this.vy = 0;
				}
			}

			switch(this.state){
				case "run":
					this.jumpNum = 0;
					break;
				case "die":
					if(sprite.currentFrame===0){
						sprite.paused = true;
					}
				break;
			}
		},

		run:function(){
			this.sprite.gotoAndPlay("run")
		},

		jump:function(){
			this.vy = -JUMP_SPEED;
			this.state = "jump";
			this.sprite.gotoAndPlay("jump");
			this.jumpNum++;
		},

		fall:function(){
			this.vy = 0;
			this.sprite.gotoAndPlay("fall")
			this.jumpNum++;
		},

		size:function(){
			return {
				w:WIDTH,
				h:HEIGHT
			}
		},

		picsize:function(){
			return {
				w:PICWIDTH*SCALE_DOLL,
				h:PICHEIGHT*SCALE_DOLL
			}
		}
	}

	w.createDoll = function(x , y , img){
		return new Doll(x , y , img)
	};
})(window)