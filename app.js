 


const express = require('express')

const app = express()

const session = require('express-session')

const bodyParser = require('body-parser')

const http = require('http')

const socketIO = require('socket.io')

const db = require('./config/config')

const path = require('path')



// middleware setups


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({ secret: 'secret_word', resave: false,
saveUninitialized: true, cookie: {expires: false}}))
app.use(express.static(path.join(__dirname, 'assets'))); 



// view engine 'EJS' setup

app.set('view engine', 'ejs')




//models


const authenticate = require('./models/authenticate')
const register = require('./models/register')
const login = require('./models/login')


// Controllers


require('./controllers/home')(app)
require('./controllers/register')(app, db, authenticate, register)
require('./controllers/login')(app, db, login)
require('./controllers/lobby')(app)
require('./controllers/logout')(app)
require('./controllers/chat')(app)
require('./controllers/game')(app)


// 

const server = http.createServer(app)

let io = socketIO(server)

let socketCount = 0

io.on('connection', (socket)=> {
	   
	console.log('new user connected')

	socket.on('newUser', ()=> {

		socketCount++

		if(socketCount === 2) {
			  
			socket.emit('game_start')
		}

	})

})

app.get('/tests', (req, res)=> {

db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at $
{Date.now()}')`)
.then( _ => db.any(`SELECT * FROM test_table`) )
.then( results => res.json( results ) )
.catch( error => {

	console.log(error)
})

})



app.get('/create', (req, res)=> {

	  db.any(`create table test_table ("id" serial PRIMARY KEY, "createdAt" date not null default CURRENT_DATE, "testString" VARCHAR(255) not null)`)
	  .then( results => res.json(results))
	  .catch(error => {
	  	console.log(error)

	  })
})


app.get('/players', (req, res)=> {


	  db.any(`create table players 
	  	("player_id" serial PRIMARY KEY,
	  	 "points"  INT,
	  	 "username" VARCHAR(255) not null,
	  	 "password" VARCHAR(255) not null, 
	  	 "wins" INT)
	  	`)
	  .then( results => res.send(results))
	  .catch(error => {

	  	  console.log(error)
	  })
})





app.get('/cards', (req, res) => {

	   db.any(`create table cards
	   	("card_id" serial PRIMARY KEY, 
	   	"suit" text not null,
	   	"rank" INT not null)`)
	   .then(results=> res.send(results))
	   .catch(error => {
	   	   console.log(error)
	   })
})













// server start


server.listen(process.env.PORT || 2000, () => {

	  console.log ('Server Running ....')
})
