const express = require("express");
const router = express.Router();

const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");
const { Console } = require("console");

// 댓글 생성
router.post('/comments/:_postId', async(req,res) => {
  try{
    const { _postId:postId } = req.params;
    const { user, password, content } = req.body;
  
    if(content === undefined){
      return res.status(400).json({
        message: "댓글 내용을 입력해 주세요."
      })
    }
  
    const existsPost = await Post.find({_id:postId});
    if(existsPost.length){
      await Comment.create({ postId, user, password, content});
    }
  
    res.status(200).json({
      message: "댓글을 생성하였습니다.",
    });

  } catch (err){
    res.status(400).json({ 
      message: "데이터 형식이 올바르지 않습니다."
    });
  }

});

// 댓글 목록 조회
router.get('/comments/:_postId', async (req,res) => {
  try{
    const { _postId } = req.params;

    const comments = await Comment.find({postId:_postId}).sort({createdAt:-1});

    const results = comments.map((comment) => {
      return {
        "commentId": comment._id,
        "user": comment.user,
        "content": comment.content,
        "createdAt": comment.createdAt
      }
    })
    
    res.status(200).json({
      "data": results
    })

  } catch (err){
    res.status(400).json({ 
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

// 댓글 수정
router.put('/comments/:_commentId', async (req,res) => {
  if(Object.keys(req.body).length === 0){
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    })
    return;
  }

  const { _commentId } = req.params;
  const { password, content } = req.body;

  try{

    if(content === undefined){
      return res.status(400).json({
        message: "댓글 내용을 입력해 주세요."
      });
    }

    const existsComment = await Comment.find({_id:_commentId});
    if(existsComment.length && existsComment[0].password === password){
      await Comment.updateOne({_id:_commentId},{$set:{content:content}});
    }

    res.status(200).json({
      message: "댓글을 수정했습니다."
    });
  } catch(err){
    res.status(404).json({
      message: "데이터 댓글 조회에 실패하였습니다."
    })
  }
});

// 댓글 삭제
router.delete('/comments/:_commentId', async(req,res) => {

  if(Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    })
    return;
  }

  const { _commentId } = req.params;
  const { password } = req.body;


  try{
    const existsComment = await Comment.find({_id:_commentId});
    console.log(existsComment.length);
    if(existsComment.length && existsComment[0].password === password){
      console.log(_commentId);
      await Comment.deleteOne({_id:_commentId});
    }
    
    res.status(200).json({
      message: "댓글을 삭제하였습니다."
    })

  } catch(err) {
    res.status(404).json({
      message: "댓글 조회에 실패하였습니다."
    })
    return;
  }

});

module.exports = router;