function PenaltyDAO(connection, fake_news_id, fake_news_title, company_id, company_name, penalty_type_id, penalty_type_name, amount) {
    this._connection = connection;
    this._fake_news_id = fake_news_id;
    this._fake_news_title = fake_news_title;
    this._company_id = company_id;
    this._company_name = company_name;
    this._penalty_type_id = penalty_type_id;
    this._penalty_type_name = penalty_type_name;
    this._amount = amount;
}

PenaltyDAO.prototype.insert_db = function (callback) {

    // SQL query
    const query = {
        text: 'INSERT INTO penalty(penalty_amount, penalty_type_id, fake_news_id, company_id) VALUES($1, $2, $3, $4);',
        values: [this._amount, this._penalty_type_id, this._fake_news_id, this._company_id]
    };

    this._connection.query(query, callback);
}

PenaltyDAO.prototype.update_penalty = function (callback) {

    // SQL query
    //new_penalty_amount INT, _penalty_type_id INT, new_penalty_type_id INT, _fake_news_id INT, new_fake_news_id INT, _company_id INT, new_company_id INT
    const query = {
        text: 'SELECT update_penalty($1, $2, $3, $4, $5, $6, $7);',
        values: [this._amount, this._penalty_type_id[0], this._penalty_type_id[1], this._fake_news_id[0], this._fake_news_id[1], this._company_id[0], this._company_id[1]]
    };
    console.log("VALUES = " + query.values);
    this._connection.query(query, callback);
}

PenaltyDAO.prototype.delete_penalty = function (callback) {

    // SQL query
    const query = {
        text: 'DELETE FROM penalty WHERE penalty_type_id = $1 AND fake_news_id = $2 AND company_id = $3;',
        values: [this._penalty_type_id[0], this._fake_news_id[0], this._company_id[0]]
    };
    console.log("VALUES2 = " + query.values);
    this._connection.query(query, callback);

}

module.exports = function (app) {
    return PenaltyDAO;
}