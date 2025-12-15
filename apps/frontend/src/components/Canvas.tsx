import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, Square } from "lucide-react";
export type Tool = "rect" | "circle" | "pencil"

export default function Canvas({roomId,socket} : {
    roomId : string
    socket : WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] = useState<
    "rect" | "circle" | "pencil"
  >("rect");
    (window as any).selectedTool = selectedTool;
    

    useEffect(() => {
        if (canvasRef.current){
            initDraw(canvasRef.current,roomId,socket)
          }
        },[canvasRef,socket,roomId])
        



    return  <div  style={{
        height : "100vh",
        overflow: "hidden"
    }}>
        <canvas ref = {canvasRef} width = {2000} height = {1000}></canvas>
        <TopBar
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
      />
    </div>
}


export function TopBar({
  selectedTool,
  onSelectTool,
}: {
  selectedTool: "rect" | "circle" | "pencil";
  onSelectTool: (tool: "rect" | "circle" | "pencil") => void;
}) {
  return (
    <div
      className="
        fixed top-2 left-2
        flex gap-2 p-1.5
        rounded-lg border border-neutral-800
        bg-neutral-900
        shadow-lg
      "
    >
      <IconButton
        icon={<Square size={18} />}
        onClick={() => {
          (window as any).selectedTool = selectedTool;
          onSelectTool("rect")
        }}
        active={selectedTool === "rect"}
      />

      <IconButton
        icon={<Circle size={18} />}
        onClick={() => {
          (window as any).selectedTool = selectedTool;
          onSelectTool("circle")
        }}
        active={selectedTool === "circle"}
      />

      <IconButton
        icon={<Pencil size={18} />}
        onClick={() => {
          (window as any).selectedTool = selectedTool;
          onSelectTool("pencil")
        }}
        active={selectedTool === "pencil"}
      />
    </div>
  );
}