import { HTTP_BACKEND } from "@/config"
import axios from "axios"
import { MessagesSquare, X } from "lucide-react"
import { serverHooks } from "next/dist/server/app-render/entry-base"

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
    };


export async function initDraw(canvas: HTMLCanvasElement,roomId:string,socket:WebSocket) {

    const ctx = canvas.getContext("2d");
    
    let existingShapes : Shape[] = await getExistingShapes(roomId)
    
    if (!ctx) {
        return
    }
    
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        const parsedShape = JSON.parse(message.message)
        
        if(message.type === "chat"){
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes,canvas,ctx)
        }
    } 

    clearCanvas(existingShapes, canvas, ctx);
    
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let clicked = false;
    let startX = 0;
    let startY = 0;
    
    canvas.addEventListener("mousedown", (e) => {
        clicked = true
        startX = e.clientX
        startY = e.clientY
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        
        //@ts-ignore
        const selectedTool = window.selectedTool
        console.log(selectedTool)
        let shape : Shape | null = null
        if (selectedTool === "rect"){
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            }
        }else if (selectedTool === "circle"){
            const left = Math.min(startX, e.clientX);
            const top = Math.min(startY, e.clientY);

            const width = Math.abs(e.clientX - startX);
            const height = Math.abs(e.clientY - startY);

            shape = {
                type: "circle",
                centerX: left + width / 2,
                centerY: top + height / 2,
                radiusX: width / 2,
                radiusY: height / 2,
            };
        }

        if (!shape){return}

        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({
                shape
            }),
            roomId
        }))
    })            
    
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearCanvas(existingShapes,canvas,ctx)
            ctx.strokeStyle = "rgba(255, 255, 255)"
            //@ts-ignore
            const selectedTool = window.selectedTool
            if (selectedTool === "rect"){
                ctx.strokeRect(startX, startY, width, height);
            }else if (selectedTool === "circle"){
                const left = Math.min(startX, e.clientX);
                const top = Math.min(startY, e.clientY);
                const width = Math.abs(e.clientX - startX);
                const height = Math.abs(e.clientY - startY);
                const centerX = left + width / 2;
                const centerY = top + height / 2;
                const radiusX = width / 2;
                const radiusY = height / 2;

                ctx.beginPath();
                ctx.ellipse(
                    centerX,
                    centerY,
                    radiusX,
                    radiusY,
                    0,               
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        }
    })            
}

export function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    
    
    existingShapes.map((shape) => {
        if(shape.type === "rect"){
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }else if (shape.type === "circle"){
            ctx.beginPath();
            ctx.ellipse(
                shape.centerX,
                shape.centerY,
                shape.radiusX,
                shape.radiusY,
                0,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    })
}

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes
}