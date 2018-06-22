var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

// Nasłuchiwanie na porcie 8181
http.listen(process.env.SV_PORT);

// Funkcja obliczjąca objętość walca
var obj = function(w,p){
	return Math.PI*p*p*w;
}

var con = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DB
});

con.connect(function(error){
	if (!!error) console.log("CONNECTION ERROR: " + error);
	else console.log("Polaczenie do bazy!");
});
// Na połączeniu wyświetla w logu, że klient się połączył.
// Po otrzymaniu od klienta rządania na 'dane' oblicza objętość
// i wysyła wynik na 'wynik' do klienta

io.on('connection', function(socket){
	console.log("Klient sie polaczyl!");

	socket.on('dane', function(dane){
		var wys = dane.wysokosc;
		var pro = dane.promien;
		var wynik = Math.round(obj(wys,pro)*100)/100;
		// SQL - zmienna zawierająca zapytanie do bazy
		// con.query - wysłanie zapytania do bazy
		var sql = "INSERT INTO obj_walca VALUES(" + pro + "," + wys + "," + wynik +");";
		con.query(sql, function (error, result) {
			if (!!error) console.log("QUERY ERROR: " + error);
			else console.log("Dane zostaly zapisane do bazy!");
		});
				
		console.log("Wynik: " + wynik);
		io.emit('wynik', wynik);
	});

});

module.exports = {
	appup: function(){
		return "App is UP";
	},
	obj: function(value1,value2){
		var wynik =3.14*value2*value2*value1;
		var wynik2 =Math.round(wynik*100)/100;		
		return wynik2;
	}
}

//con.end();