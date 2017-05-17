/**
 * Created by jbmar on 16/05/2017.
 */

$(document).ready(function () {

    $('#frmUploader').submit(function (e) {
        e.preventDefault();

        $(this).ajaxSubmit({
            success: showResponse
        });
        return false;
    });
});

// post-submit callback
function showResponse(responseText, statusText, xhr, $form) {
    var dataRes = JSON.parse(xhr.responseText),
        divError = $("#error")
    ;

    if ((dataRes.isErr === 0 || dataRes.isErr === 1) && (dataRes.response)) {

        divError.removeClass('red green');
        dataRes.isErr === 1 ?
            divError.addClass('red') : divError.addClass('green');
        dataRes.isErr === 1 ?
            divError.text(dataRes.response) : divError.text(dataRes.response.mess);

        if (dataRes.response.srcPhoto) {
            let img = document.createElement("img");
            img.className = 'photos-user';
            img.src= dataRes.response.srcPhoto.replace('./public', '');

            $('#photos-user-account').prepend(img);
        }
    }

}
