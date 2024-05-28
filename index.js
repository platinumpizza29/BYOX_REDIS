const net = require("net");
const Parser = require("redis-parser");

const store = {};

const server = net.createServer((connection) => {
  console.info("Client Connected ...");

  //request and response on connection
  connection.on("data", (data) => {
    const parser = new Parser({
      returnReply: (reply) => {
        const command = reply[0];
        switch (command) {
          case "set":
            {
              const key = reply[1];
              const value = reply[2];
              store[key] = value;
              connection.write("+OK\r\n");
            }
            break;
          case "get":
            {
              const key = reply[1];
              const value = store[key];
              if (!value) {
                connection.write("$-1\r\n");
              } else {
                connection.write(`$${value.length}\r\n${value}\r\n`);
              }
            }
            break;
        }
      },
      returnError: (error) => {
        console.error(error);
      },
    });
    parser.execute(data);
  });
});

//listening on port 4000
server.listen(4000, () => {
  console.info("Custom redis server listening on port 4000");
});
