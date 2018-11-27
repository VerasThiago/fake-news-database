module.exports = (app) => {

    app.get('/penalty/list', (req, res) => {
        // get connection with db
        var connection = app.config.dbConnection();

        // user functions
        var PenaltyDAO = new app.app.models.PenaltyDAO(connection);

        // execute get_all data function to get users from db and then render page with result
        PenaltyDAO.get_all((req, result) => res.render("penalty/penalty_list", { penaltys: result }));

    });

};
