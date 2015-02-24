// TODO: Add doc comments to this class
// Import external names locally
var Shared = require('./Shared'),
	localforage = require('localforage'),
	Core,
	Collection,
	CollectionDrop,
	CollectionGroup,
	CollectionInit,
	CoreInit,
	Persist,
	Overload;

Persist = function () {
	this.init.apply(this, arguments);
};

Persist.prototype.init = function (db) {
	// Check environment
	if (db.isClient()) {
		if (Storage !== undefined) {
			this.mode('localforage');
			localforage.config({
				driver: [
					localforage.INDEXEDDB,
					localforage.WEBSQL,
					localforage.LOCALSTORAGE
				],
				name: 'ForerunnerDB',
				storeName: 'FDB'
			});
		}
	}
};

Shared.addModule('Persist', Persist);
Shared.mixin(Persist.prototype, 'Mixin.ChainReactor');

Core = Shared.modules.Core;
Collection = require('./Collection');
CollectionDrop = Collection.prototype.drop;
CollectionGroup = require('./CollectionGroup');
CollectionInit = Collection.prototype.init;
CoreInit = Core.prototype.init;
Overload = Shared.overload;

Persist.prototype.mode = function (type) {
	if (type !== undefined) {
		this._mode = type;
		return this;
	}

	return this._mode;
};

Persist.prototype.driver = function (val) {
	if (val !== undefined) {
		switch (val.toUpperCase()) {
			case 'LOCALSTORAGE':
				localforage.setDriver(localforage.LOCALSTORAGE);
				break;

			case 'WEBSQL':
				localforage.setDriver(localforage.WEBSQL);
				break;

			case 'INDEXEDDB':
				localforage.setDriver(localforage.INDEXEDDB);
				break;

			default:
				throw('ForerunnerDB.Persist: The persistence driver you have specified is not found. Please use either IndexedDB, WebSQL or LocalStorage!');
				break;
		}

		return this;
	}

	return localforage.driver();
};

Persist.prototype.save = function (key, data, callback) {
	var encode;

	encode = function (val, finished) {
		if (typeof val === 'object') {
			val = 'json::fdb::' + JSON.stringify(val);
		} else {
			val = 'raw::fdb::' + val;
		}

		if (finished) {
			finished(false, val);
		}
	};

	switch (this.mode()) {
		case 'localforage':
			encode(data, function (err, data) {
				localforage.setItem(key, data).then(function (data) {
					callback(false, data);
				}, function (err) {
					callback(err);
				});
			});
			break;

		default:
			if (callback) {
				callback('No data handler.');
			}
			break;
	}
};

Persist.prototype.load = function (key, callback) {
	var parts,
		data,
		decode;

	decode = function (val, finished) {
		if (val) {
			parts = val.split('::fdb::');

			switch (parts[0]) {
				case 'json':
					data = JSON.parse(parts[1]);
					break;

				case 'raw':
					data = parts[1];
					break;

				default:
					break;
			}

			if (finished) {
				finished(false, data);
			}
		} else {
			finished(false, val);
		}
	};

	switch (this.mode()) {
		case 'localforage':
			localforage.getItem(key).then(function (val) {
				decode(val, callback);
			}, function (err) {
				callback(err);
			});
			break;

		default:
			if (callback) {
				callback('No data handler or unrecognised data type.');
			}
			break;
	}
};

Persist.prototype.drop = function (key, callback) {
	switch (this.mode()) {
		case 'localforage':
			localforage.removeItem(key).then(function () {
				callback(false);
			}, function (err) {
				callback(err);
			});
			break;
		default:
			if (callback) {
				callback('No data handler or unrecognised data type.');
			}
			break;
	}

};

