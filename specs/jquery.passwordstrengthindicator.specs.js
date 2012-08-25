describe("jquery.passwordStrengthIndicator", function() {
	var fixtureHtml = '<div id="root"><input type="password" id="password" /></div>';

	beforeEach(function() {
		jasmine.getFixtures().set(fixtureHtml);
	});
	
	describe("Methods", function() {
		
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
		
		it("should initialize the plugin calling it with no arguments", function () {
			var html = $("#root");
			var results = $("#password").passwordStrengthIndicator();
			expect(html.find(".password-strength-indicator").length).toEqual(1);
		});
		
		it("should get the defaults calling the plugin with 'defaults' as the first argument", function () {
			var results = $("#password").passwordStrengthIndicator("defaults");
			expect(results).toEqual(defaults);
		});
		
		it("should get the score calling the plugin with 'calculate' as the first argument and a string as the second argument", function () {
			var results = $("#password").passwordStrengthIndicator("calculate", "abc");
			expect(results).toBeGreaterThan(0);
		});
		
	});

	describe("PasswordStrengthCalculator", function() {
		var input;
		var result;

		beforeEach(function() {
			input = $("#password");
		});

		it("should give 0 points for empty string", function() {
			result = input.passwordStrengthIndicator("calculate", "");
			expect(result).toEqual(0);
		});
		
		it("should give 3 points for 1 lowercase character", function() {
			result = input.passwordStrengthIndicator("calculate", "a");
			expect(result).toEqual(3);
		});
		
		it("should give 4 points for 2 lowercase characters", function() {
			result = input.passwordStrengthIndicator("calculate", "ab");
			expect(result).toEqual(4);
		});
		
		it("should give 3 points for 1 uppercase character", function() {
			result = input.passwordStrengthIndicator("calculate", "A");
			expect(result).toEqual(3);
		});
		
		it("should give 4 points for 2 uppercase characters", function() {
			result = input.passwordStrengthIndicator("calculate", "AB");
			expect(result).toEqual(4);
		});
		
		it("should give 4 points extra when password contains a number", function() {
			result = input.passwordStrengthIndicator("calculate", "1");
			expect(result).toEqual(5);
		});
		
		it("should give 5 points extra when password contains a symbol", function() {
			result = input.passwordStrengthIndicator("calculate", "!");
			expect(result).toEqual(6);
		});
		
		it("should give 6 points for 1 lowercase, 1 uppercase characters", function() {
			result = input.passwordStrengthIndicator("calculate", "aB");
			expect(result).toEqual(6);
		});
		
		it("should give 8 points for 2 lowercase, 2 uppercase characters", function() {
			result = input.passwordStrengthIndicator("calculate", "aBcD");
			expect(result).toEqual(8);
		});
		
		it("should give 17 points for 1 lowercase, 1 uppercase characters, 1 number and 1 symbol", function() {
			result = input.passwordStrengthIndicator("calculate", "aB1?");
			expect(result).toEqual(17);
		});
		
		it("should give lots of points for a really strong password", function() {
			result = input.passwordStrengthIndicator("calculate", "This 1 is a really? strong password");
			expect(result).toEqual(48);
		});
	
	});

	describe("Indicator", function() {
		var html;
		var input;
		var defaults;

		beforeEach(function() {
			html = $("#root");
			input = $("#password").passwordStrengthIndicator();
			defaults = input.passwordStrengthIndicator("defaults");
		});
		
		function getIndicator() {
			return html.find("." + defaults.indicatorClassName);
		};

		it("should have default indicator class name", function() {
			expect(getIndicator().attr("class")).toEqual("password-strength-indicator");
		});
		
		it("should be hidden before typing", function() {
			expect(getIndicator().css("display")).toEqual("none");
		});
		
		it("should be displayed when it contains 1 ore more characters", function() {
			input.val("a").trigger("keyup");
			expect(getIndicator().css("display")).toEqual("inline-block");
		});
		
		it("should be hidden when it becomes emtpy", function() {
			input.val("a").trigger("keyup");
			expect(getIndicator().css("display")).toEqual("inline-block");
			input.val("").trigger("keyup");
			expect(getIndicator().css("display")).toEqual("none");
		});
				
		describe("Strength class names", function() {
			var html;
			var input;
			var options;

			beforeEach(function() {
				options = { indicatorClassName: "indicator" };
				
				html = $("#root");
				input = $("#password").passwordStrengthIndicator(options);
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
			
			it("should have week class for password with 7 points", function() {
				setInputValueTo("abcde");
				expect(getIndicator().hasClass("weak")).toEqual(true);
			});
			
			it("should have mediocre class for password with 13 points", function() {
				setInputValueTo("abcdefghijk");
				expect(getIndicator().hasClass("mediocre")).toEqual(true);
			});
			
			it("should have strong class for password with 19 points", function() {
				setInputValueTo("abcdefghijklmnopq");
				expect(getIndicator().hasClass("strong")).toEqual(true);
			});
			
			it("should have very-strong class for password with 25 points", function() {
				setInputValueTo("abcdefghijklmnopqrstuvwxz");
				expect(getIndicator().hasClass("very-strong")).toEqual(true);
			});

		});

	});

});