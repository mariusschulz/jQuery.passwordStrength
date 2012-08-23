$(function () {
	
	function PasswordStrengthCalculator() {
		return {
			calculate: function(value, points) {
				var score = value.length * points.forEachCharacter;
                return score;
			}
		};
	};
	
	function Indicator(indicator, settings) {
		var $indicator = $(indicator);
		
		var getStrengthClass = function(score) {
			var strengthIndex = parseInt(Math.round(score * (settings.strengthClassNames.length - 1) * 100 / settings.secureStrength) / 100);
			if (strengthIndex >= settings.strengthClassNames.length) {
				strengthIndex = settings.strengthClassNames.length - 1;
			}
			var strengthClass = settings.strengthClassNames[strengthIndex];
			return strengthClass;
		}
		
		return {
			refresh: function(score) {
				var strengthClass = getStrengthClass(score);
				$.each(settings.strengthClassNames, function (index, value) {
                    $indicator.removeClass(value);
                });
				$indicator.addClass(strengthClass);
			}
		};
	};
	
	var calculator;
	
	var defaults = {
		secureStrength: 25,
		
		indicatorClassName: "password-strength-indicator",
	
		points: {
			forEachCharacter: 1,
			forEachSpace: 1,
			containsLowercaseLetter: 2,
			containsUppercaseLetter: 2,
			containsNumber: 4,
			containsSymbol: 5
		},
		
		strengthClassNames: ["very-weak", "weak", "mediocre", "strong", "very-strong"]		
	};
	
	var methods = {
		init : function(options) { 
			var settings = $.extend(defaults, options);
			
			var $inputElement = $(this);
			var $indicatorElement = $("<span>&nbsp;</span>").attr("class", settings.indicatorClassName);
			
			
			var indicator = new Indicator($indicatorElement, settings);
			
			$inputElement.on("keyup", function () {
				var value = $inputElement.val();
				var score = methods.calculate(value, settings);
				indicator.refresh(score);
			});
			
			return $inputElement.after($indicatorElement);
		},
		
		calculate : function(value, options) {
			var settings = $.extend(defaults, options);
			
			if (!calculator) {
				calculator = new PasswordStrengthCalculator();
			}
			
			return calculator.calculate(value, settings.points);
		}
	};

	$.fn.psi = function(method) {

		if ( methods[method] ) {
			return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " +  method + " does not exist on jQuery.passwordStrengthIndicator");
		}

	};

    $.fn.passwordStrengthIndicator = function ($displayElement) {
        var $inputElement = $(this);

        var passwordStrengthPlugin = {
            secureStrength: 25,

            indicatorClassName: "password-strength-indicator",

            strengthClassNames: ["very-weak", "weak", "mediocre", "strong", "very-strong"],

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