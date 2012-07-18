$(function () {
    $.fn.passwordStrengthIndicator = function ($displayElement) {
        var $inputElement = $(this);

        var passwordStrengthPlugin = {
            secureStrength: 25,

            indicatorClassName: "password-strength-indicator",

            strengthClassNames: ["very-weak", "weak", "medium", "strong", "very-strong"],

            points: {
                forEachCharacter: 1,
                containsLowercaseLetter: 2,
                containsUppercaseLetter: 2,
                containsNumber: 4,
                containsSymbol: 5
            },

            password: "",
            strength: 0,

            refreshIndicator: function () {
                this.password = $inputElement.val();

                this.computePasswordStrength();
                this.updateIndicatorDisplay();
            },

            computePasswordStrength: function () {
                var score = this.password.length * this.points.forEachCharacter;

                if (this.passwordContainsLowercaseLetter()) score += this.points.containsLowercaseLetter;
                if (this.passwordContainsUppercaseLetter()) score += this.points.containsUppercaseLetter;
                if (this.passwordContainsNumber()) score += this.points.containsNumber;
                if (this.passwordContainsSymbol()) score += this.points.containsSymbol;

                this.strength = score;
            },

            passwordContainsLowercaseLetter: function () {
                return /[a-z]/.test(this.password);
            },

            passwordContainsUppercaseLetter: function () {
                return /[A-Z]/.test(this.password);
            },

            passwordContainsNumber: function () {
                return /[0-9]/.test(this.password);
            },

            passwordContainsSymbol: function () {
                var self = this,
                    containsSymbol = false,
                    symbols = "-!§$%&/()=?.:,~;'#+-/*\"|{}[]_<>\"".split("");

                $.each(symbols, function (index, value) {
                    if (self.password.indexOf(value) > -1) {
                        containsSymbol = true;
                        return;
                    }
                });

                return containsSymbol;
            },

            updateIndicatorDisplay: function () {
                $displayElement.show();

                if (this.password === "") {
                    $displayElement.hide();
                }

                var strengthIndex = parseInt(Math.round(this.strength * (this.strengthClassNames.length - 1) * 100 / this.secureStrength) / 100);
                if (strengthIndex >= this.strengthClassNames.length) {
                    strengthIndex = this.strengthClassNames.length - 1;
                }

                var strengthClass = this.strengthClassNames[strengthIndex];

                $.each(this.strengthClassNames, function (index, value) {
                    $displayElement.removeClass(value);
                });

                $displayElement.addClass(strengthClass);
            }
        };

        $displayElement.addClass(passwordStrengthPlugin.indicatorClassName);

        $inputElement.on("keyup", function () {
            passwordStrengthPlugin.refreshIndicator();
        });
    };
});