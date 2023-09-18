//------first page-------
$('#welcome').on('click', function() {
    $(this).css({
        'animation-name': 'vanish',
        'animation-duration': '0.8s',
        'animation-fill-mode': 'forwards'
    });
})

//------login form----------

function passwordGenerator() {
    let date = new Date();
    let password = date.getFullYear();
    return 'Demo' + password;
};

function initPassword() {
    $('#password-hint').html(passwordGenerator());
}
initPassword();

function fakeLogin({ email, password }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'Demo' && password === passwordGenerator()) {
                resolve({ data: { token: 'logging-in-succeed' } });
            } else {
                reject();
            }
        }, 1000);
    });
}

function loginFunc() {
    // let url = 'https://acustomdomain.com/api/login',
    username = $('#usernameInput').val(),
    password = $('#passwordInput').val();

    if (!username || !password) {
        $('#empty-error').removeClass('d-none');
    } else {
        $('#empty-error').addClass('d-none');
        /[0-9]/.test(password) ? $('#number-error').addClass('d-none') : $('#number-error').removeClass('d-none');
        /(?=.*[a-z])/.test(password) ? $('#lowercase-error').addClass('d-none') : $('#lowercase-error').removeClass('d-none');
        /(?=.*[A-Z])/.test(password) ? $('#uppercase-error').addClass('d-none') : $('#uppercase-error').removeClass('d-none');
    }

    if (/[0-9]/.test(password) && /(?=.*[a-z])/.test(password) && /(?=.*[A-Z])/.test(password)) {
        $('#login-text').text(''),
        $('.shape').removeClass('d-none'),

        // commented due domain is not available anymore
        // using custom async function instead
        
        // axios.post(
        //     url,
        //     {
        //         "email": username,
        //         "password": password
        //     },
        //     {
        //         "Accept": "application/json",
        //         "Content-Type": "application/json"
        //     })

        fakeLogin({
            "email": username,
            "password": password
        })
        .then(function (response) {
            $('#match-error').addClass('d-none');
            response.data.token ? window.location.href='game.html' : loginError();
        })
        .catch(function () {
            loginError()
        });
    }
}
function loginError() {
    $('#match-error').removeClass('d-none'),
    $('.shape').addClass('d-none'),
    $('#login-text').text('Login')
}