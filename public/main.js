import { Card, Parameter, deck, selectedCard, SetSelectedCard, FindCard } from './Card.js';

const parameters = document.querySelectorAll('.parameter');
const description = document.querySelector('.description').children[1];
const profile = document.querySelector('.profile');
const name = document.querySelector('.name').children[1];
const saveCard = document.querySelector('.saveCard');
const addCard = document.querySelector('#addCard');
let editParameter = true;
let editProfile = true;

let icons = [];
let profiles = [];
let lastClickedParameterId;
let currentParameter = null;
let selectedCardIcon = null;

parameters.forEach(par => {
    par.addEventListener('click', (e) => {
        ChangeIcon(par);
    });
});

profile.addEventListener('click', (e) => {
    ChangeProfile();
});

saveCard.addEventListener('click', (e) => {
    console.log(selectedCard);
    console.log(selectedCardIcon);

    UpdateCard(selectedCard, selectedCardIcon);
    //save card
});

addCard.addEventListener('click', (e) => {
    UnselectDeckCards();
    SetDefaultCardLayout();
    SetSelectedCard(deck[CreateCard()]);
});

function SetDefaultCardLayout() {
    for (let i = 0; i < parameters.length; i++) {
        parameters[i].title = `parameter ${i + 1}`;
        parameters[i].children[0].src = "./icons/albums.svg";
    }
    description.value = '';
    profile.src = './profiles/1.png';
    name.value = '';

}

function UnselectDeckCards() {
    document.querySelectorAll('.cardButton').forEach(c => {
        c.style.border = "thick solid rgba(255, 255, 255, 0)";
    });
}

function CreateCard() {
    const descriptionField = document.querySelector('.description').children[1];
    const descriptionValue = descriptionField > 0 ? descriptionField.value : descriptionField.placeholder;

    const nameField = document.querySelector('.name').children[1];
    const nameValue = nameField.value.length > 0 ? nameField.value : nameField.placeholder;

    const card = new Card(descriptionValue, profile.src, nameValue);
    for (let i = 0; i < parameters.length; i++) {
        const temp = new Parameter(parameters[i].title, StripFilename(parameters[i].children[0].src));
        card.parameters.push(temp);
    }

    deck.push(card);
    console.log(card);
    CreateCardIcon(card);
    //returns the index of the card in the deck
    return (deck.length - 1);
}

function UpdateCard(card, cardIcon) {
    const descriptionField = document.querySelector('.description').children[1];
    const descriptionValue = descriptionField > 0 ? descriptionField.value : descriptionField.placeholder;

    const nameField = document.querySelector('.name').children[1];
    const nameValue = nameField.value.length > 0 ? nameField.value : nameField.placeholder;

    for (let i = 0; i < parameters.length; i++) {
        card.parameters[i].SetParameter(parameters[i].title, StripFilename(parameters[i].children[0].src));
    }
    card.description = descriptionValue;
    card.profile = StripFilename(profile.src);
    card.name = nameValue;

    console.log("CARD ", card);

    cardIcon.children[0].innerText = card.name;
    cardIcon.children[1].src = `./profiles/${card.profile}`;
    cardIcon.children[1].title = card.name;
    console.log(cardIcon);
}

function StripFilename(url) {
    let lastSlashPos;
    let cleanFileName = "";

    for (let i = 0; i < url.length; i++) {
        if (url[i] === '/') {
            lastSlashPos = i;
        }
    }
    for (let i = lastSlashPos; i < url.length; i++) {
        cleanFileName += url[i];
    }
    return cleanFileName;
}

async function FetchImages() {
    const result = await fetch("http://localhost:3000/getImages");
    const imageData = await result.json();
    icons = imageData.icons;
    profiles = imageData.profiles;
}
FetchImages();
SetSelectedCard(deck[CreateCard()]);

function CreateCardIcon(card) {
    const cardButton = document.createElement('div');
    cardButton.id = card.id;
    cardButton.className = "cardButton";
    const cardTitle = document.createElement('p');
    cardTitle.innerText = card.name;
    const cardIcon = document.createElement('img');
    cardIcon.src = `${card.profile}`;
    cardIcon.title = card.name;
    const editCard = document.createElement('button');
    editCard.innerText = "Edit";
    const deleteCard = document.createElement('button');
    deleteCard.innerText = "Delete";

    selectedCardIcon = cardButton;

    editCard.addEventListener('click', (e) => {
        CloseParameterWindow();
        CloseProfileWindow();
        
        selectedCardIcon = cardButton;
        UnselectDeckCards();
        SetSelectedCard(FindCard(cardButton.id));

        for (let i = 0; i < parameters.length; i++) { //todo: wanneer je op edit drukt dat de card word geapplied op de grote card in het midden iykyk
            parameters[i].children[0].src = `./profile/${card.parameters[i].Icon}`;
            parameters[i].title = card.parameters[i].parameterTitle;
        }

        description.innerText = card.description;
        profile.src = card.profile;
        name.innerText = card.name;    
    });

    deleteCard.addEventListener('click', (e) => {
        if (deck.length > 1) {
            cardButton.remove();
            SetSelectedCard(deck[0]);
        }
        window.alert("can't delete, else deck will be empty");
    });

    cardButton.append(cardTitle);
    cardButton.append(cardIcon);
    cardButton.append(editCard);
    cardButton.append(deleteCard);

    addCard.insertAdjacentElement('afterend', cardButton);
}

