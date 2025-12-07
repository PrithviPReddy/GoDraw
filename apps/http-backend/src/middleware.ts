import { Request,Response,NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import "./types/express";




export function Middleware(req:Request,res:Response,next:NextFunction){

    const token = req.header("authorization") ?? "";

    const decoded = jwt.verify(token,JWT_SECRET);

    if (decoded){
        // @ts-ignore
        req.userId = decoded.userId;
        next();

    }else{
        res.status(403).json({
            message:"Unauthorized"  
        })
    }


}