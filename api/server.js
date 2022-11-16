const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { json } = require('body-parser');
const axios = require('axios');
const cloudinary = require("cloudinary");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(json());

const { parsed: config } = dotenv.config();

const BASE_URL = `https://api.cloudinary.com/v1_1/${config.CLOUD_NAME}`;

const auth = {
	username: config.API_KEY,
	password: config.API_SECRET,
};

cloudinary.config({
    cloudname: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

app.get('/photos', async (req, res) => {
	const response = await axios.get(BASE_URL + '/resources/image', {
		auth,
		params: {
			next_cursor: req.query.next_cursor,
		},
	});
	return res.send(response.data);
});

app.get('/search', async (req, res) => {
	const response = await axios.get(BASE_URL + '/resources/search', {
		auth,
		params: {
			expression: req.query.expression,
		},
	});

	return res.send(response.data);
});

app.use(cors());
app.delete("/public_id", async (req, res) => {
    const { public_id } = req.params;
    try {
        await cloudinary.uploader.destroy(public_id);
        res.status(200).send();
    }   catch (error) {
        res.status(400).send();
    }
});

const PORT = 7000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});