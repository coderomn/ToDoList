const express = require("express");
const fs = require("fs");
const PORT = 7373;
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    let tasks = JSON.parse(fs.readFileSync("data.json"));

    if (req.query.filter == "active") {
        tasks = tasks.filter(task => !task.done);
    }
    if (req.query.filter == "completed") {
        tasks = tasks.filter(task => task.done);
    }
    let all = JSON.parse(fs.readFileSync("data.json"));

    res.render("index", {
        tasks: tasks,
        active: all.filter(task => !task.done),
        completed: all.filter(task => task.done)
    });
});

app.post("/add", (req, res) => {
    let tasks = JSON.parse(fs.readFileSync("data.json"));

    tasks.push({
        id: Date.now(),
        name: req.body.name,
        date: new Date().toLocaleDateString(),
        done: false
    });

    fs.writeFileSync("data.json", JSON.stringify(tasks, null, 2));

    res.redirect("/");
});

app.post("/done/:id", (req, res) => {
    let tasks = JSON.parse(fs.readFileSync("data.json"));

    let task = tasks.find(task => task.id == req.params.id);

    task.done = !task.done;

    fs.writeFileSync("data.json", JSON.stringify(tasks, null, 2));

    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    let tasks = JSON.parse(fs.readFileSync("data.json"));

    tasks = tasks.filter(task => task.id != req.params.id)

    fs.writeFileSync("data.json", JSON.stringify(tasks, null, 2));

    res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
    let tasks = JSON.parse(fs.readFileSync("data.json"));

    let task = tasks.find(task => task.id == req.params.id);

    res.render("edit", { task: task });
});

app.post("/edit/:id", (req, res) => {
    let tasks = JSON.parse(fs.readFileSync("data.json"));

    let task = tasks.find(task => task.id == req.params.id);

    task.name = req.body.name;

    fs.writeFileSync("data.json", JSON.stringify(tasks, null, 2));

    res.redirect("/");
});

app.listen(PORT, ()=>{
    console.log("http://localhost:"+PORT);
});