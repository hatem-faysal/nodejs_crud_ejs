const express = require('express');
const {getCategories,createCategories,editCategories,storeCategories,UpdateCategories,DeleteCategories,uploadCategoriesImage,resizeImage,deleteImage} = require('../services/categoryService');

const router = express.Router();




router.route('/').get(getCategories);
router.route('/create').get(createCategories);
router.route('/edit/:id').get(editCategories);
router.route('/store').post(uploadCategoriesImage,resizeImage,storeCategories);
router.route('/update/:id').post(uploadCategoriesImage,resizeImage,UpdateCategories);
router.route('/delete/:id').post(deleteImage,DeleteCategories);

module.exports = router;