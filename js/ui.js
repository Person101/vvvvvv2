;(function (window, $, undefined) {

    window._ui = {};
    var ui = window._ui;

    ui.colorizeAppName = function () {
        var colorizedAppName = '';

        $.each(splittedAppName, function (index, char) {
            colorizedAppName += '<span style="color: #' + colors[Math.floor(Math.random() * colors.length)] + '">' + char + '</span>';
        });

        $appName.html(colorizedAppName);
    };

    var $window = $(window),
        $appName = $('.app-name'), splittedAppName = $appName.text().split(''),
        colors = [ 'E39568', '8E9150', 'C2C76D', 'E8ED82', 'EFF59A', 'EBE18C', 'DC3F1C', '448D7A', 'D8A027', '88A764', '6AB1B8', '872714', '686D6E', '91872F', '5AADA2' ];

    // Application name animation
    ui.colorizeAppName();
    $window.on('keydown.appName', ui.colorizeAppName);

})(window, jQuery);