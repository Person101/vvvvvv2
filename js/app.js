/**
 Copyright (c) Andrew Ozdion aka Aahz

 This file is part of vvvvvv2.

 vvvvvv2 is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 vvvvvv2 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */

;(function (window, $, undefined) {"use strict";

    window._vvvvvv = {};

    var app = window._vvvvvv,
		staticData = window._vvvvvvStaticData,
        ui = window._ui,
        cookie = $.cookie,
        removeCookie = $.removeCookie,
        $window = $(window),
        $canvas = $('.vvvvvv'),
        $canvasWrap = $canvas.parent(),
        constats = staticData.constants,
        states = staticData.states,
        keyCodes = staticData.keyCodes,
        levels = [],
        baseMenuTextLayer = {
            layer: true,
            groups: ['menuItems'],
            fontFamily: '"Press Start 2P"',
            fontSize: constats.menuFontSize,
            index: 1,
            fillStyle: constats.colors.baseColor,
            fromCenter: false
        };

    app.options = {
        'currentMenuItem': undefined,
        'currentMenuItemNumber': undefined,
        'state': states.STATE_NOT_READY
    };

	app.mechanics = {};

    app.states = states;

	app.parsedLayerData = {};
	app.intervals = {};

    app.menuActions = {};
    app.utils = {};

    /**
     * Base methods ----------------------------------------------------------------------------------------------------
     */

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.init = function () {
        var _this = this;

        _this.clearCanvas();

        _this.loadLevels();

        $canvas.on('statechange', function (event, data) {
            if ( data.currentState === states.STATE_DATA_READY ) {
                _this.endLoading();

                _this.setMenuItemByNumber();

                _this.setState(states.STATE_INITIALIZED);

                _this.generateMenuScreen();
            }
        });

        return _this;
    };

	/**
	 *
	 */
    app.destroy = function () {
        var _this = this;

        _this.destroyMenu();
    };

    /**
     * MENU OPERATIONS -------------------------------------------------------------------------------------------------
     */

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.generateMenuScreen = function () {
        var _this = this;

        _this.clearCanvas();

        $canvas
            .drawImage({
                layer: true,
                name: 'background',
                source: 'ui/menu-bg.png',
                x: 0, y: 0,
                width: constats.width, height: constats.height,
                index: 0,
                opacity: .5,
                fromCenter: false
            });

        _this.buildMenu();

        $window.on('keydown.appMenu', $.proxy(_this.processMenuNavigation, _this));

        _this.setState(states.STATE_MENU_OPENED);

        return _this;
    };

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.buildMenu = function () {
        var _this = this;

        $canvas
            .drawText($.extend({}, baseMenuTextLayer, {
                name: 'menuItem_1',
                x: 20 + constats.menuStartX, y: 10 + constats.menuStartY,
                text: 'Continue',
                opacity: (cookie('vvvvvv-progress') ? 1 : .2)
            }))
            .drawText($.extend({}, baseMenuTextLayer, {
                name: 'menuItem_2',
                x: 35 + constats.menuStartX, y: constats.menuFontSize + 20 + constats.menuStartY,
                text: 'New game',
                fillStyle: constats.colors.menuColor_2
            }))
            .drawText($.extend({}, baseMenuTextLayer, {
                name: 'menuItem_3',
                x: 20 + constats.menuStartX, y: constats.menuFontSize * 2 + 30 + constats.menuStartY,
                text: 'How to play'
            }))
            .drawText($.extend({}, baseMenuTextLayer, {
                name: 'menuItem_4',
                x: 20 + constats.menuStartX, y: constats.menuFontSize * 3 + 40 + constats.menuStartY,
                text: 'About & Credits'
            }))
            .drawText($.extend({}, baseMenuTextLayer, {
                name: 'menuItem_5',
                x: 20 + constats.menuStartX, y: constats.menuFontSize * 4 + 50 + constats.menuStartY,
                text: 'Exit'
            }));

        $canvas.animateLayerGroup('menuItems', {
            x: '+=' + (-constats.menuStartX)
        }, constats.menuAnimationTime);

        return _this;
    };

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.destroyMenu = function () {
        var _this = this;

        $canvas.animateLayerGroup('menuItems', {
            x: '-=' + (-constats.menuStartX)
        }, constats.menuAnimationTime, function (layer) {
            $canvas.removeLayerGroup('menuItems');
            _this.redrawLayers();
        });

        _this.setState(states.STATE_MENU_CLOSED);

        return _this;
    };

    /**
     *
     * @param event
     */
    app.processMenuNavigation = function (event) {
        var _this = this,
            previousMenuItem = _this.options.currentMenuItemNumber;

        // Navigation actions
        switch (event.keyCode){
            case (keyCodes.up):
            case (keyCodes.right):
                if ( _this.options.currentMenuItemNumber !== (cookie('vvvvvv-progress') ? 1 : 2) ) {
                    _this.options.currentMenuItemNumber--;
                }
                else {
                    _this.options.currentMenuItemNumber = _this.utils.objectLength(constats.menuItems);
                }

                _this.setMenuItemByNumber(_this.options.currentMenuItemNumber);

                break;
            case (keyCodes.down):
            case (keyCodes.left):
                if ( _this.options.currentMenuItemNumber !== _this.utils.objectLength(constats.menuItems) ) {
                    _this.options.currentMenuItemNumber++;
                }
                else {
                    _this.options.currentMenuItemNumber = (cookie('vvvvvv-progress') ? 1 : 2);
                }

                _this.setMenuItemByNumber(_this.options.currentMenuItemNumber);

                break;
            case (keyCodes.enter):
            case (keyCodes.space):
                if ( _this.menuActions.hasOwnProperty('action' + _this.options.currentMenuItem) ) {
                    $.proxy(_this.menuActions['action' + _this.options.currentMenuItem], _this)();
                }

                break;
        }

        // Navigation animation
        if ( event.keyCode === keyCodes.up || event.keyCode === keyCodes.right || event.keyCode === keyCodes.down || event.keyCode === keyCodes.left ) {
            $canvas
                .animateLayer('menuItem_' + _this.options.currentMenuItemNumber, {
                    fillStyle: constats.colors['menuColor_' + _this.options.currentMenuItemNumber],
                    x: 35
                })
                .animateLayer('menuItem_' + previousMenuItem, {
                    fillStyle: constats.colors.baseColor,
                    x: 20
                });
        }
    };

    /**
     *
     * @param number
     * @returns {window._vvvvvv}
     */
    app.setMenuItemByNumber = function (number) {
        var _this = this,
            i;

        if ( !number ) {
            number = 2;
            _this.options.currentMenuItemNumber = 2;
        }

        for ( i in constats.menuItems ) {
            if ( constats.menuItems[i] === number ) {
                _this.options.currentMenuItem = i;
            }
        }

        return _this;
    };

    /**
     * LEVEL OPERATIONS ------------------------------------------------------------------------------------------------
     */

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.loadLevels = function () {
        var _this = this;

        for (var i = 1; i <= constats.levels; i++) {
            _this.loadLevelData(i);
        }

        return _this;
    }

    /**
     *
     * @param level
     */
    app.loadLevelData = function (level) {
        var _this = this,
            result,
            request = $.ajax({
                url: "levels/level" + level + ".txt",
                beforeSend: function(xhr) {
                    xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                    _this.setState(states.STATE_DATA_LOADING);
                },
                context: document.body
            });

        request
            .done(function(data) {
                result = {
                    'level': level,
                    'data': data
                };

                levels[level] = result;

                _this.setState(states.STATE_DATA_LOADED, result);
            })
            .always(function () {
                if (level === constats.levels) {
                    _this.setState(states.STATE_DATA_READY);
                }
            });
    };

    /**
     * GAME OPERATIONS -------------------------------------------------------------------------------------------------
     */

    /**
     *
     */
    app.startGame = function (level) {
        var _this = this;

        if ( cookie('vvvvvv-progress') && !level ) {
            ui.interactionMessage('open', 'start-new-game', {
                'title': 'Hmm... You have saved progress',
                'text': 'We found some progress data of your previous game. If you\'ll start new game, all your previous progress will be lost!<br/><strong>Do you want to proceed?</strong>',
                'successButtonText': 'Yes',
                'defaultButtonText': 'No',
                'successAction': function () {
                    removeCookie('vvvvvv-progress');

                    ui.interactionMessage('destroy', 'start-new-game');

                    _this.startGame(1);
                },
                'defaultAction': function () {
                    ui.interactionMessage('destroy', 'start-new-game');
                }
            });
        }
        else {
            cookie('vvvvvv-progress', level);

            _this.setState(states.STATE_GAME_STARTED, {'currentLevel': level});

            _this.drawLevel(level);
        }
    };

    app.drawLevel = function (level) {
        var _this = this,
            levelData = {
                'image': 'levels/level' + level + '.jpg',
                'data': levels[level].data,
	            'number': parseInt(cookie('vvvvvv-progress'), 10)
            };

	    _this.parsedLayerData = _this.utils.parseLayerData(levelData.data);

        _this.clearCanvas();

        _this.createSkyLayer();
	    _this.createEnvironmentLayer(levelData);
	    _this.createPlayerLayer(levelData);

	    for (var i = (_this.parsedLayerData.enemies.length - 1); i >= 0; i--) {
		    _this.createEnemyLayer(_this.parsedLayerData.enemies[i], i);
	    }

	    return levelData;
    };

    /**
     * STATE OPERATIONS ------------------------------------------------------------------------------------------------
     */

    /**
     *
     * @param state
     * @param data
     * @returns {window._vvvvvv}
     */
    app.setState = function (state, data) {
        var _this = this,
            eventType = 'statechange',
            defaultData = {
                'previousState': _this.options.state || states.STATE_NOT_READY,
                'currentState': state
            };

        _this.options.state = state;

        if ( typeof data === 'undefined' ) {
            data = {};
        }

        $canvas.trigger(eventType, $.extend(defaultData, data));

        return this;
    };

    /**
     * CANVAS OPERATIONS -----------------------------------------------------------------------------------------------
     */

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.redrawLayers = function () {
        var _this = this;

        $canvas.drawLayers();

        _this.setState(states.STATE_REDRAWN);

        return _this;
    };

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.clearCanvas = function () {
        var _this = this;

        $canvas
            .removeLayers()
            .clearCanvas();

        _this.setState(states.STATE_CLEARED);

        return _this;
    };

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.startLoading = function () {
        var _this = this;

        _this.setState(states.STATE_LOADING);

        $canvasWrap.addClass('m-loading');

        return _this;
    };

    /**
     *
     * @returns {window._vvvvvv}
     */
    app.endLoading = function () {
        var _this = this;

        _this.setState(states.STATE_LOADED);

        $canvasWrap.removeClass('m-loading');

        return _this;
    };

    /**
     * MENU ACTIONS ----------------------------------------------------------------------------------------------------
     */

    app.menuActions.actionContinue = function () {
        var _this = this;

        _this.startGame(cookie('vvvvvv-progress'));
    };

    app.menuActions.actionNewGame = function () {
        var _this = this;

        _this.startGame();
    };

    app.menuActions.actionHowToPlay = function () {
        var _this = this;

        _this.setState(states.STATE_MENU_ITEM_OPENED, {'item': _this.options.currentMenuItem});
    };

    app.menuActions.actionAboutAndCredits = function () {
        var _this = this;

        _this.setState(states.STATE_MENU_ITEM_OPENED, {'item': _this.options.currentMenuItem});
    };

    app.menuActions.actionExit = function () {
        var _this = this;

        _this.setState(states.STATE_MENU_ITEM_OPENED, {'item': _this.options.currentMenuItem});

        ui.interactionMessage('open', 'close-dialog', {
            'title': 'You are going to leave the game...',
            'text': 'It seems you are leaving now. All unsaved progress will be lost.<br/><strong>Are you shure?</strong>',
            'successButtonText': 'Yes',
            'defaultButtonText': 'No',
            'successAction': function () {
                _this.destroy();

                window.close();
            },
            'defaultAction': function () {
                ui.interactionMessage('destroy', 'close-dialog');
            }
        });
    };

    /**
     * GAME ------------------------------------------------------------------------------------------------------------
     */

	/**
	 *
	 */
    app.createSkyLayer = function () {
        var _this = this;

        $canvas
            .drawImage({
                layer: true,
                name: 'background',
                source: 'assets/sky.png',
                x: 0, y: 0,
                width: constats.width * 2, height: constats.height,
                index: 0,
                fromCenter: false
            })
            .animateLayer('background', {
                x: -constats.width
            }, 2000, 'linear', function () {
                $canvas.removeLayer('background');

                _this.createSkyLayer();
            });
    };

	/**
	 *
	 * @param level
	 */
	app.createEnvironmentLayer = function (level) {
		var _this = this;

		$canvas
			.drawImage({
				layer: true,
				name: 'environment',
				source: 'levels/level' + level.number + '.png',
				x: 0, y: 0,
				width: constats.width, height: constats.height,
				index: 1,
				fromCenter: false
			});
	};

	/**
	 *
	 * @param level
	 */
	app.createPlayerLayer = function () {
		var _this = this,
			data = _this.parsedLayerData,
			directionUp = false;

		clearInterval(app.intervals.playerJump);

		$canvas
			.drawImage({
				layer: true,
				name: 'player',
				source: 'assets/player_sprite.png',
				x: data.startPoint.x, y: data.startPoint.y,
				width: 20, height: 40,
				sWidth: 20, sHeight: 40,
				sx: 0, sy: 0,
				index: 2,
				fromCenter: false
			});

		$window.on('keydown.mechanics', $.proxy(_this.mechanics.playerMove, _this));
		$window.on('keyup.mechanics', $.proxy(_this.mechanics.playerStop, _this));

		_this.mechanics.processMovement();

		app.intervals.playerJump = window.setInterval(function () {
			$canvas.setLayer('player', {
				sx: (directionUp ? 0 : 20)
			}).drawLayer('player');

			directionUp = !directionUp;
		}, 700);
	};

	app.playerDeath = function () {
		var _this = this,
			data = _this.parsedLayerData,
			player = $canvas.getLayer('player');

		$canvas
			.animateLayer('player', {
				opacity: 0
			}, 100, function (layer) {
				$canvas.animateLayer(layer, {
					opacity: 1
				}, 100, function (layer) {
					$canvas.animateLayer(layer, {
						opacity: 0
					}, 100, function (layer) {
						$canvas.removeLayer(layer);
						_this.createPlayerLayer();
					});
				});
			})
	};

	app.createEnemyLayer = function (data, index) {
		var _this = this;

		$canvas.drawImage({
			layer: true,
			name: 'enemy_' + index,
			group: ['enemies'],
			source: 'assets/enemy_sprite.png',
			x: data.x, y: data.y,
			width: 20, height: 20,
			sWidth: 20, sHeight: 20,
			sx: data.sx, sy: data.sy,
			index: 3,
			fromCenter: false
		});
	};

})(window, jQuery);