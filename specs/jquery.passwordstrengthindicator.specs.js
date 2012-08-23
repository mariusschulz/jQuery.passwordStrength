describe("jquery.passwordStrengthIndicator", function() {
	var fixtureHtml = '<div id="root"><input type="password" id="password" /></div>';

	beforeEach(function() {
		jasmine.getFixtures().set(fixtureHtml);
	});

	describe("PasswordStrengthCalculator", function() {
		var input;
		var result;

		beforeEach(function() {
			input = $("#password");
		});

		it("should give 0 points for empty string", function() {
			result = input.psi("calculate", "");
			expect(result).toEqual(0);
		});
		
		it("should give 3 point for 1 lowercase letter", function() {
			result = input.psi("calculate", "a");
			expect(result).toEqual(3);
		});
		
		it("should give 4 points for 2 lowercase letters", function() {
			result = input.psi("calculate", "ab");
			expect(result).toEqual(4);
		});
		
		it("should give 3 points for 1 uppercase letter", function() {
			result = input.psi("calculate", "A");
			expect(result).toEqual(3);
		});
		
		it("should give 4 points for 2 uppercase letter", function() {
			result = input.psi("calculate", "AB");
			expect(result).toEqual(4);
		});
		
		it("should give 4 points extra when it contains a number", function() {
			result = input.psi("calculate", "1");
			expect(result).toEqual(5);
		});
		
		it("should give 5 points extra when it contains a symbol", function() {
			result = input.psi("calculate", "!");
			expect(result).toEqual(6);
		});

	});

	describe("Indicator", function() {
		var html;
		var defaults;

		beforeEach(function() {
			html = $("#root");
			defaults = $("#password").psi().psi("defaults");
		});
		
		function getIndicator() {
			return html.find("." + defaults.indicatorClassName);
		};

		it("should have default indicator class name", function() {
			expect(getIndicator().attr("class")).toEqual("password-strength-indicator");
		});
				
		describe("Strength class names", function() {
			var html;
			var input;
			var options;

			beforeEach(function() {
				options = { indicatorClassName: "indicator" };
				
				html = $("#root");
				input = $("#password").psi(options);
			});
			
			function setInputValueTo(value) {
				input.val(value).trigger("keyup");
			};
			
			function getIndicator() {
				return html.find("." + options.indicatorClassName);
			};

			it("should have very-week class for password with 0 points", function() {
				setInputValueTo("");
				expect(getIndicator().hasClass("very-weak")).toEqual(true);
			});
			
			it("should have very-strong class for password with 25 points", function() {
				setInputValueTo("abcdefghijklmnopqrstuvwxz");
				expect(getIndicator().hasClass("very-strong")).toEqual(true);
			});

		});

	});

});