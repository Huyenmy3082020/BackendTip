const app = require("./app");

const PORT = 8386;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed by interrupt signal");
    process.exit(0);
  });
});
