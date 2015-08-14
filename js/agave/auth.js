jQuery(document).ready(function() {

    //jQuery('form#upload_form').uploadProgress({keyLength: 11 });
    OAuth.initialize('X5i9WnqNjrtbFPz1lCAHd6Wvn-A');

    $('#signin').click(function(e) {
        e.preventDefault();
        // if logged in, clear Auth Token, prompt user to sign in
        if ($('#signin').html() == 'Sign Out')
        {
            clearAuthToken();
            $('#signin').html('Sign In');
        }
        else  // user is not logged in, prompt user to sign in via OAuth
        {
            OAuth.popup('agave', function(error, result) {
                //handle error with error
                if (error) {
                    $('#login-error-modal').modal({backdrop: 'static',show: true});
                    loginFailure();
                } else { // no error: login successful, set Auth Token, prompt user to sign out
                    $('#signin').html('Sign Out');
                    loginSuccess(result);
                }
            });
        }
    });

    if (Token.isValid()) {
        $('#signin').html('Sign out');
        Profile.fetch();
        Systems.fetchAll();
        Jobs.startWatch();
    }
});

function loginSuccess(token)
{
  Token.set(token.access_token);
  Profile.fetch();
  Systems.fetchAll();
  Jobs.startWatch();
}

function loginFailure()
{
  Token.clear();
  Profile.clear();
  Systems.clearAll();
  Jobs.stopWatch();
}
