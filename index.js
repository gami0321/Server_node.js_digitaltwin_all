const express = require('express')
const app=express();
const appWs=require('express-ws')(app)
const http = require('http').Server(app)
const bodyParser=require('body-parser')
const parse = require('url')
const timer=ms=>new Promise(res=>setTimeout(res,ms))

var con;
var con2;

//Postman
//app.use(bodyParser.urlencoded({extended:false}));

//Pythod
app.use(bodyParser.json())

var mysql=require('mysql')
var connection = mysql.createConnection({
	host : "127.0.0.1",
	port : 3306,
	user : "jung_3",
	password : "6206",
	database : "test__db"
})
//connection.end();
//connection.connect()

//test_2
app.post('/user/Pos',function(req,res){
	var userID = req.body.userID;
	var userPosX = req.body.userPosX;
	var userPosY = req.body.userPosY;
    
	var sql="INSERT INTO user_tb VALUES ('"+userID+"','"+userPosX+"','"+userPosY+"',now())";

	connection.query(sql, function(error, result, fields){
		if(error){
			res.send('err:'+error)
		}
		else{
			console.log(userID+','+userPosX+','+userPosY)
			res.send('succes create userPos')
		}
	})
	
})

/*
app.get('', (req,res)=>{
	const interval=setInterval(()=>{
		res.send(con);
	},1000);
})
*/

/*
app.post('/',function(req,res){
	var msg=req.body.msg; 
	console.log("python: " + msg);
})
*/

const wsServer=require('ws');
const wss=new wsServer.Server({server:http});

var sql2='SELECT * from user_tb ORDER BY userTime DESC limit 1';

wss.on('connection', (ws, req)=> {
	const ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		
	console.log('Client connected',ip);

	ws.on('message', function mss(message){
		con=message
		exports.con=con;
		console.log('client : ',con);
	})
	
	ws.on('error',(error)=>{
		console.error(error);
	})

	ws.on('close', ()=>{
		console.log('Client disconnected',ip);
		clearInterval(ws.interval);
	})

	ws.interval = setInterval(()=>{
		connection.query(sql2, function(err, rows, fields){
			if(err)
			{
				ws.send("error");
				console.log("error is : "+err);
			}
			else
			{
				if(ws.readyState==ws.OPEN){
					ws.send(JSON.stringify(rows[0]));
				}
			}
		})
	},100);
})

http.listen(3000, function(){
	console.log("server starting with 3000")
})

