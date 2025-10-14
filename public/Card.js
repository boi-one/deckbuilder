export const deck = [];
export let selectedCard;

export function SetSelectedCard(card) {
    selectedCard = card;
}

export function FindCard(id){ //todo FIX DAT DE ID WORD GEVONDEN EN WAAR HET GEBRUIKTWORD DE SETCARD OOK WERKT JWZ
    for(let i = 0; i < deck.length; i++)
    {
        if(id === deck[i].id) return deck[i];
    }
    return null;
}

export class Parameter{
    parameterTitle = "";
    parameterIcon = "";

    constructor(title, icon){
        this.parameterTitle = title;
        this.parameterIcon = icon;
    }

    ToJson(){
        data = {
            parameterTitleData: this.parameterTitle,
            parameterIconData: this.parameterIcon
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
}