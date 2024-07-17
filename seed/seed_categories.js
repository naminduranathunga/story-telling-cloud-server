/**
 * node seed/seed_stories.js
 */
const axios = require('axios');

// Array of stories with title and content
const categories = [
    "Action",
    "Adventure",
    "Animated",
    "Biography",
    "Comedy",
    "Crime",
    "Dance",
    "Disaster",
    "Documentary",
    "Drama",
    "Erotic",
    "Family",
    "Fantasy",
    "Found Footage",
    "Historical",
    "Horror",
    "Independent",
    "Legal",
    "Live Action",
    "Martial Arts",
    "Musical",
    "Mystery",
    "Noir",
    "Performance",
    "Political",
    "Romance",
    "Satire",
    "Science Fiction",
    "Short",
    "Silent",
    "Slasher",
    "Sports",
    "Spy",
    "Superhero",
    "Supernatural",
    "Suspense",
    "Teen",
    "Thriller",
    "War",
    "Western"
];


// URL to POST the articles
const url = 'http://localhost:3300/api/categories/create';

// Function to upload each story
async function uploadStory(cat) {
    try {
        const response = await axios.post(url, {
            name: cat,
            slug: cat.toLowerCase().replace(/ /g, "-")
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2NjJjOTUyZThhZDYzNDA5MjM1Y2Y4ODIiLCJlbWFpbCI6Im5hbWluZHVAbGl2ZS5jb20iLCJuYW1lIjoiTmFtaW5kdSJ9.QbQm46QSSN7Q2c5LRVJDEa6Ct2upXVdNbACrro3gQDM'
            }
        });
        console.log(`Uploaded "${cat}" successfully. Response:`, response.data);
    } catch (error) {
        console.error(`Failed to upload "${cat}". Error:`, error.message);
    }
}

// Function to upload all stories
async function uploadAllStoryCategories() {
    for (let cat of categories) {
        await uploadStory(cat);
    }
}

// Upload all stories
uploadAllStoryCategories();