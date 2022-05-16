// require the express module
import express from "express";

// create a new Router object
const routes = express.Router();

// require the express module
import "dotenv/config";

import pg from "pg-promise";

const db = pg()({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "casapuerta",
  database: "blog",
});

routes.get("/posts", (req, res) => {
  db.manyOrNone(
    "select posts.id,posts.title,posts.body,posts.post_ts, posts.author_id, users.first_name, users.last_name, users.admin, users.email from posts join users on posts.author_id = users.id"
  )
    .then((posts) => res.json(posts))
    .catch((error) => console.log(error));
});

routes.get("/posts/:id", (req, res) => {
  db.oneOrNone(
    "select posts.id,posts.title,posts.body,posts.post_ts, posts.author_id, users.first_name, users.last_name, users.admin, users.email from posts join users on posts.author_id = users.id where posts.id = ${id}",
    {
      id: req.params.id,
    }
  )
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
});

routes.get("/comments/:id", (req, res) => {
  db.oneOrNone(
    "select posts.id,posts.title,posts.body,posts.post_ts, posts.author_id, users.first_name, users.last_name, users.admin, users.email from posts join users on posts.author_id = users.id where posts.id = ${id}",
    {
      id: req.params.id,
    }
  )
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
});

export default routes;
