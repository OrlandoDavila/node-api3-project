const express = require('express');
Users = require('./userDb')
Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  res.status(201).json(req.body)
});

router.post('/:id/posts', validatePost, (req, res) => {
  // do your magic!
    res.status(201).json(req.body)
});

router.get('/', (req, res) => {

  // do your magic!
  Users.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    res.status(404).json({ message: "users not found"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!

  Users.getUserPosts(req.params.id)
  .then(postData => {
    res.status(200).json(postData)
  })
  .catch(err => {
    res.status(404).json({ message: "user by that ID does not exist"})
  })
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const { id } = req.params

  Users.remove(id)
  .then(deletedUser => {
    res.status(200).json({ message: "post deleted"} )
  })
  .catch(err => {
    res.status(404).json({ message: "couldn't find user by that id" })
  })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const editedUser = req.body
  const { id } = req.params

  Users.update(id, editedUser)
  .then(thenRes => {
    res.status(200).json(editedUser)
  })
  .catch(err => {
    res.status(404).json({ message: "user by that ID was not found"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
    // do your magic!

    const { id } = req.params
    let user = {}

    Users.getById(id)
    .then(userData => {
      console.log(userData)
      user = userData

      if (user) {
        req.user = user
        next()
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
}

function validateUser(req, res, next) {
  const { id } = req.params 
  // do your magic!
  if (req.body === {}) {
    res.status(400).json({ message: "missing user data" })
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    Users.insert(req.body)
    next()
  }

}

function validatePost(req, res, next) {
  const { id } = req.params
  // do your magic!
  if(req.body === {}) {
    res.status.json({ message: "missing post data"})
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field"})
  } else {
    req.body.user_id = id
    Posts.insert(req.body)
    next()
  }
}

module.exports = router;
