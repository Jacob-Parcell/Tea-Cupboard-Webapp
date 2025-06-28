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
                        modal.innerHTML = `<button type="button" class="btn-close" aria-label="Close">X</button>
                        <img class="tea-photo-small" src="./images/${tea.img_src}" alt="test tea photo">  
                            <h2 class="tea-name">${tea.name}</h2>
                            <div id="modalInfo">
                                <table class="tea-info-table">
                                    <tr>
                                        <th class="tea-attribute-column">Modality</th>
                                        <th class="tea-value-column">${tea.modality}</th>
                                    </tr>
                                    <tr>
                                        <th class="tea-attribute-column">How To Make</th>
                                        <th class="tea-value-column">${tea.instructions}</th>
                                    </tr>
                                    <tr>
                                        <th class="tea-attribute-column">Caffeinated</th>
                                        <th class="tea-value-column">${tea.caffeinated}</th>
                                    </tr>
                                    <tr>
                                        <th class="tea-attribute-column">Flavor Profile</th>
                                        <th class="tea-value-column">${tea.flavors}</th>
                                    </tr>
                                    <tr>
                                        <th class="tea-attribute-column">Last Drank</th>
                                        <th class="tea-value-column">${tea.last_drank}</th>
                                    </tr>
                                    <tr>
                                        <th class="tea-attribute-column">Health Benefits</th>
                                        <th class="tea-value-column">${tea.health_qualities}</th>
                                    </tr>
                                </table>
                                <button class="delete-button" onclick="deleteTeaClicked(\'${tea.name}\')">Delete Tea</button>
                                <button class="edit-button" onclick="editTeaClicked(\'${tea.name}\', ${id})">Edit Tea Info</button>
                            </div>`;
                        modal.showModal();

                        /*const closeButton = modal.querySelector('.btn-close');
                        console.log(closeButton.parentElement);
                        closeButton.addEventListener('click', e => {
                            console.log('click detected');
                            closeButton.parentElement.style.display-"none";
                        });*/
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
    <form class="teaForm">\
        <label for="teaName">Tea Name:</label>\
        <input type="text" id="teaName" name="teaName" class="tea-name-text-box">\
        <label for="modality">Modality:</label>\
        <div class="modality" style="display: flex; flex-direction: row;">\
            <input type="checkbox" id="looseLeaf" name="looseLeaf" value="Loose Leaf">\
            <label for="looseLeaf" class="radio-label">Loose Leaf</label>\
            <input type="checkbox" id="teabag" name="teabag" value="Teabag">\
            <label for="teabag" class="radio-label">Teabag</label>\
        </div>\
        <label for="howToMake">How To Make: </label>\
        <textarea type="text" id="howToMake" name="instructions" class="teaTextBox"></textarea>\
        <label for="caffeineContent">Caffeine Content:</label>\
        <div class="caffeineContent">\
            <input type="radio" id="caffeinated" name="caffeine_content" value="Caffeinated">\
            <label for="caffeinated" class="radio-label">Caffeinated</label><br>\
            <input type="radio" id="non-caffeinated" name="caffeine_content" value="Non-Caffeinated">\
            <label for="non-caffeinated" class="radio-label">Non-Caffeinated</label>\
        </div>\
        <label for="flavors">Flavor Profile: </label>\
        <textarea type="text" id="flavors" name="flavors" class="teaTextBox"></textarea>\
        <label for="health_qualities">Health Benefits: </label>\
        <textarea type="text" id="health_qualities" name="health_qualities" class="teaTextBox"></textarea>\
        <label for="pin">Admin Password</label>\
        <input type="password" id="pin" name="pin" maxlength="4" size="4" class="admin-pin-text-box">\
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
            addTeaModal.remove();
        }
    });

    document.body.appendChild(addTeaModal);

    const form = addTeaModal.querySelector('.teaForm');
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
            <form id="updateTeaForm${modalId}" class="teaForm">\
                <label for="name${modalId}">Tea Name:</label>\
                <input type="text" id="name${modalId}" name="name" class="tea-name-text-box" value="${currentTea.name}">\
                <label for="modality">Modality:</label>\
                <div class="modality" style="display: flex; flex-direction: row;">\
                    <input type="checkbox" id="looseLeaf${modalId}" name="looseLeaf" value="Loose Leaf" ${looseLeafChecked}>\
                    <label for="looseLeaf${modalId}" class="radio-label">Loose Leaf</label>\
                    <input type="checkbox" id="teabag${modalId}" name="teabag" value="Teabag" ${teabagChecked}>\
                    <label for="teabag${modalId}" class="radio-label">Teabag</label>\
                </div>\
                <label for="howToMake${modalId}">How To Make: </label>\
                <textarea type="text" id="howToMake${modalId}" name="instructions" class="teaTextBox">${currentTea.instructions}</textarea>\
                <label for="caffeineContent">Caffeine Content:</label>\
                <div class="caffeineContent">\
                    <input type="radio" id="caffeinated${modalId}" name="caffeinated" value="Caffeinated" ${caffeinatedChecked}>\
                    <label for="caffeinated${modalId}" class="radio-label">Caffeinated</label>\
                    <input type="radio" id="non-caffeinated${modalId}" name="caffeinated" value="Non-Caffeinated" ${nonCaffeinatedChecked}>\
                    <label for="non-caffeinated${modalId}" class="radio-label">Non-Caffeinated</label>\
                </div>\
                <label for="flavor${modalId}">Flavor Profile: </label>\
                <textarea type="text" id="flavors${modalId}" name="flavors" class="teaTextBox">${currentTea.flavors}</textarea>\
                <label for="health_qualities${modalId}">Health Benefits: </label>\
                <textarea type="text" id="health_qualities${modalId}" name="health_qualities" class="teaTextBox">${currentTea.health_qualities}</textarea>\
                <label for="pin${modalId}">Admin Password</label>\
                <input type="password" id="pin${modalId}" name="pin" maxlength="4" size="4" class="admin-pin-text-box">\
                <input type="submit" class="updateTeaButton" id="submit" name="submit" value="Update Tea">\
            </form>`;

        //add event listener to update button
        const form = modalBody.querySelector(`#updateTeaForm${modalId}`);
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