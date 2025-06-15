function formatModal(tea) {

    return `<img class="tea-photo" src="./images/${tea.img_src}" alt="test tea photo">  
            <h2 class="tea-name">${tea.name}</h2>
            <ul>
                <li>Modality: ${tea.modality}</li>
                <li>How To Make: ${tea.instructions}</li>
                <li>Caffeinated: ${tea.caffeinated}</li>
                <li>Flavor Profile: ${tea.flavors}</li>
                <li>Last Drank: ${tea.last_drank}</li>
                <li>Health Benefits: ${tea.health_qualities}</li>
            </ul>`
}

module.exports = formatModal;