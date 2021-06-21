'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

//connect the express server with mongodb

const PORT = process.env.PORT || 3040;
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

//create a schema

const BookSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
});

//create a schema
const Userschema = new mongoose.Schema({
    email: String,
    books: [BookSchema]
});

//create a model 
const bookModel = mongoose.model('book', BookSchema);

//create a model
const userModel = mongoose.model('user', Userschema);

//data seeding (store data)

function seddBooksCollection() {
    const book1 = new bookModel({
        name: 'The Silent Patient',
        description: 'a women may or may not have killed her husband and a theapist is determind to make her talk to discover her secrets.',
        status: 'LIFE-CHANGING',
    })

    const book2 = new bookModel({
        name: 'The Hitchhickers Guide To The Gallaxy.',
        description: 'earth is destroyed and folks try to determine the ultimate question to the universe and everything.',
        status: 'RECOMMENDED TO ME',
    })


    book1.save();
    book2.save();
}

// seddBooksCollection();

function seedOwnerCollection() {
    const awon = new userModel({
        email: 'awonkhrais@gmail.com',
        books: [
            {
                name: 'The Silent Patient',
                description: 'a women may or may not have killed her husband and a theapist is determind to make her talk to discover her secrets.',
                status: 'LIFE-CHANGING',
            },
            {
                name: 'The Hitchhickers Guide To The Gallaxy.',
                description: 'earth is destroyed and folks try to determine the ultimate question to the universe and everything.',
                status: 'RECOMMENDED TO ME',
            }
        ]

    })


    awon.save();
}

// seedOwnerCollection();


app.get('/',homeHandler);
app.get('/books', getBooksHandler);

function homeHandler(req,res){
    res.send('Home Route');
}


function getBooksHandler(req,res){
    let userEmail=req.query.email;
    userModel.find({email:userEmail},function(err,userData){

        if(err){
            console.log('did not work')
        } else{
            console.log(userData[0].books)
            res.send(userData[0].books)
        }
    })
}


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})