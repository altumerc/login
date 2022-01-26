import express from "express"
import cors from "cors"
import mongoose from "mongoose"



const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/loginregisterDB",{
            useNewUrlParser : true, 
            useUnifiedTopology : true
        }, () => {
         console.log("DB connected")
     } )
const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})
const User = new mongoose.model("User", userSchema)

app.get("/",(req,res)=> {
    res.send({message : "hi"})
})
//routes
app.post("/login",(req,res) => {
    const{ email, password} = req.body
    User.findOne({ email:email}, (err, user) => {
        if(user){
            if(password === user.password){
            res.send({message : "Login successfull"}) 
        }else{
            res.send({message:"Password dont match"})
        }
    }else{
        res.send({message: "User not registered"})
        }
    })
})

app.post("/register", (req, res)=> {
    console.log("server called")
    const { name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        console.log("inside db response")
       
        if(user){
            console.log("user found")
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                console.log("registering user")
                if(err) {
                    console.log(err)
                    res.send(err)
                } else {
                    console.log("returning response")
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.post("/update", async (req, res)=> {
    console.log("update called");
    const post = await User.findOne({ email : req.body.email})
    const { name } = req.body
    if (req.body.name) {
        post.name = req.body.name
    }
    await post.save();
    res.send(post);
}) 
{console.log("backend working") }

app.listen(9002,() => {
    console.log("Be started at port 9001")
})
    