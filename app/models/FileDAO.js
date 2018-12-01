// Module that removes files
var rimraf = require('rimraf');

function FileDAO(connection, file_id, file_name, extension_id, extension_name,  fake_news_id, path){
    this._connection = connection;
    this._file_id = file_id;
    this._file_name = file_name;
    this._extension_id  = extension_id;
    this._extension_name = extension_name;
    this._fake_news_id  = fake_news_id;
    this._path = path;

}

FileDAO.prototype.save_file_db = function(callback)  {

    /**
     * Returns callback from inserting file in database
     *  
     * This query call insert_file_db procedures that checks if have some null values then insert in database with path of file in server that was uploaded previously
     *
     */


    const query = {

         /**
         *
         *  Arguments:
         *      > $1 : string 
         *         File extension name
         *      > $2 : string
         *         File name
         *      > $3 : int
         *         Fake news id that this file is related
         *      > $4 : string
         *         Path of the server that contains the file
         *
         *  ** Using values atributes was returning error in query, so this way worked and I need to fix this
         */

        text: "SELECT insert_file_db(get_extension_id('" + this._extension_name + "'),'" + this._file_name + "'," + this._fake_news_id + ",'" + this._path + this._file_name + "')"
    };

    this._connection.query(query, callback);
    
}

FileDAO.prototype.save_file = function(file, callback)  {

    /**
     * Returns save_file_db method after uploading file in server public folder, calls file mv method that upload to the server by passing the path, so
     * first upload to server to then upload to database
     *  Arguments:
     *      > file : object 
     *         File that contains (not only) file content e mv method to upload to server
     *
     */
   
    file.mv(this._path + this._file_name, () => this.save_file_db(callback));
}

FileDAO.prototype.download_file = function()  {
    
    /**
     *
     *  Download file from postgresql database by passing file id 
     *
     */

    const query = {

        /**
         *  Arguments:
         *      > $1 : string
         *          Public folder path that postgresql gonna download file
         *      > $2 : int
         *          File id that gonna be donwloaded
         */

        text:   'SELECT lo_export(arquivo.arquivo_content, $1) FROM arquivo WHERE arquivo.arquivo_id = $2',                                                                                     
        values: [this._path + this._file_name, this._file_id]
    };

    this._connection.query(query);
    
}

FileDAO.prototype.update_file = function(callback)  {

        /**
         * Returns callback from updating file in database
         *  
         * This query call update_file procedures that check if data is diferente
         *
         */

        const query = {

            /**
             *  Arguments:
             *      > $1 : string
             *          File name
             *      > $2 : int
             *          Fake news id that files is related
             *      > $3 : string
             *          Path of file that gonna be inserted in database
             *      > $4 : int
             *          File id that gonna be updated
             *      > $5 : string
             *          Extension file name
             */

            text:   'SELECT update_file($1, $2, $3, $4, $5)',
            values: [this._file_name, this._fake_news_id, this._path, this._file_id, this._extension_name]
        };

        this._connection.query(query, callback);
}

FileDAO.prototype.delete_file = function(callback)  {

    /**
     * Returns callback from deleting file in database
     *  
     * This query just delede a file that match with id passed
     *
     */
    
    const query = {

        /**
         *  Arguments:
         *      > $1 : int
         *          File id that gonna be deleted
         *
         */
        text: 'DELETE FROM arquivo WHERE arquivo.arquivo_id = $1',
        values: [this._file_id]                                                                      
    };
    
    this._connection.query(query, callback);
}

/**
 *
 *  Static functions ...
 *
 */


 FileDAO.get_all_files = function(connection, callback)  {

    /**
     *  Returns from database all files structured by : id, name, extension, fake news related (tile and id) in order to display in a files list view.
     *
     *  This function don't acctually return file data itself, but with the file name we can export from database by calling export function, passing
     *  path + file name so then postgresql can export to the specified path and created that file with that name
     *  
     *  Arguments:
     *     > connection 
     *         The connection with database, necessary to execute query
     *
     */


    const query = {
        text: 'SELECT arquivo.arquivo_id AS file_id, arquivo.arquivo_name AS name, extensao.extensao_name AS extension, fake_news.fake_news_title, fake_news.fake_news_id ' +
              'FROM arquivo, extensao, fake_news ' +
              'WHERE (arquivo.extensao_id = extensao.extensao_id AND fake_news.fake_news_id = arquivo.fake_news_id) ' +
              'ORDER BY file_id DESC' 
    };

    connection.query(query, callback);
}

FileDAO.get_file_data = function(connection, callback){
        
    /**
     *  Returns list of tuple (id,name) of fake news so that user can choose wich fake news he's gonna insert a file.
     *
     *  Arguments:
     *      > connection 
     *         The connection with database, necessary to execute query
     *
     */

    const query = {
        text: 'SELECT array_agg((fake_news_id,fake_news_title))::text[] AS data FROM fake_news'
    };

    connection.query(query, callback);
}

FileDAO.erase_files = function(path) {

    /**
     *  Deletes all files inside a folder specified by a path
     *
     *  
     *  Arguments:
     *     > path : string
     *         The path of server folder, necessary to rimraf find folder to erase all files
     *
     */


    /**
     * Add * to the end of the path to specify that all files inside this path gonna be deleted
     */

    path = path + '*';
    rimraf(path,() => { });
}       


module.exports = function(app){
    return FileDAO;
}

