const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient





var db, collection;
// const url = process.env.dburl;
const url = "mongodb+srv://Johnbel458:CPTAJLWIEEltRGus@cluster0.lbzzt.mongodb.net/savademo?retryWrites=true&w=majority";
const dbName = "savademo";
console.log(url);
app.listen(3030, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate(
    {
      name: req.body.name,
      msg: req.body.msg
    },
    {
    $set: {

      thumbUp:req.body.thumbUp + 1,

    }
  },
  {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})






app.put('/test', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate(
    {
      name: req.body.name,
      msg: req.body.msg
    },
    {
    $set: {
// this is for thumbdown
      thumbUp:req.body.thumbUp -1,

    }
  },
  {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
