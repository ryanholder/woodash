/**
 * Created by ryan on 07/08/2014.
 */
var WP = require( 'wordpress-rest-api' );
var wp = new WP({
    endpoint: 'https://wp.thewhatwhat.com/wp-json/',
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


var wc = new WP({
    endpoint: 'https://wp.thewhatwhat.com',
    username: 'ck_45841d89825d617a00814f88e74face7',
    password: 'cs_d6da0b74e1f26cdd1f6bb6c8a0207e90',
    auth: true
});

var request = wc.root( '/wc-api/v1/', true );

// Callbacks
request.get(function( err, data ) {
    if ( err ) {
        // handle err
    }
    // do something with the returned posts
});