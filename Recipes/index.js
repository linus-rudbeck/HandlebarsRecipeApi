const mongodb = require('mongodb')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main'
}))

app.set('view engine', 'hbs')
app.get('/', async (req, res) => {
    res.render('start')
})

app.get('/recipes', async (req, res) => {
    const client = new mongodb.MongoClient("mongodb://127.0.0.1")
    await client.connect()

    const db = client.db("MyRecipeDB")

    const dbRecipes = db.collection("Recipes").find()
    const recipes = await dbRecipes.toArray()

    res.render('recipes', { recipes })
})

app.get('/recipes/new', async (req, res) => {
    res.render('new')
})

app.post('/recipes/new', async (req, res) => {
    const recipe = {
        Title: req.body.title,
        Summary: req.body.summary,
        Minutes: req.body.minutes
    }

    const client = new mongodb.MongoClient("mongodb://127.0.0.1")
    client.connect()
    const db = client.db("MyRecipeDB")

    await db.collection("Recipes").insertOne(recipe);
    res.redirect('/recipes')
})

app.get('/recipes/delete/:id', async (req, res) => {
    res.render('delete', { id: req.params.id })
})

app.post('/recipes/delete/:id', async (req, res) => {
    const _id = new mongodb.ObjectId(req.params.id)
    const client = new mongodb.MongoClient("mongodb://127.0.0.1:27017")
    await client.connect()

    const db = client.db("MyRecipeDB")

    await db.collection("Recipes").deleteOne({ _id: _id })

    res.redirect("/recipes")
})


app.listen(8000, () => {
    console.log("http://127.0.0.1:8000/");
})