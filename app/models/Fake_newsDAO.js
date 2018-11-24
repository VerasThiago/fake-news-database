
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

    // SQL query
	const query = {
		text: 'SELECT insert_news_db($1, $2, $3, $4, $5, $6) AS fake_news_id',
		values: [this._title, this._content, this._intention, this._company, this._government_power, this._type]
	};

    // Insert fake_news and return id
	this._connection.query(query, (err,result) =>{

        // if don't have error set fake_news id
        if(!err){
            this.set_id(result.rows[0].fake_news_id);
        }

        // return callback
        return callback(); 
    });
}

Fake_newsDAO.prototype.save_political_party = function(value){

    // SQL query
    const query = {
        text: 'INSERT INTO fake_news_parties VALUES(get_parties_id($1),$2)',
        values: [value, this._id]
    };

    // Execute query
    this._connection.query(query);
}

Fake_newsDAO.prototype.save_parties_relation = function(){
    

    // interate on parties array
    for (var political_party of this._parties) {

        // save political party
        this.save_political_party(political_party);
    }
}

Fake_newsDAO.prototype.get_parties_db = function(callback){

    // SQL query
    const query = {
        text: 'SELECT ARRAY (SELECT (fake_news_parties.parties_id, parties.parties_name) FROM fake_news_parties, parties WHERE fake_news_parties.fake_news_id = $1 AND parties.parties_id = fake_news_parties.parties_id)',
        values: [this._id]
    };


    console.log('values = ' + query.values);

    // Execute query
    this._connection.query(query, (err,result) =>{

        var all = result.rows[0].array.split('"').join('').split('(').join('').split(')').join('').replace('{', '').replace('}','').split(',');

        for(var i = 0; i < all.length - 1; i += 2){
            this._parties.push([all[i],all[i+1]]);
        }
        
        return callback();

    });
}
Fake_newsDAO.prototype.update_fake_news = function(callback){

    console.log(this._parties);

}

Fake_newsDAO.prototype.set_id = function(id){
    this._id = id;
}

Fake_newsDAO.prototype.get_title = function(){
	return this._title;
}

Fake_newsDAO.prototype.get_id = function() {
    return this._id;
}

Fake_newsDAO.prototype.get_parties = function() {
    return this._parties;
}

module.exports = function(app){
    return Fake_newsDAO;
}
