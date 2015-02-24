test('Overload :: Type-based overloading', function () {
	base.dbUp();

	var func = new db.shared.overload({
		'string': function (val) {
			return 1;
		},
		'string, function': function (val, callback) {
			return 2;
		},
		'string, number': function (val, num) {
			return 3;
		},
		'string, string': function (val1, val2) {
			return 4;
		},
		'string, string, ...': function (val1, val2) {
			return 5;
		},
		'string, string, number, ...': function (val1, val2) {
			return 6;
		},
		'string, *, number, number, ...': function () {
			return 7;
		},
		'array, *': function () {
			return 8;
		}
	});

	ok(func('hello') === 1, 'Single string argument');
	ok(func('hello', function () {}) === 2, 'String, function arguments');
	ok(func('hello', 4) === 3, 'String, number arguments');
	ok(func('hello', 'goodbye') === 4, 'String, string arguments');
	ok(func('hello', 'goodbye', 'useful') === 5, 'String, string, further arguments');
	ok(func('hello', 'goodbye', 4, 'moo', 'foo') === 6, 'String, string, number, further arguments');
	ok(func('hello', null, 4, 4, 'foo') === 7, 'String, any, number, number, further arguments');
	ok(func([], 'foo') === 8, 'Array, any');

	base.dbDown();
});