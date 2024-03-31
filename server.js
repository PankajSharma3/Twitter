const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const server = express();
const port = process.env.PORT || 8080;

server.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true,
}));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(express.static('public')); 

const { Schema } = mongoose;
const userSchema = new Schema({
    username: {type:String,unique:true},
    password: String,
    email: {type:String,unique:true},
    phone: {type:Number,unique:true},
    gender: String
});

const postSchema = new Schema({
    username: String,
    post: String,
    time: String,
    date: String,
    like: Number
});
  
const Post = mongoose.model("Post",postSchema);
const User = mongoose.model("User", userSchema);
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

async function main() {
    await mongoose.connect(`mongodb+srv://username:password@cluster0.3r4pbup.mongodb.net/employee`, { auth: { username: MONGODB_USERNAME, password: MONGODB_PASSWORD } });
    console.log("Database connected"); 
}

main().catch(err => console.error(err));

server.post('/signup', async(req, res) => {
    try {
        const { username, email, password, phone, gender } = req.body;
        const newUser = new User({
            username: username,
            password: password,
            email: email,
            phone: phone,
            gender: gender
        });
        await newUser.save();
        console.log("Document added to the database");
        res.send(`
            <script>
                alert('Signup successfully!');
                window.location.href = '/login';
            </script>
        `);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
            res.send(`
                <script>
                    alert('Username already exists. Please choose a different one.');
                    window.location.href = '/signup'; 
                </script>
            `);
        } else {
            console.error(err);
            res.status(500).send("Error occurred during signup");
        }
    }
});


server.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        req.session.email = email;
        if (!user || user.password !== password) {
            res.send(`
                <script>
                    alert('Invalid Username or Password!');
                    window.location.href='/login';
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert('Login successfully!');
                    window.location.href='/home';
                </script>
            `);
        }
    } catch (err) {
        console.error(err);
        res.send(`
            <script>
                alert('Internal error occured!');
                window.location.href='/login';
            </script>
        `);
    }
});

const getdate = ()=>{
    const currentDate = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = currentDate.getMonth();
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const monthName = monthNames[monthIndex];
    const date = `${monthName} ${day}, ${year}`;
    return date;
}


const getTime = ()=>{
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${amOrPm}`;
    return time;
}

server.post('/posts', async(req, res) => {
    try{
        const valueFromFrontend = req.body.value;
        const user = await User.findOne({email:req.session.email});
        const username = user.username;

        const time = getTime();
        const date = getdate();

        const newpost = new Post({
            username:username,
            post: valueFromFrontend,
            time: time,
            date: date,
            like: 0
        });
        await newpost.save();
        res.json({ message: 'Posted successfully!' });
    }
    catch(err){
        console.error(err);
        res.json({message:"Error Occured!"});
    }
});

server.get('/api/posts',async(req,res)=>{
    try {
      const post = await Post.find();
      res.json(post);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
})

server.get('/api/data', async (req, res) => {
    try {
      const items = await User.findOne({email:req.session.email});
      res.json(items);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

const signup = fs.readFileSync("./signup.html", 'utf8');
const login = fs.readFileSync(`./login.html`, "utf8");
const home = fs.readFileSync("./home.html","utf-8");

server.get('/signup', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(signup);
});

server.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.send(home);
})

server.get('/home',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.send(home);
})

server.get('/login', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(login);
});

server.listen(8080, () => {
    console.log(`Server is running on ${port}`);
});
