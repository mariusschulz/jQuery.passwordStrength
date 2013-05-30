# jQuery.passwordStrength

`jQuery.passwordStrength` is a **minimalist jQuery plugin** that **visualizes**
the **strength of a password** a user enters into a password input field.


## Example Usage

Using `jQuery.passwordStrength` is fairly simple — you only need to call a single method on the password field you want the plugin to monitor:

```html
<form action="#" method="get">
    <input type="password" id="password" />
</form>

<script type="text/javascript">
    $(function() {
        $("#password").passwordStrength();
    });
</script>
```


## How does the plugin work?

The password strength algorithm is quite basic.
It keeps track of a score that increases when a user uses certain characters in their password.
By default, you can configure by how much the score increases for ...

  - **each** character,
  - **each** space,
  - the usage of at least one **lowercase** character,
  - the usage of at least one **uppercase** character,
  - the usage of at least one **number**, and
  - the usage of at least one **symbol**.

The plugin's `secureStrength` property contains the score that you consider secure.
To determine the password strength, the algorithm computes how many percent of the secure strength a user reached
and assigns one of the following five classes to the password strength indicator display element accordingly:

  - *very-weak*
  - *weak*
  - *mediocre*
  - *strong*
  - *very-strong*

You can add classes to or remove classes from the existing array without having to modify the plugin itself.
Note that classes in the `strengthClassNames` array need to be ordered from the weakest to the strongest
as the index of the class to return is computed according to the achived score (it's distributed linearly).

To display the password strength, you can simply apply CSS formatting to the classes provided;
please refer to the demos for examples.
Of course, nobody stops you from doing some fancy JavaScript stuff based on the assigned classes!

## Options
Below are the options and the default values that you can override by passing a settings object into the plugin.

```javascript
$("#password").passwordStrength({
    // The password strength you consider secure
    secureStrength: 25,

    // Allows you to specify a custom indicator element (arbitrary jQuery selection)
    $indicator: undefined,

    // The class that the indicator element will have
    indicatorClassName: "password-strength-indicator",

    // CSS "display" property of the indicator elements
    indicatorDisplayType: "inline-block",

    // Points for different character sets
    points: {
        forEachCharacter: 1,
        forEachSpace: 1,
        containsLowercaseLetter: 2,
        containsUppercaseLetter: 2,
        containsNumber: 4,
        containsSymbol: 5
    },

    // The class names to give the indicator element, according to the current password strength
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
});
```
