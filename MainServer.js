var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var md5 = require('MD5');
var busboy = require('connect-busboy'); // middleware for form/file upload
var path = require('path'); // used for file path
var fs = require('fs-extra');
var inspect = require('util').inspect; // File System - for file manipulation
var rest = function REST_ROUTER (router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
};
var app = express();
var mysql = require('mysql');

function REST () {
    var self = this;
    self.connectMysql();
}

REST.prototype.connectMysql = function () {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: '123456',
        dateStrings: 'true',
        database: 'admin_pgms',
        debug: false
    });
    pool.getConnection(function (err, connection) {
        if (err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
    function keepAlive () {
        pool.getConnection(function (err, connection) {
            if (err) {
                return;
            }
            connection.ping();
            connection.release();

            // console.log("CHECK CONN MYSQL");
        });
    }
    console.log(new Date());
    setInterval(keepAlive, 30000);
};

REST.prototype.configureExpress = function (connection) {
    var self = this;
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(busboy());
    app.use(express.static(path.join(__dirname, 'upload')));

    var router = express.Router();
    app.use('/api', router);
    router.get('/', function (req, res) {
        res.json({'Message': 'Hello World !'});
    });

    //* *********
    // START USER SECTION
    //* *********
    router.get('/user/:user/:pass', function (req, res) {
        var query = 'SELECT * FROM user WHERE username = ? AND password = ?';
        console.log(req.body);
        console.log(req.params);
        var table = [req.params.user, req.params.pass];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                console.log(query);
                console.log('error occur');
            } else {
                console.log(rows.length);
                res.json({'Error': false, 'Message': 'Success', 'user': rows});
            }
        });
    });

    router.post('/user', function (req, res) {
        var query = 'SELECT * FROM user LEFT JOIN shop on user.shopID = shop.shopID WHERE username = ?';
        var table = [req.body.user];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
            } else {
                console.log(rows.length);
                console.log(rows[0]);
                if (rows.length == 0) {
                    console.log('user = 0 ');
                    var query2 = 'INSERT INTO ??(??,??) VALUES (?,?)';
                    var table2 = [
                        'user',
                        'username',
                        'password',
                        req.body.user,
                        md5(req.body.pass)
                    ];
                    query2 = mysql.format(query2, table2);
                    console.log(query2);
                    connection.query(query2, function (err, rows) {
                        if (err) {
                            res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                        } else {
                            res.json({'Error': false, 'Message': 'Welcome new user !'});
                        }
                    });
                } else {
                    let encrptPass = md5(req.body.pass);
                    var shopID = rows[0].shopID;
                    var userID = rows[0].userID;
                    var shopName = rows[0].shopName;
                    var type = rows[0].type;
                    console.log(rows[0].shopName);
                    console.log(encrptPass);
                    console.log(rows[0].password);
                    if (encrptPass == rows[0].password) {
                        res.json({
                            'Error': false,
                            'Message': 'Welcome Back !',
                            'shopID': shopID,
                            'userID': userID,
                            'shopName': '' + shopName + '',
                            'type' : type
                        });
                    } else {
                        res.json({'Error': false, 'Message': 'Incorrect username or password !'});
                    }
                }
            }
        });
    });
    //* *********
    // START SHOP SECTION
    //* *********
    router.post('/shop', function (req, res) {
        var query = 'SELECT * FROM shop WHERE shopName = ?';
        var table = [req.body.shopName];
        var role = req.body.roleValue;
        var pass = req.body.shopPass;
        var shopID = '';
        if (role != 'owner' && role != 'employee') {
            res.json({'Error': true, 'Message': 'Invalid role'});
            return;
        }
        console.log(table);
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
            } else {
                if (rows.length == 0) {
                    console.log('shop not exist');
                    if (role == 'owner') {
                        let query2 = 'INSERT INTO shop(??,??) VALUES(?,?)';
                        let table2 = ['shopName', 'keyShop', req.body.shopName, req.body.shopPass];
                        query2 = mysql.format(query2, table2);
                        console.log(query2);
                        connection.query(query2, function (err, rows) {
                            console.log('INSERT');
                            if (err) {
                                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                            } else {
                                let query2 = 'SELECT shop.shopID , user.userID FROM `shop` JOIN user WHERE userName = ? and shopName = ?';
                                let table2 = [req.body.userName, req.body.shopName];
                                query2 = mysql.format(query2, table2);
                                console.log(query2);
                                connection.query(query2, function (err, rows) {
                                    console.log('UPDATE');
                                    console.log(rows);
                                    let userID = rows[0].userID;
                                    let shopID = rows[0].shopID;
                                    if (err) {
                                        res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                                    } else {
                                        let queryUpdate = 'UPDATE user SET shopID = ?, type = \'owner\' WHERE username = ?';
                                        let tableUpdate = [rows[0].shopID, req.body.userName];
                                        queryUpdate = mysql.format(queryUpdate, tableUpdate);
                                        console.log(queryUpdate);
                                        connection.query(queryUpdate, function (err, rows) {
                                            if (err) {
                                                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                                            } else {
                                                res.json({'Error': false, 'Message': 'Your shop has been created !', 'userID': userID, 'shopID': shopID, 'username' :req.body.userName, "type":"owner"});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({'Error': false, 'Message': 'wrong password or shop not exist !'});
                    }
                } else {
                    console.log('shop exist');
                    shopID = rows[0].shopID;
                    console.log(shopID);
                    if (rows[0].keyShop == pass) {
                        if (role == 'owner') {
                            res.json({'Error': false, 'Message': 'Sorry this name already exist!'});
                            return;
                        } else {
                            let queryUpdate = 'UPDATE user SET shopID = ?,type = \'employee\' WHERE username = ?';
                            let tableUpdate = [rows[0].shopID, req.body.userName];
                            queryUpdate = mysql.format(queryUpdate, tableUpdate);
                            console.log(queryUpdate);
                            connection.query(queryUpdate, function (err, rows) {
                                if (err) {
                                    res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                                }
                            });
                        }
                        let query2 = 'SELECT shop.shopID , user.userID, user.type FROM `shop` JOIN user WHERE userName = ? and shopName = ?';
                        let table2 = [req.body.userName, req.body.shopName];
                        query2 = mysql.format(query2, table2);
                        connection.query(query2, function (err, rows) {
                            console.log('UPDATE');
                            console.log(query2);
                            console.log(rows);
                            if (err) {
                                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                            } else {
                                res.json({'Error': false, 'Message': 'Welcome to our shop !', 'userID': rows[0].userID, 'shopID': rows[0].shopID, 'type':rows[0].type});
                            }
                        });
                    } else {
                        res.json({'Error': false, 'Message': 'wrong password or shop not exist !'});
                    }
                }
                // res.json({"Error" : false, "Message" : "good"});
            }
        });
    });

    //* *********
    // START SETTING SECTION
    //* *********

    router.get('/setting/:shopID', function (req, res) {
        let lQuery = 'SELECT  settingID, value from shop_setting WHERE shopID = ?';
        let lTable = [req.params.shopID];
        lQuery = mysql.format(lQuery, lTable);
        connection.query(lQuery, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                console.log(lQuery);
            } else {
                res.json({'Error': false, 'Message': 'Success', 'setting': rows});
                console.log(lQuery);
            }
        });
    });

    //* *********
    // START TRANSACTION SECTION
    //* *********
    router.post('/transaction', function (req, res) {
        console.log(req.body.productList[0].productID);
        var reqProduct = req.body;
        reqProduct.total == null
            ? reqProduct.total = 0
            : reqProduct.total = reqProduct.total;
        reqProduct.discount == null
            ? reqProduct.discount = 0
            : reqProduct.discount = reqProduct.discount;
        reqProduct.method == null
            ? reqProduct.method = 0
            : reqProduct.method = reqProduct.method;
        reqProduct.discountDetail == null
            ? reqProduct.discountDetail = ' s'
            : reqProduct.discountDetail = reqProduct.discountDetail;
        console.log(reqProduct.discountDetail);
        var transaction_date = new Date().toISOString().replace(/T/, ' ').replace(/-/g, '') // replace T with a space
            .replace(/ .+/, '').substring(2);
        console.log(transaction_date);
        var create_date = new Date().toISOString().substring(0, 10).concat(' 00:00:00');
        console.log(create_date);
        var query = 'SELECT * FROM transaction WHERE createAt >= ? AND shopID = ? ';
        var table = [String(create_date), reqProduct.shopID];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function (err, rows) {
            console.log(rows.length);
            let transaction_new = String(rows.length + 1);
            // console.log(transaction_new.length);
            transaction_new = transaction_date + ('000' + reqProduct.shopID).substring(reqProduct.shopID.length) + ('0000' + transaction_new).substring(transaction_new.length);
            console.log(transaction_new);
            // transaction_new = transaction_new;
            // console.log(transaction_count);
            var query = 'INSERT INTO transaction(transactionID, userID, shopID, total, discount, method, discountDetail) VALUES(?,?,?,?,?,?,?)';
            var table = [
                transaction_new,
                reqProduct.userID,
                reqProduct.shopID,
                reqProduct.total,
                reqProduct.discount,
                reqProduct.method,
                reqProduct.discountDetail
            ];
            query = mysql.format(query, table);
            connection.query(query, function (err, rows) {
                if (err) {
                    console.log(err.code);
                    res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                    console.log(query);
                    console.log('error occur');
                } else {
                    let query = '';
                    let queryAll = '';
                    let arr_promise = [];
                    for (var i = 0; i < reqProduct.productList.length; i++) {
                        console.log(i);
                        console.log(reqProduct.productList[i]);
                        console.log('in loop');
                        console.log('productID' + reqProduct.productList[i].productID);
                        let productID = reqProduct.productList[i].productID;
                        let qty = reqProduct.productList[i].qty;
                        let p = new Promise(function (rsv, rej) {
                            let j = i;
                            let query = 'INSERT INTO transactionDetail(transactionID,productID,qty) VALUES (?,?,?);';
                            var table = [transaction_new, reqProduct.productList[i].productID, reqProduct.productList[i].qty];
                            query = mysql.format(query, table);
                            connection.query(query, function (err, rows) {
                                if (err) {} else {
                                    let query = 'SELECT qty FROM product WHERE productID = ?';
                                    var table = [productID];
                                    query = mysql.format(query, table);
                                    connection.query(query, function (err, rows) {
                                        if (err) {
                                            rej(j + 'error\n' + query);
                                        } else {
                                            let newQty = rows[0].qty;
                                            newQty = newQty - qty;
                                            let query = 'UPDATE product SET qty = ? WHERE productID = ?';
                                            var table = [newQty, productID];
                                            query = mysql.format(query, table);
                                            connection.query(query, function (err, rows) {
                                                if (err) {
                                                    rej(j + 'error\n' + query);
                                                } else {
                                                    rsv(j + 'Done\n' + query);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                        arr_promise.push(p);
                    }
                    pAll = Promise.all(arr_promise);
                    pAll.then(function (value) {
                        console.log(value[0]);
                        res.json({'Error': false, 'transactionID': transaction_new});
                    }, function (reason) {
                        console.log(reason);
                        res.json({'Error': true});
                    });
                }
            });
        });
    });
    router.get('/transaction/:shopID', function (req, res) {
        let lQuery = 'SELECT  t.transactionID, t.refTransactionID, u.username, t.total, t.discount, t.discountDetail, t.status, t.method, t.createAt from transaction t INNER JOIN user u on t.userID = u.userID WHERE t.shopID = ?';
        let lTable = [req.params.shopID];
        lQuery = mysql.format(lQuery, lTable);
        connection.query(lQuery, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                console.log(lQuery);
            } else {
                res.json({'Error': false, 'Message': 'Success', 'transaction': rows});
                console.log(lQuery);
            }
        });
    });

    router.get('/transactionDetail/:transactionID/:createAt', function (req, res) {
        let lQuery = 'SELECT td.*, ph2.name, ph2.price,ph2.cost FROM ( SELECT productID ,MAX(createAt) AS createProduct FROM `productHistory` WHERE createAt <= ? GROUP BY productID ) ph1 JOIN `productHistory` ph2 ON (ph2.productID = ph1.productID AND ph1.createProduct = ph2.createAt ) INNER JOIN transactionDetail td ON td.productID = ph2.productID WHERE td.transactionID = ? ORDER BY td.transactionID';
        let lTable = [
            req.params.createAt.replace('T', ' '),
            req.params.transactionID
        ];
        lQuery = mysql.format(lQuery, lTable);
        connection.query(lQuery, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                console.log(lQuery);
            } else {
                res.json({'Error': false, 'Message': 'Success', 'transactionDetail': rows});
                console.log(lQuery);
            }
        });
    });
    //* *********
    // START PRODUCT SECTION
    //* *********
    router.get('/product', function (req, res) {
        var query = 'SELECT * FROM ??';
        var table = ['product'];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                console.log(query);
                console.log('error occur');
            } else {
                res.json({'Error': false, 'Message': 'Success', 'Products': rows});
            }
        });
    });

    router.post('/product', function (req, res) {
        var query = 'INSERT INTO product(shopID, qty, type,imgName) VALUES( ?, ?, ?, ?)';
        var table = [req.body.shopID, req.body.qty, req.body.type, req.body.imgName];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                console.log(query);
                console.log('error occur');
            } else {
                let query2 = 'SELECT productID from product WHERE shopID = ? ORDER BY productID DESC LIMIT 1';
                let table2 = [req.body.shopID];
                query2 = mysql.format(query2, table2);
                connection.query(query2, function (err, rows) {
                    if (err) {
                        res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                        console.log(query2);
                        console.log('error occur');
                    } else {
                        console.log(rows[0].productID);
                        let productID = rows[0].productID;
                        let q = 'INSERT INTO productHistory(productID, barcode, name, price, cost) VALUES (?, ?, ?, ?, ?)';
                        let t = [productID, req.body.barcode, req.body.name, req.body.price, req.body.cost];
                        q = mysql.format(q, t);
                        connection.query(q, function (err, rows) {
                            if (err) {
                                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                                console.log(query2);
                                console.log('error occur');
                            } else {
                                res.json({'Error': false, 'Message': 'Success Added'});
                            }
                        });
                    }
                });
            }
        });
    });

    router.put('/product', function (req, res) {
        let arr_promise = [];
        console.log(req.body);
        let p = new Promise(function (rsv, rej) {
            console.log(req.body);
            let query = 'INSERT INTO productHistory(productID,name,barcode,price,cost) VALUES (?,?,?,?,?);';
            let table = [req.body.productID, req.body.name, req.body.barcode, req.body.price, req.body.cost];
            query = mysql.format(query, table);
            connection.query(query, function (err, rows) {
                if (err) {
                    rej('error\n' + query);
                } else {
                    rsv('Done\n' + query);
                }
            });
        });
        arr_promise.push(p);
        let updateAt = new Date().toISOString().replace(/T/, ' ');
        updateAt = updateAt.substring(0, updateAt.indexOf('.'));
        console.log(updateAt);
        let p2 = new Promise(function (rsv, rej) {
            let query = 'UPDATE product SET qty=? WHERE productID = ?';
            let table = [req.body.qty, req.body.productID];
            query = mysql.format(query, table);
            connection.query(query, function (err, rows) {
                if (err) {
                    rej('error\n' + query);
                } else {
                    rsv('Done\n' + query);
                }
            });
        });
        arr_promise.push(p2);
        pAll = Promise.all(arr_promise);
        pAll.then(function (value) {
            console.log(value[0]);
            res.json({'Error': false, 'Message': 'Success Edit'});
        }, function (reason) {
            console.log(reason);
            res.json({'Error': true});
        });
    });

    router.get('/product/:shop_id', function (req, res) {
        var query = 'SELECT ph2.*,p.qty, p.type, p.imgName ' +
        'FROM ' +
        '( ' +
        'SELECT ph.productID, MAX(ph.createAt) AS lastedDate ' +
        'FROM `productHistory` ph INNER JOIN product p on p.productID = ph.productID  ' +
        'GROUP BY productID ' +
        ') ph1 ' +
        'JOIN `productHistory` ph2 ON (ph2.createAt = ph1.lastedDate AND ph2.productID = ph1.productID) ' +
        'INNER JOIN product p on ph2.productID = p.productID WHERE p.shopID = ? ' +
        'GROUP BY  ph2.productHistoryID';
        var table = [req.params.shop_id];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function (err, rows) {
            if (err) {
                console.log(query);
                res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                console.log('error occur');
            } else {
                console.log(query);
                res.json({'Error': false, 'Message': 'Success', 'Products': rows});
            }
        });
    });

    router.post('/product2', function (req, res) {
        let jsoBody;
        let temp;
        var fstream;
        var picName = 'temp1';
        console.log('in busboy');
        console.log(req.body);
        req.pipe(req.busboy);
        console.log('after pipe');
        req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
            jsoBody = inspect(val);
            console.log('in field');
            console.log(jsoBody);
            jsoBody = jsoBody.substring(1, (jsoBody.length) - 1);
            temp = JSON.parse(jsoBody);
            console.log(temp);
            // req.pause();
            var query = 'INSERT INTO product(shopID, qty, type) VALUES( ?, ?, ?)';
            var table = [temp.shopID, temp.qty, temp.type];
            query = mysql.format(query, table);
            connection.query(query, function (err, rows) {
                if (err) {
                    res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                    console.log(query);
                    console.log('error occur');
                } else {
                    let query2 = 'SELECT productID from product WHERE shopID = ? ORDER BY productID DESC LIMIT 1';
                    let table2 = [temp.shopID];
                    query2 = mysql.format(query2, table2);
                    connection.query(query2, function (err, rows) {
                        if (err) {
                            res.json({'Error': true, 'Message': 'Error executing MySQL query'});
                            console.log(query2);
                            console.log('error occur');
                        } else {
                            console.log(rows);
                            console.log(rows[0].productID);
                            let arr_promise = [];
                            let productID = rows[0].productID;
                            // picName = productID;
                            // console.log("picNmae"+picName);
                            let p = new Promise(function (rsv, rej) {
                                let q = 'INSERT INTO productHistory(productID, barcode, name, price, cost) VALUES (?, ?, ?, ?, ?)';
                                let t = [productID, temp.barcode, temp.name, temp.price, temp.cost];
                                q = mysql.format(q, t);
                                connection.query(q, function (err, rows) {
                                    if (err) {
                                        rej('error\n' + query);
                                    } else {
                                        rsv('Done\n' + query);
                                    }
                                });
                            });
                            arr_promise.push(p);
                            pAll = Promise.all(arr_promise);
                            pAll.then(function (value) {
                                console.log(value[0]);
                                fs.ensureDirSync(__dirname + '/upload/'+temp.shopID);
                                fs.rename(__dirname + '/upload/' + picName, __dirname + '/upload/'+temp.shopID+'/'+'/img_' + productID + '.png', function (err) {
                                    if (err) { console.log('ERROR: ' + err); }
                                }
                                );
                                let img = 'img_' + productID + '.png';
                                let q = 'UPDATE product SET imgName = ? WHERE productID = ?';
                                let t = [img, productID];
                                q = mysql.format(q, t);
                                connection.query(q, function (err, rows) {
                                    if (err) {
                                        res.json({'Error': true, 'Message': 'error set picname'});
                                    } else {
                                        let img = 'img_' + productID + '.png';
                                        let q = 'SELECT createAt FROM product WHERE productID = ?';
                                        let t = [productID];
                                        q = mysql.format(q, t);
                                        connection.query(q, function (err, rows) {
                                            if (err) {
                                                res.json({'Error': true, 'Message': 'error set picname'});
                                            } else {
                                                res.json({
                                                    'Error': false,
                                                    'imgName': img,
                                                    'productID': productID,
                                                    'shopID': temp.shopID,
                                                    'qty': temp.qty,
                                                    'type': temp.type,
                                                    'barcode': temp.barcode,
                                                    'name': temp.name,
                                                    'price': temp.price,
                                                    'cost': temp.cost,
                                                    'details': temp.details,
                                                    'createAt': rows[0].createAt
                                                });
                                            }
                                        });
                                    }
                                });
                            }, function (reason) {
                                console.log(reason);
                                res.json({'Error': true});
                            });
                        }
                    });
                }
            });
        });
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log('Uploading: ' + filename);
            console.log(picName);
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            fstream = fs.createWriteStream(__dirname + '/upload/' + picName);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log('Done savefile');
            });
        });
    });

    //* *********
    // START EXAMPLE SECTION
    //* *********

    self.startServer();
};

REST.prototype.startServer = function () {
    app.listen(3001, function () {
        console.log('All right ! I am alive at Port 3001.');
    });
};

REST.prototype.stop = function (err) {
    console.log('ISSUE WITH MYSQL n' + err);
    process.exit(1);
};

new REST();
