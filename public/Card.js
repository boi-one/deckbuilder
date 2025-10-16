import { StripFilename } from './main.js';

export const deck = [];
export let selectedCard;

export function SetSelectedCard(card) {
    selectedCard = card;
    FindCardIcon(card.id).style.border = "thick solid white";
}

export function FindCard(id){
    for(let i = 0; i < deck.length; i++)
    {
        if(Number(id) === deck[i].id) return deck[i];
    }
    return null;
}

function FindCardIcon(id){
    const cardIcons = document.querySelectorAll('.cardButton');
    for(let i = 0; i < cardIcons.length; i++)
    {
        if(id === Number(cardIcons[i].id)) return cardIcons[i];
    }
    return null;
}

export class Parameter{
    parameterTitle = "";
    parameterIcon = "";
    leftValueMin = 0;
    leftValueMax = null;
    rightValueMin = 0;
    rightValueMax = null;

    constructor(title, icon){
        this.parameterTitle = title;
        this.parameterIcon = icon;
    }

    SetParameter(title, icon){
        this.parameterTitle = title;
        this.parameterIcon = icon;
    }

    ToJson(){
        const data = {
            parameterTitleData: StripFilename(this.parameterTitle),
            parameterIconData: StripFilename(this.parameterIcon),
            leftValueMin: this.leftValueMin,
            leftValueMax: this.leftValueMax,
            rightValueMin: this.rightValueMin,
            rightValueMax: this.rightValueMax
        }
        return data;
    }
}

let cardId = 0;

export class Card{
    id = 0;
    parameters = [];
    description = "";
    profile = "";
    name = "";

    constructor(description, profile, name){
        this.id = cardId;
        cardId++;
        this.description = description;
        this.profile = profile;
        this.name = name;
    }

    ToJson(){
        const params = [];
        this.parameters.forEach(p => {
            params.push(p.ToJson());
        });
        
        const data = {
            id: this.id,
            parameters: params,
            description: this.description,
            profile: StripFilename(this.profile),
            name: this.name
        }

        return data;
    }
}