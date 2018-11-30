
function Fake_newsDAO(connection, id ,title, content, company, government_power, parties, intention, type, files){
    this._connection = connection;
    this._id = id;
    this._title = title ? title:null;
    this._content = content ? content:null;
    this._company = company ? company:null;
    this._government_power = government_power ? government_power:null;
    this._parties = parties ? parties:null;
    this._intention = intention ? intention:null;
    this._type = type ? type:null;
    this._files = files ? files:null;
}

Fake_newsDAO.prototype.save_news_db = function(callback){

    // SQL query
	const query = {
		text: 'SELECT insert_news_db($1, $2, $3, $4, $5, $6) AS fake_news_id',
		values: [this._title, this._content, this._intention, this._company, this._government_power, this._type]
	};

    // Insert fake_news and return id
	this._connection.query(query, (err,result) =>{

        console.log('RESULT = ' + result);

        // if don't have error set fake_news id
        if(!err)
            this.set_id(result.rows[0].fake_news_id);

        // return callback
        return callback(); 
    });
}

Fake_newsDAO.prototype.save_political_party = function(value){

    // SQL query
    const query = {
        text: 'INSERT INTO fake_news_parties VALUES($1,$2)',
        values: [value, this._id]
    };

    // Execute query
    this._connection.query(query);
}

Fake_newsDAO.prototype.save_parties_relation = function(){
    
    if(this._parties != null){

        // interate on parties array
        for (var political_party of this._parties) {

            // save political party
            this.save_political_party(political_party);
        }
    }
}

Fake_newsDAO.prototype.get_parties_db = function(callback){

    // SQL query
    const query = {
        text: 'SELECT ARRAY (SELECT (fake_news_parties.parties_id, parties.parties_name) FROM fake_news_parties, parties WHERE fake_news_parties.fake_news_id = $1 AND parties.parties_id = fake_news_parties.parties_id)',
        values: [this._id]
    };

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

    // SQL query
    const query = {
        text: 'SELECT update_fake_news($1, $2, $3 , $4, ARRAY[' +  [this._parties] + ']::bigint[], $5, $6, $7)',
        values: [this._id, this._title, this._content, this._intention, this._company, this._government_power, this._type]
    };

    this._connection.query(query, callback);
}

Fake_newsDAO.prototype.delete_fake_news = function(callback){
    // SQL query
    const query = {
        text: 'SELECT delete_fake_news($1)',
        values: [this._id]
    };

    this._connection.query(query, callback);
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
