/**
 * Created by jbmar on 11/05/2017.
 */

module.exports = function newUser(arrayForm) {
    let sql = "SELECT email FROM users WHERE email = ?";
    connection.query(sql, [arrayForm.email], function (error, results, fields) {
        if (error) throw error
        if (results.length == 0){
            let sql2 = "INSERT INTO users SET ?";
            connection.query(sql2, arrayForm, function (error, results, fields) {
                if (error) throw error;
                return true;
            })
        }
        return false;
    } )
};
