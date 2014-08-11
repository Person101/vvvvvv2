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
    var ui = window._ui,
        templates = {},
        $window = $(window),
        $messagesBlock = $('.messages'),
        $appName = $('.app-name'), splittedAppName = $appName.text().split(''),
        colors = [ 'E39568', '8E9150', 'C2C76D', 'E8ED82', 'EFF59A', 'EBE18C', 'DC3F1C', '448D7A', 'D8A027', '88A764', '6AB1B8', '872714', '686D6E', '91872F', '5AADA2' ];

    /**
     * TEMPLATES -------------------------------------------------------------------------------------------------------
     */

    templates.message = $('<div class="message-wrap">' +
                              '<div class="message">' +
                                  '<h2 class="message-title"></h2>' +
                                  '<div class ="message-text" />' +
                                  '<div class="message-buttons">' +
                                      '<button class="message-button m-success" tabindex="1" />' +
                                      '<button class="message-button m-default" tabindex="2" />' +
                                  '</div>' +
                              '</div>' +
                          '</div>');

    /**
     * UI METHODS ------------------------------------------------------------------------------------------------------
     */

    /**
     *
     */
    ui.colorizeAppName = function () {
        var colorizedAppName = '';

        $.each(splittedAppName, function (index, char) {
            colorizedAppName += '<span style="color: #' + colors[Math.floor(Math.random() * colors.length)] + '">' + char + '</span>';
        });

        $appName.html(colorizedAppName);
    };

    /**
     *
     * @param action
     * @param cfg
     */
    ui.interactionMessage = function (action, id, cfg) {
        if ( typeof action !== 'string' || typeof id !== 'string' ) {
            throw new Error('Parameters not set!');
        }

        if ( typeof cfg !== 'object' ) {
            cfg = {};
        }

        // Implement default configuration
        cfg = $.extend(true, {}, {
            'width': 480,
            'height': 240,
            'title': 'Interactive message',
            'text': 'Hello, user!',
            'successButtonText': 'OK',
            'defaultButtonText': 'Cancel',
            'successAction': function () {
                return;
            },
            'defaultAction': function () {
                return;
            }
        }, cfg);

        switch (action) {
            case ('open'):
                $messagesBlock.addClass('m-visible');

                if ( $messagesBlock.find('.id-' + id).length === 0 ) {
                    var $messageBlock = templates.message.clone(),
                        $message = $messageBlock.find('.message'),
                        $messageTitle = $message.find('.message-title'),
                        $messageText = $message.find('.message-text'),
                        $messageButtonsBlock = $message.find('.message-buttons'),
                        $messageButtons = $message.find('.message-button'),
                        $messageButtonSuccess = $messageButtonsBlock.find('.m-success'),
                        $messageButtonDefault = $messageButtonsBlock.find('.m-default');

                    $messageBlock.css({
                        'height': cfg.height,
                        'margin-top': -(cfg.height/2)
                    })

                    $message.addClass('id-' + id).css({
                        'width': cfg.width,
                        'height': cfg.height,
                        'margin-left': -(cfg.width/2)
                    });

                    $messageTitle.text(cfg.title);
                    $messageText.html(cfg.text);
                    $messageButtonSuccess.text(cfg.successButtonText);
                    $messageButtonDefault.text(cfg.defaultButtonText);

                    $messageButtons.on('click.interactionMessageButtons', function (event) {
                        if ( $(event.target).hasClass('m-success') ) {
                            cfg.successAction();
                        }
                        if ( $(event.target).hasClass('m-default') ) {
                            cfg.defaultAction();
                        }
                    });

                    $messageBlock.appendTo($messagesBlock);
                }

                break;
            case ('hide'):
                $messagesBlock.removeClass('m-visible');

                break;
            case ('destroy'):
                $messagesBlock.removeClass('m-visible');

                $messagesBlock.find('.id-' + id).parent().remove();

                break;
        }

        return;
    };

    /**
     * INITIALIZATION --------------------------------------------------------------------------------------------------
     */

    // Application name animation
    ui.colorizeAppName();
    $window.on('keydown.appName', ui.colorizeAppName);

})(window, jQuery);