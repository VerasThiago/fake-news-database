module.exports = {
	string_to_list: function (data) {


		/**
		 * Converts a string created by sql array (don't know why sql returns array in string ???) 
		 * Just removes all '(', ')', '"' and split by ','
		 *
		 *	Arguments:
		 *		> data : string
		 *	       The array string that gonna be converted in original array
		 *
		 */

		var data_list = new Array;

		if(data != null){
			data.forEach(function (value, key) {
				data_list.push(value.split('(').join('').split(')').join('').split('"').join('').split(','));
			});
		}
		return data_list;
	}
};

