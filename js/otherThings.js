(function(w){
	var SPEED = 4

	//地上的石头类

	var Stone = function(x,kind,allImage){
		this.x = x;
		this.kind = kind;
		this.allImage = allImage;
		this.init();
	}

	var sp = Stone.prototype;

	sp.init=function(){
		this.shape = new createjs.Shape();
		if(this.kind!=="A"){
			this.h = this.allImage.height;
			this.w = this.allImage.width;
			if(this.kind=="B"){
				this.y = C_H - 300;
			}else if(this.kind=="C"){
				this.y = C_H - 400;
			}else if(this.kind=="D"){
				this.y = C_H - 450;
			}
			
			this.shape.graphics.beginBitmapFill(this.allImage).drawRect(0, 0, this.w, this.h);
			this.shape.setTransform(this.x, this.y, 1, 1);
		}else {
			this.h = -1000;
			this.w = 60;
			this.y = C_H - this.h;
			this.shape.graphics.beginFill("#000").drawRect(0, 0, this.w, this.h);
			this.shape.setTransform(this.x, this.y, 1, 1);
		}
		this.shape.visible = false;
		this.shape.cache(0 , 0 , this.w , this.h);
		stage.addChild(this.shape);
	}

	sp.update=function(){
		this.shape.x -= SPEED;
	}

	w.createStone = function(x,kind,allImage){
		return new Stone(x,kind,allImage);
	}
})(window)