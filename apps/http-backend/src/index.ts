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



    const token = await jwt.sign({
        userId:user?.id
    },JWT_SECRET)

    res.json({
        token : token
    })
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

        res.status(200).json({
            roomId:room.id,
        })

    }catch(e){
        res.json({
            message:"room already exists with that id"
        })
    }

})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const messages = await prismaclient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }

})

app.get("/room/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: "Room slug is required",
      });
    }

    const room = await prismaclient.room.findFirst({
      where: {
        slug,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json({
      room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});



app.listen(3001);