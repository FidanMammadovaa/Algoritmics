const express = require('express')
const app = express();

const myName = 'Kamal'

app.get('/', (req, res) =>
    res.send(`Menim adim: ${myName}`));

app.get('/card', (req, res) =>
    res.send(`Bu route kartlar üçün cavabdehdir`));


app.get('/client', (req, res) =>
    res.send(`Bu marşrut müştərilər üçün cavabdehdir`));

const POST = 3000;

app.listen(POST, ()=>{
    console.log(`http://localhost:${POST}`);
})