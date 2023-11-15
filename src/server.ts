import app from "./app";
import Socket from "./helpers/socket.helper";

//Use system configuration for port or use 3000 by default.
const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || "127.0.0.1";

Socket.createServer(app, PORT, HOSTNAME);

// app.listen(PORT, () => {
//   console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
// });
