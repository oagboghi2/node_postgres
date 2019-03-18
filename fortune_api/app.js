const express = require('express');
const fortunes = require('./data/fortunes');
const bodyParser = require('body-parser');
const fs = require('fs');

//const port = 3000;

const app = express();

app.use(bodyParser.json());

app.get('/fortunes', (req, res)=>{
    // send this string to the response stream
    // res.send('requesting fortunes')
    // send this data as a json to the response stream
    res.json(fortunes);
});

app.get('/fortunes/random', (req, res) => {
    const r_fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.json(r_fortune);
    
})

app.get(`/fortunes/:id`, (req, res)=>{
    console.log(req.params);

    // helper function called find
    // important that we use == instead of === becuase we are comparing
    // values, not data types

    // We use find to compare id of f object, and compare it to req.params
    // If true, return that value
    res.json(fortunes.find(f => f.id == req.params.id));

})

app.post('/fortunes', (req, res)=>{
    console.log(req.body);

    const { message, lucky_number,spirit_animal } = req.body;
    const fortune_ids = fortunes.map(f => f.id);
    const new_fortunes = fortunes.concat({
        id: (fortune_ids.length > 0 ? Math.max(...fortune_ids) : 0) + 1,
        message,
        lucky_number,
        spirit_animal
    });

    fs.writeFile('./data/fortunes.json', JSON.stringify(new_fortunes), err => console.log(err));

    //res.json(new_fortunes)
})

app.put('/fortunes/:id', (req,res) => {
    console.log("testing")
    const { id } = req.params;
    const { message, lucky_number, spirit_animal } = req.body;

    const old_fortune = fortunes.find(f => f.id == id);

    old_fortune.message = message;
    old_fortune.lucky_number = lucky_number;
    old_fortune.spirit_animal = spirit_animal;

    fs.writeFile('./data/fortunes.json', JSON.stringify(fortunes), err => console.log(err));
    console.log("testing")
    res.json(fortunes)
})
// app.listen(port, ()=>{
//     console.log(`Listening on port ${port}`)
// });

module.exports = app;