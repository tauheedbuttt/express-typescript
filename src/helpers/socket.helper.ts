import cors from "cors";
import SocketJWT from "../middlewares/authentication/socket.middleware";
import Device from "../models/Device";
import http from "http";
import { Server as SocketServer } from "socket.io";

let io: any;

const updateDevice = async (data: any) => {
  const updated = await Device.findOneAndUpdate(
    { user: data.user, device: data.device },
    { ...data },
    { new: true }
  );
  if (!updated) await Device.create(data);
};

const onConnect = (socket: any) => {
  const { device, name, fcm, os } = socket.handshake?.query;

  updateDevice({
    user: socket.user._id,
    device,
    os,
    fcm,
    name,
    socket: socket.id,
  });

  console.log("User Connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
};

const createServer = (app: any, port: any, host: any) => {
  // initialize server with web socket
  const server = http.createServer(app);
  io = new SocketServer(server, {
    cors: { origin: "*" },
  });
  app.set("io", io);

  io.use(cors());

  // Socket.io
  io.of("/api/socket").use(SocketJWT.jwtVerify).on("connection", onConnect);

  // start express app
  server.listen(port, () =>
    console.log(`Server running at http://${host}:${port}/`)
  );
};

const sendMessage = (socketID: any, event: any, message: any) =>
  io.of("/api/socket").to(socketID).emit(event, message);

const sendUserMessage = async (user: any, event: any, message: any) => {
  const devices = await Device.find({ user });
  devices.forEach((device: any) => {
    sendMessage(device.socket, event, message);
  });
};

export default {
  io,
  createServer,
  sendMessage,
  sendUserMessage,
};
