const express = require('express');
const path = require('path');


const app = express()
const PORT = process.env.PORT || 3500


//middleware - app.use()
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.status(404).json({ message : "requested page does not exist" });
    } else {
        res.type('txt').send("404 not found")
    }
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