function UnselectProfileIcons(profileList) {
    for (let j = 0; j < profileList.children.length; j++) {
        profileList.children[j].style.border = "thick solid rgba(255, 255, 255, 0)";
    }
}

function HighlightCurrentIcon(profileList, parameterIcon) {
    for (let j = 0; j < profileList.children.length; j++) {
        const child = profileList.children[j];
        if (profileList.children[j].src === parameterIcon) child.style.border = "thick solid white";
    }
}

function CloseParameterWindow(){
    const parameterWindow = document.getElementById('parameterId');
    if(parameterWindow) parameterWindow.remove();
}

function ChangeIcon(parameter) {
    const parameterId = 'parameterId';
    currentParameter = parameter;

    parameters.forEach(p => {
        p.style.border = "thick solid rgba(255, 255, 255, 0)";
    });
    parameter.style.border = "thick solid white";

    if (editParameter) {
        editParameter = false;

        console.log("CREATE");
        const editParametersWindow = document.createElement('div');
        editParametersWindow.id = parameterId;
        const parameterDescription = document.createElement('textarea');
        parameterDescription.id = 'parameterDescription';
        parameterDescription.innerText = parameter.title;
        const parameterProfileList = document.createElement('div');
        parameterProfileList.id = 'parameterProfileList';
        const saveParameter = document.createElement('button');
        saveParameter.id = 'saveParameter';
        saveParameter.innerText = 'Save Parameter';

        for (let i = 0; i < icons.length; i++) {
            const ico = document.createElement('img');
            ico.src = `./icons/${icons[i]}`;
            ico.id = icons[i];
            ico.className = 'clickable';
            ico.style.border = parameter.children[0].src === ico.src ? "thick solid white" : "thick solid rgba(255, 255, 255, 0)";

            ico.addEventListener('click', (e) => {
                currentParameter.children[0].src = ico.src;
                UnselectProfileIcons(parameterProfileList);
                ico.style.border = "thick solid white";
            });

            parameterProfileList.appendChild(ico);
            if (i > 12) break;
        }

        saveParameter.addEventListener('click', (e) => {
            parameter.title = parameterDescription.value;
            editParameter = true;
            parameter.style.border = "thick solid rgba(255, 255, 255, 0)";
            CloseParameterWindow();
        });

        editParametersWindow.appendChild(parameterDescription);
        editParametersWindow.appendChild(parameterProfileList);
        editParametersWindow.appendChild(saveParameter);

        document.body.append(editParametersWindow);
    }
    else {
        if (document.getElementById(parameterId) && parameter.id === lastClickedParameterId) {
            editParameter = true;
            parameter.style.border = "thick solid rgba(255, 255, 255, 0)";
            document.getElementById(parameterId).remove();
        }
        else if (lastClickedParameterId !== parameter.id) {
            currentParameter = parameter;
            const parameterWindow = document.getElementById(parameterId);
            if (parameterWindow) {
                const parameterDescription = parameterWindow.querySelector('#parameterDescription');
                const parameterProfileList = parameterWindow.querySelector('#parameterProfileList');
                parameterDescription.innerText = parameter.title;
                UnselectProfileIcons(parameterProfileList);
                HighlightCurrentIcon(parameterProfileList, parameter.children[0].src);
            }
        }
    }

    lastClickedParameterId = parameter.id;
}

function CloseProfileWindow() {
    editProfile = true;
    const profileWindow = document.getElementById('editProfileWindow');
    if(profileWindow) profileWindow.remove();
}

function ChangeProfile() {
    if (editProfile) {
        const profileWindowId = 'editProfileWindow';

        const editProfileWindow = document.createElement('div');
        editProfileWindow.id = profileWindowId;
        const profileList = document.createElement('div');
        profileList.id = 'profileList';
        const saveParameter = document.createElement('button');
        saveParameter.id = 'saveParameter';
        saveParameter.innerText = 'Save Parameter';

        for (let i = 0; i < profiles.length; i++) {
            const ico = document.createElement('img');
            ico.src = `./profiles/${profiles[i]}`;
            ico.id = profiles[i];
            ico.className = 'clickable'
            ico.style.border = profile.src === ico.src ? "thick solid white" : "thick solid rgba(255, 255, 255, 0)";

            ico.addEventListener('click', (e) => {
                profile.src = ico.src;
                UnselectProfileIcons(profileList);
                ico.style.border = "thick solid white";
            });

            profileList.appendChild(ico);
        }

        saveParameter.addEventListener('click', (e) => {
            CloseProfileWindow();
        });

        editProfileWindow.appendChild(profileList);
        editProfileWindow.appendChild(saveParameter);

        document.body.append(editProfileWindow);
    }
    else {
        document.getElementById('editProfileWindow').remove();
    }
}