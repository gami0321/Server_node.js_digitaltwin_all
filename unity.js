const path=require('path');
const express=require('express');
const app=express();
const http=require('http').Server(app);
const bodyParser=require('body-parser');
const ip=require('./test.js');

var mysql=require('mysql')
var connection=mysql.createConnection({
	host : "127.0.0.1",
	port : 3306,
	user : "ip_user",
	password : "ip",
	database : "ip_db"
})

const wsServer=require('ws');
const wss=new wsServer.Server({server:http});

var sql='SELECT * FROM ip_tb WHERE user_id="Unity"'
wss.on('connection', (ws,req)=>{
	console.log('Client connected_UnityIP');

	ws.on('message',function mss(message){
		console.log(message);
		
		connection.query(sql, function(error, rows, fields){
			if(error) console.log('err:'+error)
			else{
				ws.send(JSON.stringify(rows[0]));
				console.log(JSON.stringify(rows[0]));
			}
		
		})	
	})

	ws.on('error', (error)=>{
		console.log(error);
	})

	ws.on('close', ()=> {
		console.log('disconnected UnityIP');
	})
})	

http.listen(3002, function(){
	console.log("server starting with 3002");
})
