;(function (window, app, $, undefined) {

	app.mechanics = {};

	var $canvas = $('.vvvvvv'),
		staticData = window._vvvvvvStaticData,
		mechanics = app.mechanics;

	mechanics.options = {
		gravity: 1,
		speed: 0
	};

	mechanics.playerObject = {
		tl: [0, 0],
		tc: [0, 0],
		tr: [0, 0],
		cr: [0, 0],
		br: [0, 0],
		bc: [0, 0],
		bl: [0, 0],
		cl: [0, 0]
	};

	mechanics.intervals = {};

	mechanics.setPlayerObject = function () {
		var player = $canvas.getLayer('player');

		mechanics.playerObject = {
			tl: [player.x, player.y],
			tc: [player.x + player.width / 2, player.y],
			tr: [player.x + player.width, player.y],
			cr: [player.x + player.width, player.y + player.height / 2],
			br: [player.x + player.width, player.y + player.height],
			bc: [player.x + player.width / 2, player.y + player.height],
			bl: [player.x, player.y + player.height],
			cl: [player.x, player.y + player.height / 2]
		};
	};

	mechanics.collisionDetectVertical = function () {
		var _this = app,
			data = _this.parsedLayerData,
			model = _this.mechanics.options,
			vector = 'idle',
			points = [];

		if ( model.gravity === 1 ) {
			vector = 'bottom';
			if ( model.speed > 0 ) {
				vector += '-right';
			}
			if ( model.speed < 0 ) {
				vector += '-left';
			}
		}

		if ( model.gravity === -1 ) {
			vector = 'top';
			if ( model.speed > 0 ) {
				vector += '-right';
			}
			if ( model.speed < 0 ) {
				vector += '-left';
			}
		}

		if ( /^bottom/.test(vector) ) {
			points = [_this.mechanics.playerObject.bc];
		}

		if ( /^top/.test(vector) ) {
			points = [_this.mechanics.playerObject.tc];
		}

		for ( var i = 0; i < data.walls.length; i++ ) {
			var wallSquare = [
				[data.walls[i].x, data.walls[i].y],
				[data.walls[i].x + 20, data.walls[i].y],
				[data.walls[i].x + 20, data.walls[i].y + 20],
				[data.walls[i].x, data.walls[i].y + 20]
			];

			for ( var j = 0; j < points.length; j++ ) {
				if ( _this.utils.detectIntersect(points[j], wallSquare) ) {
					return true;
				}
			}
		}

		return false;
	};

	mechanics.collisionDetectHorizontal = function () {
		var _this = app,
			data = _this.parsedLayerData,
			model = _this.mechanics.options,
			point = [];

		if ( model.speed > 0 ) {
			point = _this.mechanics.playerObject.cr;
		}
		if ( model.speed < 0 ) {
			point = _this.mechanics.playerObject.cl;
		}


		for (var i = 0; i < data.walls.length; i++) {
			var wallSquare = [
				[data.walls[i].x, data.walls[i].y],
				[data.walls[i].x + 20, data.walls[i].y],
				[data.walls[i].x + 20, data.walls[i].y + 20],
				[data.walls[i].x, data.walls[i].y + 20]
			];

			if ( _this.utils.detectIntersect(point, wallSquare) ) {
				return true;
			}
		}

		return false;
	};

	mechanics.enemyCollision = function () {
		var _this = app,
			data = _this.parsedLayerData;

		for (var i = 0; i < data.enemies.length; i++) {
			var enemySquare = [
				[data.enemies[i].x, data.enemies[i].y],
				[data.enemies[i].x + 20, data.enemies[i].y],
				[data.enemies[i].x + 20, data.enemies[i].y + 20],
				[data.enemies[i].x, data.enemies[i].y + 20]
			];

			for ( var point in _this.mechanics.playerObject ) {
				if ( _this.utils.detectIntersect(_this.mechanics.playerObject[point], enemySquare) ) {
					return true;
				}
			}
		}

		return false;
	};

	mechanics.playerMove = function (event) {
		var _this = this,
			model = _this.mechanics.options;

		switch (event.keyCode) {
			case staticData.keyCodes.up:
				model.gravity = -1;
				break;
			case staticData.keyCodes.down:
				model.gravity = 1;
				break;
			case staticData.keyCodes.left:
				model.speed = -1;
				break;
			case staticData.keyCodes.right:
				model.speed = 1;
				break;
		}
	};

	mechanics.playerStop = function (event) {
		var _this = this,
			model = _this.mechanics.options;

		switch (event.keyCode) {
			case staticData.keyCodes.left:
				model.speed = 0;
				break;
			case staticData.keyCodes.right:
				model.speed = 0;
				break;
		}
	};

	mechanics.movement = function () {
		var _this = this,
			model = _this.mechanics.options,
			player = $canvas.getLayer('player'),
			source = player.source;

		_this.mechanics.setPlayerObject();

		if ( model.speed === -1 ) {
			source = 'assets/player_inverted_sprite.png';
		}

		if ( model.speed === 1 ) {
			source = 'assets/player_sprite.png';
		}

		if ( model.gravity === -1 ) {
			if ( model.speed === -1 ) {
				source = 'assets/player_sprite.png';
			}

			if ( model.speed === 1 ) {
				source = 'assets/player_inverted_sprite.png';
			}
		}

		if ( _this.mechanics.enemyCollision() ) {
			_this.mechanics.resetMovement();
			_this.playerDeath();
		}

		$canvas.setLayer('player', {
			source: source,
			rotate: (model.gravity > 0 ? 0 : 180),
			y: '+=' + ( !_this.mechanics.collisionDetectVertical() ? model.gravity * 3 : 0),
			x: '+=' + ( !_this.mechanics.collisionDetectHorizontal() ? model.speed : 0 )
		});
	};

	mechanics.processMovement = function () {
		var _this = app;

		_this.mechanics.intervals.movement = setInterval($.proxy(mechanics.movement, app), 5);
	};

	mechanics.resetMovement = function () {
		var _this = app;

		_this.mechanics.options = {
			gravity: 1,
			speed: 0
		};

		clearInterval(_this.mechanics.intervals.movement);
	};

})(window, window._vvvvvv, window.jQuery);