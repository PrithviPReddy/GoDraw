"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRoom() {
  const router = useRouter();

  const [createRoomName, setCreateRoomName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [joinRoomName, setJoinRoomName] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return null;
    }
    return token;
  };

  const handleCreateRoom = async () => {
    if (!createRoomName.trim()) {
      setCreateError("Room name is required");
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      setCreateLoading(true);
      setCreateError("");

      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: createRoomName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const roomId = res.data?.roomId;
      if (!roomId) throw new Error("Invalid room id");

      router.push(`/canvas/${roomId}`);
    } catch (error: any) {
      setCreateError(error.response?.data?.message || "Failed to create room");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomName.trim()) {
      setJoinError("Room name is required");
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      setJoinLoading(true);
      setJoinError("");

      const res = await axios.get(`${HTTP_BACKEND}/room/${joinRoomName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const roomId = res.data?.room?.id;
      if (!roomId) throw new Error("Invalid room");

      router.push(`/canvas/${roomId}`);
    } catch (error: any) {
      setJoinError(error.response?.data?.message || "Failed to join room");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900 px-4">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        <div className="p-8 w-full bg-gray-800 rounded-xl shadow-xl border border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
            Create a Room
          </h1>

          <input
            type="text"
            placeholder="Enter your room name"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={createRoomName}
            onChange={(e) => setCreateRoomName(e.target.value)}
          />

          {createError && (
            <p className="mt-2 text-sm text-red-400">{createError}</p>
          )}

          <button
            onClick={handleCreateRoom}
            disabled={createLoading}
            className="mt-6 w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createLoading ? "Creating..." : "Create Room"}
          </button>
        </div>

        {/* Join Room Card */}
        <div className="p-8 w-full bg-gray-800 rounded-xl shadow-xl border border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
            Or Join a Room
          </h1>

          <input
            type="text"
            placeholder="Enter room name"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={joinRoomName}
            onChange={(e) => setJoinRoomName(e.target.value)}
          />

          {joinError && (
            <p className="mt-2 text-sm text-red-400">{joinError}</p>
          )}

          <button
            onClick={handleJoinRoom}
            disabled={joinLoading}
            className="mt-6 w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joinLoading ? "Joining..." : "Join Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
