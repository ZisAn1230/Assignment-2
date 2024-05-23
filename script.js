document.addEventListener('DOMContentLoaded', () => {
    const defaultApiUrl = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=A';
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const playersContainer = document.getElementById('players-container');
    const playerCountElem = document.getElementById('player-count');
    const groupContainer = document.getElementById('group-container');

    let groupCount = 0;
    let groupPlayers = [];

    fetchPlayers(defaultApiUrl);

    searchButton.addEventListener('click', () => {
        const playerName = searchInput.value.trim();
        if (playerName) {
            fetchPlayers(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`);
        }
    });

    function fetchPlayers(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.player) {
                    displayPlayers(data.player);
                } else {
                    playersContainer.innerHTML = '<p>No players found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
                playersContainer.innerHTML = '<p>Error fetching player data.</p>';
            });
    }

    function displayPlayers(players) {
        playersContainer.innerHTML = '';
        players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card', 'col-md-4');

            const playerHtml = `
                <img src="${player.strThumb || 'https://via.placeholder.com/150'}" alt="${player.strPlayer}">
                <h3 class="player-name">${player.strPlayer}</h3>
                <p class="player-info"><strong>Nationality:</strong> ${player.strNationality}</p>
                <p class="player-info"><strong>Team:</strong> ${player.strTeam}</p>
                <p class="player-info"><strong>Sport:</strong> ${player.strSport}</p>
                <p class="player-info"><strong>Salary:</strong> ${player.strWage || 'N/A'}</p>
                <p class="player-info"><strong>Description:</strong> ${(player.strDescriptionEN || '').split(' ').slice(0, 10).join(' ')}...</p>
                <div class="social-icons">
                    <a href="${player.strInstagram || '#'}" target="_blank"><i class="fab fa-instagram"></i></a>
                    <a href="${player.strTwitter || '#'}" target="_blank"><i class="fab fa-twitter"></i></a>
                </div>
                <button class="btn btn-primary details-button" data-id="${player.idPlayer}">Details</button>
                <button class="btn btn-success add-to-group-button">Add to Group</button>
            `;
            playerCard.innerHTML = playerHtml;

            playerCard.querySelector('.details-button').addEventListener('click', () => showPlayerDetails(player.idPlayer));
            playerCard.querySelector('.add-to-group-button').addEventListener('click', () => addToGroup(player.strPlayer));

            playersContainer.appendChild(playerCard);
        });
    }

    function showPlayerDetails(playerId) {
        fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
            .then(response => response.json())
            .then(data => {
                const player = data.players[0];
                const modalBody = document.getElementById('modal-body');
                modalBody.innerHTML = `
                    <h4>${player.strPlayer}</h4>
                    <p><strong>Team:</strong> ${player.strTeam}</p>
                    <p><strong>Position:</strong> ${player.strPosition}</p>
                    <p><strong>Nationality:</strong> ${player.strNationality}</p>
                    <p><strong>Birth Date:</strong> ${player.dateBorn}</p>
                    <p><strong>Height:</strong> ${player.strHeight}</p>
                    <p><strong>Weight:</strong> ${player.strWeight}</p>
                `;
                $('#playerModal').modal('show');
            })
            .catch(error => console.error('Error fetching player details:', error));
    }

    function addToGroup(playerName) {
        if (groupCount >= 11) {
            alert('You cannot add more than 11 players to the group.');
            return;
        }
        if (!groupPlayers.includes(playerName)) {
            groupPlayers.push(playerName);
            groupCount++;
            playerCountElem.textContent = groupCount;

            const playerElem = document.createElement('p');
            playerElem.textContent = playerName;
            groupContainer.appendChild(playerElem);
        } else {
            alert('This player is already in the group.');
        }
    }
});

