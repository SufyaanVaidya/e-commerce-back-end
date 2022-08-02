const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
  const catData = await Category.findAll({
    include: [{ model: Product }]
  });
  res.status(200).json(catData);
}
catch (err) {
  res.status(500).json(err)
}
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    where: {
      id: req.params.id
    },
    include:
      [{ model: Product }]
  })
    .then(categoryData => {
      if (!categoryData) {
        res.status(404).json({ message: 'No category was found using this id'}); 
        return; 
      }
      res.json(categoryData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
        id: req.params.id
    }
  })
  .then(categoryData => {
        if (!categoryData[0]) {
            res.status(404).json({ message: 'No category found with this id'});
            return;
        }
        res.json(categoryData);
  })
  .catch(err => {
        console.log(err); 
        res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
        id: req.params.id
    }
  })
    .then(categoryData => {
        if (!categoryData) {
            res.status(404).json({ message: 'No product found with this id'});
            return;
        }
        res.json(categoryData)
  })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});

module.exports = router;
