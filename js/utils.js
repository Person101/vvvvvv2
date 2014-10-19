;(function (window, app, $, undefined) {

	app.utils = {};

	var utils = app.utils;

	utils.parseLayerData = function (levelData) {
		var _this = this,
				parsedData = {
					'startPoint': {
						x: 0, y: 0
					},
					'space': [],
					'walls': [],
					'enemies': []
				};

		levelData = levelData.split('\n');

		for (var i = (levelData.length - 1); i >= 0; i--) {
			if ( levelData[i] ) {
				levelData[i] = levelData[i].split(' ');
			}
		}

		for (var i = 0; i <= (levelData.length - 1); i++) {
			for (var j = 0; j <= (levelData[i].length - 1); j++) {
				var currentCoords = {
					x: j * 20, y: i * 20
				};

				switch (parseInt(levelData[i][j], 10)) {
					case 0: // Moving space
						parsedData.space.push(currentCoords);
						break;
					case 1: // Walls
						parsedData.walls.push(currentCoords);
						break;
					case 2: // Enemy facing top
						parsedData.enemies.push({
							x: currentCoords.x, y: currentCoords.y,
							sx: 0, sy: 0
						});
						break;
					case 3: // Enemy facing left
						parsedData.enemies.push({
							x: currentCoords.x, y: currentCoords.y,
							sx: 20, sy: 0
						});
						break;
					case 4: // Enemy facing right
						parsedData.enemies.push({
							x: currentCoords.x, y: currentCoords.y,
							sx: 0, sy: 20
						});
						break;
					case 5: // Enemy facing bottom
						parsedData.enemies.push({
							x: currentCoords.x, y: currentCoords.y,
							sx: 20, sy: 20
						});
						break;
					case 9: // Start point
						parsedData.startPoint = {
							x: currentCoords.x, y: currentCoords.y
						};
						break;
				}
			}
		}

		return parsedData;
	};

	utils.detectIntersect = function (point, vs) {
		var x = point[0], y = point[1];

		var inside = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
			var xi = vs[i][0], yi = vs[i][1];
			var xj = vs[j][0], yj = vs[j][1];

			var intersect = ((yi > y) != (yj > y))
					&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}

		return inside;
	};

	/**
	 *
	 * @param object
	 * @returns {number}
	 */
	utils.objectLength = function (object) {
		var size = 0, key;

		for (key in object) {
			if ( object.hasOwnProperty(key) ) {
				size++;
			}
		}

		return size;
	};

})(window, window._vvvvvv, window.jQuery);