const parameters = document.querySelectorAll('.parameter');
let editParameter = true;

icons = []
profiles = []

parameters.forEach(par => {
    par.addEventListener('click', (e) => {
        console.log(par.id);

        ChangeIcon(par);
    });
});

async function FetchImages(){
    const result = await fetch("http://localhost:3000/getImages");
    const imageData = await result.json();
    icons = imageData.icons;
    profiles = imageData.profiles;
    ChangeIcon();
    console.log(icons);
    console.log(profiles);
}
FetchImages();

console.log("lol");

function ChangeIcon(parameter) {
    const parameterId = 'parameterId';
    editParameter = !editParameter;
    
    if (editParameter) {
        console.log("CREATE");
        editParametersWindow = document.createElement('div');
        editParametersWindow.id = parameterId;
        parameterDescription = document.createElement('textarea');
        parameterDescription.id = 'parameterDescription';
        parameterDescription.innerText = "LOL LMAO";
        parameterProfileList = document.createElement('div');
        parameterProfileList.id = 'parameterProfileList';

        for(i = 0; i < icons.length; i++){
            ico = document.createElement('img');
            ico.src = `./icons/${icons[i]}`;
            ico.id = icons[i];
            parameterProfileList.appendChild(ico);
            if(i > 10) break;
        }

        editParametersWindow.appendChild(parameterDescription);
        editParametersWindow.appendChild(parameterProfileList);

        document.body.append(editParametersWindow);
    }
    else{
        console.log("DELETE");
        if(document.getElementById(parameterId)) document.getElementById(parameterId).remove();
    }
}