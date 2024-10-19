let characters = [];
let currentCharacterIndex = 0;
const apiBaseUrl = 'https://akabab.github.io/starwars-api/api';

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
          return null;
        })
    );
  }

  const results = await Promise.all(promises);
  characters = results.filter(character => character);

  if (characters.length > 0) {
    displayCharacter(characters[currentCharacterIndex]);
  } else {
    displayError('No characters available. Please try again.');
  }
}

function displayCharacter(character) {
  document.getElementById('characterName').textContent = character.name;
  document.getElementById('characterID').textContent = `ID: ${character.id}`;
  document.getElementById('characterSpecies').textContent = `Species: ${character.species}`;
  document.getElementById('characterGender').textContent = `Gender: ${character.gender}`;
  document.getElementById('characterHeight').textContent = `Height: ${character.height * 100} cm`;
  document.getElementById('characterMass').textContent = `Mass: ${character.mass} kg`;
  document.getElementById('characterAffiliations').textContent = `Affiliations: ${character.affiliations?.join(', ') || 'None'}`;
  document.getElementById('characterMasters').textContent = `Master(s): ${character.masters?.join(', ') || 'None'}`;
  document.getElementById('characterApprentices').textContent = `Apprentice(s): ${character.apprentices?.join(', ') || 'None'}`;
  document.getElementById('characterHomeworld').textContent = `Homeworld: ${character.homeworld}`;

  const wikiLink = `https://starwars.fandom.com/wiki/${character.name.replace(/ /g, '_')}`;
  document.getElementById('wikiLink').href = wikiLink;

  const characterImage = document.getElementById('characterImage');
  if (character.image) {
    characterImage.src = character.image;
    characterImage.style.display = 'block';
  } else {
    characterImage.style.display = 'none';
  }

  document.getElementById('errorSection').style.display = 'none';
}

function displayError(message = 'Character not found.') {
  const errorSection = document.getElementById('errorSection');
  errorSection.textContent = message;
  errorSection.style.display = 'block';
}

function handleNext() {
  currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
  displayCharacter(characters[currentCharacterIndex]);
}

function handlePrevious() {
  currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length;
  displayCharacter(characters[currentCharacterIndex]);
}

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

document.getElementById('resetLink').addEventListener('click', () => {
  currentCharacterIndex = 0;
  displayCharacter(characters[currentCharacterIndex]);
});

document.getElementById('nextButton').addEventListener('click', handleNext);
document.getElementById('prevButton').addEventListener('click', handlePrevious);
document.getElementById('searchButton').addEventListener('click', searchCharacter);
document.getElementById('searchInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter' || event.keyCode === 13) {
    event.preventDefault();
    searchCharacter();
  }
});

fetchAllCharacters();
