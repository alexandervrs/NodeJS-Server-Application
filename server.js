
const express           = require("express");
const socket_io         = require("socket.io");
const path              = require("path");
const mysql             = require("mysql2");

/* -----------------------------------------
   Globals
----------------------------------------- */

const dbHost     = "localhost";
const dbUser     = "root";
const dbPassword = "";
const dbName     = "test";


/* -----------------------------------------
   Initialize Server
----------------------------------------- */

const port  = process.env.PORT || 3000;
const index = path.join(__dirname, "client.html");

const server = express()
  .use((req, res) => res.sendFile(index))
  .listen(port, () => console.log(`Listening on ${port}`));

const io = socket_io(server);


/* -----------------------------------------
   Handle Messages from Client
----------------------------------------- */

io.on("connection", (socket) => {
	
	console.log("Client connected");
	
	socket.on("Disconnect", () => {
		console.log("Client disconnected");
	});

	var pool = mysql.createPool({
		host: dbHost,
		user: dbUser,
		password: dbPassword,
		database: dbName,
		waitForConnections: true,
		connectionLimit: 151,
		queueLimit: 0
	});
	
	// add or update user scores when client sends the data
	socket.on("UpdateUserData", function (data) {
		
		// validate data first ...
		
		pool.execute(
			"INSERT INTO userdata (name,score) VALUES(?,?) ON DUPLICATE KEY UPDATE score=?",
			[ data["name"], data["score"], data["score"] ],
			function(err) {
				
				if (err) {
					console.log("Error when executing SQL query: "+err);
				}
				
				console.log("User Data: "+data["name"]+": "+data["score"]);
			}
		);	
		
	});
  
});


/* -----------------------------------------
   Broadcast Messages to Client
----------------------------------------- */

// update datetime every second
setInterval(() => {
	io.emit("time", new Date().toTimeString())
}, 1000);

// update user scores every 3 seconds
setInterval(() => {
	
	var pool = mysql.createPool({
		host: dbHost,
		user: dbUser,
		password: dbPassword,
		database: dbName,
		waitForConnections: true,
		connectionLimit: 151,
		queueLimit: 0
	});
	
	pool.execute(
		"SELECT * FROM userdata ORDER BY `score` DESC",
		function(err, results) {
			
			if (err) {
				console.log("Error when executing query "+err);
			}
			
			var tableData = "";
			Object.keys(results).forEach(function(key) {
				
				var row = results[key];

				tableData += row.name +": "+row.score+"<br/>";
			  
			});
			
			io.emit("ShowUserData", tableData);
		}
	);
	
}, 3000);
