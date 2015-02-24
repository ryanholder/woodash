var Base = function () {};

Base.prototype.dbUp = function () {
	db = new ForerunnerDB();
	user = db.collection('user');
	organisation = db.collection('organisation');

	// Don't use deferred emits in testing
	user._noEmitDefer = true;
	organisation._noEmitDefer = true;
};

Base.prototype.dataUp = function () {
	user.setData(usersData);
	organisation.setData(organisationsData);
};

Base.prototype.dbDown = function () {
	organisation ? organisation.drop() : '';
	user ? user.drop() : '';
	organisation = undefined;
	user = undefined;
	db = undefined;
};

Base.prototype.viewUp = function () {
	userView = db.view('userView')
		.from(db.collection('user'));
};

Base.prototype.viewDown = function () {
	db.view('userView').drop();
	userView = undefined;
};

Base.prototype.viewGroupUp = function () {
	userGroup = db.collectionGroup('userGroup')
		.addCollection(userView);

	userGroupView = db.view('userGroupView')
		.from(userGroup);
};

Base.prototype.viewGroupDown = function () {
	db.collectionGroup('userGroup').drop();
	db.view('userGroupView').drop();
	userGroup = undefined;
	userGroupView = undefined;
};

Base.prototype.domUp = function () {
	$('<ul id="testTarget"></ul>').appendTo('body');
	$('<div id="testTarget2"></div>').appendTo('body');
	$('<div id="demo-chart" style="width: 400px; height: 300px;"></div>').appendTo('body');
};

Base.prototype.domDown = function () {
	$('#testTarget').remove();
	$('#testTarget2').remove();
	$('#demo-chart').remove();
};

// Declare a global for ForerunnerDB

// Use global
window.base = new Base();