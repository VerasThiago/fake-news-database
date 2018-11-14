module.exports = function (app) {

	this.save_file_pc = function(file, path, callback){
		name = file.name,
		type = file.mimetype;
		file.mv(path + name, callback);
	}

	this.save_file_db = function(file, connection, callback){
		console.log(file.upfile);
        const query = {
            text: "INSERT INTO arquivo (extensao_id, fake_news_id,arquivo_content )VALUES(1,7,decode($1,hex))",
            values: [file.upfile.data]
        };
        // callback
        connection.query(query, callback);
	}

	return this;
}