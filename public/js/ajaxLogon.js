$("#formRegister").submit(function (e) {
    e.preventDefault();

    $.post('/logon/form', $(e.target).serialize(), function (data, textStatus, jqXHR) {
        var dataRes = JSON.parse(jqXHR.responseText),
            divError = $("#error")
        ;

        divError.removeClass('red green');
        dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');

        if (dataRes.isRedirect && dataRes.isURL){
            divError.text(dataRes.response + ' Vous allez etre redirigé sur la page de connection dans un instant...');
            setTimeout(() => {
                alert('redirection desactivé  dans ajaxLogon!');
                // window.location.replace(dataRes.isURL);
            }, 5000);
        } else {
            divError.text(dataRes.response);
        }
    });
});