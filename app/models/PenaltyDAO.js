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

PenaltyDAO.prototype.save_penalty_db = function (callback) {

    /**
     * Returns callback from inserting penalty data in database
     *  
     * This query just make a normal insert to penalty table
     *
     */

    const query = {

        /**
        *
        *  Arguments:
        *      > $1 : int 
        *         Amount of that penalty
        *      > $2 : int
        *         Id of penalty type
        *      > $3 : int
        *         Id of fake news that was envolved in the penalty
        *      > $4 : int
        *         Id of company that was penalized
        *
        */

        text: 'INSERT INTO penalty(penalty_amount, penalty_type_id, fake_news_id, company_id) VALUES($1, $2, $3, $4);',
        values: [this._amount, this._penalty_type_id, this._fake_news_id, this._company_id]
    };

    this._connection.query(query, callback);
}

PenaltyDAO.prototype.update_penalty = function (callback) {

    /**
     * Returns callback from updating penalty in database
     *  
     * This query call update_penalty procedures that check if some data is not the same in database then update it
     *
     */


    const query = {

         /**
        *
        *  Arguments:
        *      > $1 : int 
        *         Amount of that penalty
        *      > $2 : int
        *         Original id of penalty type
        *      > $3 : int
        *         New id of penalty type that gonna be replaced
        *      > $4 : int
        *         Original id of fake news
        *      > $5 : int
        *         New id of fake news that gonna be replaced
        *      > $6 : int
        *         Original id of company
        *      > $7 : int
        *         New id of company that gonna be replaced
        *
        */

        text: 'SELECT update_penalty($1, $2, $3, $4, $5, $6, $7);',
        values: [this._amount, this._penalty_type_id[0], this._penalty_type_id[1], this._fake_news_id[0], this._fake_news_id[1], this._company_id[0], this._company_id[1]]
    };

    this._connection.query(query, callback);
}

PenaltyDAO.prototype.delete_penalty = function (callback) {

    /**
     * Returns callback from deleting file in database
     *  
     * This query just delede a file that match with penalty type, fake news and company id
     *
     */

    const query = {

        /**
         *  Arguments:
         *      > $1 : int
         *          Penalty type id 
         *      > $2 : int
         *          Fake news id
         *      > $3 : int
         *          Company id
         *
         */

        text: 'DELETE FROM penalty WHERE penalty_type_id = $1 AND fake_news_id = $2 AND company_id = $3;',
        values: [this._penalty_type_id[0], this._fake_news_id[0], this._company_id[0]]
    };
    
    this._connection.query(query, callback);
}


/**
 *
 * Static functions ...
 *
 */

PenaltyDAO.get_all_penalties = function (connection, callback){
        
    /**
     * Returns from database all penalties structured by : fake news (id, title), company (id, name), penalty type (id, name), amount
     *                                                     
     *  
     *  Arguments:
     *      > connection 
     *         The connection with database, necessary to execute query
     *
     */

    const query = {
        text: 'SELECT fake_news.fake_news_id AS fake_news_id, fake_news.fake_news_title AS fake_news_title, ' +
                     'company.company_name AS company_name, company.company_id AS company_id, ' + 
                     'penalty_type.penalty_type_name AS penalty_type_name, penalty_type.penalty_type_id AS penalty_type_id, ' + 
                     'penalty.penalty_amount AS amount ' +
              'FROM fake_news, company, penalty_type, penalty '  +
              'WHERE fake_news.fake_news_id = penalty.fake_news_id AND company.company_id = penalty.company_id AND penalty_type.penalty_type_id = penalty.penalty_type_id ' +
              'ORDER BY amount DESC'
        };

    connection.query(query, callback);

}

PenaltyDAO.get_penalty_data = function (connection, callback) {

    /**
     *  Returns list of pair (id,name) of entities relateded in fake news creation.
     *  Data returned from this method is :
     *      - List of companies that published the news
     *      - List of penalty type ie.: Moral damage
     *      - List of fake news that was published by a company
     *
     *
     *  Arguments:
     *      > connection 
     *         The connection with database, necessary to execute query
     *
     */

    const query = {
        text: 'SELECT array_agg((company_id,company_name))::text[]  AS data FROM company UNION ALL ' +
              'SELECT array_agg((penalty_type_id,penalty_type_name))::text[]  FROM penalty_type UNION ALL ' +
              'SELECT array_agg((fake_news_id,fake_news_title, company_id))::text[]  FROM fake_news'    
    };

    connection.query(query, callback);
}

module.exports = function (app) {
    return PenaltyDAO;
}