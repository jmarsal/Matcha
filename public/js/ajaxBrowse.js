/**
 * Created by jmarsal on 6/7/17.
 */

function displayFilterOptions(){
    let buttonFilter = $('#containerTrieOptions');

    if (buttonFilter[0].style.display === 'none') {
        buttonFilter.css('display', 'block');
    } else {
        buttonFilter.css('display', 'none');
    }
}

function displayOptions(valeur) {

    let dataToSend = {data:valeur};

    $('#containerTrieOptions>div.active').removeClass('active');
    if (valeur === 'ASC') {
        $('#optionASC').addClass('active');
    } else if (valeur === 'DESC') {
        $('#optionDESC').addClass('active');
    } else if (valeur === 'TAGS') {
        $('#optionTAGS').addClass('active');
    } else if (valeur === 'POP') {
        $('#optionPOP').addClass('active');
    } else if (valeur === 'AgeASC') {
        $('#optionAgeASC').addClass('active');
    } else if (valeur === 'AgeDESC') {
        $('#optionAgeDESC').addClass('active');
    }

    $.post('/browse/Change-Filters-Trie', dataToSend, function (data, textStatus, jqXHR) {
        var dataRes = JSON.parse(jqXHR.responseText),
            divError = $("#error")
        ;

        divError.removeClass('red green');
        dataRes.isErr === 1 ? divError.addClass('red') : "";
        dataRes.isErr === 1 ? divError.text(dataRes.response) : "";

        rebaseBrowseUsers(dataRes.response)
    });
}

function rebaseBrowseUsers(data) {
    $('#containerProfilsBrowse').remove();
    $('<div/>', {
        id: "containerProfilsBrowse",
        class: 'container-profils-browse',
        appendTo: $('#contentAccountUser')
    });
    $('<div/>', {
        class: 'separator-profil',
        id: 'separatorProfil',
        appendTo: $('#containerProfilsBrowse')
    });
    data.profilsOrder.map((profil) => {
        $('<div/>', {
            id: profil.id,
            class: 'profil-browse',
            on: {
                click: function () {
                    aChangerPlusTard(profil.id)
                }
            },
            appendTo: $('#separatorProfil')
        });
        $('<div/>', {
            class: 'infos-profil-browse',
            id: 'infosProfilBrowse'+profil.id,
            appendTo: $('#' + profil.id)
        });
        $('<div/>', {
            class: 'login-profil-browse infos',
            id: 'loginProfilBrowse'+profil.id,
            appendTo: $('#infosProfilBrowse'+profil.id)
        }).text(profil.login + '    ' + profil.age + ' ans');

        data.photos.map((photo) => {
            if (photo.id_user == profil.id) {
                $('<div/>', {
                    class: 'info-pop-tag',
                    id: 'infoPopTag'+profil.id,
                    appendTo: $('#infosProfilBrowse'+profil.id)
                });
                $('<div/>', {
                    class: 'popularity-browse',
                    id: 'popularityBrowse'+profil.id,
                    appendTo: $('#infoPopTag'+profil.id)
                }).text('Popularité: ' + profil.popularity + '%');
                $('<div/>', {
                    class: 'commun-tags-browse',
                    id: 'communTagsBrowse'+profil.id,
                    appendTo: $('#infoPopTag'+profil.id)
                }).text('#: ' + profil.tagsCommun + ' commun');
                $('<div/>', {
                    class: 'photo-profil-browse',
                    id: 'photoProfilBrowse'+profil.id,
                    css: {
                        'background-image': 'url(' + photo.src_photo + ')'
                    },
                    appendTo: $('#infosProfilBrowse'+profil.id)
                });
            }
        });
        $('<div/>', {
            class: 'primary-infos',
            id: 'primaryInfos'+profil.id,
            appendTo: $('#infosProfilBrowse'+profil.id)
        })
        $('<div/>', {
            class: 'localite-infos',
            id: 'localiteInfos'+profil.id,
            appendTo: $('#primaryInfos'+profil.id)
        }).text(profil.city + ' ' +(profil.country === 'États-Unis' ? "aux" : "en") + ' ' + profil.country)
        $('<div/>', {
            class: 'secondary-infos',
            id: 'secondaryInfos'+profil.id,
            appendTo: $('#infosProfilBrowse'+profil.id)
        })
        $('<div/>', {
            class: 'about-me infos',
            id: 'aboutMe'+profil.id,
            appendTo: $('#secondaryInfos'+profil.id)
        }).text('A propos de moi :');
        $('<div/>', {
            class: 'about',
            id: 'about'+profil.id,
            appendTo: $('#secondaryInfos'+profil.id)
        })
        $('<div/>', {
            class: 'bio-browse',
            id: 'bioBrowse'+profil.id,
            appendTo: $('#about'+profil.id)
        }).text(profil.bio);
        $('<div/>', {
            class: 'looking-for infos',
            id: 'lookingFor'+profil.id,
            appendTo: $('#secondaryInfos'+profil.id)
        }).text('Je recherche :')
        if (profil.orientation == 1) {
            $('<div/>', {
                class: 'looking',
                id: 'looking'+profil.id,
                appendTo: $('#secondaryInfos'+profil.id)
            }).text('un homme')
        }
        else if (profil.orientation == 2) {
            $('<div/>', {
                class: 'looking',
                id: 'looking'+profil.id,
                appendTo: $('#secondaryInfos'+profil.id)
            }).text('une femme')
        }
        else {
            $('<div/>', {
                class: 'looking',
                id: 'looking'+profil.id,
                appendTo: $('#secondaryInfos'+profil.id)
            }).text('un homme ou une femme');
        }
        $('<div/>', {
            class: 'separator-profil',
            id: 'separatorProfil',
            appendTo: $('#' + profil.id)
        });
    });
}
