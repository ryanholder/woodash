/**
 * Created by ryan on 07/08/2014.
 */
var WP = require( 'wordpress-rest-api' );
var wp = new WP({
    endpoint: 'http://wp.thewhatwhat.com/wp-json/',
    username: 'ryanholder',
    password: 'XGKjDDaFv6obLi4',
    auth: true
});

// All posts belonging to author with nicename "jadenbeirne"
wp.posts().filter( 'author_name', 'ryanholder' ).get();

// Callbacks
//wp.posts().filter( 'author_name', 'ryanholder' ).get(function( err, data ) {
//    if ( err ) {
//        // handle err
//    }
//    console.log('hello');
//    // do something with the returned posts
//});