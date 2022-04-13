const path=require('path');
const express=require('express');
const app=express();
const http=require('http').Server(app);
const bodyParser=require('body-parser')
var way=require('./index.js');
var con=null;
var test;

//Postman
//app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var mysql=require('mysql')
var connection = mysql.createConnection({
	host : "127.0.0.1",
	port : 3306,
	user : "ip_user",
	password : "ip",
	database : "ip_db"
})

connection.connect();

/*
app.post('/user/ip', function(req,res){
	var user_id=req.body.user_id;
	var user_ip=req.body.user_ip;
	var userport=req.body.userport;

	var sql="INSERT INTO ip_tb VALUES ('"+user_id+"','"+user_ip+"','"+userport+"')";

	connection.query(sql, function(error, result, fields){
		if(error)
		{ 
			console.log ('err:'+error)
			res.send('err:'+error)
		}
		else
		{
			res.send('succes!')
			console.log('succes!')
			console.log(user_id+','+user_ip+','+userport)
		}
	})
})
*/


//var W3CWebSocket = require('websocket').w3cwebsocket;
//var client = new W3CWebSocket('ws://220.69.241.126:8888');

const wsServer=require('ws');
const wss=new wsServer.Server({server:http});

http.listen(3001, function(){
	console.log("server starting with 3001");
});

wss.on('connection', (ws,req)=>{
	//const ip=req.headers['x-forwarded-for']||req.connection.remoteAddress;
	const ip=req.socket.remoteAddress;
	const ip_2=ip.split(":");
	console.log(ip_2[3]);

	console.log('Client connected_rcip_',ip);
	var sql3="INSERT INTO ip_tb VALUES ('Unity','"+ip_2[3]+"')";
	
	ws.on('message',function mss(message){
		console.log(message);
		
		//con=message;
		//client.send(con);
		
		connection.query(sql3, function(error, rows, fields){
			if(error) console.log('err:'+error)
			else{
				console.log(message);
			}
		})
	})

	ws.on('error', (error)=>{
		console.log(error);
	})

	ws.on('close', ()=> {
		console.log('disconnected');
	})
})

/*
client.onerror = function(){
	console.log('Connection Error');
};

client.onopen = function(){
	console.log('WebSocket Client Connected');
};

client.onclose = function(){
	console.log('echo-protocol Client Closed');
};

client.onmessage=function(e){
	console.log(e.data);
	test=e.data;
	exports.test=test;
};
*/
