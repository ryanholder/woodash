var WC = require( 'woocommerce-rest-api' );
var wc = new WC({
    endpoint: 'http://wp.thewhatwhat.com/wc-api/v1/',
    username: 'ck_45841d89825d617a00814f88e74face7',
    password: 'cs_d6da0b74e1f26cdd1f6bb6c8a0207e90',
    auth: true
});


// Callbacks
wc.orders().get(function( err, data ) {
    if ( err ) {
        // handle err
    }
    // do something with the returned posts
});