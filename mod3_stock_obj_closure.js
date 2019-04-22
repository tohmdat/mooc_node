/*PARTE 1*///Closure para implementar el control de un "stock" de productos
function stock (title) {
    let    _title = title;  //  Title of stock manager
    const  _stock = {};     //  prods: { <code>: {c: code, desc: <description>,  n: <number>}
 
         // Returns access object to internal state (variables), uses ES6 object method syntax
    return {

        title  ()  {              // Returns title of stock manager
            return _title; 
        },

        new_p (code, desc) {      // Adds product to stock if not yet included 
            if (!_stock[code]) {  // if already included returns null, else product object
                _stock[code] = {code, desc, n:0};
                return _stock[code];
            };
            return null;
        },

        add (code, n) {           // if product exists add n and return product, else return null
            if (_stock[code]) {
                _stock[code].n += n;
                return _stock[code];
            }
            return null;
        },

       rem (code, n) { // if n prods in stock subtract n and return product object or return null
            if ( _stock[code] && _stock[code].n >= n ) {
                _stock[code].n -= n;
                return _stock[code];
            } 
            return null;
        },

        number () {             // return number of prods (length of array of prod objects)
            return Object.keys(_stock).length;
        },


       get_p (code) {           // return product obj if exists or null if it doesn’t
            if (_stock[code]) { 
                return _stock[code]; 
            }
            return null;
        },

       del_p (code) {           // if code exists eliminate and return it, or return null
            if (_stock[code]) { 
                delete _stock[code];
                return _stock[code]; 
            }
            return null;
        },

       addJSON (json_prods) {   // Add n to prod if code exists, or create new prod
            json_prods = JSON.parse(json_prods);
            Object.keys(json_prods).forEach(code => {
                if (_stock[code]) {
                    let nu = json_prods[code].n;
                    _stock[code].n += nu;
                    return _stock[code];
                }
                else { 
                    let nu = json_prods[code].n;
                    let desc = json_prods[code].desc;
                    _stock[code] = {code, desc, n:nu};
                    return _stock[code];
                }
            })
        },

       getJSON () {             // Returns content of _stock serialised as a JSON string
            return JSON.stringify( _stock );
        },

        reset () {              // Remove all products from _stock
            _stock = {}; 
        }
    }
}



/*PARTE 2*///Sentencias para crear un stock
let my_shop = stock ("My shop");

console.log();

my_shop.new_p('a1', 'fork');	
my_shop.add('a1', 3);	
my_shop.new_p('a4', 'spoon');	
my_shop.add('a4', 7);	

console.log("-> my_shop.new_p('a1', 'fork')");	
console.log("-> my_shop.add('a1', 3)");	
console.log("-> my_shop.new_p('a4', 'spoon')");	
console.log("-> my_shop.add('a4', 7)");	

console.log();	
console.log("There are " + my_shop.number() + " prods");	
console.log();	
console.log("_stock= " + my_shop.getJSON());	
console.log();	
console.log();


my_shop.addJSON('{"a1":{"n":2}, "a2":{"code":"a2", "desc":"knife", "n": 3}}');	
console.log(`-> my_shop.addJSON('{ "a1":{"n":2}, "a2":{"code":"a2", "desc":"knife", "n": 3}}'`);


console.log();	
console.log("_stock= " + my_shop.getJSON());	
console.log();	
console.log();	
my_shop.add('a1', 4);	
console.log("-> my_shop.add('a1', 4)");	

console.log();	
console.log("_stock['a1'] =	" +	JSON.stringify(my_shop.get_p('a1')));	
console.log();	
console.log();

my_shop.rem('a2', 3);	
my_shop.del_p('a4');
console.log("-> my_shop.rem('a2', 3)");	
console.log("-> my_shop.del_p('a4')");	

console.log();	
console.log("_stock= " + my_shop.getJSON());	
	
