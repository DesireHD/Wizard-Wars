	/* ------- begin model ------- */
(function(){
	function Model(){
		let myModaView=null;
		let myModalModel = null;
		let myModalController = null;
		let self=this;
		let gameCycle = null;
		let player = null;


	/* ------- Создание игровых уровней ------- */
		
	/* ------- Создание игровых уровней ------- */

		this.allAudio = null
		//Массив уровней где i = номеру уровня 
		this.primLevels = {
			1:['bloob','dragon','bloob'],//
			2:['zombie','zombie','runer','skelet','zombie','zombie','runer','skelet'],//
			3:['skelet','skelet','skelet','skelet','godzila'],//
			4:['zombie','zombie','zombie','zombie','zombie','zombie','zombie','zombie',],
			5:['runer','runer','runer','runer','runer','runer','runer','runer','runer',],
			6:['zombie','zombie','zombie','zombie','dragon'],
			7:['zombie','zombie','zombie','runer','skelet','skelet','skelet','skelet','skelet'],
			8:['runer','runer','runer','runer','runer','runer','runer','runer','runer','runer',],
			9:['skelet','skelet','skelet','skelet','skelet','skelet','skelet','skelet','skelet',],
			10:['runer','runer','runer','runer','bloob'],//
			// 11:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 12:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 13:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 14:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 15:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 16:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 17:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 18:['zombie','zombie','zombie','zombie','zombie','zombie'],
			// 19:['zombie','zombie','zombie','zombie','zombie','zombie'],
			number:[1, 4, 4, 5, 5, 5, 5, 5, 4, 4]
		};

		this.levels = {
			point: 0,
			Npc: {},
			level: 0,
			drawStatusText: null,
			changeImage:false,
			drawText: null,
			interval: null,
			intervalGameOver: null,
			intervalGameWin: null,
			currentForAdd:null,
			currentDead: null,
			currentMax: null,
			maxOnMap: null,
			textPosY: 0,
			gameOver:false,
			initLevel: ()=>{
				for(let i=1; i<=self.primLevels.number[self.levels.level-1]; i++){
					self.levels.drawText = null;
					self.levels.Npc[i] = self.Npc(self.primLevels[self.levels.level][i-1]);
					self.levels.maxOnMap = self.primLevels.number[self.levels.level-1]
					self.levels.currentForAdd =i+1;
					self.levels.currentDead =0;
					self.levels.currentMax = self.primLevels[self.levels.level].length
					self.levels.Npc[i].init();
				};
			},
			updateLevel: ()=>{

			}
		}
		this.updateNpcOnMap = function(){
			if(!self.levels.gameOver){
				self.levels.currentDead+=1;

				if(self.levels.level == self.primLevels.number.length && self.levels.currentDead>=self.levels.currentMax ){
					self.gameWin()
					return
				}
				if(self.levels.currentDead>=self.levels.currentMax){
					self.changeLevel()
				}

				if(self.levels.currentForAdd<=self.levels.currentMax){
					self.levels.Npc[self.levels.currentForAdd] = self.Npc(self.primLevels[self.levels.level][self.levels.currentForAdd-1]);
					self.levels.Npc[self.levels.currentForAdd].init();
					self.levels.currentForAdd+=1;
				}
			}
		};
		this.changeLevel = function(){
			self.levels.level +=1;
			setTimeout(()=>{
				if(self.levels.level !=1){
					// self.allAudio.nextLevel.stop();
					// self.allAudio.nextLevel.play();
					self.player.hp = self.player.maxHp
				}
				self.levels.drawText = true;
			},500)
			setTimeout(()=>{
				self.levels.textPosY = 0;
				self.levels.drawText = false;
				self.levels.initLevel();
			},3000);
		}

		this.drawText = function(){
			self.levels.textPosY+=6;
			let x = self.bg.width/2-self.bg.width/5;
				y =self.levels.textPosY ;
			myModaView.showText(x,y,false,`LeveL ${self.levels.level}`);
		}

		this.drawStatusText = function(){
			let x = (self.levels.gameOver)?self.bg.width/2-self.bg.width/3:self.bg.width/2-self.bg.width/4.5
				y = self.bg.height/2 ;
				text = (self.levels.gameOver)?'GAME OVER':'YOU WIN';
				point = `Points ${self.levels.point}`
			myModaView.showText(x, y, self.bg.width/2-170, text, point);
		}
		
		this.gameWin = function(){
			if(!self.levels.intervalGameWin){
				self.allAudio.win.stop()
				self.allAudio.win.play()
				self.allAudio.game.stop()
				// self.allAudio.playerDead.stop()
				// self.allAudio.playerDead.play()
				self.levels.statusText = true;
				self.levels.intervalGameWin=setTimeout(()=>{
						setTimeout(()=>{
							clearInterval(self.intervalSprite)
							cancelAnimationFrame(gameCycle)
							self.changeScreen();
						},5000)
				},600);
			}
		}

		this.gameOver = function(){
			if(!self.levels.intervalGameOver){
				self.allAudio.dead.stop()
				self.allAudio.dead.play()
				self.allAudio.game.stop()
				self.levels.gameOver = true;
				self.levels.statusText = true;
				self.levels.intervalGameOver=setTimeout(()=>{
						setTimeout(()=>{
							clearInterval(self.intervalSprite)
							cancelAnimationFrame(gameCycle)
							self.changeScreen();
						},6000)
				},600);
			}
		}

		this.changeScreen = function(){
			
			let allUsers = 	JSON.parse(window.localStorage.getItem("users"));
				allUsers[player] = self.levels.point
				window.localStorage.setItem("users", JSON.stringify(allUsers));
			myModaView.endGame()
			myModalController = null;
			myModaView = null;
			myModalModel = null;
		}

	/* ------- Игровое поле ------- */


		this.bg={
			width:900,
			height:700,
			img:null
		};


	/* ------- Игрок ------- */


		this.player={
			posX:null,
			posY:null,
			playerPosX:null,
			playerPosY:null,
			centerX:null,
			centerY:null,
			width:null,
			height:null,
			speed:100,
			maxHp:1000,
			hp:1000,
			xp:null,
			img:null,

			dead:false,

			firstEmergence:{
				status:true,
				firstEmergenceImg:null,
				sx:null, 
				sy:0, 
				sWidth:null, 
				sHeight:null, 
				cadr:null,
				directions:null,
				cadrHeight:null,
			},
			

			bullet:{
				atk:10,
				img:null,
				speed:15,
				size:16
			},
			sprite: {
				sx:null, 
				sy:0, 
				sWidth:null, 
				sHeight:null, 
				cadr:7,
				directions:1,
				cadrHeight:6,
			},
			init: function(){
				this.bullet.img = self.allImage.bullet;
				this.img = self.allImage.player;
				this.width = Math.round(this.img.width/this.sprite.cadr*0.2);
				this.height = Math.round(this.img.height/this.sprite.cadrHeight*0.75);
				this.posX = Math.round(self.bg.width/2-this.img.width/this.sprite.cadr*0.5);
				this.posY = Math.round(self.bg.height/2-this.img.height/this.sprite.cadrHeight+this.height/2);
				this.centerX = Math.round(this.posX+this.img.width/this.sprite.cadr*0.5);
				this.centerY = Math.round(this.posY+this.img.height/this.sprite.cadrHeight-this.height/2);
				this.playerPosX = Math.round(this.centerX-this.width/2);
				this.playerPosY = Math.round(this.centerY-this.height/2);
			}
		}
		
		//Кнопки управления
		this.buttons={
			w:{coor:-1, pos:'posY', startPos:null, interval:null, date:null},
			s:{coor:+1, pos:'posY', startPos:null, interval:null, date:null},
			a:{coor:-1, pos:'posX', startPos:null, interval:null, date:null},
			d:{coor:+1, pos:'posX', startPos:null, interval:null, date:null}
		};


		//Получение кнопки при нажатии
		this.runPosPlayer=function(key){
			let options = self.buttons[key];
			if(!self.player.dead){
				if(options && !options.interval){
					let start=new Date().getTime();
					options.startPos = (key=='w'|| key=='s')?self.player.posY:self.player.posX;
					options.interval = setInterval(function(){
						self.changePosPlayer(key,start);
					},20)
				}
			}
		}

		//Изменение позиции игрока
		this.changePosPlayer = function(key,start){
			let pos=self.buttons[key].pos;
			let coor = self.buttons[key].coor;

			if(self.player.dead){
				clearInterval(self.buttons[key].interval);
				self.buttons[key].date=null;
				self.buttons[key].interval = null;
			}		
			self.player.centerX = self.player.posX+self.player.img.width/self.player.sprite.cadr*0.5;
			self.player.centerY = self.player.posY+self.player.img.height/self.player.sprite.cadrHeight-self.player.height/2;
			self.player.playerPosX = Math.round(self.player.centerX-self.player.width/2);
			self.player.playerPosY = Math.round(self.player.centerY-self.player.height/2);	

			self.player[pos]=self.buttons[key].startPos+Math.round(((new Date().getTime())-start)/1000*self.player.speed)*coor;
		}

		//Очистка интервала при отжатии
		this.clearInterval=function(key){
			if (self.buttons[key]) {
				clearInterval(self.buttons[key].interval);
				self.buttons[key].date=null;
				self.buttons[key].interval = null;
			};
			let int = self.buttons;
			if(!int.w.interval && !int.a.interval && !int.s.interval && !int.d.interval){
				self.player.sprite.directions = 1;
			};
		};

		//Отрисовка персонажа
		this.drawPlayer = function(){
			if(self.player.hp<=0 && !self.player.dead) {
				self.player.hp = 0;
				self.player.dead = true;
				self.player.sprite.sx = 0;
			}
			if(self.player.hp<=0) {
				self.player.hp = 0;
			}
			if(self.buttons.a.interval) self.player.sprite.directions = 2;
			if(self.buttons.d.interval) self.player.sprite.directions = 3;
			if(self.buttons.w.interval && !self.buttons.a.interval && !self.buttons.d.interval) self.player.sprite.directions = 2;
			if(self.buttons.s.interval && !self.buttons.a.interval && !self.buttons.d.interval) self.player.sprite.directions = 3;
			if(self.player.dead) self.player.sprite.directions = 6;
			let a = self.player;
				img = a.img;
				sx = a.sprite.sx;
				sy = (a.sprite.directions-1)*a.img.height/a.sprite.cadrHeight;
				sWidth = img.width/a.sprite.cadr;
				sHeight = img.height/a.sprite.cadrHeight;
				dx = a.posX;
				dy = a.posY;
				dWidth = sWidth;
				dHeight = sHeight;
			myModaView.showObject(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			let persentHp = Math.round(a.hp/a.maxHp*(a.width+30));
			myModaView.showPlayerHp(a.playerPosX-15,a.playerPosY-12,a.width+30,4,persentHp);
			self.checkDamage()
		}


		//проверка попадания npc по персонажу
		self.checkDamage = function(){
			let x = self.player.playerPosX;
				y = self.player.playerPosY;
				w = self.player.width;
				h = self.player.height;
				bul = self.bulletNpc;
				col = null;
			if (bul){
				for(let i in bul){ 
					if((bul[i].startX>x && bul[i].startX<x+w)&&(bul[i].startY>y && bul[i].startY<y+h)) col = true
					if(col){
						if(!self.levels.gameOver){
							self.allAudio.damageForPlayer.stop();
							self.allAudio.damageForPlayer.play();
						}
						self.player.hp-=bul[i].damage;
						bul.splice(i,1);
						break
					};
				};
			};
		}
		//массив с пулями игрока
		this.playerBullets=[],

		//наполнение массива пулями при клике по полю
		this.createBullet = function(x,y){
			if(self.player.dead) return
			let hyp = ((x - self.player.playerPosX)**2 + (y - self.player.playerPosY)**2 ) ** 0.5;
			let sin = (y - self.player.playerPosY) / hyp;
			let cos = (x - self.player.playerPosX) / hyp;
			let deltaX = self.player.bullet.speed * cos;
			let deltaY = self.player.bullet.speed * sin;
			self.playerBullets.push({
				startX:(self.player.sprite.directions==2)?self.player.playerPosX-self.player.bullet.size/2:self.player.playerPosX+self.player.width-self.player.bullet.size/2,
				startY:self.player.playerPosY+5-self.player.bullet.size/2,
				deltaX:deltaX,
				deltaY:deltaY
			})
		}

		//отрисовка пуль из наполненного массива
		this.drawBullet = function(){
			if (self.playerBullets){
				let bul = self.playerBullets;
				for(let i in bul){
					myModaView.showBullet(self.player.bullet.img, bul[i].startX, bul[i].startY, self.player.bullet.size, self.player.bullet.size);
					bul[i].startX += bul[i].deltaX;
					bul[i].startY += bul[i].deltaY;
					//console.log(bul)
					if(bul[i].startX>self.bg.width || bul[i].startX+bul.width<0) {
						bul.splice(i,1); continue;
					};
					if(bul[i].startY>self.bg.height || bul[i].startY<0) bul.splice(i,1);
				};
			};
		};


		/* ------- NPC ------- */
		this.allImage = null
		this.settingsNpc = ()=>{
			let a = {
				skelet:{
					img: self.allImage.skelet,
					imgB: self.allImage.skeletBullet,
					imgSpawn: self.allImage.spawnSkelet,
					imgDead: self.allImage.deadSkelet,
					posX: [20,300],
					posY: [20,300],
					speed: [80,30],
					damage:20,
					hp: 150,
					speedBul: 7,//bullet
					sizeBul: 8,
					delayBul: [1500,1500],
					damageBul: 30,
					fire:true,
					point:20,
					cadr:4
				},
				runer:{
					img: self.allImage.runer,
					imgSpawn:self.allImage.spawnRuner,
					imgDead: self.allImage.deadRuner,
					posX: [20,300],
					posY: [20,300],
					speed: [300,50],
					damage:30,
					hp: 60,
					fire: false,
					point:25,
					cadr:4
				},
				zombie:{
					img: self.allImage.zombie,
					imgSpawn:self.allImage.spawnZombie,
					imgDead: self.allImage.deadZombie,
					posX: [20,300],
					posY: [20,300],
					speed: [50,50],
					damage:35,
					hp: 100,
					fire:false,
					point:15,
					cadr:4
				},
				godzila:{
					img: self.allImage.godzila,
					imgB: self.allImage.godzilaBullet,
					imgSpawn:self.allImage.spawnGodzila,
					imgDead: self.allImage.spawnGodzila,
					posX: [20,300],
					posY: [20,300],
					speed: [60,60],
					damage:50,
					hp: 550,
					point: 40,
					cadr: 10,
					speedBul: 5,//bullet
					sizeBul: 13,
					delayBul: [1500,1500],
					damageBul: 40,
					fire:true,
				},
				bloob:{
					img: self.allImage.bloob,
					imgB: self.allImage.godzilaBullet,
					imgSpawn:self.allImage.spawnBloob,
					imgDead: self.allImage.spawnBloob,
					posX: [20,300],
					posY: [20,300],
					speed: [200,50],
					damage:70,
					hp: 1000,
					fire:false,
					point:100,
					cadr:8,
					speedBul: 5,//bullet
					sizeBul: 15,
					delayBul: [2000,500],
					damageBul: 40,
					fire:true,
				},
				dragon:{
					img: self.allImage.dragon,
					imgB: self.allImage.dragonBullet,
					imgSpawn:self.allImage.spawnDragon,
					imgDead: self.allImage.spawnDragon,
					posX: [20,300],
					posY: [20,300],
					speed: [80,30],
					damage:50,
					hp: 750,
					point:70,
					cadr:4,
					speedBul: 7,//bullet
					sizeBul: 17,
					delayBul: [2500,500],
					damageBul: 40,
					fire:true,
				}
			}
			self.settingsNpc =  a
		}
		//Функция конструктор для создания NPC
		this.Npc = function(name){
			function Npc(name){
				this.name = name;
				this.posX = null;
				this.posY = null;
				this.img = null;
				this.width = null;
				this.height = null;
				this.speed = null;
				this.maxHp = null;
				this.hp = null;
				this.damage = null;
				this.fire = null;
				this.fireStatus = null;
				this.update = null;
				this.IntervalDirection = null;
				this.point = null,

				this.damageStatus = true;
				this.damageTimeout = null;
				this.speedDamage = 1500;

				this.statusDead = true,
				this.immortality = true,
				this.imgSpawn = null,
				this.imgDead = null,
				this.dead = false,
				this.firstEmergenceTimeout = null,
				this.firstEmergence = true;
				this.changePos = false,
				this.draw = true,
				this.timeout = null,

				this.options = {
					changeDirection : null,
					angle : 7,
					radSin : null,
					radCos : null,
					startPosX : null,
					startPosY : null,
					date : null,
					sin : null,
					cos: null,
				};
				this.bullet = {
					img:null,
					speed:7,
					size:10,
					delay:1500,
					date: new Date().getTime(),
					damage: 15
				};
				this.sprite = {
					sx:0, 
					sy:0, 
					sWidth:null, 
					sHeight:null, 
					cadr:null,
					directions:1,
					cadrHeight:2,
				};
				this.init = function(){
					let link = self.settingsNpc[this.name];
					this.sprite.cadr = link.cadr;
					this.img = link.img;
					this.bullet.img = link.imgB;
					let	width = this.img.width/this.sprite.cadr;
						height = this.img.height/this.sprite.cadrHeight;
					this.posX = Math.round(Math.random()*(self.bg.width-2*width-20)+width+20);
					this.posY = Math.round(Math.random()*(self.bg.height-2*height-20)+height+20);
					this.speed = Math.round(Math.random()*link.speed[1]+link.speed[0]);
					this.point = link.point
					this.maxHp = link.hp;
					this.hp = link.hp;
					this.fireStatus = link.fire;
					this.damage = link.damage;
					this.plusPower = 0.2,
					this.width = width;
					this.height = height;
					this.options.startPosX = this.posX;
					this.options.startPosY = this.posY;
					this.options.angle = Math.random()*Math.PI*2;
					this.imgSpawn = link.imgSpawn;
					this.imgDead = link.imgDead;


					if(link.fire){
						this.bullet.speed = link.speedBul;
						this.bullet.size = link.sizeBul;
						this.bullet.delay = Math.round(Math.random()*link.delayBul[1]+link.delayBul[0]);
						this.bullet.damage = link.damageBul;
					}
					else{this.bullet = null};
				};
			};
			return new Npc(name)
		}

		//Расчет движения NPC
		this.runNpc = function(){
			let a = self.levels.Npc;
			//console.log(a)
			let time = new Date().getTime();
			if(a){
				for(let i=1; i<=Object.keys(a).length; i++){
					if(a[i]){
						if(a[i].firstEmergence) self.checkFirstEmergence(a[i]);

						if(self.levels.gameOver) a[i].changePos = false

						//Направление движения для отрисовки спрайта
						if(!a[i].firstEmergence || a[i].dead){
							if(a[i].name !=='godzila'){if(a[i].posX<a[i].options.startPosX) a[i].sprite.directions=2;
							if(a[i].posX>a[i].options.startPosX) a[i].sprite.directions=1;}
						}

						if(a[i].dead) a[i].changePos = false;

						// Расчет движения для каждого npc
						if(a[i].changePos){
							if(a[i].name =='skelet'){
								if(!a[i].options.startPosX) a[i].options.startPosX = a[i].posX;
								if(!a[i].options.startPosY) a[i].options.startPosY = a[i].posY;
								if(!a[i].options.angle) a[i].options.angle = Math.random()*Math.PI*2;
								if(!a[i].options.date) a[i].options.date = new Date().getTime();
								if(!a[i].options.sin) {a[i].options.sin = Math.sin(a[i].options.angle)};
								if(!a[i].options.cos) {a[i].options.cos = Math.cos(a[i].options.angle)};
								a[i].posX = a[i].options.startPosX+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.cos))
								a[i].posY = a[i].options.startPosY+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.sin))
								if(!a[i].options.changeDirection) a[i].options.changeDirection = setTimeout(changeDirection,Math.random()*1000+2000);
								checkPos(a[i])
							}
							
							if(a[i].name =='runer' || a[i].name =='dragon'){
								if(!a[i].options.date) a[i].options.date = new Date().getTime();
								if(!a[i].options.sin) {a[i].options.sin = Math.sin(a[i].options.angle)};
								if(!a[i].options.cos) {a[i].options.cos = Math.cos(a[i].options.angle)};
								a[i].posX = a[i].options.startPosX+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.cos))
								a[i].posY = a[i].options.startPosY+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.sin))
								checkPos(a[i])
							}

							if(a[i].name =='zombie' || a[i].name == 'godzila'){
								if(!a[i].options.startPosX) a[i].options.startPosX = a[i].posX;
								if(!a[i].options.startPosY) a[i].options.startPosY = a[i].posY;
								if(a[i].options.startPosX+a[i].width/2<self.player.centerX) a[i].sprite.directions=1;
								if(a[i].options.startPosX+a[i].width/2>self.player.centerX) a[i].sprite.directions=2;
								if(!a[i].options.angle) a[i].options.angle = Math.random()*Math.PI*2;
								if(!a[i].options.date) a[i].options.date = new Date().getTime();
								let hyp = ((self.player.centerX - (a[i].posX+a[i].width/2))**2 + (self.player.centerY - (a[i].posY + a[i].height/2))**2 ) ** 0.5;
								let sin = (self.player.centerY - (a[i].posY + a[i].height/2)) / hyp;
								let cos = (self.player.centerX - (a[i].posX + a[i].width/2)) / hyp;
								if(!a[i].options.sin) {a[i].options.sin = sin};
								if(!a[i].options.cos) {a[i].options.cos = cos};
								a[i].posX = a[i].options.startPosX+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.cos))
								a[i].posY = a[i].options.startPosY+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.sin))
								if(!a[i].options.changeDirection) a[i].options.changeDirection = setTimeout(changeDirectionInPlayer,300);
							}

							if(a[i].name =='bloob'){
								if(!a[i].options.startPosX) a[i].options.startPosX = a[i].posX;
								if(!a[i].options.startPosY) a[i].options.startPosY = a[i].posY;
								if(!a[i].options.angle) a[i].options.angle = Math.random()*Math.PI*2;
								if(!a[i].options.date) a[i].options.date = new Date().getTime();
								let hyp = ((self.player.centerX - (a[i].posX+a[i].width/2))**2 + (self.player.centerY - (a[i].posY + a[i].height/2))**2 ) ** 0.5;
								let sin = (self.player.centerY - (a[i].posY + a[i].height/2)) / hyp;
								let cos = (self.player.centerX - (a[i].posX + a[i].width/2)) / hyp;
								if(!a[i].options.sin) {a[i].options.sin = sin};
								if(!a[i].options.cos) {a[i].options.cos = cos};
								a[i].posX = a[i].options.startPosX+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.cos))
								a[i].posY = a[i].options.startPosY+Math.round(((new Date().getTime())-a[i].options.date)/1000*(a[i].speed*a[i].options.sin))
								checkPos(a[i])
							}

							function changeDirectionInPlayer(length){
								if(!!a[i]){
									a[i].options.date = null;
									a[i].options.sin = null;
									a[i].options.cos = null;
									a[i].options.startPosX = (a[i].name =='bloob')? a[i].posX+length:null;
									a[i].options.startPosY = (a[i].name =='bloob')? a[i].posY+length:null;
									if(a[i].name =='bloob'){
										if(a[i].options.startPosX<self.player.centerX) a[i].sprite.directions=1;
										if(a[i].options.startPosX>self.player.centerX) a[i].sprite.directions=2;
									}	
									clearTimeout(a[i].options.changeDirection);
									a[i].options.changeDirection = null;
								}
							};

							function changeDirection(x,y){
								if(!!a[i]){
									a[i].options.date = null;
									a[i].options.sin = null;
									a[i].options.cos = null;
									a[i].options.angle = (x || y)?a[i].options.angle:null;
									a[i].options.startPosX = (x)?a[i].posX+x:a[i].posX;
									a[i].options.startPosY = (y)?a[i].posY+y:a[i].posY;
								}
							}

							function checkPos(link){
								if(link.posX+link.width >= self.bg.width){//право
									if(link.name == 'bloob'){changeDirectionInPlayer(-3);return}
									link.options.angle = Math.random()*(3*Math.PI/2-Math.PI/4)+(Math.PI/2+Math.PI/4);
									changeDirection(-(3+link.posX+link.width -self.bg.width),null)};
								if(link.posX <= 0){ //лево
									if(link.name == 'bloob'){changeDirectionInPlayer(+3);return}
									link.options.angle = Math.random()*(Math.PI*2.5-Math.PI/4)+(3*Math.PI/2+Math.PI/4);
									changeDirection(3-link.posX, null)};
								if(link.posY+link.height >= self.bg.height){ //низ
									if(link.name == 'bloob'){changeDirectionInPlayer(-3);return}
									link.options.angle = Math.random()*(2*Math.PI-Math.PI/4)+(Math.PI+Math.PI/4)
									changeDirection(null,-(3+link.posY+link.height-self.bg.height))};
								if(link.posY <= 0){ //верх
									if(link.name == 'bloob'){changeDirectionInPlayer(+3);return}
									link.options.angle = Math.random()*(Math.PI-Math.PI/4)+(0+Math.PI/4)
									changeDirection(null,3-link.posY)};
						
							}
						}

						//стрельба npc если она предусмотрена
						if(a[i].dead || self.levels.gameOver) a[i].fire=false
						if(a[i].fire){	
							if(time-a[i].bullet.date>=a[i].bullet.delay){
								if(a[i].name=='dragon') addDragonBullet(a[i]);
								if(a[i].name=='bloob') addStarBullet(a[i])
								if(a[i].name=='godzila' || a[i].name=='skelet') addBullet();
							}
							function addBullet(){
								let hyp = ((self.player.centerX - (a[i].posX+a[i].width/2))**2 + (self.player.centerY - (a[i].posY + a[i].height/2))**2 ) ** 0.5;
								let sin = (self.player.centerY - (a[i].posY + a[i].height/2)) / hyp;
								let cos = (self.player.centerX - (a[i].posX + a[i].width/2)) / hyp;

								let deltaX = a[i].bullet.speed * cos;
								let deltaY = a[i].bullet.speed * sin;
								self.bulletNpc.push(
									{
										img: a[i].bullet.img,
										size: a[i].bullet.size,
										startX: (a[i].posX + a[i].width/2),
										startY: (a[i].posY + a[i].height/2),
										deltaX: deltaX,
										deltaY: deltaY,
										damage:	a[i].bullet.damage
									}
								)
								a[i].bullet.date = new Date().getTime()
							}
							function addStarBullet(link){
								let acc = 0.001
								for(let i = 0; i<12; i++){
									let sin = Math.sin(acc);
									let cos = Math.cos(acc);
									let deltaX = link.bullet.speed * cos;
									let deltaY = link.bullet.speed * sin;
									self.bulletNpc.push(
										{
											img: link.bullet.img,
											size: link.bullet.size,
											startX: (link.posX + link.width/2),
											startY: (link.posY + link.height/2),
											deltaX: deltaX,
											deltaY: deltaY,
											damage:	link.bullet.damage
										}
									)
									console.log(acc)
									acc+= Math.PI/6
								}
								acc = 0.001
								console.log(self.bulletNpc)
								link.bullet.date = new Date().getTime()
							}
							function addDragonBullet(link){
								let hyp = ((self.player.centerX - (a[i].posX+a[i].width/2))**2 + (self.player.centerY - (a[i].posY + a[i].height/2))**2 ) ** 0.5;
								let sin = (self.player.centerY - (a[i].posY + a[i].height/2)) / hyp;
								let cos = (self.player.centerX - (a[i].posX + a[i].width/2)) / hyp;
								let radSin = Math.asin(sin) - 3*Math.PI/50;
								let radCos = Math.acos(cos) - 3*Math.PI/50;
								for(let i = 0; i<7; i++){
									let sin = Math.sin(radSin);
									let cos = Math.cos(radCos);
									let deltaX = link.bullet.speed * cos;
									let deltaY = link.bullet.speed * sin;
									self.bulletNpc.push(
										{
											img: link.bullet.img,
											size: link.bullet.size,
											startX: (link.posX + link.width/2),
											startY: (link.posY + link.height/2),
											deltaX: deltaX,
											deltaY: deltaY,
											damage:	link.bullet.damage
										}
									)		
									radSin += Math.PI/50;
									radCos += Math.PI/50;				
								}
								link.bullet.date = new Date().getTime()
							}
						}

						//проверка убит ли npc
						if(a[i].hp<=0){
							a[i].dead = true;
							if(a[i].statusDead){
								a[i].changePos = false;
								a[i].fire = false;
								a[i].sprite.directions=1;
								a[i].statusDead = false;
								self.allAudio.deadNpc.play()
								setTimeout(()=>{
									self.levels.point+=a[i].point 
									self.updateNpcOnMap()
									a[i] = null;
								},500);
							}
						}

						if(a[i].dead) a[i].sprite.directions = 1;

						//Отрисовка npc
						if(a[i].draw){
							let img = (a[i].firstEmergence) ? a[i].imgSpawn : (a[i].dead)? a[i].imgDead : a[i].img;
								sx = a[i].sprite.sx;
								sy = (a[i].sprite.directions-1)*img.height/a[i].sprite.cadrHeight;
								sWidth = img.width/a[i].sprite.cadr;
								sHeight = img.height/a[i].sprite.cadrHeight;
								dx = a[i].posX;
								dy = a[i].posY;
								dWidth = sWidth;
								dHeight = sHeight;
							myModaView.showObject(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
							let persentHp = Math.round(a[i].hp/a[i].maxHp*a[i].width);
							if(!a[i].firstEmergence && !a[i].dead){
								myModaView.showHp(a[i].posX,a[i].posY-8,a[i].width,4,persentHp);
							}
						}
						//если не умер или не появляется расчет попаданий
						if(a[i].dead || !a[i].firstEmergence){
							self.checkDamageNpc(a[i]);
							self.checkContact(a[i]);
						}
					}
				}
			}
		}

		this.checkContact = function(npc){
			let playerX = self.player.playerPosX;
				playerY = self.player.playerPosY;
				playerW = self.player.width;
				playerH = self.player.height;
				npcX = npc.posX;
				npcY = npc.posY;
				npcW = npc.width;
				npcH = npc.height;
				Col = false;
			//левый верхний
			if((playerX>npcX && playerX<npcX+npcW)&&(playerY>npcY && playerY<npcY+npcH)) {Col = true;}
			//правый верхний
			if((playerX+playerW>npcX && playerX+playerW<npcX+npcW)&&(playerY>npcY && playerY<npcY+npcH)) {Col = true;}
			//левый нижний
			if((playerX>npcX && playerX<npcX+npcW)&&(playerY+playerH>npcY && playerY+playerH<npcY+npcH)) {Col = true;}
			// //правый нижний
			if((playerX+playerW>npcX && playerX+playerW<npcX+npcW)&&(playerY+playerH>npcY && playerY+playerH<npcY+npcH)) {Col = true;}
			if(Col){
				Col = false
				if(npc.damageStatus){
					self.player.hp-=npc.damage;
					if(!self.levels.gameOver){
						self.allAudio.damageForPlayer.stop();
						self.allAudio.damageForPlayer.play();
					}
					npc.damageStatus = false
					npc.damageTimeout=setTimeout(()=>{
						npc.damageStatus = true
						clearTimeout(npc.damageTimeout)
						npc.damageTimeout = null
					},npc.speedDamage)
				}
			}
		};

		//Проверка отображения при появлении
		this.checkFirstEmergence = function(link){
			if(!link.firstEmergenceTimeout){
				link.firstEmergenceTimeout=setTimeout(()=>{
					if(link.fireStatus) link.fire = true;
					link.firstEmergence = false;
					link.changePos = true;
					link.immortality = false;
					clearTimeout(link.timeout);
					link.timeout = null;
				},1500);
			}
		}

		//Проверка соприкосновения NPC с пулями
		this.checkDamageNpc = function(link){
			let x = link.posX;
				y = link.posY;
				w = link.width;
				h = link.height;
				b = self.player.bullet;
				Col = false;

			if (self.playerBullets){
				let bul = self.playerBullets;
				for(let i in bul){ 
					if(!link.dead){
						if((bul[i].startX>x && bul[i].startX<x+w)&&(bul[i].startY>y && bul[i].startY<y+h)) Col = true;
						if((bul[i].startY>y && bul[i].startY<y+h)&&(bul[i].startX>x && bul[i].startX<x+w)) Col = true;				
						if(Col){
							self.allAudio.damageForNpc.stop()
							self.allAudio.damageForNpc.play()
							if(!link.immortality) link.hp-=b.atk;
							bul.splice(i,1);
							break
						}
					}
				};
			};
		}	

		//Массив пуль от всех NPC на карте
		this.bulletNpc = [];

		//Движение пуль NPC(перерасчет позиций)
		this.updateBulletNpc = function(){
		if(!self.levels.gameOver)
			if(self.bulletNpc){
				let bul = self.bulletNpc;
				for(let i in bul){
					bul[i].startX += bul[i].deltaX;
					bul[i].startY += bul[i].deltaY;
					if(bul[i].startX>self.bg.width || bul[i].startX+bul.width<0) {
						bul.splice(i,1); continue
					}
					if(bul[i].startY>self.bg.height || bul[i].startY<0) bul.splice(i,1);
				}
			}
		}	

		//Отрисовка всех пуль NPC
		this.drawBulletNpc = function(){
			if(self.bulletNpc){
				let bul = self.bulletNpc;
				for(let i in bul){
					myModaView.showBullet(bul[i].img, bul[i].startX, bul[i].startY, bul[i].size, bul[i].size);
				}
			}
		}
		

		

	/* ------- Перерасчет параметров для спрайтов ------- */

		//Интервал перерасчета
		this.intervalSprite = null;
		
		//Вызов функций для разных оббъектов
		this.callSprite = function(){			
			self.runSpriteNPC(self.levels.Npc);
			self.runSpritePlayer(self.player);
		};
		
		//перерасчет для Игрока
		this.runSpritePlayer = function(link){

			link.sprite.sx += link.img.width/link.sprite.cadr;
			if(link.dead && link.sprite.sx >= link.img.width){
				link.sprite.sx = link.img.width-link.img.width/link.sprite.cadr
				self.gameOver()
			}
			if(link.sprite.sx >= link.img.width) {
				if(!link.dead)link.sprite.sx=0;
			}
		} 

		//Перерасчет для моба
		this.runSpriteNPC = function(link){
			if(!self.levels.gameOver){
				for(let i = 1;i <= Object.keys(link).length; i++){
					if(link[i]){
						link[i].sprite.sx += link[i].width;
						if(link[i].sprite.sx >= link[i].img.width)link[i].sprite.sx=0;
					}
				}
			}
		}
		

	/* ------- Обновление и инициализация ------- */

		//
		this.updateView = function(){
			//self.callSprite()
			myModaView.showMap(self.allImage.bg.width,self.allImage.bg.height,self.allImage.bg);
			self.drawPlayer();
			self.drawBulletNpc();
			self.runNpc();
			self.updateBulletNpc();
			self.drawBullet();
			if(self.levels.drawText) self.drawText();
			if(self.levels.gameOver || self.levels.intervalGameWin) self.drawStatusText();
			myModaView.showText(10,20,false,false,false,`Points: ${self.levels.point}`)
			myModaView.drawBuffer(self.bg.width,self.bg.height)
			gameCycle=requestAnimationFrame(self.updateView);
		}
		
		this.init=function(view,img,aud,p,model,controller){
			player = p
			myModaView = view;
			myModalModel = model;
			myModalController = controller;
			self.allImage = img;
			self.allAudio = aud;
			self.player.init();
			self.settingsNpc();
			self.changeLevel();
			self.intervalSprite=setInterval(self.callSprite,100);
			self.allAudio.game.stop()
			self.allAudio.game.play()
			gameCycle = requestAnimationFrame(self.updateView);
		}
	}

	/* -------- end model -------- */
	/* ------- begin view -------- */
	function View(){
		let firstScreen = null
		let canvas = null
		let ctx = null
		let buffer = null
		let bufferCtx = null;
		this.showMap = function(width,height,img){
			canvas.setAttribute('width',width);
			canvas.setAttribute('height',height);
			bufferCtx.drawImage(img,0,0);
		}
		this.showBullet = function(img, dx, dy,width,height){
			bufferCtx.drawImage(img, dx, dy, width, height);
		}
		this.showObject = function(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
			bufferCtx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		}
		this.showHp = function(x,y,width,height,hp){
			bufferCtx.fillStyle = 'red';
			bufferCtx.strokeStyle = 'black';
			bufferCtx.lineWidth = 1;
			bufferCtx.fillRect(x, y, hp, height);
			bufferCtx.strokeRect(x, y, width, height);
		}
		this.showPlayerHp = function(x,y,width,height,hp){
			bufferCtx.fillStyle = 'red';
			bufferCtx.strokeStyle = 'black';
			bufferCtx.lineWidth = 1;
			bufferCtx.fillRect(x, y, hp, height);
			bufferCtx.strokeRect(x, y, width, height);
		}
		this.showText = function(x,y,xpoint,text,point,pointStatus){
			bufferCtx.fillStyle = '#fff';
			bufferCtx.strokeStyle = '#333';
			bufferCtx.font = '100px magic';
			if(text){
				bufferCtx.fillText(text, x, y);
				bufferCtx.strokeText(text, x, y);
			}
			if(point){
				bufferCtx.font = '70px magic';
				bufferCtx.fillText(point, xpoint, y+80);
				bufferCtx.strokeText(point, xpoint, y+80);
			}
			if(pointStatus){
				bufferCtx.font = '20px magic';
				bufferCtx.fillText(pointStatus, x, y);
			}
		}
		this.drawBuffer = function (width,height){
			ctx.drawImage(buffer, 0, 0, width,height);
		}
		this.endGame = function(){
			firstScreen()
			audio.firstAudio.play()
		}
		this.init = function(c,fs){
			firstScreen = fs
			buffer = document.createElement('canvas');
			buffer.width = 900
			buffer.height = 700
			if (buffer && buffer.getContext('2d')) {
				bufferCtx = buffer.getContext('2d');
			}
			canvas = c
			if (canvas && canvas.getContext('2d')) {
				ctx = canvas.getContext('2d');
			}
		}
	}


	/* -------- end view --------- */




	/* ----- begin controller ---- */
	function Controller(){
		let myModalModel=null;
		let self=this;
		this.init = function(model,canvas){
			myModalModel=model;
			window.addEventListener('keydown',function(e){
				let key= e.key;
				myModalModel.runPosPlayer(key);
			});
			window.addEventListener('keyup', function(e) {
				let key = e.key;
				myModalModel.clearInterval(key);
			});
			canvas.addEventListener('mousedown',function(e){
				myModalModel.createBullet(e.layerX,e.layerY)
			})
		}
	}





	/* ------ end controller ----- */

	let myModel= null;
	let myView= null;
	let myController= null;
	let playerName = null;
	if(!window.localStorage.getItem("users")){
		window.localStorage.setItem("users", JSON.stringify({}));
	}

	let game = document.getElementById('game');

	let firstScreen = document.createElement('div');
		firstScreen.id = 'firstScreen'
		game.appendChild(firstScreen)

	let title = document.createElement('p')
		title.id='title'

	let input = document.createElement('input')
		input.id='input'
		input.setAttribute('placeholder','Your nickname')

	let submit = document.createElement('button')
		submit.id='submit'
		submit.innerHTML = 'ENTER'
		submit.disabled = true

	let play = document.createElement('button');
		play.id = 'play'
		play.innerHTML='PLAY'

	let showState = document.createElement('button');
		showState.id = 'showState'
		showState.innerHTML='STATISTICS'

	let canvasPathes = document.createElement('canvas');
		canvasPathes.id = 'battleground'

	let ul = document.createElement('ul')
		ul.id='ul'

	let buttonMenu = document.createElement('div')
		buttonMenu.id='buttonMenu'
		buttonMenu.innerHTML='MENU'

	//вешаем оработчики на все кнопки
	firstScreen.addEventListener('click',()=>{
		game.classList.add('active')
		game.innerHTML = ''
		title.innerHTML = 'Enter your name'
		title.className = 'titleLogining'
		game.appendChild(title)
		game.appendChild(input)
		game.appendChild(submit)
		audio.firstAudio.play()
	})
	input.addEventListener('input',()=>{
		if(input.value.split('').length<3){
			input.style.border = '3px solid red'
			submit.disabled = true
		}
		else{
			input.style.border = '3px solid green'
			submit.disabled = false
		}
	})
	submit.addEventListener('click',()=>{
		playerName = input.value
		game.innerHTML = ''
		title.innerHTML = 'Wizard Wars'
		title.className = 'titleFirst'
		game.appendChild(title);
		game.appendChild(play);
		game.appendChild(showState);
		audio.click.play()
	})

	play.addEventListener('click',()=>{
		audio.firstAudio.pause()
		audio.click.play()
		audio.gong.play()
		title.classList.add('startAnimation');
		play.classList.add('startAnimation');
		showState.classList.add('startAnimation');
		game.classList.add('startAnimation');
		title.disabled = true
		play.disabled = true
		showState.disabled = true
		setTimeout(()=>{
			title.disabled = false
			play.disabled = false
			showState.disabled = false
			title.classList.remove('startAnimation');
			play.classList.remove('startAnimation');
			showState.classList.remove('startAnimation');
			game.classList.remove('startAnimation');
			game.classList.remove('active')
			game.innerHTML = ''
			game.appendChild(canvasPathes)
			myModel= new Model();
			myView= new View();
			myController= new Controller();

			// init методы
			myView.init(canvasPathes,onFirstScreen)
			myController.init(myModel,canvasPathes);
			myModel.init(myView,image,audio,playerName,myModel,myController);
		},3000)
	})

	showState.addEventListener('click',()=>{
		let obj = JSON.parse(window.localStorage.getItem("users"))
		let keys = Object.getOwnPropertyNames(JSON.parse(window.localStorage.getItem("users")))
		let result = '';
		keys.sort(function (a, b) {
			if (obj[a] > obj[b]) {
			return -1;
			}
			if (obj[a] < obj[b]) {
			return 1;
			}
			// a должно быть равным b
			return 0;
		})
		for(i in keys){
			result+= `<li><p>${keys[i]}</p><p>${obj[keys[i]]}</p></li>`
		}
		audio.click.play()
		game.innerHTML = ''
		title.innerHTML = 'States'
		title.className = 'titleStates'
		ul.innerHTML = result
		game.appendChild(title)
		game.appendChild(ul)
		game.appendChild(buttonMenu)
	})
	buttonMenu.addEventListener('click',()=>{
		audio.click.play()
		onFirstScreen()
	})




	function onFirstScreen(){
		game.classList.add('active')
		game.innerHTML = ''
		title.innerHTML = 'Wizard Wars'
		game.appendChild(title)
		game.appendChild(play)
		game.appendChild(showState)
	}

		//картинки и звуки
		let audio = {
			game:null,
			dead:null,
			deadNpc:null,
			emergence:null,
			damageForNpc:null,
			win:null,
			damageForPlayer:null,
			nextLevel:null,
			playerDead:null,
			firstAudio:null,
			click:null,
			hover:null,
			gong:null
		}
		let image = {
			player:null,
			bullet:null,
			bg:null,
			skelet:null,
			skeletBullet:null,
			runer: null,
			zombie: null,
			spawnSkelet: null,
			spawnRuner: null,
			spawnZombie: null,
			deadSkelet: null,
			deadRuner: null,
			deadZombie: null,
			godzila: null,
			spawnGodzila: null,
			spawnBloob: null,
			godzilaBullet: null,
			dragon:null,
			spawnDragon:null,
			dragonBullet:null
		}

		let dead = new Audio();
		dead.src = 'sounds/dead.mp3';

		let deadNpc = new Audio();
		deadNpc.src = 'sounds/deadNpc.mp3';

		let emergence = new Audio();
		emergence.src = 'sounds/deadNpc.mp3';

		let damageForNpc = new Audio();
		damageForNpc.src = 'sounds/damageForNpc.mp3';

		let damageForPlayer = new Audio();
		damageForPlayer.src = 'sounds/damageForPlayer.mp3';

		let win = new Audio();
		win.src = 'sounds/win.mp3';

		let playerDead = new Audio();
		playerDead.src = 'sounds/playerDead.mp3';

		let firstAudio = new Audio();
		firstAudio.src = 'sounds/firstScreen.mp3';
		firstAudio.loop = 'true';

		let nextLevel = new Audio();
		nextLevel.src = 'sounds/nextLevel.mp3';
		nextLevel.volume = 0.1

		let gameAudio = new Audio();
		gameAudio.src = 'sounds/game.mp3';
		gameAudio.loop = 'true';
		gameAudio.volume = 0.5

		let click = new Audio();
		click.src = 'sounds/click.mp3';

		let hover = new Audio();
		hover.src = 'sounds/hover.mp3';

		let gong = new Audio();
		gong.src = 'sounds/gong.mp3';

		//Image
		let player = new Image();
		player.src = 'img/player/player.png'

		let godzila = new Image();
		godzila.src = 'img/mobs/godzila(test).png'

		let spawnGodzila = new Image();
		spawnGodzila.src = 'img/mobs/spawn(godzila).png'

		let bloob = new Image();
		bloob.src = 'img/mobs/bloob.png'

		let spawnBloob = new Image();
		spawnBloob.src = 'img/mobs/spawn(bloob).png'

		let bullet = new Image();
		bullet.src = 'img/player/bullet.png';

		let skeletNPC = new Image();
		skeletNPC.src = 'img/mobs/skeleton(1).png';

		let spawnSkelet = new Image();
		spawnSkelet.src = 'img/mobs/spawn(skelet).png';

		let deadSkelet = new Image();
		deadSkelet.src = 'img/mobs/dead(skelet).png';

		let zombieNPC = new Image();
		zombieNPC.src = 'img/mobs/zombie.png';

		let spawnZombie = new Image();
		spawnZombie.src = 'img/mobs/spawn(zombie).png';

		let deadZombie = new Image();
		deadZombie.src = 'img/mobs/dead(zombie).png';

		let skeletBullet = new Image();
		skeletBullet.src = 'img/mobs/bullet(1).png';

		let runerNPC = new Image();
		runerNPC.src = 'img/mobs/runer.png';

		let spawnRuner = new Image();
		spawnRuner.src = 'img/mobs/spawn(runer).png';

		let deadRuner = new Image();
		deadRuner.src = 'img/mobs/dead(runer).png';

		let godzilaBullet = new Image();
		godzilaBullet.src = 'img/mobs/bulletGodzila.png';

		let dragon = new Image();
		dragon.src = 'img/mobs/dragon.png';

		let spawnDragon = new Image();
		spawnDragon.src = 'img/mobs/spawn(dragon).png';

		let dragonBullet = new Image();
		dragonBullet.src = 'img/mobs/bullet(dragon).png';

		let background = new Image();
		background.src = 'img/arena.jpg';



		background.onload = function(){
			image.bg = background;

			image.player = player;
			image.bullet = bullet;
			image.skelet = skeletNPC;
			image.skeletBullet = skeletBullet;
			image.runer = runerNPC;
			image.zombie = zombieNPC;
			image.spawnSkelet = spawnSkelet;
			image.spawnZombie = spawnZombie;
			image.spawnRuner = spawnRuner;
			image.deadSkelet = deadSkelet;
			image.deadZombie = deadZombie;
			image.deadRuner = deadRuner;
			image.godzila = godzila;
			image.spawnGodzila = spawnGodzila
			image.bloob = bloob;
			image.spawnBloob =spawnBloob;
			image.godzilaBullet = godzilaBullet;
			image.dragon = dragon;
			image.spawnDragon = spawnDragon;
			image.dragonBullet = dragonBullet;

			audio.game = gameAudio;
			audio.dead = dead ;
			audio.deadNpc = deadNpc ;
			audio.emergence = emergence ;
			audio.damageForNpc = damageForNpc ;
			audio.win = win ;
			audio.damageForPlayer = damageForPlayer;
			audio.nextLevel = nextLevel;
			audio.playerDead = playerDead;
			audio.firstAudio = 	firstAudio;
			audio.click = 	click;
			audio.hover = 	hover;
			audio.gong = gong;
		}
	}())












	HTMLAudioElement.prototype.stop = function()
	{
	this.pause();
	this.currentTime = 0.0;
	}