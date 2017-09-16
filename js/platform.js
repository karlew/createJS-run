(function(w){
	var SPEED = 4

	//平台类

	var Platform = function(x,kind,allImage){
		this.x = x;
		this.kind = kind;
		this.allImage = allImage;
		this.init();
	}

	var pp = Platform.prototype;

	pp.init=function(){
		this.shape = new createjs.Shape();
		//根据设置的序列将平台放入容器
		if(this.kind!=="A"){
			this.h = this.allImage.height;
			this.w = this.allImage.width;
			if(this.kind=="B"){
				this.y = C_H - 200;
			}else if(this.kind=="C"){
				this.y = C_H - 300;
			}else if(this.kind=="D"){
				this.y = C_H - 350;
			}
			
			this.shape.graphics.beginBitmapFill(this.allImage).drawRect(0, 0, this.w, this.h);
			this.shape.setTransform(this.x, this.y, 1, 1);
		}else {
			//无平台的情况
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

	pp.update=function(){
		this.shape.x -= SPEED;
	}

	w.createPlatform = function(x,kind,allImage){
		return new Platform(x,kind,allImage);
	}
})(window)