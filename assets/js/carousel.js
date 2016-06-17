function Carousel(options) {
	var _this = this,
		opt = options;

	this.options = {
		'slideNum'    :opt.slideNum,
		'navigation'  :opt.navigation || 'true',
		'pagination'  :opt.pagination || 'true',
		'autoPlay'    :opt.autoPlay   || 'false',
		'repeat'      :opt.repeat     || 'false',
		'speed'       :opt.speed      ||  2
	};

	var elemId = opt.elemID || 'carousel';
	this.main = document.getElementById(elemId);
	this.curPosition = 0;
	this.gallery = this.getClassElement('gallery');
	this.pagination = this.getClassElement('pagination');
	this.length = this.gallery.children.length;

	this.init = function(){
		setCarousel();
		showNavigation();
		showPagination();
		autoPlay();
	}
	this.init();

	function autoPlay(){
		if(_this.options.autoPlay == 'true'){
			setInterval(function(){
				moveNext();
			}, _this.options.speed*1000);
		}
	}

	function showPagination(){
		if(_this.options.pagination == 'true'){
			var tempNode = '';
			for(var i=0; i <_this.pageNum; i++){
				tempNode = tempNode + '<div class="page" data-index="'+ i +'"></div>';
			}
			_this.pagination.innerHTML = tempNode;

			_this.pagination = _this.getClassElement('pagination');
			_this.pagination.addEventListener('click', paginationClickHandler);

			_this.moveTo(_this.curPosition);
		} else {
			_this.pagination.style = 'visibility:hidden;';
		}
	}

	function paginationClickHandler(e){
		_this.moveTo(e.target.getAttribute('data-index'));
	}

	function showNavigation(){
		_this.prevBtn = _this.getClassElement('crsl_left_arr');
		_this.nextBtn = _this.getClassElement('crsl_right_arr');

		if(_this.options.navigation == 'true'){
			navigationEventBind();
		}else{
			_this.prevBtn.remove();
			_this.nextBtn.remove();
		}
	}
	function navigationEventBind(){
		_this.prevBtn.addEventListener('click', movePrev, true);
		_this.nextBtn.addEventListener('click', moveNext, true);
	}

	function movePrev(){
		var pos = _this.curPosition - 1;
		if(pos >= 0){
			_this.curPosition = pos;
		} else if(_this.options.repeat === 'true'){
			_this.curPosition = _this.pageNum-1;
		}
		_this.moveTo(_this.curPosition);
	};

	function moveNext(){
		var pos = _this.curPosition;
		if(++pos < _this.pageNum){
			_this.curPosition = pos;
		} else if(_this.options.repeat === 'true'){
			_this.curPosition = 0; 
		}
		_this.moveTo(_this.curPosition);
	};

	function setCarousel(){
		var slideWidth = _this.gallery.children[0].offsetWidth+32;
		if(_this.options.slideNum){
			var slideNum = _this.options.slideNum*1;
			_this.main.style.width = slideWidth*slideNum - 4 + 'px';
		}

		var totalWidth = slideWidth*_this.length - 12;
		var carouselWidth = _this.main.offsetWidth;
			_this.pageNum = Math.ceil(1 + (totalWidth-carouselWidth)/slideWidth);
	};
}

Carousel.prototype.setActivePaging = function(index){
	var val;
	for(var i=0; i<this.pageNum; i++){
		this.pagination.childNodes[i].classList.remove('active');

		if(this.pagination.childNodes[i].getAttribute('data-index') == index){
			val = i;
		}
	}

	this.pagination.childNodes[val].classList.add('active');
}

Carousel.prototype.moveTo = function(pos){
	var curPos = ((this.gallery.children[0].offsetWidth + 32) * pos);
	this.gallery.style.left = -1*curPos + 'px';

	if(this.options.pagination == 'true'){
		this.setActivePaging(pos);
	}
}

Carousel.prototype.getClassElement = function(className){
	var tempNode = this.main.getElementsByClassName(className)[0];
	return tempNode;
}