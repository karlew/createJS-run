(function(w){
	var FRAME_RATE = 10,	//精灵表播放速度
		GRAVITY = 0.3,		//重力加速度
		JUMP_SPEED = -6,		//跳跃垂直速度
		COUNT = 13,			//序列帧每行图片数
		SCALE_DOLL = 0.2;	//人物的缩放比例

	var Doll = function(x , y , img){
		this.sigleX = img.width/COUNT;
		this.sigleY = img.height;
		this.x = x;
		this.y = y;
		this.vy = 0;
		this.state = "fall";
		this.jumpNum = 1;
		this.jumpMax = 2;
		this.init(img);
	}

	Doll.prototype = {
		init:function(img){
			//动作序列设置
			var dollSpriteSheet = new createjs.SpriteSheet({
				"images":[img],
				"frames":{"regX":0,"regY":1,"width":this.sigleX,"height":this.sigleY,"count":COUNT},
				"animations":{
					"run":{
						frames:[0,1,2,3,4,5,6,7,8,9],
						next:"run",
						speed:0.2
					}, 
					"jump":{
						frames:[10]
					},
					"suspend":{
						frames:[11]
					},
					"fall":{
						frames:[12]
					}
				}
			});
			this.sprite = new createjs.Sprite(dollSpriteSheet , this.state);
			this.sprite.framerate = FRAME_RATE;
			this.sprite.setTransform(this.x, this.y, SCALE_DOLL, SCALE_DOLL);
			stage.addChild(this.sprite);
		},

		update:function(){
			this.vy += GRAVITY;
			this.sprite.y += this.vy ;
			if(this.sprite.currentAnimation=="jump"&&this.vy>-1){
				this.suspend();
			}else if(this.sprite.currentAnimation=="suspend"&&this.vy>1){
				this.fall();
			}

		},

		run:function(){
			this.jumpNum = 0;
			this.sprite.gotoAndPlay("run")
		},

		jump:function(){
			this.vy = JUMP_SPEED;
			this.sprite.gotoAndPlay("jump");
			this.jumpNum++;
		},

		suspend:function(){
			this.sprite.gotoAndPlay("suspend")
		},

		fall:function(){
			this.sprite.gotoAndPlay("fall")
		},

		reset:function(){
			this.sprite.x = this.x;
			this.sprite.y = this.y;
			this.jumpNum = 1;
			this.vy = 0;
		},

		picsize:function(){
			return {
				w:this.sigleX*SCALE_DOLL,
				h:this.sigleY*SCALE_DOLL
			}
		}
	}

	w.createDoll = function(x , y , img){
		return new Doll(x , y , img)
	};
})(window)