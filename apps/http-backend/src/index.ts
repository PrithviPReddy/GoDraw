import express, { json } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { Middleware } from "./middleware";

const app = express()

app.post("/signup", function(req,res){
    
    //db-call
})

app.post("/signin", function(req,res){

    const userId = 1 

    jwt.sign({
        userId
    },JWT_SECRET)

})

app.post("/room", Middleware,function(req,res){

    //db-call
    
    res.json({
        roomId:123,
    })

})