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
    checkboxed();
}

function addTeaClicked() {
    const addTeaModal = document.createElement('dialog');
    addTeaModal.id = 'addTeaModal';

    //html for tea creation form
    addTeaModal.innerHTML = '\
    <form action="/teas" method="post">\
        <label for="teaName">Tea Name:</label><br>\
        <input type="text" id="teaName" name="teaName"><br><br>\
        <p>Modality:</p>\
        <input type="checkbox" id="looseLeaf" name="looseLeaf" value="Loose Leaf">\
        <label for="looseLeaf">Loose Leaf</label>\
        <input type="checkbox" id="teabag" name="teabag" value="Teabag">\
        <label for="teabag">Teabag</label><br><br>\
        <label for="howToMake">How To Make: </label><br>\
        <input type="text" id="howToMake" name="howToMake"><br><br>\
        <input type="radio" id="caffeinated" name="caffeine_content" value="caffeinated">\
        <label for="caffeinated">Caffeinated</label><br>\
        <input type="radio" id="non-caffeinated" name="caffeine_content" value="non-caffeinated">\
        <label for="non-caffeinated">Non-Caffeinated</label><br><br>\
        <label for="flavor">Flavor Profile: </label><br>\
        <input type="text" id="flavor" name="flavor"><br><br>\
        <label for="health">Health Benefits: </label><br>\
        <input type="text" id="health" name="health"><br><br>\
        <input type="submit" id="submit" name="submit" value="Add Tea">\
    </form>';

    //allow user to click out of modal
    addTeaModal.addEventListener('click', e => {
        const modalDimensions = addTeaModal.getBoundingClientRect();
        if (
            e.clientX < modalDimensions.left ||
            e.clientX > modalDimensions.right ||
            e.clientY < modalDimensions.top ||
            e.clientY > modalDimensions.bottom
        ) {
            addTeaModal.close();
        }
    });

    addTeaModal.style = "font-size: 20px; width: 15%; text-align: center";

    document.body.appendChild(addTeaModal);
    addTeaModal.showModal();
}

/* TODO add checkboxed functionality and implement searched method to clean code
function searched(teaName, filter) {
    if(teaName.toUpperCase().substring(0, filter.length) == filter || teaName.toUpperCase().includes(" " + filter)) {
        return true;
    }
    else {
        return false;
    }
}

function checkboxed() {
    let cafBoxValue = document.getElementById('caffeinated').checked;
    let nonCafBoxValue = document.getElementById('non-caffeinated').checked;

    if(cafBoxValue ^ nonCafBoxValue) {
        //one box is checked and the other isn't
        if(cafBoxValue) {

        }
        else {
            
        }
    }
}
    */

window.searchTeas = searchTeas;