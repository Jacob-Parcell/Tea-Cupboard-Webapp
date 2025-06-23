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
                let id;
                if(e.target.className == 'tile') {
                    //target is tile
                    id = e.target.id.substring(4);
                    currentTile = document.getElementById(`tile${id}`);
                }
                else {
                    //parent of target is tile
                    if(e.target.parentElement.id.includes('modal')) {
                        id = e.target.parentElement.id.substring(5);
                    }
                    else {
                        id = e.target.parentElement.id.substring(4);
                    }
                    currentTile = document.getElementById(`tile${id}`);
                }

                let modal;

                if(currentTile) {
                    modal = currentTile.querySelector('dialog');
                    if(!modal.open) {
                        modal.innerHTML = `<img class="tea-photo" src="./images/${tea.img_src}" alt="test tea photo">  
                            <h2 class="tea-name">${tea.name}</h2>
                            <div id="modalInfo">
                                <ul>
                                    <li>Modality: ${tea.modality}</li>
                                    <li>How To Make: ${tea.instructions}</li>
                                    <li>Caffeinated: ${tea.caffeinated}</li>
                                    <li>Flavor Profile: ${tea.flavors}</li>
                                    <li>Last Drank: ${tea.last_drank}</li>
                                    <li>Health Benefits: ${tea.health_qualities}</li>
                                </ul>
                                <button class="delete-button" onclick="deleteTeaClicked(\'${tea.name}\')">Delete Tea</button>
                                <button class="edit-button" onclick="editTeaClicked(\'${tea.name}\', ${id})">Edit Tea Info</button>
                            </div>`;
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
    <form id="addTeaForm">\
        <label for="teaName">Tea Name:</label>\
        <input type="text" id="teaName" name="teaName" class="addTeaTextBox">\
        <p>Modality:</p>\
        <input type="checkbox" id="looseLeaf" name="looseLeaf" value="Loose Leaf">\
        <label for="looseLeaf">Loose Leaf</label>\
        <input type="checkbox" id="teabag" name="teabag" value="Teabag">\
        <label for="teabag">Teabag</label>\
        <label for="howToMake">How To Make: </label>\
        <input type="text" id="howToMake" name="instructions" class="addTeaTextBox">\
        <div class="caffeineContent">\
            <input type="radio" id="caffeinated" name="caffeine_content" value="Caffeinated">\
            <label for="caffeinated">Caffeinated</label>\
            <input type="radio" id="non-caffeinated" name="caffeine_content" value="Non-Caffeinated">\
            <label for="non-caffeinated">Non-Caffeinated</label>\
        </div>\
        <label for="flavors">Flavor Profile: </label>\
        <input type="text" id="flavors" name="flavors" class="addTeaTextBox">\
        <label for="health_qualities">Health Benefits: </label>\
        <input type="text" id="health_qualities" name="health_qualities" class="addTeaTextBox">\
        <label for="pin">Admin Password</label>\
        <input type="text" id="pin" name="pin" class="addTeaTextBox">\
        <input type="submit" class="addTeaButton" id="submit" name="submit" value="Add Tea">\
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

    document.body.appendChild(addTeaModal);

    const form = addTeaModal.querySelector('#addTeaForm');
    form.addEventListener('submit', async function(e) {
        
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        //let promptValue = prompt('Enter Admin Password');

        // Send POST request
        await fetch('/teas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Redirect to homepage
        window.location.assign("http://localhost:4001/");
    });

    addTeaModal.showModal();
}

async function deleteTeaClicked(teaName) {
    
    await fetch(`/teas/${teaName}`, {
        method: 'DELETE'
    });

    // Redirect to homepage
    window.location.assign("http://localhost:4001/");
}

async function editTeaClicked(teaName, modalId) {
    //get current info
    await fetch(`/teas/${teaName}`, {
        method: 'GET'
    }).then(response => response.json())
    .then(currentTea => {
        const currentModal = document.getElementById(`modal${modalId}`);

        const modalBody = currentModal.querySelector('#modalInfo');

        //replace null values with empty string
        for (let [key, value] of Object.entries(currentTea)) {
            if(value == null)
            {
                currentTea[key] = "";
            }
        }

        //set default values of checkboxes and radio button
        let looseLeafChecked = "";
        let teabagChecked = "";
        let caffeinatedChecked = "";
        let nonCaffeinatedChecked = "";

        if(currentTea.modality.includes("Loose Leaf")) {
            looseLeafChecked = "checked";
        }

        if(currentTea.modality.includes("Teabag")) {
            teabagChecked = "checked";
        }

        if(currentTea.caffeinated.includes('Non')) {
            nonCaffeinatedChecked = "checked";
        }
        else if(currentTea.caffeinated) {
            caffeinatedChecked = "checked";
        }

        //update innerHTML and put old info in the text boxes
        modalBody.innerHTML = `\
            <form id="updateTeaForm">\
                <label for="name">Tea Name:</label>\
                <input type="text" id="name" name="name" class="addTeaTextBox" value="${currentTea.name}">\
                <p>Modality:</p><br>\
                <input type="checkbox" id="looseLeaf" name="looseLeaf" value="Loose Leaf" ${looseLeafChecked}>\
                <label for="looseLeaf">Loose Leaf</label>\
                <input type="checkbox" id="teabag" name="teabag" value="Teabag" ${teabagChecked}>\
                <label for="teabag">Teabag</label>\
                <label for="howToMake">How To Make: </label>\
                <input type="text" id="howToMake" name="instructions" class="addTeaTextBox" value="${currentTea.instructions}">\
                <div class="caffeineContent">\
                    <input type="radio" id="caffeinated" name="caffeinated" value="Caffeinated" ${caffeinatedChecked}>\
                    <label for="caffeinated">Caffeinated</label>\
                    <input type="radio" id="non-caffeinated" name="caffeinated" value="Non-Caffeinated" ${nonCaffeinatedChecked}>\
                    <label for="non-caffeinated">Non-Caffeinated</label>\
                </div>\
                <label for="flavor">Flavor Profile: </label>\
                <input type="text" id="flavors" name="flavors" class="addTeaTextBox" value="${currentTea.flavors}">\
                <label for="health_qualities">Health Benefits: </label>\
                <input type="text" id="health_qualities" name="health_qualities" class="addTeaTextBox" value="${currentTea.health_qualities}">\
                <label for="pin">Admin Password</label>\
                <input type="text" id="pin" name="pin" class="addTeaTextBox">\
                <input type="submit" class="updateTeaButton" id="submit" name="submit" value="Update Tea">\
            </form>`;

        //add event listener to update button
        const form = modalBody.querySelector('#updateTeaForm');
        form.addEventListener('submit', async function(e) {
            
            //has not been changed to be used for Update yet
            
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            //let promptValue = prompt('Enter Admin Password');
            // Send PUT request
            await fetch(`/teas/${teaName}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            

            // Redirect to homepage
            window.location.assign("http://localhost:4001/");
        });
    });

    
    //do backend stuff

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