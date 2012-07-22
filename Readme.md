# jQuery.passwordStrengthIndicator

`jQuery.passwordStrengthIndicator` is a **minimalist jQuery plugin** that **visualizes**
the **strength of a password** a user enters into a password input field.


## Example Usage

Using `jQuery.passwordStrengthIndicator` is fairly simple — you only need to call a single method on the password field you want the plugin to monitor:

    <form action="#" method="get">
        <input type="password" id="password" />
        <span id="indicator">&nbsp;</span>
    </form>

    <script type="text/javascript">
        $(function() {
            $("#password").passwordStrengthIndicator($("#indicator"));
        });
    </script>
    
    
## How does the plugin work?

The password strength algorithm is quite basic.
It keeps track of a score that increases when a user uses certain characters in his or her password.
By default, you can configure by how much the score increases every for ...

  - **each** character,
  - the usage of at least one **lowercase** character,
  - the usage of at least one **uppercase** character,
  - the usage of at least one **number**, and
  - the usage of at least one **symbol**.

The plugin's `secureStrength` property contains the score that you want to treat as secure.
To determine the password strength, the algorithm computes how many percent of the secure strength a user reached
and assigns one of the following five classes to the password strength indicator display element:

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