// require the express module
import express from "express";

// create a new Router object
const routes = express.Router();
import { checkJwt } from "../middleware/authmiddleware";

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

// // ✨ New! Mount authorization middleware
// routes.use(checkJwt);
// create a post

routes.post("/posts", (req, res) => {
  const post = {
    title: req.body.title,
    body: req.body.body,
    author_id: req.body.author_id,
  };
  db.one(
    "INSERT INTO posts(title, body, author_id) VALUES(${title}, ${body}, ${author_id}) returning id",
    post
  )
    .then((id) => {
      return db.oneOrNone("SELECT * FROM posts WHERE id = ${id}", {
        id: id.id,
      });
    })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).send(error));
});

// get a single post by the id
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

// edit post
routes.put("/posts/:id", (req, res) => {
  db.many("select * from posts")
    .then((posts) => {
      let elem: any = posts.find((m) => m.id === +req.params.id);

      if (!elem) {
        res.status(404).json({ error: "Post not found" });
      } else {
        db.none(
          "update posts set title=${title}, body=${body} where id = ${id}",
          {
            title: req.body.title,
            body: req.body.body,
          }
        );
        res.send(req.body);
      }
    })
    .catch((error) => console.log(error));
});

// delete post
routes.delete("/posts/:id", (req, res) => {
  db.many("select * from posts")
    .then((elements) => {
      let elem: any = elements.find((e) => e.id === +req.params.id);

      if (!elem) {
        res.status(404).json({ error: "Post not found" });
      } else {
        db.none("delete from posts where id = ${id}", {
          id: +req.params.id,
        });

        res
          .status(200)
          .json({ message: `Post with id ${+req.params.id} deleted` });
      }
    })
    .catch((error) => console.log(error));
});

// create a comment
routes.post("/posts/:id/comments", (req, res) => {
  const comment = {
    body: req.body.body,
    author_id: req.body.author_id,
    post_id: +req.params.id,
  };
  db.one(
    "INSERT INTO comments(body, author_id, post_id) VALUES(${body}, ${author_id}, ${post_id}) returning id",
    comment
  )
    .then((id) => {
      return db.oneOrNone("SELECT * FROM comments WHERE id = ${id}", {
        id: id.id,
      });
    })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).send(error));
});

// edit comment
routes.put("/posts/comments/:id", (req, res) => {
  db.many("select * from comments")
    .then((comm) => {
      let elem: any = comm.find((c) => c.id === +req.params.id);

      if (!elem) {
        res.status(404).json({ error: "Comment not found" });
      } else {
        db.none("update comments set body=${body} where id = ${id}", {
          id: +req.params.id,
          body: req.body.body,
        });
        res.send(req.body);
      }
    })
    .catch((error) => console.log(error));
});

// delete comment
routes.delete("/posts/comments/:id", (req, res) => {
  db.many("select * from comments")
    .then((elements) => {
      let elem: any = elements.find((e) => e.id === +req.params.id);

      if (!elem) {
        res.status(404).json({ error: "Comment not found" });
      } else {
        db.none("delete from comments where id = ${id}", {
          id: +req.params.id,
        });

        res
          .status(200)
          .json({ message: `Post with id ${+req.params.id} deleted` });
      }
    })
    .catch((error) => console.log(error));
});

// get all comments for the post id
routes.get("/posts/:id/comments", (req, res) => {
  db.manyOrNone(
    "select comments.id, comments.body,comments.comment_ts,comments.author_id,comments.post_id,users.first_name,users.last_name, users.email from comments join users on comments.author_id = users.id join posts on comments.post_id = posts.id where posts.id = ${id}",
    {
      id: req.params.id,
    }
  )
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
});

// get a single comment by its id
routes.get("/comments/:id", (req, res) => {
  db.oneOrNone("select * from comments where comments.id = ${id}", {
    id: req.params.id,
  })
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
});

export default routes;
