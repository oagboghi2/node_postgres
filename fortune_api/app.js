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

const writeFortunes = json => {
    fs.writeFile('./data/fortunes.json', JSON.stringify(json), err => console.log(err));

}
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

writeFortunes(new_fortunes)
    res.json(new_fortunes)
})

app.put('/fortunes/:id', (req,res) => {
    console.log("testing")
    const { id } = req.params;
    const { message, lucky_number, spirit_animal } = req.body;

    const old_fortune = fortunes.find(f => f.id == id);

    // if (message) old_fortune.message = message;
    // if (lucky_number) old_fortune.lucky_number = lucky_number;
    // if (spirit_animal )old_fortune.spirit_animal = spirit_animal;

    ['message', 'lucky_number', 'spirit_animal'].forEach(key => {
        if(req.body[key]) old_fortune[key] = req.body[key];
    });

    writeFortunes(fortunes) 
    res.json(fortunes)
})

app.delete('/fortunes/:id', (req, res) => {
    const { id} = req.params;

    const new_fortunes = fortunes.filter(f => f.id != id);

    writeFortunes(new_fortunes);

    res.json(new_fortunes);
})
// app.listen(port, ()=>{
//     console.log(`Listening on port ${port}`)
// });

module.exports = app;