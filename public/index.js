fetch('/teas').then(response => response.json())
    .then(teas => {
        const container = document.querySelector('.tiles-container');
        let counter = 0;
        teas.forEach(tea => {
            const card = document.createElement('div');
            card.className = 'tile';
            card.id = `tile${counter}`;
            card.innerHTML = `
                <img class="tea-photo" src="./images/${tea.img_src}" alt="test tea photo">  
                <h2 class="tea-name">${tea.name}</h2>
            `;

            card.addEventListener('click', e => {
                let currentTile;
                if(e.target.className == 'tile') {
                    //target is tile
                    let id = e.target.id.substring(4);
                    currentTile = document.getElementById(`tile${id}`);
                }
                else {
                    //parent of target is tile
                    let id;
                    if(e.target.parentElement.id.includes('modal')) {
                        id = e.target.parentElement.id.substring(5);
                    }
                    else {
                        id = e.target.parentElement.id.substring(4);
                    }
                    currentTile = document.getElementById(`tile${id}`);
                }

                const modal = currentTile.children[currentTile.children.length - 1];

                if(!modal.open) {
                    /*if(e.target.className == 'tile') {
                        modal.innerHTML = fm.formatModal(tea);
                    }
                    else {
                        modal.innerHTML = e.target.parentElement.innerHTML;    
                    }*/
                    modal.innerHTML = `<img class="tea-photo" src="./images/${tea.img_src}" alt="test tea photo">  
                        <h2 class="tea-name">${tea.name}</h2>
                        <ul>
                            <li>Modality: ${tea.modality}</li>
                            <li>How To Make: ${tea.instructions}</li>
                            <li>Caffeinated: ${tea.caffeinated}</li>
                            <li>Flavor Profile: ${tea.flavors}</li>
                            <li>Last Drank: ${tea.last_drank}</li>
                            <li>Health Benefits: ${tea.health_qualities}</li>
                        </ul>`;
                    modal.showModal();
                } 
                else {
                    const modalDimensions = modal.getBoundingClientRect();
                    if (
                        e.clientX < modalDimensions.left ||
                        e.clientX > modalDimensions.right ||
                        e.clientY < modalDimensions.top ||
                        e.clientY > modalDimensions.bottom
                    ) {
                    modal.close();
                    }
                }
            });
            container.appendChild(card);
            
            const modal = document.createElement('dialog');
            modal.id = `modal${counter++}`;
            card.appendChild(modal);
        });
    })
.catch(err => console.error(err));

function searchTeas() {
    let input = document.getElementById('searchBar');
    let filter = input.value.toUpperCase();
    let tileContainer = document.getElementById('tilesContainer');
    let tileList = tileContainer.getElementsByClassName('tile');

    for(let i = 0; i < tileList.length; i++) {
        let teaName = tileList[i].getElementsByClassName('tea-name')[0].innerText;
        
        if(teaName.toUpperCase().substring(0, filter.length) == filter || teaName.toUpperCase().includes(" " + filter)) {
            tileList[i].style.display = "";
        }
        else {
            tileList[i].style.display = "none";
        }
    }
}

window.searchTeas = searchTeas;