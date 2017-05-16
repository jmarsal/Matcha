/**
 * Created by jbmar on 16/05/2017.
 */

function getUploadPhotoUser() {
    let upload = $("#my-file"),
        type = $("#my-file")[0].files[0].type,
        path = $("#my-file")[0].files[0].name,
        divError = $("#error")
    ;

    divError.removeClass('red green');
    divError.addClass('red');
    divError.text("Mauvais Format ! Veuillez essayer avec un jpg, png ou gif...");
    console.log($("#my-file")[0].file.type);
}
