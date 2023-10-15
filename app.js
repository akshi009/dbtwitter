const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

// Route for getting all users or specific user by ID
app.get("/users", async (req, res) => {
  try {
    if (req.query.id) {
      // If 'id' is provided in the query, return a specific user by ID
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.query.id) },
      });
      res.json(user);
    } else {
      // If 'id' is not provided, return all users
      const users = await prisma.user.findMany({});
      res.json(users);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Eor");
  }
});

// Route for creating a new user
app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Eor" });
  }
});

// Route for getting all posts or specific post by ID
app.get("/posts", async (req, res) => {
  try {
    if (req.query.id) {
      // If 'id' is provided in the query, return a specific post by ID
      const post = await prisma.post.findUnique({
        where: { id: parseInt(req.query.id) },
        include: { user: true },
      });
      res.json(post);
    } else {
      // If 'id' is not provided, return all posts
      const posts = await prisma.post.findMany({
        include: { user: true },
      });
      res.json(posts);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route for creating a new post
app.post("/posts", async (req, res) => {
  try {
    const { userId, caption, image } = req.body;
    if (!userId || !caption) {
      return res.status(400).json({ error: "userId and caption are required fields" });
    }

    const post = await prisma.post.create({
      data: {
        userId: userId,
        caption: caption,
        image: image,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
