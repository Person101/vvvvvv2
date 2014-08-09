;(function (window, $, undefined) {"use strict";

    window._vvvvvv = {};

    var app = window._vvvvvv,
        $window = $(window),
        $canvas = $('.vvvvvv'),
        $canvasWrap = $canvas.parent(),
        constats = {
            'width': 640,
            'height': 480,
            'menuFontSize': 36,
            'menuStartX': -960,
            'menuStartY': 90,
            'menuAnimationTime': 1000,
            'menuItems': {
                'Continue': 1,
                'NewGame': 2,
                'HowToPlay': 3,
                'AboutAndCredits': 4,
                'Exit': 5
            },
            'colors': {
                'baseColor': 'rgb(255,255,255)',
                'menuColor_1': 'rgb(48, 70, 68)',
                'menuColor_2': 'rgb(55, 113, 93)',
                'menuColor_3': 'rgb(76, 179, 93)',
                'menuColor_4': 'rgb(127, 226, 106)',
                'menuColor_5': 'rgb(184, 234, 87)'
            }
        },
        states = {
            'STATE_NOT_READY': 'not_ready',
            'STATE_CLEARED': 'cleared',

            'STATE_LOADING': 'loading',
            'STATE_LOADED': 'loaded',
            'STATE_INITIALIZED': 'initialized',
            'STATE_READY': 'ready',

            'STATE_REDRAWN': 'redrawn',

            'STATE_MENU_OPENED': 'menu_opened',
            'STATE_MENU_ITEM_OPENED': 'menu_item_opened',
            'STATE_MENU_ITEM_CLOSED': 'menu_item_closed',
            'STATE_MENU_CLOSED': 'menu_closed'
        },
        keyCodes = {
            'down':   40,
            'right':  39,
            'up':     38,
            'left':   37,
            'space':  32,
            'escape': 27,
            'enter':  13
        },
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

    app.states = states;

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

        _this.endLoading();

        _this.setMenuItemByNumber();

        _this.setState(states.STATE_INITIALIZED);

        _this.generateMenuScreen();

        return _this;
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
                text: 'Continue'
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
                if ( _this.options.currentMenuItemNumber !== 1 ) {
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
                    _this.options.currentMenuItemNumber = 1;
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

        $canvas.clearCanvas();

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

        _this.setState(states.STATE_MENU_ITEM_OPENED, {'item': _this.options.currentMenuItem});
    };

    app.menuActions.actionNewGame = function () {
        var _this = this;

        _this.setState(states.STATE_MENU_ITEM_OPENED, {'item': _this.options.currentMenuItem});
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
    };

    /**
     * UTILITIES -------------------------------------------------------------------------------------------------------
     */

    /**
     *
     * @param object
     * @returns {number}
     */
    app.utils.objectLength = function (object) {
        var size = 0, key;

        for (key in object) {
            if ( object.hasOwnProperty(key) ) {
                size++;
            }
        }

        return size;
    };

})(window, jQuery);