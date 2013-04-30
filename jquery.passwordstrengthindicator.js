$(function() {
	
	function PasswordStrengthCalculator() {
		function passwordContainsLowercaseLetter (value) {
			return /[a-z]/.test(value);
		}

		function passwordContainsUppercaseLetter (value) {
			return /[A-Z]/.test(value);
		}
		
		function passwordContainsSpaces(value) {
			return / /.test(value);
		}
		
		function passwordContainsNumber(value) {
			return /[0-9]/.test(value);
		}
		
		function passwordContainsSymbol(value) {
			var self = this,
				containsSymbol = false,
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
				
				if (passwordContainsSpaces(value)) score += countSpaces(value) * points.forEachSpace;
				if (passwordContainsLowercaseLetter(value)) score += points.containsLowercaseLetter;
				if (passwordContainsUppercaseLetter(value)) score += points.containsUppercaseLetter;
				if (passwordContainsNumber(value)) score += points.containsNumber;
				if (passwordContainsSymbol(value)) score += points.containsSymbol;
				
                return score;
			}
		};
	};
	
	function Indicator(indicator, settings) {
		var $indicator = $(indicator).hide();
		
		function getStrengthClass(score) {
			var strengthIndex = parseInt(Math.round(score * (settings.strengthClassNames.length - 1) * 100 / settings.secureStrength) / 100);
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
		
		indicatorDisplayType: "inline-block",
	
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
		init: function(options) { 
			var settings = $.extend({}, defaults, options);
			
			var $inputElement = $(this);
			var $indicatorElement = $("<span>&nbsp;</span>").attr("class", settings.indicatorClassName);
			
			var indicator = new Indicator($indicatorElement, settings);
			
			$inputElement.on("keyup", function() {
				var password = $inputElement.val();
				var score = methods.calculate(password, settings);
				indicator.refresh(score);
			});
			
			return $inputElement.after($indicatorElement);
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

	$.fn.passwordStrengthIndicator = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " +  method + " does not exist on jQuery.passwordStrengthIndicator");
		}
	};

});