
function Fake_newsDAO(connection, title, content, company_id, government_power_id, parties_envolved, intention, files){
    this._connection = connection;
    this._title = title;
    this._content = content;
    this._company_id = company_id;
    this._government_power_id = government_power_id;
    this._parties_envolved = parties_envolved;
    this._intention = intention;
    this._files = files;
}




module.exports = function(app){
    return Fake_newsDAO;
}

