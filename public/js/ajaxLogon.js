$("#formRegister").submit(function (e) {
    e.preventDefault();

    $.post('/logon/form', $(e.target).serialize(), function (data, textStatus, jqXHR) {
        var dataRes = JSON.parse(jqXHR.responseText),
            divError = $("#error")
        ;

        divError.text(dataRes.response);
        divError.removeClass('red green');

        dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
    });
});
