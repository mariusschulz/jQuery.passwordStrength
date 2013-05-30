$(function() {
    "use strict";

    function PasswordStrengthCalculator() {

        function passwordContainsLowercaseLetter(value) {
            return (/[a-z]/).test(value);
        }

        function passwordContainsUppercaseLetter(value) {
            return (/[A-Z]/).test(value);
        }

        function passwordContainsSpaces(value) {
            return (/ /).test(value);
        }

        function passwordContainsNumber(value) {
            return (/[0-9]/).test(value);
        }

        function passwordContainsSymbol(value) {
            var containsSymbol = false,
                symbols = "-!§$%&/()=?.:,~;'#+-/*\\|{}[]_<>\"".split("");

            $.each(symbols, function(index, symbol) {
                if (value.indexOf(symbol) > -1) {
                    containsSymbol = true;

                    // We found a symbol. Therefore, return false to exit $.each early (short-circuit).
                    return false;
                }
            });

            return containsSymbol;
        }

        function countSpaces(value) {
            return value.split(/ +/).length - 1;
        }

        return {
            calculate: function(value, points) {
                var score = value.length * points.forEachCharacter;

                if (passwordContainsSpaces(value)) { score += countSpaces(value) * points.forEachSpace; }
                if (passwordContainsLowercaseLetter(value)) { score += points.containsLowercaseLetter; }
                if (passwordContainsUppercaseLetter(value)) { score += points.containsUppercaseLetter; }
                if (passwordContainsNumber(value)) { score += points.containsNumber; }
                if (passwordContainsSymbol(value)) { score += points.containsSymbol; }

                return score;
            }
        };
    }

    function Indicator(indicator, settings) {
        var $indicator = $(indicator).hide();

        function getStrengthClass(score) {
            var strengthIndex = parseInt(Math.round(score * (settings.strengthClassNames.length - 1) * 100 / settings.secureStrength) / 100, 10);
            if (strengthIndex >= settings.strengthClassNames.length) {
                strengthIndex = settings.strengthClassNames.length - 1;
            }

            return settings.strengthClassNames[strengthIndex];
        }

        return {
            refresh: function(score) {
                if (score > 0) {
                    $indicator.css("display", settings.indicatorDisplayType);
                } else {
                    $indicator.hide();
                }

                var strengthClass = getStrengthClass(score);
                $.each(settings.strengthClassNames, function(index, value) {
                    $indicator.removeClass(value.name);
                });
                $indicator.addClass(strengthClass.name);

                if (settings.text) {
                    $indicator.text(strengthClass.text);
                }
            }
        };
    }

    var calculator,
        defaults = {
            secureStrength: 25,

            $indicator: undefined,
            indicatorClassName: "password-strength-indicator",
            indicatorDisplayType: "inline-block",

            text: true,

            points: {
                forEachCharacter: 1,
                forEachSpace: 1,
                containsLowercaseLetter: 2,
                containsUppercaseLetter: 2,
                containsNumber: 4,
                containsSymbol: 5
            },

            strengthClassNames: [{
                name: "very-weak",
                text: "very weak"
            }, {
                name: "weak",
                text: "weak"
            }, {
                name: "mediocre",
                text: "mediocre"
            }, {
                name: "strong",
                text: "strong"
            }, {
                name: "very-strong",
                text: "very strong"
            }]
        },

        methods = {
            init: function(options) {
                var settings = $.extend({}, defaults, options),
                    $input = $(this),
                    $indicator = getIndicatorElement($input, settings),
                    indicator = new Indicator($indicator, settings);

                setupAutomaticIndicatorRefresh(indicator, $input, settings);

                return $input;
            },

            calculate: function(value, options) {
                var settings = $.extend(defaults, options);

                if (!calculator) {
                    calculator = new PasswordStrengthCalculator();
                }

                return calculator.calculate(value, settings.points);
            },

            defaults: function() {
                return defaults;
            }
        };

    function getIndicatorElement($input, settings) {
        var $indicator = settings.$indicator || $("<span>&nbsp;</span>").insertAfter($input);

        return $indicator.attr("class", settings.indicatorClassName);
    }

    function setupAutomaticIndicatorRefresh(indicator, $input, settings) {
        var refresh = function() {
            var password = $input.val(),
                score = methods.calculate(password, settings);

            indicator.refresh(score);
        };

        $input.on("keyup", refresh);
    }

    $.fn.passwordStrengthIndicator = $.fn.passwordStrength = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        }

        $.error("Method " +  method + " does not exist on jQuery.passwordStrength");
    };
});