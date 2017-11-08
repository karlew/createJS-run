(function(w){
	var ITEM_SCALE = 1;	//缩放比例

	//平台类

	var ITEM = function(x , img){
		this.sigleX = img.width;
		this.sigleY = img.height;
		this.x = x;
		this.y = C_H*0.6 + Math.random()*100;
		this.init(img);
	}

	ITEM.prototype = {
		init:function(img){
			this.shape = new createjs.Shape();
			this.shape.graphics.beginBitmapFill(img).drawRect(0, 0, this.sigleX, this.sigleY);
			this.shape.setTransform(this.x, this.y, ITEM_SCALE, ITEM_SCALE);
			this.child = stage.addChild(this.shape);
			platformX += this.sigleX*1.5 + Math.random()*40;
        	startPlatformX = platformX;
		},

		update:function(){
			this.shape.x += platformS;

			if(this.shape.x<-this.sigleX*ITEM_SCALE-10){
				this.shape.y = C_H*0.6 + Math.random()*100;
				this.shape.x = platformX;
				platformX += this.sigleX*1.5 + Math.random()*40;
        		startPlatformX = platformX;
			}
		},

		picsize:function(){
			return {
				w:this.sigleX*ITEM_SCALE,
				h:this.sigleY*ITEM_SCALE
			}
		}
	}

	w.createPlatform = function(x,img){
		return new ITEM(x,img);
	}
})(window)