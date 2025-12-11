import express, { json } from "express";
import jwt from "jsonwebtoken";
import { Middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/types"
import { prismaclient } from "@repo/db/client"
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cors())

app.post("/signup", async function(req,res){

    const parsedData = CreateUserSchema.safeParse(req.body)
    if(!parsedData.success){
        console.log(parsedData.error)
        res.json({
            message:"Invalid inputs"
        })

        return;
    }
    try{
        const user = await prismaclient.user.create({
            data:{
                email:parsedData.data.username,
                password:parsedData.data.password,
                name:parsedData.data.name
            }
        })

        res.json({
            userId:user.id
        })

    }catch(e){
        res.status(411).json({
            message:"user already exists"
        })

    }
    
})

app.post("/signin", async function(req,res){

    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success){
        res.json({
            message : " Invalid format"
        })

        return;
    }

    const user = await prismaclient.user.findFirst({
        where:{
            email: parsedData.data.username,
            password : parsedData.data.password
        }
    })

    if(!user){
        res.status(403).json({
            message:"user does not exist"
        })
    }



    jwt.sign({
        userId:user?.id
    },JWT_SECRET)

})

app.post("/room", Middleware,async function(req,res){

    const parsedData = CreateRoomSchema.safeParse(req.body)

    if (!parsedData.success){
        res.json({
            message : " Invalid format"
        })

        return;
    }
    //@ts-ignore
    const userId = req.userId
    try{
        const room = await prismaclient.room.create({
            data:{
                slug:parsedData.data.name,
                adminId:userId
            }
        })

        res.json({
            roomId:room.id,
        })

    }catch(e){
        res.json({
            message:"room already exists with that id"
        })
    }

})

app.get("/chat/:roomId", async function (req,res){
    const roomId  = req.body.roomId
    const message = await prismaclient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id : "desc"
        },
        take : 50
    })

    res.json({
        message
    })
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaclient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})
app.listen(3001);