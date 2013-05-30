(function() {
    "use strict";

    describe("jquery.passwordStrength", function() {
        var fixtureHtml = '<div id="root"><input type="password" id="password" /></div>';

        beforeEach(function() {
            jasmine.getFixtures().set(fixtureHtml);
        });

        describe("Methods", function() {
            var defaults = {
                secureStrength: 25,

                $indicator: $("<span>&nbsp;</span>"),
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
            };

            it("should initialize the plugin calling it with no arguments", function () {
                var html = $("#root");
                $("#password").passwordStrength();

                expect(html.find(".password-strength-indicator").length).toEqual(1);
            });

            it("should get the defaults calling the plugin with 'defaults' as the first argument", function () {
                var results = $("#password").passwordStrength("defaults");

                expect(results.secureStrength).toEqual(defaults.secureStrength);
                expect(results.$indicator).toBeUndefined();
                expect(results.indicatorClassName).toEqual(defaults.indicatorClassName);
                expect(results.indicatorDisplayType).toEqual(defaults.indicatorDisplayType);
                expect(results.text).toEqual(defaults.text);
                expect(results.points).toEqual(defaults.points);
                expect(results.strengthClassNames).toEqual(defaults.strengthClassNames);
            });

            it("should get the score calling the plugin with 'calculate' as the first argument and a string as the second argument", function () {
                var results = $("#password").passwordStrength("calculate", "abc");
                expect(results).toBeGreaterThan(0);
            });

            it("should not modify the default indicator class name when setting a custom one", function() {
                $("#password").passwordStrength({
                    indicatorClassName: "different-class-name"
                });

                var defaults = $("#password").passwordStrength("defaults");
                expect(defaults.indicatorClassName).toEqual("password-strength-indicator");
            });
        });

        describe("PasswordStrengthCalculator", function() {
            var input, result;

            beforeEach(function() {
                input = $("#password");
            });

            it("should give 0 points for empty string", function() {
                result = input.passwordStrength("calculate", "");
                expect(result).toEqual(0);
            });

            it("should give 3 points for 1 lowercase character", function() {
                result = input.passwordStrength("calculate", "a");
                expect(result).toEqual(3);
            });

            it("should give 4 points for 2 lowercase characters", function() {
                result = input.passwordStrength("calculate", "ab");
                expect(result).toEqual(4);
            });

            it("should give 3 points for 1 uppercase character", function() {
                result = input.passwordStrength("calculate", "A");
                expect(result).toEqual(3);
            });

            it("should give 1 point extra for 1 space", function() {
                result = input.passwordStrength("calculate", "a b");
                expect(result).toEqual(6);
            });

            it("should give 2 points extra for 2 spaces", function() {
                result = input.passwordStrength("calculate", "a b ");
                expect(result).toEqual(8);
            });

            it("should give 4 points for 2 uppercase characters", function() {
                result = input.passwordStrength("calculate", "AB");
                expect(result).toEqual(4);
            });

            it("should give 4 points extra when password contains a number", function() {
                result = input.passwordStrength("calculate", "1");
                expect(result).toEqual(5);
            });

            it("should give 5 points extra when password contains a symbol", function() {
                result = input.passwordStrength("calculate", "!");
                expect(result).toEqual(6);
            });

            it("should give 6 points for 1 lowercase, 1 uppercase characters", function() {
                result = input.passwordStrength("calculate", "aB");
                expect(result).toEqual(6);
            });

            it("should give 6 points for 1 backslash", function() {
                result = input.passwordStrength("calculate", "\\");
                expect(result).toEqual(6);
            });

            it("should give 8 points for 2 lowercase, 2 uppercase characters", function() {
                result = input.passwordStrength("calculate", "aBcD");
                expect(result).toEqual(8);
            });

            it("should give 17 points for 1 lowercase, 1 uppercase characters, 1 number and 1 symbol", function() {
                result = input.passwordStrength("calculate", "aB1?");
                expect(result).toEqual(17);
            });

            it("should give lots of points for a really strong password", function() {
                result = input.passwordStrength("calculate", "This 1 is a really? strong password");
                expect(result).toEqual(54);
            });
        });

        describe("Indicator", function() {
            var html, input, defaults;

            beforeEach(function() {
                html = $("#root");
                input = $("#password").passwordStrength();
                defaults = input.passwordStrength("defaults");
            });

            function getIndicator() {
                return html.find("." + defaults.indicatorClassName);
            }

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
                var html, input, options;

                beforeEach(function() {
                    options = { indicatorClassName: "indicator" };

                    html = $("#root");
                    input = $("#password").passwordStrength(options);
                });

                function setInputValueTo(value) {
                    input.val(value).trigger("keyup");
                }

                function getIndicator() {
                    return html.find("." + options.indicatorClassName);
                }

                it("should have very-weak class for password with 0 points", function() {
                    setInputValueTo("");
                    expect(getIndicator().hasClass("very-weak")).toEqual(true);
                });

                it("should have weak class for password with 7 points", function() {
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

            describe("Texts", function() {
                var html, input, options;

                beforeEach(function() {
                    options = { indicatorClassName: "indicator-texts" };

                    jasmine.getFixtures().set(fixtureHtml);

                    html = $("#root");
                    input = $("#password").passwordStrength(options);
                });

                function setInputValueTo(value) {
                    input.val(value).trigger("keyup");
                }

                function getIndicator() {
                    return html.find("." + options.indicatorClassName);
                }

                it("should have text 'very weak' for password with score 0", function() {
                    setInputValueTo("");
                    expect(getIndicator().text()).toEqual("very weak");
                });

                it("should have text 'weak' for password with score 7", function() {
                    setInputValueTo("abcde");
                    expect(getIndicator().text()).toEqual("weak");
                });

                it("should have text 'mediocre' for password with score 13", function() {
                    setInputValueTo("abcdefghijk");
                    expect(getIndicator().text()).toEqual("mediocre");
                });

                it("should have text 'strong' for password with score 19", function() {
                    setInputValueTo("abcdefghijklmnopq");
                    expect(getIndicator().text()).toEqual("strong");
                });

                it("should have text 'very strong' for password with score 25", function() {
                    setInputValueTo("abcdefghijklmnopqrstuvwxz");
                    expect(getIndicator().text()).toEqual("very strong");
                });
            });
        });
    });
})();