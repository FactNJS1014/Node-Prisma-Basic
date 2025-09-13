const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.get('/check-db-connection', async (req,res) =>{
    try{
        await prisma.$connect();
        res.status(200).json({message: "Database connection successfully"});
    }catch(error){
        res.status(500).json({message: "Database connection failed"});
    }
})

app.post('/customer/create', async(req,res) =>{
    try{
        const payload =req.body
        const customer = await prisma.customer.create({data: payload})
        res.json(customer)
    }catch(error){
        res.status(500).json({message: "Create Failed"});
    }
})

app.get('/customer/list', async(req,res) =>{
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/customer/details/:id', async(req,res) =>{
    try {
        const id = req.params.id
        const customer = await prisma.customer.findUnique({
            where:{
                id:id
            }
        })
        res.json(customer)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put('/customer/update/:id' , async(req,res) =>{
    try {
        const id = req.params.id
        const payload = req.body
        const customer = await prisma.customer.update({
            where: {id},
            data: payload
        })
        res.json(customer)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})
