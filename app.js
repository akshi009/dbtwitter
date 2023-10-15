const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

app.get("/post", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/post", async (req, res) => {
  
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


// app.post("/post", async (req, res) => {
//   try {
//     const postDataArray = req.body;

//     if (!Array.isArray(postDataArray)) {
//       return res.status(400).json({ error: "Request body should be an array of posts" });
//     }

    
//     const createdPosts = [];

    
//     for (const postData of postDataArray) {
//       const { userId, caption, image } = postData;

//       if (!userId || !caption) {
//         return res.status(400).json({ error: "userId and caption are required fields for each post" });
//       }

      
//       const post = await prisma.post.create({
//         data: {
//           user: {
//             connect: { id: userId }, 
//           },
//           caption: caption,
//           image: image,
//         },
//       });

//       createdPosts.push(post);
//     }

    
//     res.status(201).json(createdPosts);
//   } catch (error) {
//     console.error("Error creating posts:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });




app.post("/user", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


// app.post("/user", async (req, res) => {
//   try {
//     const usersArray = req.body;
    
    
//     const usersData = usersArray.map((user) => ({
//       name: user.name,
//       email: user.email,
//       image: user.image,
//     }));

//     const usersCreated = await prisma.user.createMany({
//       data: usersData,
//     });

//     res.status(204).send(usersCreated);
//   } catch (e) {
//     console.error(e.message);
//     res.status(500).send(e.message);
//   }
// });








app.delete("/post/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: id,
      },
    });
    res.json(deletedPost);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleteduser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.json(deleteduser);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.patch("/user/:id", async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.patch("/post/:id", async (req, res) => {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updatedPost);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
