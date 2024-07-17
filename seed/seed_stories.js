/**
 * node seed/seed_stories.js
 */
const axios = require('axios');

// Array of stories with title and content
const stories = [
    {
        title: "Midnight Literary Soirée",
        content: "As the old clock struck midnight, the bookstore came to life. Books whispered secrets to each other, pages rustled with excitement, and characters from different worlds gathered for a clandestine meeting. Among them, Sherlock Holmes debated with Elizabeth Bennet while Harry Potter and Frodo Baggins discussed the perils of their respective adventures. It was a literary soirée where imagination knew no bounds and where every tale found its echo in another."
    },
    {
        title: "Melodies of the City",
        content: "In the heart of a bustling city, a lonely street musician played his violin under the dim glow of streetlights. His music, melancholic and haunting, drew a small crowd who paused to listen, their faces illuminated by the music's emotion. Among them was an elderly woman, tears glistening in her eyes, transported back to a time when love was new and dreams were endless. For a moment, the city's chaos faded, and all that remained was the magic of music and memories."
    },
    {
        title: "Garden of Cherry Blossoms",
        content: "In the heart of a bustling city, a lonely street musician played his violin under the dim glow of streetlights. His music, melancholic and haunting, drew a small crowd who paused to listen, their faces illuminated by the music's emotion. Among them was an elderly woman, tears glistening in her eyes, transported back to a time when love was new and dreams were endless. For a moment, the city's chaos faded, and all that remained was the magic of music and memories."
    },
    {
        title: "Song of the Sapphire Sea",
        content: "Deep in the enchanted forest, a young witch brewed potions under the watchful eyes of ancient trees. Her cauldron bubbled with magic, each concoction a delicate balance of herbs and spells. One day, a lost faerie stumbled into her glade, her wings tangled and her eyes filled with fear. With a gentle touch, the witch healed her wounds and showed her the way home, forging an unlikely friendship that bridged the divide between their worlds."
    },
    {
        title: "Witch's Glade",
        content: "Deep in the enchanted forest, a young witch brewed potions under the watchful eyes of ancient trees. Her cauldron bubbled with magic, each concoction a delicate balance of herbs and spells. One day, a lost faerie stumbled into her glade, her wings tangled and her eyes filled with fear. With a gentle touch, the witch healed her wounds and showed her the way home, forging an unlikely friendship that bridged the divide between their worlds."
    },
    {
        title: "Urban Canvas",
        content: "In a bustling metropolis, a graffiti artist adorned the city's walls with vibrant colors and hidden messages. Each stroke of their spray can was a rebellion against the monotony of urban life, a plea for freedom and expression. One night, as they painted beneath the glow of street lamps, a curious bystander approached, captivated by the artistry before them. Together, they explored the city's hidden corners, discovering beauty in unexpected places."
    },
    {
        title: "Nomad's Mirage",
        content: "On the edge of the desert, a nomad wandered beneath the scorching sun, his camel by his side and the promise of adventure in his heart. With each step, he collected stories whispered by the shifting sands, tales of lost civilizations and forgotten dreams. One evening, as he rested by a campfire, a traveler approached, bearing a map to a hidden oasis rumored to grant wishes. With newfound hope, they journeyed into the unknown, guided by the stars and the promise of miracles."
    },
    {
        title: "Baker's Kindness",
        content: "In a quaint village nestled among rolling hills, a baker kneaded dough with practiced hands, filling the air with the scent of freshly baked bread. Each loaf was a labor of love, a tradition passed down through generations. When a weary traveler stumbled upon her bakery, hungry and lost, she offered him a warm slice and a listening ear. In that simple act of kindness, they found solace in each other's company and a renewed faith in the goodness of humanity."
    },
    {
        title: "Forge of Honor",
        content: "In the shadow of an ancient castle, a blacksmith forged swords that gleamed like silver under the moonlight. Each blade told a story of battles fought and victories won, of honor and sacrifice. One day, a knight in tarnished armor sought his expertise, his sword broken and his spirit weary. With skill and determination, the blacksmith repaired the blade, infusing it with newfound strength and purpose. As the knight rode off into the sunset, he carried with him not just a weapon but a symbol of resilience and hope."
    },
    {
        title: "Campfire Chronicles",
        content: "Beneath a canopy of stars, a group of children huddled around a campfire, their faces illuminated by the flickering flames. With each tale they spun, their imaginations soared, weaving stories of dragons and treasure hunts, of faraway lands and daring adventures. As they laughed and dreamed together, they formed bonds that would last a lifetime, forging memories that would shine brighter than any constellation in the night sky."
    }
];


// URL to POST the articles
const url = 'http://localhost:3300/api/articles/create';

// Function to upload each story
async function uploadStory(story) {
    try {
        const response = await axios.post(url, {
            title: story.title,
            content: story.content,
            body: [{
                type: 'text',
                content: story.content
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2NjJjOTUyZThhZDYzNDA5MjM1Y2Y4ODIiLCJlbWFpbCI6Im5hbWluZHVAbGl2ZS5jb20iLCJuYW1lIjoiTmFtaW5kdSJ9.QbQm46QSSN7Q2c5LRVJDEa6Ct2upXVdNbACrro3gQDM'
            }
        });
        console.log(`Uploaded "${story.title}" successfully. Response:`, response.data);
    } catch (error) {
        console.error(`Failed to upload "${story.title}". Error:`, error.message);
    }
}

// Function to upload all stories
async function uploadAllStories() {
    for (let story of stories) {
        await uploadStory(story);
    }
}

// Upload all stories
uploadAllStories();