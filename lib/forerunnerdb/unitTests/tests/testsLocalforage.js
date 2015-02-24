ForerunnerDB.moduleLoaded('Persist', function () {
  asyncTest('Persistence - Collection.save() :: Save data to storage and load it back', function (assert) {
    base.dbUp();

    var coll = db.collection('test');
    coll.insert({
      name: 'Test'
    });

    var result = coll.save(function(err){

        assert.ok(!err, 'Saves without an error');

        base.dbDown();
        base.dbUp();

        coll = db.collection('test');

        // Make sure the item does not currently exist
        result = coll.find();
        ok(result.length === 0, 'Check that there are currently no items in the collection');

        result = coll.load(function(err){

            start();
            assert.ok(!err, 'Loads without an error');

            result = coll.find();
            ok(result.length === 1, 'Check that items were loaded correctly');
            ok(result[0].name === 'Test', 'Check that the data loaded holds correct information');

            base.dbDown();
        });

    });

  });
});