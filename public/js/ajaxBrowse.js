/**
 * Created by jmarsal on 6/7/17.
 */

function displayFilterOptions(){
    let buttonFilter = $('#containerTrieOptions');

    if (buttonFilter[0].style.display === 'none') {
        console.log('none => block');
        buttonFilter.css('display', 'block');
    } else {
        console.log('block => none');
        buttonFilter.css('display', 'none');
    }
}

function displayOptions(valeur) {

    if (valeur === 'ASC') {
        window.location.replace('/browse');
    } else if (valeur === 'DESC') {
        window.location.replace('/browse/DESC');
    } else if (valeur === 'TAGS') {
        window.location.replace('/browse/TAGS');
    } else if (valeur === 'POP') {
        window.location.replace('/browse/POP');
    }

    //$.post('/Browse/Change-Filters-Trie', dataToSend, function (data, textStatus, jqXHR) {});
}
