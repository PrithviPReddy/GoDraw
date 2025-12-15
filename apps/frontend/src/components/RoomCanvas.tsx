"use client"

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import Loader from "./Loader";

export function RoomCanvas({roomId}:{
    roomId : string
}){

        const canvasRef = useRef<HTMLCanvasElement>(null)
        const [socket, setSocket] = useState<WebSocket | null>(null)
        const TOKEN = localStorage.getItem("token")
        useEffect(() => {
            const ws = new WebSocket(`${WS_URL}?token=${TOKEN}`)

            ws.onopen = () => {
                setSocket(ws)
                ws.send(JSON.stringify({
                    type:"join_room",
                    roomId
                }))
            }
        },[])

        if(!socket){
            return <Loader/>

        }
    
    
        return <div>
            <Canvas roomId={roomId} socket ={socket}/>
        </div>
}