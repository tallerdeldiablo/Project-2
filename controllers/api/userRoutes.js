//routes for creating users in session db
const router = require("express").Router();
const { User, Task } = require("../../models");
const sequelize = require("../../config/connection");

//gets all users route for testing
router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll();
    const users = userData.map((user) => user.get({ plain: true }));

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
});

//creates new user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.manager = userData.manager;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete a user and their tasks
router.delete("/:id", async (req, res) => {
  if (!req.session.logged_in || !req.session.manager) {
    return res.status(403).json({ message: "Manager access required" });
  }

  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  if (userId === req.session.user_id) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sequelize.transaction(async (transaction) => {
      await Task.destroy({ where: { user_id: userId }, transaction });
      await user.destroy({ transaction });
    });
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Could not delete user" });
  }
});

//logs a user in
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });


    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;

    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.manager = userData.manager;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//logs a user out
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});



module.exports = router;
