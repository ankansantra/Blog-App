const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken=require('../verifyToken')
const officegen = require('officegen');
const fs = require('fs');
const path = require('path');

router.post("/create",verifyToken,async (req,res)=>{
    try {
        // Create a new post
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
    
        // Generate .docx content
        const docx = officegen('docx');
        const pObj = docx.createP();
    
        pObj.addText(`${newPost.title}`, { bold: true });
        pObj.addLineBreak();
        pObj.addLineBreak();
        pObj.addText(`${newPost.desc}`);
    
        // Create a write stream for the .docx file
        const docxFileName = `post_${savedPost._id}.docx`;
        const out = fs.createWriteStream(path.join(__dirname,`posts`,docxFileName));
        // const stream = fs.createWriteStream(filepath);
    
        // Handle any errors that occur during file creation
        out.on('error', (err) => {
          console.log(err);
          res.status(500).json({ error: 'Failed to generate .docx file' });
        });
    
        // Write the generated .docx file to the write stream
        docx.generate(out, { finalize: () => {
          // Return the saved post along with the .docx file path
          
          res.status(200).json({ post: savedPost, docxFilePath: docxFileName });
        } });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create a post' });
      }
    });





router.put("/:id",verifyToken,async (req,res)=>{
    try{
        
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedPost)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Post has been deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get Post Details
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get Posts
router.get("/",async (req,res)=>{
    const query=req.query
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const posts=await Post.find(query.search?searchFilter:null)
        
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get users Posts
router.get("/user/:userId",async (req,res)=>{
    try{
        const posts=await Post.find({userId:req.params.userId})
        
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports=router