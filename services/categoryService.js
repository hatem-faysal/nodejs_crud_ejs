const { v4: uuidv4 } = require('uuid');
const { default: slugify } = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/CategoryModel');
const multer  = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');


//2- member storage engine
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file , cb){
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    } else {
        cb('only images allowed');
    }
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoriesImage = upload.single('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
if (req.file && req.file.buffer && req.file.buffer.length > 0) {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600).toFormat('jpeg').jpeg({ quality: 95 }).toFile(`uploads/category/${filename}`);
      req.body.image = filename;
      if(req.body.old_image){
        fs.unlink(path.join('uploads/category/', req.body.old_image), (err) => {
          if (err) {
            console.error(`Error deleting ${req.body.old_image}: ${err}`);
          } else {
            console.log(`Deleted ${req.body.old_image} successfully.`);
          }
        });  
      }
  
}
  next();
});


// Image processing
exports.deleteImage = asyncHandler(async (req, res, next) => {
      const category = await Category.findById(req.params.id);
      if(category.image){
          fs.unlink(path.join('uploads/category/', category.image), (err) => {
               if (err) {
                  console.error(`Error deleting ${category.image}: ${err}`);
              } else {
                    console.log(`Deleted ${category.image} successfully.`);
              }   
          });
      }
  next();
});

//@desc   Get list of categories
//@route  Get /api/v1/categories
//@access Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({});
   return res.render('index',{categories:categories});
});

exports.createCategories = asyncHandler(async (req, res, next) => {
if(req.query){
       const data = req.query;
    }
   return res.render('create');
});

exports.editCategories = asyncHandler(async (req, res, next) => {
    Category.findById(req.params.id)
    .then(data=>{
        return res.render('edit',{category:data});
    });
});


exports.storeCategories = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name, { lower: true });
    const { name } = req.body;
  const errors = {};
  if (!name) {
    errors.name = 'Name is required';
  }
  // If there are any errors, redirect back to the form page with the errors
  if (Object.keys(errors).length > 0) {
      return res.redirect(`create`);
  }
  await Category.create(req.body);
  res.send('Registration successful!');  
});

exports.UpdateCategories = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name, { lower: true });
  await Category.findByIdAndUpdate(req.params.id,req.body,{useFindAndModify:false,new: true })
  res.redirect('/');
});

exports.DeleteCategories = asyncHandler(async (req, res, next) => {
   await Category.findByIdAndDelete(req.params.id);
  res.redirect('/');
});