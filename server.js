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

app.delete('/customer/delete/:id' , async(req,res) =>{
    try {
        const id = req.params.id
        const customer = await prisma.customer.delete({
            where:{
                id:id
            }
        })
        res.json(customer)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/customer/startsWith', async(req,res) =>{
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where:{
                name:{
                    startsWith: keyword
                }
            }
        })
        res.json({results: customers})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/customer/endsWith', async(req,res) =>{
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where:{
                name:{
                    endsWith: keyword
                }
            }
        })
        res.json({results: customers})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/customer/contains', async(req,res) =>{
    try {
        const keyword = req.body.keyword;
        const customers = await prisma.customer.findMany({
            where:{
                name:{
                    contains: keyword
                }
            }
        })
        res.json({results: customers})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/customer/findCreditIsNotZero', async(req,res) =>{
    try {
        const customers = await prisma.customer.findMany({
            where:{
                credit:{
                    not: 0
                }
            }
        })
        res.json({result: customers})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/customer/sortByName', async(req,res) =>{
    try {
        const customers = await prisma.customer.findMany({
            orderBy:{
                name: 'asc'
            }
        })
        res.json(customers)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/customer/whereAnd', async(req,res) =>{
    try {
        const customers = await prisma.customer.findMany({
            where:{
                AND:[
                    {
                        name:{
                            contains: 'n'
                        }
                    },
                    {
                        credit:{
                            gt: 0
                        }
                    }
                ]
            }
        })
        res.json(customers)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/customer/listBetweenCredit', async(req,res) =>{
    try {
        const customers = await prisma.customer.findMany({
            where:{
                credit:{
                    gt: 100000,
                    lt: 900000
                }
            }
        })
        res.json(customers)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
} )

app.get('/customer/sumCredit', async(req , res) =>{
    try {
        const customers = await prisma.customer.aggregate({
            _sum:{
                credit: true
            }
        })
        res.json({sumCredit: customers._sum.credit})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/customer/avgCredit', async(req , res) =>{
    try {
        const customers = await prisma.customer.aggregate({
            _avg:{
                credit: true
            }
        })
        res.json({avgCredit: customers._avg.credit})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/customer/countCustomer', async(req,res) =>{
    try {
        const countCus = await prisma.customer.count()
        res.json({count: countCus})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

 app.post('/order/create', async(req,res) =>{
    try {
        const customerId = req.body.customerId
        const amount = req.body.amount
        const order = await prisma.order.create({
            data:{
                customerId,
                amount
            }
        })
        res.json(order)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
 })

 app.get('/customer/listOrder/:customerId', async(req, res) =>{
    try {
        const customerId = req.params.customerId
        const orders = await prisma.order.findMany({
            where:{
                customerId: customerId
            }
        })
        res.json(orders)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
 })

 app.get('/customer/listAllOrder', async(req,res) =>{
    try {
        const orders = await prisma.customer.findMany({
            include:{
                Orders: true
            }
        })
        res.json({orders: orders})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
 })

 app.get('/customer/listOrderAndProduct/:customerId', async(req,res) =>{
    try {
        const customerId = req.params.customerId;
        const customers = await prisma.customer.findMany({
            where:{
                id: customerId
            },
            include:{
                Orders: {
                    include: {
                        Product: true
                    }
                }
            }
        })
        res.json(customers)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
 })

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})
