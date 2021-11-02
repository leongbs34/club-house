var Message = require('../models/message.js');
const { body,validationResult } = require("express-validator");

exports.message_details_get = (req,res,next) => {
  Message
    .find()
    .sort({timestamp: -1})
    .populate('user')
    .exec((err, messages) => {
      if (err) return next(err);

      res.render('index', { title: 'Welcome to the Club House', user: req.user, messages: messages});
    })
}

exports.message_create_post = [

  body('message_title', 'Title required')
    .isLength({min: 1, max: 50}).withMessage('Maximum length of title is 50 characters')
    .escape(),
  body('message_text', 'Text required')
    .isLength({min: 1, max: 500}).withMessage('Maximum length of text is 500 characters')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var message = new Message({ 
      title: req.body.message_title,
      text: req.body.message_text,
      user: req.user._id,
    });

    if(!errors.isEmpty()){
      res.render('index', { title: 'Welcome to the Club House', errors: errors.array(), user: req.user});
      return
    } else {
      message.save((err) => {
        if(err) return next(err);
        
        res.redirect('/');
      });
    }
  }
]