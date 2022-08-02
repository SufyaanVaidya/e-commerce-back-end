const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      if (req.body.productIds.length) {
        const productArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productArr);
      }
      res.status(200).json(tag)
    })
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
        id: req.params.id
    }
  })
  .then(dbTagData => {
        if (!dbTagData[0]) {
            res.status(404).json({ message: 'No tag found with this id'});
            return;
        }
        res.json(dbTagData)
  })
  .catch(err => {
        console.log(err); 
        res.status(500).json(err);
  });

});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
        id: req.params.id
    }
  })
  .then(dbTagData => {
        if (!dbTagData) {
            res.status(404).json({ message: 'No tag found with this id'});
            return;
        }
        res.json(dbTagData)
  })
  .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});

module.exports = router;
