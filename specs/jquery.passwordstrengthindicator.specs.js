describe("PasswordStrengthCalculator", function() {
	var input;
	var result;

	beforeEach(function() {
		jasmine.getFixtures().set('<div id="root"><input type="password" id="password" /></div>');
		
		input = $("#password");
	});

	it("should give 0 points for empty string", function() {
		result = input.psi("calculate", "");
		expect(result).toEqual(0);
	});
	
	it("should give 1 point for single lowercase letter", function() {
		result = input.psi("calculate", "a");
		expect(result).toEqual(1);
	});
	
	it("should give 2 points for two lowercase letters", function() {
		result = input.psi("calculate", "ab");
		expect(result).toEqual(2);
	});

});

describe("Indicator", function() {
	var html;
	var input;
	var options;

	beforeEach(function() {
		jasmine.getFixtures().set('<div id="root"><input type="password" id="password" /></div>');
		
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