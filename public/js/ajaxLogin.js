$("#formRegister").submit(function (e) {
    e.preventDefault();

    $.post('/login/form', $(e.target).serialize(), function (data, textStatus, jqXHR) {
        var dataRes = JSON.parse(jqXHR.responseText),
            divError = $("#error")
        ;

        if ((dataRes.isErr === 0 || dataRes.isErr === 1) && (dataRes.response)) {
            divError.removeClass('red green');
            dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
        }

        if (dataRes.isRedirect && dataRes.isURL) {
            window.location.replace(dataRes.isURL);
        } else {
            divError.text(dataRes.response);
        }
    });
});

$(document).ready(function() {
    $('#forget-button').click(function(e) {
        window.location.replace('../forget-passwd/');
    });
});