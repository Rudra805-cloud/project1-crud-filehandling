import express from "express"
import users from "./MOCK_DATA.json" with { type: "json" }
import fs from "fs"
import { error } from "console";
const app=express();
const PORT=8000;

//middleware to load data from req and create a object and put in body
app.use(express.urlencoded({extended :false}))

//middle ware creation 
app.use((req,res,next)=>{
     fs.appendFile("./log.txt",`${Date.now()}:${req.method}:${req.path}`,(err)=>{
        res.send("404")
        next();
     })
     next();
})
//routes
app.get("/api/users",(req,res)=>{
    return res.json(users);
})
app.get("/users",(req,res)=>{
    const html=`
    <ul>
        ${users.map((user)=>`<li>${user.first_name} </li>`).join("")}
    </ul>
    `
    res.send(html)
})
// {/ When "we have"}to do multiple task on same route we do in suchh way 


app.get("/api/users/:id",(req,res)=>{
     const id=Number(req.params.id)
    const user=users.find((user)=>user.id==id);
    if(!user){
       return res.status(404).send("User not found");
    }
   return res.send(user)
})
app.post("/api/users",(req,res)=>{
    const body=req.body;
    const newUser={
      ...body,
      id:users.length+1
    }
    users.push(newUser);
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err,data)=>{
                if (err) {
                   return res.status(500).json({ status: "error" });
                  }

           return res.json({status:"user added",userid:`${users.length }`})
    })
})

app.patch("/api/users/:id",(req,res)=>{
      const body=req.body;
      const userid=Number(req.params.id)
      const index=users.findIndex(user=>user.id==userid)
       if(index==-1){
       return res.status(404).json({ message: "User not found" });
    }  
     // Merge old user with new fields
    users[index] = {
        ...users[index],
        ...body
    };
     fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err)=>{
                if (err) {
                   return res.status(500).json({ status: "error" });
                  }

           return res.json({status:"user updated",userid:`${userid}`})
    })
})
app.delete("/api/users/:id",(req,res)=>{
     const id=Number(req.params.id)
    const index=users.findIndex(user=>user.id==id);
    if(index==-1){
       return res.status(404).json({ message: "User not found" });
    }
    users.splice(index,1);
 
   fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(error)=>{
     if (error) {
       return res.status(500).json({ status: "error" });
     }
     return res.json({status:"user deleted",userid:`${id }`})
   })
   
})

app.listen(PORT,()=>console.log(`Server started at port ${PORT}`))