let characters = []; // Store valid characters
let currentCharacterIndex = 0; // Track the current character's index
const apiBaseUrl = 'https://akabab.github.io/starwars-api/api'; // Fixed API URL

// Fetch all valid characters (IDs 1 to 88)
async function fetchAllCharacters() {
  const promises = [];

  for (let id = 1; id <= 88; id++) {
    promises.push(
      fetch(`${apiBaseUrl}/id/${id}.json`)
        .then(response => {
          if (!response.ok) throw new Error('Character not found');
          return response.json();
        })
        .catch(error => {
          console.error(`Failed to fetch character ${id}:`, error);
          return null; // Handle missing IDs gracefully
        })
    );
  }

  const results = await Promise.all(promises);
  characters = results.filter(character => character); // Filter out null values

  if (characters.length > 0) {
    displayCharacter(characters[currentCharacterIndex]);
  } else {
    displayError('No characters available. Please try again.');
  }
}

// Display character data on the page
function displayCharacter(character) {
  document.getElementById('characterName').textContent = character.name;
  document.getElementById('characterID').textContent = `ID: ${character.id}`;
  document.getElementById('characterSpecies').textContent = `Species: ${character.species}`;
  document.getElementById('characterGender').textContent = `Gender: ${character.gender}`;
  document.getElementById('characterHeight').textContent = `Height: ${character.height * 100} cm`; // Convert meters to cm
  document.getElementById('characterMass').textContent = `Mass: ${character.mass} kg`;
  document.getElementById('characterAffiliations').textContent = `Affiliations: ${character.affiliations?.join(', ') || 'None'}`;
  document.getElementById('characterMasters').textContent = `Master(s): ${character.masters?.join(', ') || 'None'}`;
  document.getElementById('characterApprentices').textContent = `Apprentice(s): ${character.apprentices?.join(', ') || 'None'}`;
  document.getElementById('characterHomeworld').textContent = `Homeworld: ${character.homeworld}`;

  // Set Wookieepedia link
  const wikiLink = `https://starwars.fandom.com/wiki/${character.name.replace(/ /g, '_')}`;
  document.getElementById('wikiLink').href = wikiLink;

  // Image Handling: Use only API-provided image or hide the image element
  const characterImage = document.getElementById('characterImage');
  if (character.image) {
    characterImage.src = character.image; // Use API-provided image
    characterImage.style.display = 'block'; // Show the image if available
  } else {
    characterImage.style.display = 'none'; // Hide the image element if not available
  }

  document.getElementById('errorSection').style.display = 'none'; // Hide error section
}

// Display error message
function displayError(message = 'Character not found.') {
  const errorSection = document.getElementById('errorSection');
  errorSection.textContent = message;
  errorSection.style.display = 'block';
}

// Handle next character navigation
function handleNext() {
  currentCharacterIndex = (currentCharacterIndex + 1) % characters.length; // Loop back to start
  displayCharacter(characters[currentCharacterIndex]);
}

// Handle previous character navigation
function handlePrevious() {
  currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length; // Loop to end
  displayCharacter(characters[currentCharacterIndex]);
}

// Search for a character by name
function searchCharacter() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const foundCharacter = characters.find(character =>
    character.name.toLowerCase().includes(searchQuery)
  );

  if (foundCharacter) {
    currentCharacterIndex = characters.indexOf(foundCharacter);
    displayCharacter(foundCharacter);
  } else {
    displayError('No character found. Try a different search.');
  }
}

// Reset to the first character
document.getElementById('resetLink').addEventListener('click', () => {
  currentCharacterIndex = 0;
  displayCharacter(characters[currentCharacterIndex]);
});

// Event listeners for buttons
document.getElementById('nextButton').addEventListener('click', handleNext);
document.getElementById('prevButton').addEventListener('click', handlePrevious);
document.getElementById('searchButton').addEventListener('click', searchCharacter);
document.getElementById('searchInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter' || event.keyCode === 13) {
    event.preventDefault(); // Prevent default form submission
    searchCharacter(); // Trigger search
  }
});

// Fetch all characters on page load
fetchAllCharacters();
