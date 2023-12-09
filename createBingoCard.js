const Jimp = require('jimp');

const imageCount = 54; // Total number of images
const gridSize = 4; // Grid size for the bingo card (4x4)
const sheetsCount = 20; // Number of bingo sheets to create
const cardWidth = 2550; // Width of the bingo card
const cardHeight = 3300; // Height of the bingo card
const imageWidth = cardWidth / gridSize; // Width of each image in the grid
const imageHeight = cardHeight / gridSize; // Height of each image in the grid

console.log('Script started');

// Function to create a bingo card
async function createBingoCard(sheetNumber) {
    console.log(`Creating bingo card ${sheetNumber}...`);
    
    // Create a blank image for the bingo card
    let bingoCard = new Jimp(cardWidth, cardHeight, 0xffffffff);

    let selectedImages = new Set(); // To keep track of selected images

    while (selectedImages.size < gridSize * gridSize) {
        selectedImages.add(Math.floor(Math.random() * imageCount) + 1);
    }

    let imageArray = Array.from(selectedImages);

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            let imageIndex = imageArray[x * gridSize + y];
            let imagePath = `Images/LoteriaCards/${imageIndex}.png`;
            console.log(`Processing image ${imageIndex} at position (${x}, ${y}) on card ${sheetNumber}`);

            try {
                let image = await Jimp.read(imagePath);
                image.resize(imageWidth, imageHeight);

                bingoCard.composite(image, x * imageWidth, y * imageHeight);
            } catch (error) {
                console.error(`Error processing image ${imageIndex} on card ${sheetNumber}:`, error);
                return;
            }
        }
    }

    // Save the bingo card
    bingoCard.write(`bingoCard${sheetNumber}.png`, () => {
        console.log(`Bingo card ${sheetNumber} created!`);
    });
}

// Create multiple bingo cards
async function createMultipleBingoCards() {
    for (let i = 1; i <= sheetsCount; i++) {
        await createBingoCard(i);
    }
}

createMultipleBingoCards().catch(error => {
    console.error('Error creating multiple bingo cards:', error);
});
