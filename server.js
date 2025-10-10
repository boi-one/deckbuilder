const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const fs = require('fs');
const icons = './public/icons';
const profiles = './public/profiles';

app.use(express.static('public'));

app.get('/getImages', (req, res) => {
    const iconImages = [];
    const profileImages = [];    
    fs.readdirSync(icons).forEach(file => {
        iconImages.push(file);
    });
    fs.readdirSync(profiles).forEach(file => {
        profileImages.push(file);
    });
    data = {
        icons: iconImages,
        profiles: profileImages
    }

    res.send(data);
});

app.listen(PORT, () => { console.log("server is running on port: " + PORT) });