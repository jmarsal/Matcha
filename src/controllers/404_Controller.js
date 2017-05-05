/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const pug = require('pug');

class Error404 {
    constructor() {
        if (!app) {
            console.error('Error! Exiting... You must provide the Express instance to controllers.');
            process.exit(1);
        }

        app.use(function(request, response, next){
            response.render('views/404/404', {
                title: 'Not Found !!! Error 404.'
            });
        });
    }
}
module.exports = Error404;
