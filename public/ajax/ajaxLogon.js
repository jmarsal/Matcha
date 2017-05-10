$('.button').click(function (e) {
    e.preventDefault();
    submitFormRegister();
});

function submitFormRegister() {
    var formRegister = {
        login: $(':input')[0].value,
        lastName: $(':input')[1].value,
        firstName: $(':input')[2].value,
        email: $(':input')[3].value,
        passwd: $(':input')[4].value
    };
    // console.log(formRegister);
    $.post('/logon', formRegister, function (data, textStatus, jqXHR) {
        console.log('Success !!! :)');
        console.log("data = " + data + "status = " + textStatus);
    });

    // $.ajax({
    //     type: "POST",
    //     url: "./accueil/logon",
    //     timeout: 2000,
    //     data: { data: formRegister },
    //     dataType: 'application/json',
    //     success: function(data) {
            // show content
            // alert('Success !!! :)')
        // },
        // error: function(jqXHR, textStatus, err) {
            //show error message
            // alert('text status '+textStatus+', err '+err)
        // }
    // });
    // $.ajax({
    //     url: 'localhost:8080/accueil/logon',
    //     dataType: "json",
    //     data: formRegister,
    //     type: 'POST',
    //     success: function (data) {
    //         var ret = jQuery.parseJSON(data);
    //         $('#lblResponse').html(ret.msg);
    //         console.log('Success: ')
    //     },
    //     error: function (xhr, status, error) {
    //         console.log('Error: ' + error.message);
    //         $('#lblResponse').html('Error connecting to the server.');
    //     },
    // });
}
