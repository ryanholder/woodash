ForerunnerDB.moduleLoaded('Grid', function () {
	test('Grid - Grid() :: Instantiate a grid', function () {
		base.dbUp();

		var grid = db.grid('.moo');

		ok(grid instanceof db.shared.modules.Grid, 'Grid instantiated from correct class');

		base.dbDown();
	});

	test('Grid - Grid() :: Bind a grid', function () {
		base.dbUp();
		base.domUp();

		var coll = db.collection('gridTest').truncate(),
			view = db.view('gridTest').from(coll),
			grid = view.grid('#testTarget2', '#gridTable');

		coll.setData([{
			firstName: 'Fred',
			lastName: 'Jones',
			age: 15
		}, {
			firstName: 'Jim',
			lastName: 'Franks',
			age: 34
		}, {
			firstName: 'Tilly',
			lastName: 'Monsoon',
			age: 52
		}, {
			firstName: 'Arbit',
			lastName: 'Frogsbottom',
			age: 63
		}]);

		ok(grid, 'Grid active');
		//grid.drop();

		//base.domDown();
		base.dbDown();
	});
});