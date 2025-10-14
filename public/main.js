import { Card, Parameter, deck, selectedCard, SetSelectedCard, FindCard } from './Card.js';

const parameters = document.querySelectorAll('.parameter');
const profile = document.querySelector('.profile');
const saveCard = document.querySelector('.saveCard');
const cardsDeck = document.querySelector('.dropdown');
const addCard = document.querySelector('#addCard');
let editParameter = true;
let editProfile = true;

let icons = [];
let profiles = [];
let lastClickedParameterId;
let currentParameter = null;

parameters.forEach(par => {
    par.addEventListener('click', (e) => {
        ChangeIcon(par);
    });
});

profile.addEventListener('click', (e) => {
    ChangeProfile();
});

saveCard.addEventListener('click', (e) => {
    //save card
});

addCard.addEventListener('click', (e) => {
    UnselectDeckCards();
    SetSelectedCard(deck[CreateCard()]);
});

function UnselectDeckCards(){
    document.querySelectorAll('.cardButton').forEach(c => {
        c.style.border = "thick solid rgba(255, 255, 255, 0)";
    });
}

function CreateCard(){
    const descriptionField = document.querySelector('.description').children[1];
    const descriptionValue = descriptionField > 0 ? descriptionField.value : descriptionField.placeholder;
    
    const nameField = document.querySelector('.name').children[1];
    const nameValue = nameField.value.length > 0 ? nameField.value : nameField.placeholder;
    console.log(nameValue);
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

function StripFilename(url){
    let lastSlashPos;
    let cleanFileName = "";

    for(let i = 0; i < url.length; i++){
        if(url[i] === '/'){
            lastSlashPos = i;
        }
    }
    for(let i = lastSlashPos; i < url.length; i++){
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

function CreateCardIcon(card){
    const cardButton = document.createElement('div');
    cardButton.id = card.id;
    cardButton.className = "cardButton";
    cardButton.style.border = "thick solid white";
    const cardTitle = document.createElement('p');
    cardTitle.innerText = card.name;
    const cardIcon = document.createElement('img');
    cardIcon.src = `${card.profile}`;
    cardIcon.title = card.name;
    const editCard = document.createElement('button');
    editCard.innerText = "Edit";
    const deleteCard = document.createElement('button');
    deleteCard.innerText = "Delete";

    editCard.addEventListener('click', (e) => {
        UnselectDeckCards();
        cardButton.style.border = "thick solid white";
        SetSelectedCard(FindCard(cardButton.id));
        console.log("sc ", selectedCard);
    });

    deleteCard.addEventListener('click', (e) => {
        console.log("delete");
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
            document.getElementById(parameterId).remove();
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
            editProfile = true;
            document.getElementById(editProfileWindow).remove();
        });


        editProfileWindow.appendChild(profileList);
        editProfileWindow.appendChild(saveParameter);

        document.body.append(editProfileWindow);
    }
    else {
        document.getElementById(editProfileWindow).remove();
    }
}