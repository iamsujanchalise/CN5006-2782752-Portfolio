var express = require('express');
var fs = require('fs');
var app = express();

//add middleware

var bodyParser = require('body-parser');
const { default: mongoose, mongo } = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  week 4 

app.get('/', function(req, res) {
    res.send('hello it is my first express application');
});

app.get('/about',function(req,res)
{ res.send("This is basic express application ")
});
app.get('/users/:userId/books/:bookId', function (req, res) { res.send(req.params)
});


app.get('/GetStudents',function (req,res)
 { studentdata={}
 fs.readFile(__dirname + "/" + "Student.json", 'utf8', function (err,
data) { console.log( data );
 res.json({ 'status':true, 'Status_Code':200,
 'requested at': req.localtime, 'requrl':req.url,
 'request Method':req.method, 'studentdata':JSON.parse(data)});
});
}) 


app.get('/GetStudentid/:id',(req,res)=>{
 studentdata={}
 fs.readFile(__dirname + "/" + "Student.json", 'utf8', function (err, data) {
 var students= JSON.parse(data)
 var student=students["Student"+req.params.id]
 console.log("student",student)
 if (student)
 res.json(student)
 else
 res.json({ 'status':true, 'Status_Code':200,
 'requested at': req.localtime, 'requrl':req.url, 
 'request Method':req.method, 'studentdata':JSON.parse(data)});
 });
 })

app.get('/studentinfo',function(req,res)
{
res.sendFile('StudentInfo.html', { root: __dirname });
})
app.post('/submit-data', function (req, res) {
var name = req.body.firstName + ' ' + req.body.lastName+ ' ';
var Age= req.body.myAge+ ' Gender: ' + req.body.gender+ ' Qualification'+ req.body.Qual;
console.log(req.body.Qual)
res.send({
status: true,
message: 'form Details', data: {
name: name, age:Age, Qualification:Qual,
}
});
});


// week 7 -mongoose connection and apis
mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/Week8';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', function(err) {
    console.log('Error occured during the connection', err);
});

db.once('connected', function() {
    console.log(`Connected to ${MONGO_URI}`);
});


//Ccreating the scheme

const PersonSchema = new mongoose.Schema({name: { type: String, required: true }, 
    age: Number, 
    Gender: String, 
    Salary: Number
});
const person_doc = mongoose.model('modelname', PersonSchema, 'personCollection');
//creating a single document
const doc1 = new person_doc({ name: 'Sujan Chalise', age: 22, Gender: 'Male', Salary: 50000 });

doc1.save().then(doc1 => {
    console.log('New article has been added into your databse:', doc1);
}).catch(err => {
    console.error( err);
});


// insert many documents

manyPersons = [
    {
        name: 'simon', age:42, Gender:"Male", Salary:70000,
    },
    {
        name: 'Neesha', age:23, Gender:"Male", Salary:1312421,
    },{
        name: 'Mary', age:27, Gender:"Male", Salary:5555,
    },{
        name: 'Mike', age:40, Gender:"Male", Salary:1234,
    }
];

person_doc.insertMany(manyPersons).then(function() {
    console.log('Data inserted');;
}).catch(function(err) {
    console.error(err);
});

// find all documents
person_doc.find()
    .sort({Salary: 1})
    .select("name Salary age")
    .limit(10)
    .exec()
    .then(docs => {
        console.log('Showing multiple documents');
        docs.forEach(doc => console.log(doc.age, doc.name));
    })
    .catch(err => {
        console.error(err);
    });

    //filter conditions
var givenage = 30;
person_doc.find({ Gender: "Female", age: {$gte: givenage} })
.sort({Salary: 1})
    .select("name Salary age")
    .limit(10)
    .exec()
    .then(docs => {
        console.log('Showing multiple documents');
        docs.forEach(doc => console.log(doc.age, doc.name));
    })
    .catch(err => {
        console.error(err);
    });

//counting all documents

person_doc.countDocuments().exec().then(count => {
    console.log(`Total number of documents: ${count}`);
}).catch(err => {
    console.error(err);
});


//delete many
person_doc.deleteMany({ age: { $lt: 25 } }).exec()
    .then(docs => {
        console.log('Documents deleted:', docs.deletedCount);
    })
    .catch(err => {
        console.error(err);
    });

//multiple updates
person_doc.updateMany({Gender: 'Female'}, {Salary: 5555}).exec()
    .then(docs => {
        console.log('Documents updated:');
        console.log(docs)
    })
    .catch(err => {
        console.log(err);
    }); 

app.listen(5000, function() {
    console.log('Server is running on port 5000');
});