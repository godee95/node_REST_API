const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require('./routes/posts.js')
const commentsRouter = require('./routes/comments.js')

const connect = require('./schemas/index.js')
connect();

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.use("/api", [goodsRouter, cartsRouter]);

app.use('/', [postsRouter, commentsRouter]);

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!')
});