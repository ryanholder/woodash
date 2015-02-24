test("Transform - Collection.transform() :: Assign a transform-in method to a collection", function() {
	base.dbUp();
	var coll = db.collection('transformColl').truncate();

	coll.transform({
		enabled: true,
		dataIn: function (data) {
			return {
				_id: data._id,
				moo: data.foo,
				goo: data.foo + 1
			}
		}
	});

	coll.insert({
		_id: 'test1',
		foo: 1
	});

	var result = coll.find();

	ok(result.length === 1, "Insert");
	ok(result[0].moo === 1 && result[0].goo === 2, "Insert transformed");

	base.dbDown();
});

test("Transform - Collection.transform() :: Assign a transform-out method to a collection", function() {
	base.dbUp();
	var coll = db.collection('transformColl').truncate();

	coll.transform({
		enabled: true,
		dataOut: function (data) {
			return {
				_id: data._id,
				moo: data.foo,
				goo: data.foo + 1
			}
		}
	});

	coll.insert({
		_id: 'test1',
		foo: 1,
		doo: 1
	});

	var collData = coll._data,
		result = coll.find();

	ok(result.length === 1, "Insert");
	ok(collData[0].doo === 1, "Insert not transformed");
	ok(result[0].moo === 1 && result[0].goo === 2 && result[0].doo === undefined, "Find transformed");

	base.dbDown();
});

ForerunnerDB.moduleLoaded('View', function () {
	test("Transform - View.transform() :: Assign a transform-in method to a view from a standard collection", function () {
		base.dbUp();
		var coll = db.collection('transformColl').truncate();
		coll.transform(false);

		coll.insert({
			_id: 'test1',
			foo: 1
		});

		var result = coll.find();

		ok(result.length === 1, "Collection insert");
		ok(result[0].foo === 1, "Collection insert not transformed");

		var view = db.view('transformView').from(coll);

		view.transform({
			enabled: true,
			dataIn: function (data) {
				return {
					_id: data._id,
					moo: data.foo,
					goo: data.foo + 1
				}
			}
		});

		result = view.find();
		ok(result[0].moo === 1 && result[0].goo === 2, "View insert 1 transformed");

		// Now insert another record
		coll.insert({
			_id: 'test2',
			foo: 4
		});

		result = view.find();
		ok(result[1] && result[1].moo === 4 && result[1].goo === 5, "View insert 2 transformed");

		// Now test collection updates
		coll.update({
			_id: 'test2'
		}, {
			foo: 2
		});

		result = view.find();
		ok(result[1] && result[1].moo === 2 && result[1].goo === 3, "View update 2 transformed");

		// Now remove a record
		coll.remove({
			_id: 'test1'
		});

		result = view.find();
		ok(result[0] && result[0].moo === 2 && result[0].goo === 3, "Collection remove 'test1' replicate to transformed view");

		base.dbDown();
	});
});