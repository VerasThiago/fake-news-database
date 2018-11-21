
function Fake_newsDAO(connection, id ,title, content, company, government_power, parties, intention, type, files){
    this._connection = connection;
    this._id = id;
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
		text: 'SELECT insert_news_db($1, $2, $3, $4, $5, $6) AS fake_news_id',
		values: [this._title, this._content, this._intention, this._company, this._government_power, this._type]
	};

	this._connection.query(query, callback);
}

Fake_newsDAO.prototype.save_political_party = function(value, item){


    console.log("ID DENTRO = " + this.get_id());

    const query = {
        text: 'INSERT INTO fake_news_parties VALUES(get_parties_id($1),$2)',
        values: [value, this._id]
    };

    //this._connection.query(query, (err,result) => console.log("ERROR = " + err));
}

Fake_newsDAO.prototype.save_parties_relation = function(){
    this._parties.forEach(this.save_political_party);
}


Fake_newsDAO.prototype.set_id = function(id){
    this._id = id;
}

Fake_newsDAO.prototype.get_title = function(){
	return this._title;
}

Fake_newsDAO.prototype.get_id = function() {
    return this._id;
};


module.exports = function(app){
    return Fake_newsDAO;
}
