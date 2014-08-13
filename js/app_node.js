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

wp.posts()
    .author( 'ryanholder' )
    .category( 'jetpack' )
    .get(function( err, data ) {
        if ( err ) {
            // handle err
            console.log('test');
        }
        console.log(data);
        // do something with the returned posts
    });