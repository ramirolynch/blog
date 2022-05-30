// require the express module
import express from "express";

import helmet from "helmet";
require("dotenv").config();

// require the cors module
import cors from "cors";
import authroutes from "./routes/authroutes";
import postsroutes from "./routes/postsroutes";

// app variables
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

// creates an instance of an Express server
const app = express();

// app configuration
app.use(helmet());
// enable Cross Origin Resource Sharing so this API can be used from web-apps on other domains
app.use(cors());
// allow POST and PUT requests to use JSON bodies
app.use(express.json());

app.use("/", authroutes);
app.use("/", postsroutes);

// run the server
app.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));

module.exports = app;
