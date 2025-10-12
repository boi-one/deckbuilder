const parameters = document.querySelectorAll('.parameter');
const profile = document.querySelector('.profile');
let editParameter = true;
let editProfile = true;

let icons = []
let profiles = []
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

async function FetchImages() {
    const result = await fetch("http://localhost:3000/getImages");
    const imageData = await result.json();
    icons = imageData.icons;
    profiles = imageData.profiles;
}
FetchImages();

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
            ico.style.border = parameter.children[0].src === ico.src ? "thick solid white" : "thick solid rgba(255, 255, 255, 0)";

            ico.addEventListener('click', (e) => {
                currentParameter.children[0].src = ico.src;
                UnselectProfileIcons(parameterProfileList);
                ico.style.border = "thick solid white";
            });

            parameterProfileList.appendChild(ico);
            // if (i > 2) break;
        }

        saveParameter.addEventListener('click', (e) => {
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
        const editProfileWindow = document.createElement('div');
        editProfileWindow.id = 'editProfileWindow';
        const profileList = document.createElement('div');
        profileList.id = 'profileList';

        for (let i = 0; i < profiles.length; i++) {
            const ico = document.createElement('img');
            ico.src = `./profiles/${profiles[i]}`;
            ico.id = profiles[i];
            ico.style.border = profile.src === ico.src ? "thick solid white" : "thick solid rgba(255, 255, 255, 0)";

            ico.addEventListener('click', (e) => {
                profile.src = ico.src;
                UnselectProfileIcons(parameterProfileList);
                ico.style.border = "thick solid white";
            });

            profileList.appendChild(ico);
        }

        editProfileWindow.appendChild(profileList);

        document.body.append(editProfileWindow);
    }
}