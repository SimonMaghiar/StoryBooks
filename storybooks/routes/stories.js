const express = require("express");
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');


const Story = require('../models/Story');

// @desc Show add page
// @route GET /stories/add
router.get('/stories/add', ensureAuth ,(req,res)=>{
    res.render('stories/add');
});


// @desc Process add form
// @route POST /stories
router.post('/stories', ensureAuth , async (req,res)=>{
    try {
        req.body.user = req.user.id;
        console.log(req.body);
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// @desc Show all stories
// @route GET /stories
router.get('/stories', ensureAuth, async (req,res) =>{
    try {
        const stories = await Story.find({status: 'public' })
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()
        //console.log(stories);
    res.render('stories/index',{
        stories,
    });
    
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// @desc Show single story
// @route GET /stories/:id
router.get('/stories/:id', ensureAuth ,async (req,res)=>{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()
        if(!story){
            res.render('error/404');
        }
        res.render('stories/show',{
            story
        });
    } catch (err) {
        console.error(err);
        res.render('error/404');
    }
});



// @desc Show edit page
// @route GET /stories/edit/:id
router.get('/stories/edit/:id', ensureAuth ,async (req,res)=>{
    
    const story = await Story.findOne({
        _id: req.params.id
    }).lean();
    if(!story){
        return res.render('error/404');
    }
    if(story.user != req.user.id){
        res.redirect('/stories');
    }else{
        res.render('stories/edit',{
           story, 
        });
    }
});



// @desc Update story
// @route PUT /stories/:id
router.put('/stories/:id', ensureAuth ,async (req,res)=>{
    let story = await Story.findById(req.params.id).lean();

    if(!story){
        return res.render('error/404');
    }
    if(story.user != req.user.id){
        res.redirect('/stories');
    }else{
        console.log(req);
        story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        });
        res.redirect('/dashboard');
    }
});


// @desc Delete story
// @route DELETE /stories/:id
router.delete('/stories/:id', ensureAuth ,async (req,res)=>{
    console.log("DELETED");
    try {
        await Story.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

module.exports = router;