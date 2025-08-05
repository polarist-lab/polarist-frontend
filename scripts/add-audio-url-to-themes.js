const fs = require('fs');
const path = require('path');

const themedWordbooksDir = path.join(__dirname, '..', 'src', 'data', 'themed-wordbooks');
const audioDir = path.join(__dirname, '..', 'backend', 'audio');
const backendUrl = 'http://localhost:4000';

// Get all themed wordbook files
fs.readdir(themedWordbooksDir, (err, files) => {
  if (err) {
    console.error('Error reading themed-wordbooks directory:', err);
    return;
  }

  const jsonFiles = files.filter(file => file.endsWith('.json'));

  // Get all audio files
  fs.readdir(audioDir, (err, audioFiles) => {
    if (err) {
      console.error('Error reading audio directory:', err);
      return;
    }

    const mp3Files = audioFiles.filter(file => file.endsWith('.mp3'));
    const audioMap = new Map();
    mp3Files.forEach(file => {
      const word = path.basename(file, '.mp3').replace(/_/g, ' ');
      audioMap.set(word, file);
    });

    // Process each themed wordbook
    jsonFiles.forEach(jsonFile => {
      const filePath = path.join(themedWordbooksDir, jsonFile);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading ${jsonFile}:`, err);
          return;
        }

        const wordbookData = JSON.parse(data);

        wordbookData.words.forEach(word => {
          const audioFile = audioMap.get(word.korean);
          if (audioFile) {
            word.audioUrl = `${backendUrl}/audio/${encodeURIComponent(audioFile)}`;
          } else {
            const matchedFile = mp3Files.find(f => f.startsWith(word.korean));
            if (matchedFile) {
                word.audioUrl = `${backendUrl}/audio/${encodeURIComponent(matchedFile)}`;
            }
          }
        });

        fs.writeFile(filePath, JSON.stringify(wordbookData, null, 2), 'utf8', (err) => {
          if (err) {
            console.error(`Error writing updated ${jsonFile}:`, err);
            return;
          }
          console.log(`Successfully added audioUrl to ${jsonFile}`);
        });
      });
    });
  });
});
