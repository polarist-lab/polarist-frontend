const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'korean-vocabulary-200-final.json');
const audioDir = path.join(__dirname, '..', 'backend', 'audio');
const backendUrl = 'http://localhost:4000';

// Read the JSON data
fs.readFile(dataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading data file:', err);
    return;
  }

  const vocabData = JSON.parse(data);

  // Get the list of audio files
  fs.readdir(audioDir, (err, files) => {
    if (err) {
      console.error('Error reading audio directory:', err);
      return;
    }

    const audioFiles = files.filter(file => file.endsWith('.mp3'));

    // Create a map for quick lookup
    const audioMap = new Map();
    audioFiles.forEach(file => {
      const word = path.basename(file, '.mp3').replace(/_/g, ' ');
      audioMap.set(word, file);
    });

    // Add audioUrl to each word
    vocabData.words.forEach(word => {
      const audioFile = audioMap.get(word.word);
      if (audioFile) {
        word.audioUrl = `${backendUrl}/audio/${encodeURIComponent(audioFile)}`;
      } else {
        // Handle cases where the word has a different file name
        const matchedFile = audioFiles.find(f => f.startsWith(word.word));
        if (matchedFile) {
            word.audioUrl = `${backendUrl}/audio/${encodeURIComponent(matchedFile)}`;
        }
      }
    });

    // Write the updated data back to the file
    fs.writeFile(dataPath, JSON.stringify(vocabData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing updated data file:', err);
        return;
      }
      console.log('Successfully added audioUrl to vocabulary data.');
    });
  });
});
