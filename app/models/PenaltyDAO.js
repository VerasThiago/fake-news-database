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



module.exports = function (app) {
    return PenaltyDAO;
}