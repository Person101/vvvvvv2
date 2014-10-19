;(function (window, undefined) {

	window._vvvvvvStaticData = {};

	var staticData = window._vvvvvvStaticData;

	staticData.constants = {
		'levels': 7,
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
	};

	staticData.states = {
		'STATE_NOT_READY': 'not_ready',
		'STATE_CLEARED': 'cleared',

		'STATE_LOADING': 'loading',
		'STATE_DATA_LOADING': 'data_loading',
		'STATE_LOADED': 'loaded',
		'STATE_DATA_LOADED': 'data_loaded',
		'STATE_INITIALIZED': 'initialized',
		'STATE_READY': 'ready',
		'STATE_DATA_READY': 'data_ready',

		'STATE_REDRAWN': 'redrawn',

		'STATE_MENU_OPENED': 'menu_opened',
		'STATE_MENU_ITEM_OPENED': 'menu_item_opened',
		'STATE_MENU_ITEM_CLOSED': 'menu_item_closed',
		'STATE_MENU_CLOSED': 'menu_closed',

		'STATE_GAME_STARTED': 'game_started',
		'STATE_GAME_PAUSED': 'game_paused',
		'STATE_GAME_RESUMED': 'game_resumed',
		'STATE_GAME_ENDED': 'game_ended'
	};

	staticData.keyCodes = {
		'down':   40,
		'right':  39,
		'up':     38,
		'left':   37,
		'space':  32,
		'escape': 27,
		'enter':  13
	};

})(window);