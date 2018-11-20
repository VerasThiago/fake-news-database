
function Fake_newsDAO(connection, title, content, company, government_power, parties, intention, type, files){
    this._connection = connection;
    this._title = title;
    this._content = content;
    this._company = company;
    this._government_power = government_power;
    this._parties = parties;
    this._intention = intention;
    this._type = type;
    this._files = files;
}

Fake_newsDAO.prototype.save_news_db = function(callback){

	const query = {
		text: 'INSERT INTO fake_news(fake_news_title, fake_news_content, fake_news_intention, company_id, government_power_id, fake_news_type_id) VALUES ($1, $2, $3, get_company_id($4), get_government_power_id($5), get_fake_news_type_id($6))',
		values: [this._title, this._content, this._intention, this._company, this._government_power, this._type]
	};
	this._connection.query(query,callback);

}


Fake_newsDAO.prototype.get_title = function(callback){
	return this._title;
}




module.exports = function(app){
    return Fake_newsDAO;
}
