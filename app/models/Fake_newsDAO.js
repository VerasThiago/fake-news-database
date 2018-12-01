/**
 *
 *  Fake news class
 *
 */

function Fake_newsDAO(connection, id ,title, content, company, government_power, parties, intention, type, propagations,files){
    this._connection = connection;
    this._id = id;
    this._title = title ? title:null;
    this._content = content ? content:null;
    this._company = company ? company:null;
    this._government_power = government_power ? government_power:null;
    this._parties = parties ? parties:null;
    this._intention = intention ? intention:null;
    this._type = type ? type:null;
    this._propagations = propagations  ? propagations:null; 
    this._files = files ? files:null;
}


/**
 *
 * Class methods
 *
 */


Fake_newsDAO.prototype.save_news_db = function(callback){


    /**
     * Returns callback from inserting news data in database, if query is executed successfully, then it returns the id created in database by inserting the news and
     * the set_id method is called to set object fake news id. 
     *  
     * This query call insert_news_db procedures that insert in database and returns id of the news
     *
     */


	const query = {

        /**
         *
         *  Arguments:
         *      > $1 : string 
         *         Fake news title
         *      > $2 : string
         *         Fake news content that describes fake news
         *      > $3 : boolean
         *         Intention of fake news, true if is in favor or false if is against
         *      > $4 : int
         *         Company id that published that fake news
         *      > $5 : int
         *         Government power id that was affected by that fake news
         *      > $6 : int
         *         Type of fake news id 
         *
         *
         */


		text: 'SELECT insert_news_db($1, $2, $3, $4, $5, $6) AS fake_news_id',
		values: [this._title, this._content, this._intention, this._company, this._government_power, this._type]
	};

    
	this._connection.query(query, (err,result) =>{

        if(!err){
            this.set_id(result.rows[0].fake_news_id);
        }

        return callback(); 
    });
}

Fake_newsDAO.prototype.save_relation = function(table, value_id){

     /**
     *  
     *  Void method that recieve database table name and a value, so then insert the relation between fake news and table name
     * 
     *
     *   Arguments:
     *      > table : string 
     *         Table name in database that gonna be inserted the relation
     *      > value_id : int
     *          Id from object entitie that have a relation with fake news
     */


    const query = {

        /**
         *
         *  Arguments:
         *      > table : string 
         *         Name of the table that gonna be inserted data
         *      > $1 : int
         *         Entity id that have relation with that fake news
         *      > $2 : int
         *         Fake news id
         *
         */


        text: 'INSERT INTO ' + table + ' VALUES($1,$2)',
        values: [value_id, this._id]
    };

    this._connection.query(query);
}

Fake_newsDAO.prototype.save_parties_relation = function(){

     /**
     *  
     *  Void method that check if political party list is null, then iterate through all parties envolved with this fake news and call save_relation method to insert individually in database
     *
     */
    
    if(this._parties != null){

        for (var political_party of this._parties) {

            this.save_relation('fake_news_parties', political_party);
        }
    }
}

Fake_newsDAO.prototype.save_propagation_method_relation = function(){

    /**
     *  
     *  Void method that check if propagation method list is null, then iterate through all propagations type envolved with this fake news and call save_relation method to insert individually in database
     *
     */

    if(this._propagations != null){

        for (var propagation of this._propagations) {

            this.save_relation('fake_news_propagation_method', propagation);
        }
    }
}

Fake_newsDAO.prototype.update_fake_news = function(callback){

    /**
     * Returns callback from updating news data in database
     *  
     * This query calls update_fake_news procedure that pass all data to database and check if is null then update data
     *
     */

    const query = {

        /**
         *
         *  Arguments:
         *      > $1 : int 
         *         Fake news id
         *      > $2 : string
         *         Fake news tile
         *      > $3 : string
         *         Fake news content that describes fake news
         *      > $3 : boolean
         *         Intention of fake news, true if is in favor or false if is against
         *      > $4 : int
         *         Company id that published that fake news
         *      > ARRAY[]::bigint[] : list
         *         List of political parties envolved. The bigint cast is to array_length method in postgresql that returns 0 if array is empty, without this cast
         *          the functions was returning error              
         *      > $5 : int
         *         Government power id that was affected by that fake news
         *      > $6 : int
         *         Type of fake news id 
         *      > ARRAY[]::bigint[] : list
         *         List of propagation method envolved. The bigint cast is to array_length method in postgresql that returns 0 if array is empty, without this cast
         *          the functions was returning error
         *
         */



        text: 'SELECT update_fake_news($1, $2, $3 , $4, ARRAY[' +  [this._parties] + ']::bigint[], $5, $6, $7, ARRAY[' +  [this._propagations] + ']::bigint[])',
        values: [this._id, this._title, this._content, this._intention, this._company, this._government_power, this._type]
    };

    this._connection.query(query, callback);
}


