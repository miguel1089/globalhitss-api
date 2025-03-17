import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'
// import cors from 'cors'

const app = express();

// app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());

const readData = ()=>{
    try{
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    }catch(error){
        console.log(error);
    }
}

const writeData = (data)=>{
    try{
        fs.writeFileSync("./db.json",JSON.stringify(data));
    }catch(error){
        console.log(error);
    }
}

app.get("/",(req,res)=>{
    res.send("welcome con nodemon")
})

app.get("/personas",(req, res)=>{
 const data = readData();
 res.json(data.personas);
});

app.get("/persona/:numeroDocumento",(req, res)=>{
    const data = readData();
    const documento = req.params.numeroDocumento;
    const persona = data.personas.find((persona)=> persona.Numero_documento == documento);
    res.json(persona);
});

app.post("/persona/add",(req, res)=>{
    const data = readData();
    const body = req.body;
    const newPerson = {
        ...body,
    }
    data.personas.push(newPerson);
    writeData(data);
    res.json(newPerson);
});

app.put("/persona/edit/:numeroDocumento",(req, res)=>{
    const data = readData();
    const body = req.body;
    const documento = req.params.numeroDocumento;
    const personaIndex = data.personas.findIndex((persona)=> persona.Numero_documento == documento);

    data.personas[personaIndex] ={
        ...data.personas[personaIndex],
        ...body
    };
    writeData(data);
    res.json({message:"Se actualizó la información correctamente."});
});

app.delete("/persona/delete/:numeroDocumento",(req, res)=>{
    const data = readData();
    const documento = req.params.numeroDocumento;
    const personaIndex = data.personas.findIndex((persona)=> persona.Numero_documento == documento);
    data.personas.splice(personaIndex,1);
    writeData(data);
    res.json({message:"Se elimino la persona correctamente."});
});

app.listen(3000,() =>{
    console.log('Server listening on port 3000');
});