const router = require("express").Router();
const { Task, User } = require("../models");
const withAuth = require("../utils/auth");

//hompage route
router.get("/", async (req, res) => {
  try {
    res.render("login", {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//manager view
router.get("/manager", withAuth, async (req, res) => {
  try {
    //finding user bases on session id
    const userData = await User.findByPk(req.session.user_id, {
      attributes: ["name", "role", "manager"],
    });
    //serializing
    const user = userData.get({ plain: true });

    //getting all employees and their tasks
    const tasksWithUser = await User.findAll({
      include: Task,
      required: false,
    });

    //serializing
    const employeeTasks = tasksWithUser.map((employee) => ({
      ...employee.get({ plain: true }),
      isCurrentUser: employee.id === req.session.user_id,
    }));
    //res.status(200).json(tasksWithUser);
    res.render("manager", {
      user,
      employeeTasks,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//*-----------------chart

//loginn with auth view will depend on your employee role
router.get("/chart", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: ["name", "role", "manager"],
    });
    const userforchart = userData.get({ plain: true });

    //getting all employees and their tasks
    const tasksWithUser = await User.findAll({
      include: Task,
      required: false,
    });

    const employeeTasks = tasksWithUser.map((task) =>
      task.get({ plain: true })
    );

    res.render("chart", {
      userforchart,
      employeeTasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//employee view
router.get("/employee", withAuth, async (req, res) => {
  try {
    //finding user bases on session id
    const userData = await User.findByPk(req.session.user_id, {
      attributes: ["name", "role", "manager"],
    });
    //serializing
    const user = userData.get({ plain: true });

    //gets all tasks asscoiated with logged in user
    const taskData = await Task.findAll({
      where: { user_id: req.session.user_id },
    });
    const tasks = taskData.map((task) => task.get({ plain: true }));

    res.render("employee", {
      user,
      tasks,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in && req.session.manager) {
    res.redirect("/manager");
    return;
  } else if (req.session.logged_in && !req.session.manager) {
    res.redirect("/employee");
    return;
  }

  res.render("login");
});

module.exports = router;
