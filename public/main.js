import { Card, Parameter, deck, selectedCard, SetSelectedCard, FindCard } from './Card.js';

const parameters = document.querySelectorAll('.parameter');
const description = document.querySelector('.description').children[1];
const profile = document.querySelector('.profile');
const name = document.querySelector('.name').children[1];
const saveCard = document.querySelector('.saveCard');
const addCard = document.querySelector('#addCard');
const saveDeck = document.querySelector('#saveDeck');
const loadDeck = document.querySelector('#loadDeck');

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
    UpdateCard(selectedCard, selectedCardIcon);
});

addCard.addEventListener('click', (e) => {
    CloseParameterWindow();
    CloseProfileWindow();
    UnselectDeckCards();
    SetDefaultCardLayout();
    SetSelectedCard(deck[CreateCard()]);
});

saveDeck.addEventListener('click', (e) => {
    const cards = [];
    deck.forEach(c => {
        cards.push(c.ToJson());
    });

    console.log(cards);

    fetch('http://localhost:3000/save-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards })
    })
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `deck - ${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(console.error);
});

loadDeck.addEventListener('click', (e) => {

});

function SetDefaultCardLayout() {
    for (let i = 0; i < parameters.length; i++) {
        parameters[i].title = `parameter ${i + 1}`;
        parameters[i].children[0].src = "./icons/location.png";
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
        const temp = new Parameter(parameters[i].title, parameters[i].children[0].src);
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
    const descriptionValue = descriptionField.value.length > 0 ? descriptionField.value : descriptionField.placeholder;

    const nameField = document.querySelector('.name').children[1];
    const nameValue = nameField.value.length > 0 ? nameField.value : nameField.placeholder;

    for (let i = 0; i < parameters.length; i++) {
        card.parameters[i].SetParameter(parameters[i].title, parameters[i].children[0].src);
    }
    card.description = descriptionValue;
    card.profile = StripFilename(profile.src);
    card.name = nameValue;

    cardIcon.children[0].innerText = card.name;
    cardIcon.children[1].src = `./profiles/${card.profile}`;
    cardIcon.children[1].title = card.name;
    console.log(cardIcon);
}

export function StripFilename(url) {
    if (url.length < 1) return null;

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

        for (let i = 0; i < parameters.length; i++) parameters[i].style.border = "thick solid rgba(255, 255, 255, 0)";

        selectedCardIcon = cardButton;
        UnselectDeckCards();
        SetSelectedCard(FindCard(cardButton.id));

        for (let i = 0; i < parameters.length; i++) { //todo: laat de grote kaart veranderen en niet invalid worden als je op edit drukt bij een van de kleine kaartjes
            parameters[i].children[0].src = card.parameters[i].parameterIcon;
            parameters[i].title = card.parameters[i].parameterTitle;
        }

        description.value = card.description;
        profile.src = `./profiles${StripFilename(card.profile)}`;
        name.value = card.name;
    });

    deleteCard.addEventListener('click', (e) => {
        console.log("deck lenght", deck.length);
        if (deck.length < 2) {
            window.alert("can't delete, else deck will be empty");
        }
        else {
            const obj = FindCard(cardButton.id);
            const idx = deck.indexOf(obj);
            if (idx !== -1) {
                cardButton.remove();
                deck.splice(idx, 1);
                SetSelectedCard(deck[deck.length - 1]);
            }
        }
        console.log("deck lenght", deck.length);
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

function CloseParameterWindow() {
    const parameterWindow = document.getElementById('parameterId');
    if (parameterWindow) {
        editParameter = true;
        parameterWindow.remove();
    }
}

function GetLowest(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (a > b) return b;
    return a;
}

function GetHighest(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (a > b) return a;
    return b;
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

        const leftRightValuesMin = document.createElement('div');
        leftRightValuesMin.className = "leftRightValuesContainer";
        const leftValueMinInput = document.createElement('input');
        leftValueMinInput.title = 'left value min';
        leftValueMinInput.placeholder = 'left value min';
        leftValueMinInput.type = 'number';
        const leftValueMin = selectedCard.parameters[Number(parameter.id)].leftValueMin;
        leftValueMinInput.value = leftValueMin === null ? 0 : leftValueMin;
        const rightValueMinInput = document.createElement('input');
        rightValueMinInput.title = 'right value min';
        rightValueMinInput.placeholder = 'right value min';
        rightValueMinInput.type = 'number';
        const rightValueMin = selectedCard.parameters[Number(parameter.id)].rightValueMin;
        rightValueMinInput.value = rightValueMin === null ? 0 : rightValueMin;

        const leftRightValuesMax = document.createElement('div');
        leftRightValuesMax.className = "leftRightValuesContainer";
        const leftValueMaxInput = document.createElement('input');
        leftValueMaxInput.title = 'left value max';
        leftValueMaxInput.placeholder = 'left value max';
        leftValueMaxInput.type = 'number';
        const leftValueMax = selectedCard.parameters[Number(parameter.id)].leftValueMax;
        leftValueMaxInput.value = leftValueMax;
        const rightValueMaxInput = document.createElement('input');
        rightValueMaxInput.title = 'right value max';
        rightValueMaxInput.placeholder = 'right value max';
        rightValueMaxInput.type = 'number';
        const rightValueMax = selectedCard.parameters[Number(parameter.id)].rightValueMax;
        rightValueMaxInput.value = rightValueMax;

        leftRightValuesMin.appendChild(leftValueMinInput);
        leftRightValuesMin.appendChild(rightValueMinInput);
        leftRightValuesMax.appendChild(leftValueMaxInput);
        leftRightValuesMax.appendChild(rightValueMaxInput);
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

            let tempLeftMin = Number(leftValueMinInput.value);
            let tempLeftMax = Number(leftValueMaxInput.value);
            let tempRightMin = Number(rightValueMinInput.value);
            let tempRightMax = Number(rightValueMaxInput.value);

            selectedCard.parameters[Number(parameter.id)].leftValueMin = leftValueMinInput.value.length > 0 ? GetLowest(tempLeftMin, tempLeftMax) : 0;
            selectedCard.parameters[Number(parameter.id)].leftValueMax = leftValueMaxInput.value.length > 0 ? GetHighest(tempLeftMin, tempLeftMax) : null;
            selectedCard.parameters[Number(parameter.id)].rightValueMin = rightValueMinInput.value.length > 0 ? GetLowest(tempRightMin, tempRightMax) : 0;
            selectedCard.parameters[Number(parameter.id)].rightValueMax = rightValueMaxInput.value.length > 0 ? GetHighest(tempRightMin, tempRightMax) : null;

            console.log("PM ", selectedCard.parameters);

            editParameter = true;
            parameter.style.border = "thick solid rgba(255, 255, 255, 0)";
            CloseParameterWindow();
        });

        editParametersWindow.appendChild(parameterDescription);
        editParametersWindow.appendChild(parameterProfileList);
        editParametersWindow.appendChild(leftRightValuesMin);
        editParametersWindow.appendChild(leftRightValuesMax);
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
    if (profileWindow) profileWindow.remove();
}

function ChangeProfile() {
    if (editProfile) {
        editProfile = false;
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
        editProfile = true;
        document.getElementById('editProfileWindow').remove();
    }
}