function PenaltyDAO(connection, fake_news, company, type, amount) {
    this._connection = connection;
    this._fake_news = fake_news;
    this._company = company;
    this._type = type;
    this._amount = amount;
}

PenaltyDAO.prototype.get_all = function (callback) {
    const query = {
        text: 'SELECT fake_news.fake_news_title AS fake_news, company.company_name AS company, penalty_type.penalty_type_name AS type, penalty.penalty_amount AS amount FROM fake_news, company, penalty_type, penalty WHERE fake_news.fake_news_id = penalty.fake_news_id AND company.company_id = penalty.company_id AND penalty_type.penalty_type_id = penalty.penalty_type_id'
    };
    this._connection.query(query, callback);
}

module.exports = function (app) {
    return PenaltyDAO;
}