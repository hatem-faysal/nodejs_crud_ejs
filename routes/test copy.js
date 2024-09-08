const express = require('express');
const {getCategories,createCategories,editCategories,storeCategories,UpdateCategories,DeleteCategories,uploadCategoriesImage,resizeImage} = require('../services/categoryService');

const router = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/').get(getCategories);
router.route('/create').get(createCategories);
router.route('/edit/:id').get(editCategories);
router.route('/store').post(upload.single('image'), (req, res) => {
    console.log(req.file);
  },storeCategories);
// router.route('/store').post(uploadCategoriesImage,resizeImage,storeCategories);
router.route('/update/:id').post(UpdateCategories);
router.route('/delete/:id').post(DeleteCategories);

module.exports = router;