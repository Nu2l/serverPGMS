var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var rest = function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}
var app = express();
var mysql = require("mysql");

function REST() {
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'admin_pgms',
        password: '123456',
        database: 'admin_pgms',
        debug: false
    });
    pool.getConnection(function(err, connection) {
        if (err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    router.get("/", function(req, res) {
        res.json({"Message": "Hello World !"});

    });
    router.post("/users", function(req, res) {
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = [
            "user_login",
            "user_email",
            "user_password",
            req.body.email,
            md5(req.body.password)
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({"Error": false, "Message": "User Added !"});
            }
        });
    });
    router.get("/user/:user/:pass", function(req, res) {
        var query = "SELECT * FROM user WHERE username = ? AND password = ?";
        console.log(req.body);
        console.log(req.params);
        var table = [req.params.user, req.params.pass];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
                console.log(query);
                console.log("error occur");
            } else {
                console.log(rows.length);
                res.json({"Error": false, "Message": "Success", "user": rows});
            }
        });
    });

    router.post("/user", function(req, res) {
        var query = "SELECT * FROM user LEFT JOIN shop on user.shopID = shop.shopID WHERE username = ?";
        var table = [req.body.user];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                console.log(rows.length);
                console.log(rows[0]);
                if (rows.length == 0) {
                    console.log("user = 0 ");
                    var query2 = "INSERT INTO ??(??,??) VALUES (?,?)";
                    var table2 = [
                        "user",
                        "username",
                        "password",
                        req.body.user,
                        md5(req.body.pass)
                    ];
                    query2 = mysql.format(query2, table2);
                    console.log(query2);
                    connection.query(query2, function(err, rows) {

                        if (err) {
                            res.json({"Error": true, "Message": "Error executing MySQL query"});
                        } else {
                            res.json({"Error": false, "Message": "Welcome new user !"});
                        }
                    });
                } else {
                    let encrptPass = md5(req.body.pass);
                    var shopName = rows[0].shopName;
                    console.log(rows[0].shopName);
                    console.log(encrptPass);
                    console.log(rows[0].password);
                    console.log("shopname = " + shopName);
                    if (encrptPass == rows[0].password) {
                        res.json({
                            "Error": false,
                            "Message": "Welcome Back !",
                            "ShopName": '' + shopName + ''
                        });
                    } else {
                        res.json({"Error": false, "Message": "Incorrect username or password !"});
                    }
                }

            }
        });
    });
    router.post("/shop", function(req, res) {
        var query = "SELECT * FROM shop WHERE shopName = ?";
        var table = [req.body.shopName];
        var role = req.body.roleValue;
        var pass = req.body.shopPass;
        var shopID = "";
        if (role != "owner" && role != "employee") {
            res.json({"Error": true, "Message": "Invalid role"});
            return;
        }
        console.log(table);
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {

            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                if (rows.length == 0) {
                    if (role == "owner") {
                        let query2 = "INSERT INTO shop(??,??) VALUES(?,?)";
                        let table2 = ["shopName", "keyShop", req.body.shopName, req.body.shopPass];

                        query2 = mysql.format(query2, table2);
                        console.log(query2);
                        connection.query(query2, function(err, rows) {
                            console.log("INSERT");
                            if (err) {
                                res.json({"Error": true, "Message": "Error executing MySQL query"});
                            } else {
                                let query2 = "SELECT * FROM shop WHERE shopName =?";
                                let table2 = [req.body.shopName];

                                query2 = mysql.format(query2, table2);
                                console.log(query2);
                                connection.query(query2, function(err, rows) {
                                    console.log("UPDATE");
                                    console.log(rows);
                                    if (err) {
                                        res.json({"Error": true, "Message": "Error executing MySQL query"});
                                    } else {
                                        let queryUpdate = "UPDATE user SET shopID = ? WHERE username = ?";
                                        let tableUpdate = [rows[0].shopID, req.body.userName];
                                        queryUpdate = mysql.format(queryUpdate, tableUpdate);
                                        console.log(queryUpdate);
                                        connection.query(queryUpdate, function(err, rows) {
                                            if (err) {
                                                res.json({"Error": true, "Message": "Error executing MySQL query"});
                                            } else {
                                                res.json({"Error": false, "Message": "Your shop has bee created !"});
                                            }
                                        });

                                    }
                                });

                            }
                        });
                    } else {
                        res.json({"Error": false, "Message": "wrong password or shop not exist !"});
                    }

                } else {
                    shopID = rows[0].shopID;
                    console.log(shopID);
                    if (rows[0].keyShop == pass) {
                        if (role == "owner") {
                            res.json({"Error": false, "Message": "Welcome Back Owner !"});
                        } else {

                            res.json({"Error": false, "Message": "Welcome to our shop !"});
                        }
                    } else {
                        res.json({"Error": false, "Message": "wrong password or shop not exist !"});
                    }
                }
                // res.json({"Error" : false, "Message" : "good"});
            }
        });
    });
    router.post("/transaction", function(req, res) {
// {"userID":4,"productList":[{"productID":"1007","qty":1},{"productID":"1010","qty":1}]}
        console.log(req.body.productList[0].productID);
        var reqProduct = req.body;
        var transaction_date = new Date().toISOString().
        replace(/T/, ' ').
        replace(/-/g, '').      // replace T with a space
        replace(/ .+/, '').
        substring(2)   ;
        console.log(transaction_date);
        var create_date = new Date().toISOString().
        substring(0,10).
        concat(" 00:00:00");
        console.log(create_date);
        var query = "SELECT * FROM transaction WHERE createAt >= ?";
        var table = [String(create_date)];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function(err, rows) {
            console.log(rows.length);
            let transaction_new = String(rows.length+1);
            // console.log(transaction_new.length);
            transaction_new = transaction_date+('0000'+transaction_new).substring(transaction_new.length);
            // console.log(transaction_new);
            // transaction_new = transaction_new;
            // console.log(transaction_count);
            var query = "INSERT INTO transaction(transactionID, userID, total, discount, discountDetail) VALUES(?,?,?,?,?)";
            var table = [
                transaction_new,
                reqProduct.userID,
                reqProduct.total,
                reqProduct.discount,
                reqProduct.discountDetail
            ]
            query = mysql.format(query,table);
            connection.query(query, function(err,rows){
                if (err) {
                    console.log(err.code);
                    res.json({"Error": true, "Message": "Error executing MySQL query"});
                    console.log(query);
                    console.log("error occur");
                }
                else {
                    let query = "";
                    let queryAll = "";
                    let arr_promise =[];
                    for(var i = 0 ; i<reqProduct.productList.length ; i++){
                        console.log(i);
                        console.log(reqProduct.productList[i]);
                        console.log("in loop");
                        console.log("productID"+reqProduct.productList[i].productID);
                        let p = new Promise(function(rsv,rej){
                            let j = i;
                            let query = "INSERT INTO transaction_detail(transactionID,productID,qty) VALUES (?,?,?);";
                            var table = [
                                transaction_new ,
                                reqProduct.productList[i].productID,
                                reqProduct.productList[i].qty
                            ];
                            query = mysql.format(query, table);
                            connection.query(query, function(err, rows){
                                if(err){
                                    rej(j+"error\n"+query);
                                }
                                else{
                                    rsv(j+"Done\n"+query);
                                }
                            });
                        });
                        arr_promise.push(p);
                        // p.then(function (value){
                        //     arr_promise.push(p);
                        //     console.log(value);
                        // },function (reason){
                        //     arr_promise.push(p);
                        //     console.log(reason);
                        // });
                        // query = "INSERT INTO transaction_detail(transactionID,productID,qty) VALUES (?,?,?);";
                        // var table = [
                        //     transaction_new ,
                        //     reqProduct.productList[i].productID,
                        //     reqProduct.productList[i].qty
                        // ];
                        // query = mysql.format(query, table);
                        // queryAll = queryAll + query;
                    }
                    pAll = Promise.all(arr_promise);
                    pAll.then(function (value){
                        console.log(value[0]);
                        res.json({"Error": false, "transactionID": transaction_new});
                    },function (reason){
                        console.log(reason);
                        res.json({"Error": true});
                    });

                    // console.log(queryAll);
                    // connection.query(queryAll, function(err, rows){
                    //     if(err){
                    //         res.json({"Error": true, "Message": "Error executing MySQL query in transactionDetail"});
                    //     }
                    //     else{
                    //         res.json({"transactionID" : transaction_new});
                    //     }
                    // });
                }
            });
        });

    });
    router.get("/product", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["product"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
                console.log(query);
                console.log("error occur");
            } else {
                res.json({"Error": false, "Message": "Success", "Products": rows});
            }
        });
    });

    router.post("/product", function(req, res) {
        var query = "INSERT INTO product(shopID, barcode, name, qty, type,imgName) VALUES(?, ?, ?, ?, ?, ?)";
        var table = [
            req.body.shopID,
            req.body.barcode,
            req.body.name,
            req.body.qty,
            req.body.type,
            req.body.imgName
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
                console.log(query);
                console.log("error occur");
            } else {
                res.json({"Error": false, "Message": "Success Added"});
            }
        });
    });

    router.put("/product", function(req, res){
        let reqProduct = req.body;
        let query = "UPDATE product SET ? WHERE userID = ?";
        for(let i= 0 ; i < reqProduct.productDetail.length ; i++){

        }
    });

    router.get("/product/:shop_id", function(req, res) {
        var query = "SELECT * FROM product INNER JOIN product_history on product.productID = product_history.productID WHERE ??=? ";
        var table = ["shopID", req.params.shop_id];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
                console.log("error occur");
            } else {
                res.json({"Error": false, "Message": "Success", "Products": rows});
            }
        });
    });

    router.get("/users", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["user_login"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({"Error": false, "Message": "Success", "Users": rows});
            }
        });
    });

    router.get("/users/:user_id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["user_login", "user_id", req.params.user_id];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({"Error": false, "Message": "Success", "Users": rows});
            }
        });
    });
    router.put("/users", function(req, res) {
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = [
            "user_login",
            "user_password",
            md5(req.body.password),
            "user_email",
            req.body.email
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({
                    "Error": false,
                    "Message": "Updated the password for email " + req.body.email
                });
            }
        });
    });
    router.delete("/users/:email", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user_login", "user_email", req.params.email];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({
                    "Error": false,
                    "Message": "Deleted the user with email " + req.params.email
                });
            }
        });
    });
    self.startServer();
}

REST.prototype.startServer = function() {
    app.listen(3001, function() {
        console.log("All right ! I am alive at Port 3001.");
    });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();
