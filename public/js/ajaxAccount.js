/**
 * Created by jbmar on 16/05/2017.
 */

function getUploadPhotoUser() {
    let type = $("#my-file")[0].files[0].type,
        fullNameExtension = $("#my-file")[0].files[0].name,
        path = $("#my-file")[0].value,
        size = $("#my-file")[0].files[0].size,
        validImage = ["image/gif", "image/jpeg", "image/png"],
        divError = $("#error")
    ;

    divError.removeClass('red green');
    if (fullNameExtension) {
        const reader = new FileReader();

        if (validImage.indexOf(type) < 0) {
            divError.addClass('red');
            divError.text("Mauvais Format ! Veuillez essayer avec un jpg, png ou gif...");
        } else {
            if (size <= 1500000){
                reader.addEventListener('load', () => {
                    alert(reader.result);
                    const tmp = "src=" + reader.result + "&namePhoto=" + fullNameExtension + "&typePhoto=" + type;
                    $.post('/account/post', tmp, function (data, textStatus, jqXHR) {
                        //var dataRes = JSON.parse(jqXHR.responseText),
                            let divError = $("#error")
                        ;

                        //if ((dataRes.isErr === 0 || dataRes.isErr === 1) && (dataRes.response)) {
                        //    divError.removeClass('red green');
                        //    dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
                        //}
                            //divError.text(dataRes.response);
                    });
                });
                reader.readAsDataURL($("#my-file")[0].files[0]);
            } else {
                divError.addClass('red');
                divError.text("La taille de ta photo ne doit pas dépassée 1,5 mega !");
            }
        }
    }
}
