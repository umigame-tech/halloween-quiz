import { serve } from "bun";
import index from "./index.html";
import quizList from "./quiz-list.html";
import quiz from "./quiz.html";
import result from "./result.html";
import explanation from "./explanation.html";

const server = serve({
  routes: {
    "/": index,
    "/quiz-list": quizList,
    "/quiz": quiz,
    "/result": result,
    "/explanation": explanation,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