Fake_newsDAO.prototype.delete_fake_news = function(callback){

    /**
     * Returns callback from deleting news data in database
     *  
     * This query calls delete_fake_news procedure that delete news
     *
     */


    const query = {
        text: 'SELECT delete_fake_news($1)',
        values: [this._id]
    };

    this._connection.query(query, callback);
}


Fake_newsDAO.prototype.set_id = function(id){

    /**
     *  
     * Update fake news id
     *
     */
    this._id = id;
}




/**
 *
 *  Returns atributes values
 *
 */


Fake_newsDAO.prototype.get_title = function(){
	return this._title;
}

Fake_newsDAO.prototype.get_id = function() {
    return this._id;
}

Fake_newsDAO.prototype.get_parties = function() {
    return this._parties;
}



/**
 *
 *  Static functions that made connection with db but don't use object instance of Fake_newsDAO
 *
 */


Fake_newsDAO.get_all_news = function(connection, callback){
        
    /**
     * Returns from database all fake news structured by : id, title, content, intention, company, government power,
     *                                                     fake news type, list of political parties and propagation method envolved.
     *  
     * This query uses a view to return list of parties and propagatioon menthod envolved
     *
     *
     *  Arguments:
     *      > connection 
     *         The connection with database, necessary to execute query
     *
     */

    const query = {
        text: 'SELECT fake_news.fake_news_id AS id, fake_news.fake_news_title AS title, fake_news.fake_news_content AS content, ' + 
                    ' fake_news.fake_news_intention AS intention, get_company_name(fake_news.company_id) AS company, ' + 
                    ' get_government_power_name(fake_news.government_power_id) AS government_power , get_fake_news_type_name(fake_news.fake_news_type_id) AS type, ' +
                    ' politycal_parties_relation.parties, propagation_method_relation.propagations ' +
              'FROM politycal_parties_relation,fake_news, propagation_method_relation  ' +
              'WHERE fake_news.fake_news_id = politycal_parties_relation.fake_news_id AND fake_news.fake_news_id = propagation_method_relation.fake_news_id ' +
              'ORDER BY fake_news.fake_news_id DESC'
    };

    connection.query(query, callback);
    
}

Fake_newsDAO.get_fake_news_data = function(connection, callback){
        
        /**
         *  Returns list of pair (id,name) of entities relateded in fake news creation.
         *  Data returned from this method is :
         *      - List of companies that publish news
         *      - List of political parties that can be envolved in a fake news
         *      - List of government power that can be affected by a fake news
         *      - List of fake news type ie.: Manipulated news, invented news
         *      - List of propagation method ie.: Social media, television, radio
         *
         *
         *  Arguments:
         *      > connection 
         *         The connection with database, necessary to execute query
         *
         */


        const query = {
            text: 'SELECT array_agg((company_id,company_name))::text[]  AS data FROM company UNION ALL ' +
                  'SELECT array_agg((parties_id,parties_name))::text[]  FROM parties UNION ALL ' +
                  'SELECT array_agg((government_power_id,government_power_name))::text[]  FROM government_power UNION ALL ' +
                  'SELECT array_agg((fake_news_type_id,fake_news_type_name))::text[]  FROM fake_news_type UNION ALL ' +
                  'SELECT array_agg((propagation_method_id,propagation_method_name))::text[]  FROM propagation_method'
        };

        connection.query(query, callback);
    }

module.exports = function(app){
    return Fake_newsDAO;
}
