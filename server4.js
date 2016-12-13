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
var http = require('http');
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
        dateStrings: 'true',
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
    function keepAlive() {
        pool.getConnection(function(err, connection) {
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
}

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/barcode', router);
    router.get("/:shopID", function(req, res) {

        var query = "SELECT ph2.barcode FROM ( SELECT ph.productID, MAX(ph.createAt) AS lastedDate FROM `productHistory` ph INNER JOIN product p on p.productID = ph.productID GROUP BY productID ) ph1 JOIN `productHistory` ph2 ON (ph2.createAt = ph1.lastedDate AND ph2.productID = ph1.productID) INNER JOIN product p on ph2.productID = p.productID WHERE p.shopID = ? GROUP BY ph2.productHistoryID";
        console.log(req.body);
        console.log(req.params);
        var table = [req.params.shopID];
        query = mysql.format(query, table);
        console.log(query);
        connection.query(query, function(err, rows) {

            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
                console.log(query);
                console.log("error occur");
            } else {
                var header = '';
                let body = '';
                let barcode = "";
                console.log(rows.length);
                console.log(rows);
                for(let i = 0 ;i< rows.length;i++){
                    console.log(rows[i].barcode);
                    barcode = barcode +"<img alt=\"Barcoded value "+rows[i].barcode+"\" src=\"http://api-bwipjs.rhcloud.com/?bcid=code128&text="+rows[i].barcode+"&includetext\" style=\"margin:10px\">\n\r";
                    console.log(barcode);
                }
                body = body + barcode;
                // concatenate header string
                // concatenate body string

                html =  '<!DOCTYPE html>'
                     + '<html><header>' + header + '</header><body  onload="window.print()">' + body + '</body></html>';
                     res.writeHead(200, {
                          'Content-Type': 'text/html',
                          'Content-Length': html.length,
                          'Expires': new Date().toUTCString()
                      });
                        res.end(html);
            }
        });
    //     var html = buildHtml(req);
    //     console.log(html);
    //     res.writeHead(200, {
    //       'Content-Type': 'text/html',
    //       'Content-Length': html.length,
    //       'Expires': new Date().toUTCString()
    //   });
    //     res.end(html);
    //
    // });
    // router.get("/:shopID", function(req, res) {
    //     res.json({"Message": "Hello World !"});

    });
    function buildHtml(req) {
        // let barcode = "";
        // var query = "SELECT ph2.barcode FROM ( SELECT ph.productID, MAX(ph.createAt) AS lastedDate FROM `productHistory` ph INNER JOIN product p on p.productID = ph.productID GROUP BY productID ) ph1 JOIN `productHistory` ph2 ON (ph2.createAt = ph1.lastedDate AND ph2.productID = ph1.productID) INNER JOIN product p on ph2.productID = p.productID WHERE p.shopID = ? GROUP BY ph2.productHistoryID";
        // console.log(req.body);
        // console.log(req.params);
        // var table = [req.body.shopID];
        // query = mysql.format(query, table);
        // console.log(query);
        // connection.query(query, function(err, rows) {
        //     console.log(rows.length);
        //     if (err) {
        //         res.json({"Error": true, "Message": "Error executing MySQL query"});
        //         console.log(query);
        //         console.log("error occur");
        //     } else {
        //         console.log(rows.length);
        //         var header = '';
        //         var body = '55';
        //         // for(let i = 0 ;i< rows.length;i++){
        //         //     barcode = barcode +"<img alt=\"Barcoded value "+rows[i].barcode+"\" src=\"http://api-bwipjs.rhcloud.com/?bcid=code128&text="+rows[i].barcode+"&includetext\">";
        //         //     body = body + barcode;
        //         // }
        //         // concatenate header string
        //         // concatenate body string
        //
        //         html =  '<!DOCTYPE html>'
        //              + '<html><header>' + header + '</header><body>' + body + '</body></html>';
        //     }
        // });

    };
    self.startServer();

}

REST.prototype.startServer = function() {
    app.listen(3000, function() {
        console.log("All right ! I am alive at Port 3000.");
    });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();
