'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

// this method is used to decode our request body sent by the post or put methods
app.use(express.json());


//connect the express server with mongodb

const PORT = process.env.PORT || 3040;
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

//create a schema

const BookSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    image_url:String
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
        image_url:'https://images-na.ssl-images-amazon.com/images/I/91lslnZ-btL.jpg',

    })

    const book2 = new bookModel({
        name: 'The Hitchhickers Guide To The Gallaxy.',
        description: 'earth is destroyed and folks try to determine the ultimate question to the universe and everything.',
        status: 'RECOMMENDED TO ME',
        image_url:'https://images-na.ssl-images-amazon.com/images/I/A1lXgSfNdpL.jpg',

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
                image_url:'https://images-na.ssl-images-amazon.com/images/I/91lslnZ-btL.jpg',
            },
            {
                name: 'The Hitchhickers Guide To The Gallaxy.',
                description: 'earth is destroyed and folks try to determine the ultimate question to the universe and everything.',
                status: 'RECOMMENDED TO ME',
                image_url:'https://images-na.ssl-images-amazon.com/images/I/A1lXgSfNdpL.jpg',

            }
        ]

    })


    awon.save();
}

// seedOwnerCollection();

// home route
app.get('/',homeHandler);
// Read route, get all the books by the user email
app.get('/books', getBooksHandler);
// Create route, which will receive new books to be added for the user
app.post('/addBooks',addBookHandler);
// Delete route, which will delete the book by its index
app.delete('/deleteBook/:book_Index',deleteBookHandler);



function addBookHandler(req,res){

// we need to get the email of the person and the book(name,descrpition,...) to add to that person

    const{name,description,status,image_url,email}=req.body;
    userModel.find({email:email},(error,userData)=>{
        if(error){
            res.send('we have an error');
        }
        else{
            console.log('before pushing',userData[35])
            userData[35].books.push({
                name: name,
                description:description,
                status:status,
                image_url:image_url,
            })
            userData[35].save();
            res.send(userData[35].books)

        }
    })
}

//localhost:3001/deleteBook/:2?email=awonkhrais@gmail.com
function deleteBookHandler(req,res){
const {email} = req.query;
const index = Number(req.params.book_Index);
userModel.find({email:email},(error,userData)=>{
    // filter the books for the owner and remove the one that matches the index
    const newBookArr = userData[35].books.filter((book,idx)=>{
        if(idx !== index) {
            return book;
        }
    })
    userData[35].books = newBookArr;
    userData[35].save();
    res.send(userData[35].books);


})

}

function homeHandler(req,res){
    res.send('Home Route');
}


function getBooksHandler(req,res){
    let userEmail=req.query.email;
    userModel.find({email:userEmail},function(err,userData){

        if(err){
            console.log('did not work')
        } else{
            
            console.log(userData[35].books)
            res.send(userData[35].books)
        }
    })
}


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})