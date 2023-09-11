const express=require("express");

const bcrypt=require("bcrypt");


const connection=require('./config/db');
const {ProductModel}=require("./Models/Product.model");
const cors=require('cors');
require('dotenv').config();

const app=express();
app.use(express.json())

app.use(cors({origin:"*"}))

const PORT=process.env.PORT;


app.get("/",(req,res)=>{
    res.send('BASE URL POINT');
})


app.post('/add',async(req,res)=>{
    const newProd=new ProductModel(req.body);
    await newProd.save();
    res.json({msg:'Product has been Added Sucessfully'})
})


app.get('/getProduct',async(req,res)=>{
    const{category,sort,page,q}=req.query;
    const filterProduct={};
    if(category){
        filterProduct.category=category;
    }
    if(q){
        filterProduct.name={$regex:q,$option:"i"};

    }
    const skip=(page-1)*4;

    const product=await ProductModel.find(filterProduct).sort({date:sort=="asc" ? 1 :-1}).skip(skip).limit(4);
    res.json(product)
})

app.put("/edit/:id",async(req,res)=>{
    const idx=req.params.id;
    const items=await ProductModel.findOne({_id:idx});
    if(items){
        const product=await ProductModel.findByIdAndUpdate(idx,req.body);
        res.json({msg:"updated sucessfully"});
    }else{
        res.status(500).json({msg:'product not found'})
    }
})


app.delete("/delete/:id",async(req,res)=>{
    const idx=req.params.id;
    const items=await ProductModel.findOne({_id:idx});
    if(items){
        const product=await ProductModel.findByIdAndDelete(idx);
        res.json({msg:"deleted sucessfully",data:product});
    }else{
        res.status(500).json({msg:'product not found'})
    }
})


app.listen(PORT,async()=>{
    try {
        await connection;
        console.log("connected to mongoDB")
    } catch (error) {
        console.log(error)
    }
    console.log(`listening on port ${PORT}`);

})