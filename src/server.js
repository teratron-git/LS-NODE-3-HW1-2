const http = require('http');
const port = 3000;

const requestHandler = (request, response) => {
  const showTimeInterval = setInterval(() => {
    console.log(new Date().getTime());
  }, process.env.INTERVAL);

  setTimeout(() => {
    clearInterval(showTimeInterval);
    response.end(new Date().getTime().toString());
  }, process.env.STOPTIME);
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {});
