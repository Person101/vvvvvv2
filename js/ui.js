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