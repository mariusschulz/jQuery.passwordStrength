# jQuery.passwordStrengthIndicator

`jQuery.passwordStrengthIndicator` is a minimalist jQuery plugin that allows you to visualize the strength of a password a user enters into a password input field.

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