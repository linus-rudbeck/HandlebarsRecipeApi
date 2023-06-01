const mongodb = require('mongodb')
const express = require('express')
const exphbs =require('express-handlebars')

const app = express()

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main'
}))

app.set('view engine', 'hbs')

app.get('/recipes', async (req, res) => {
    const client = new mongodb.MongoClient("mongodb://127.0.0.1")
    await client.connect()

    const db = client.db("MyRecipeDB")

    const dbRecipes = db.collection("Recipes").find()
    const recipes = []
   

    await dbRecipes.forEach(r => {
     recipes.push(r)
    })

    res.render('home', {recipes})
})

app.post('/recipes/:id', async (req, res) =>{
    const _id = new mongodb.ObjectId(req.params.id)
    const client = new mongodb.MongoClient("mongodb://127.0.0.1:27017")
     client.connect()

    const db = client.db("MyRecipeDB")

    db.collection("Recipes").findOneAndUpdate({_id: _id}, (err, recipe) => {
       res.render('recipe', {recipe})
    
    })
})
app.listen(8000, () => {
    console.log("http://127.0.0.1:8000/");
})