// Extend the Collection prototype with persist methods
Collection.prototype.drop = new Overload({
	/**
	 * Drop collection and persistent storage.
	 */
	'': function () {
		if (this._state !== 'dropped') {
			this.drop(true);
		}
	},

	/**
	 * Drop collection and persistent storage with callback.
	 * @param {Function} callback Callback method.
	 */
	'function': function (callback) {
		if (this._state !== 'dropped') {
			this.drop(true, callback);
		}
	},

	/**
	 * Drop collection and optionally drop persistent storage.
	 * @param {Boolean} removePersistent True to drop persistent storage, false to keep it.
	 */
	'boolean': function (removePersistent) {
		if (this._state !== 'dropped') {
			// Remove persistent storage
			if (removePersistent) {
				if (this._name) {
					if (this._db) {
						// Save the collection data
						this._db.persist.drop(this._name);
					} else {
						throw('ForerunnerDB.Persist: Cannot drop a collection\'s persistent storage when the collection is not attached to a database!');
					}
				} else {
					throw('ForerunnerDB.Persist: Cannot drop a collection\'s persistent storage when no name assigned to collection!');
				}
			}

			// Call the original method
			CollectionDrop.apply(this, arguments);
		}
	},

	/**
	 * Drop collections and optionally drop persistent storage with callback.
	 * @param {Boolean} removePersistent True to drop persistent storage, false to keep it.
	 * @param {Function} callback Callback method.
	 */
	'boolean, function': function (removePersistent, callback) {
		if (this._state !== 'dropped') {
			// Remove persistent storage
			if (removePersistent) {
				if (this._name) {
					if (this._db) {
						// Save the collection data
						this._db.persist.drop(this._name, callback);
					} else {
						if (callback) {
							callback('Cannot drop a collection\'s persistent storage when the collection is not attached to a database!');
						}
					}
				} else {
					if (callback) {
						callback('Cannot drop a collection\'s persistent storage when no name assigned to collection!');
					}
				}
			}

			// Call the original method
			CollectionDrop.apply(this, arguments);
		}
	}
});

Collection.prototype.save = function (callback) {
	if (this._name) {
		if (this._db) {
			// Save the collection data
			this._db.persist.save(this._name, this._data, callback);
		} else {
			if (callback) {
				callback('Cannot save a collection that is not attached to a database!');
			}
		}
	} else {
		if (callback) {
			callback('Cannot save a collection with no assigned name!');
		}
	}
};

Collection.prototype.load = function (callback) {
	var self = this;

	if (this._name) {
		if (this._db) {
			// Load the collection data
			this._db.persist.load(this._name, function (err, data) {
				if (!err) {
					if (data) {
						self.setData(data);
					}

					if (callback) {
						callback(false);
					}
				} else {
					if (callback) {
						callback(err);
					}
				}
			});
		} else {
			if (callback) {
				callback('Cannot load a collection that is not attached to a database!');
			}
		}
	} else {
		if (callback) {
			callback('Cannot load a collection with no assigned name!');
		}
	}
};

// Override the DB init to instantiate the plugin
Core.prototype.init = function () {
	this.persist = new Persist(this);
	CoreInit.apply(this, arguments);
};

Core.prototype.load = function (callback) {
	// Loop the collections in the database
	var obj = this._collection,
		keys = obj.keys(),
		keyCount = keys.length,
		index;

	for (index in obj) {
		if (obj.hasOwnProperty(index)) {
			// Call the collection load method
			obj[index].load(function (err) {
				if (!err) {
					keyCount--;

					if (keyCount === 0) {
						callback(false);
					}
				} else {
					callback(err);
				}
			});
		}
	}
};

Core.prototype.save = function (callback) {
	// Loop the collections in the database
	var obj = this._collection,
		keys = obj.keys(),
		keyCount = keys.length,
		index;

	for (index in obj) {
		if (obj.hasOwnProperty(index)) {
			// Call the collection save method
			obj[index].save(function (err) {
				if (!err) {
					keyCount--;

					if (keyCount === 0) {
						callback(false);
					}
				} else {
					callback(err);
				}
			});
		}
	}
};

Shared.finishModule('Persist');
module.exports = Persist;