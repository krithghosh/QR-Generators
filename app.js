var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var qr = require('qr-image');
var r = require('rethinkdb');
var random = require('random-js')();
var uuid = require('node-uuid');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/putDetails', function(req, res){
  var fname = req.body.fname;
  var phone = req.body.phone;
  var email = req.body.email;
  var value = null;

    r.connect({host: 'localhost', port: 28015}, function(err, conn){
      if(err) console.log(err);
          r.table('userdetails').run(conn, function(err, cursor) {
              if (err) throw err;
              cursor.toArray(function(err, result) {
                  if (err) throw err;
                  var flag = true;
                  console.log(result.length);
                  while(flag)
                  {
                    value = random.integer(1, 120);
                    for(var i = 0; i<result.length; i++) {
                       if(result[i]. ==value){
                          flag = false;
                          break;
                       }
                    }
                    if(flag){
                      break;
                    }
                    else
                    {
                      flag=true;
                    }
                  }
              
                r.table('userdetails').insert([{ name: fname || null, phone: phone || null, email: email || null,  : value || null}]).
                  run(conn, function(err, result){
                    if(err) console.log(err);
                    console.log(JSON.stringify(result, null, 2));
                    //res.json('Document Inserted');
                    r.table('userdetails').filter(r.row('email').eq(email)).
                          run(conn, function(err, cursor){
                            if(err) console.log(err);
                                cursor.toArray(function(err, result){
                                  if(err) console.log(err);
                                  console.log(result);
                                  if(result.length != 0){
                                      console.log(result[0].email)
                                      //var jsonString = JSON.stringify('{"name":'+'"'+result[0].name+'","seat":'+result[0].seat+'}');
                                      var code = qr.image(result[0].name+","+result[0]. , {type: 'png'});
                                      res.type('png');
                                      code.pipe(res);
                                    }
                                    else
                                    {
                                      res.json('member not found');
                                    }
                            })
                      })
                }) 
            })
        });
    });
});

app.get('/qrgenerate', function(req,res){
  var phone = req.query.phone;
      
      
});

app.set('port', process.env.PORT || 3000);
module.exports = app;
