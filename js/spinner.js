class Spinner {
    constructor (x,y,w,h,options,font){
        this.optionGroup = game.add.group();
        this.group = game.add.group();
        this.height = h;
        this.width = w;
        this.x = x;
        this.y = y;
        this.font = font;

        this.leftArrow = game.add.button(x,y,"left_arrow");
        this.leftArrow.scale.setTo(h/this.leftArrow.width,h/this.leftArrow.height);
        this.leftArrow.anchor.setTo(0,0);
        this.group.add(this.leftArrow);

        this.rightArrow = game.add.button(x + w,y,"right_arrow");
        this.rightArrow.scale.setTo(h/this.rightArrow.width,h/this.rightArrow.height);
        this.rightArrow.anchor.setTo(1,0);
        this.group.add(this.rightArrow);

        this.selected = 0;
        this.options = options;

        this.update = function(){
            this.changing = false;
            this.optionGroup.removeAll(true);
            this.text = game.add.bitmapText(x + w / 2, y + h / 2, font,this.value(),34);
            this.text.anchor.x = .5;
            this.text.anchor.y = .5;
            this.text.scale.setTo(h / this.text.height,h / this.text.height);
            this.optionGroup.add(this.text);
        };
        this.clickLeft = function () {
            if (this.changing) return;
            this.changing = true;
            this.selected --;
            if (this.selected < 0) this.selected = this.options.length - 1;
            let tween = game.add.tween(this.text).to( { width: 0}, 200, "Linear", true, 200);
            tween.onComplete.add(this.update, this);
        };
        this.clickRight = function () {
            if (this.changing) return;
            this.changing = true;
            this.selected ++;
            if (this.selected >= this.options.length) this.selected = 0;
            let tween = game.add.tween(this.text).to( { width: 0}, 200, "Linear", true, 200);
            tween.onComplete.add(this.update, this);
        };
        this.clear = function(){
          this.group.removeAll(true);
          this.optionGroup.removeAll(true);
        },
        this.value = function(){
            return this.options[this.selected];
        };
        this.leftArrow.inputEnabled = true;
        this.leftArrow.events.onInputDown.add(this.clickLeft, this);

        this.rightArrow.inputEnabled = true;
        this.rightArrow.events.onInputDown.add(this.clickRight, this);
        this.update();
    }
};
