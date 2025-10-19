const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

let dropdown = document.querySelectorAll(".select_container select");
let btn = document.querySelector("#btn");
let amt = document.querySelector("#amount input");
let fromCurr = document.querySelector("#from select");
let toCurr = document.querySelector("#to select");
let msg = document.querySelector("#msg");


for(let select of dropdown) {
    for(let Code in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = Code;
        newOption.value = Code;
        newOption.style.height="100%";
        if(select.name==="from" && Code==="USD") {
        newOption.selected = true;
        }
        else if(select.name==="to" && Code==="INR") {
        newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        getExchangeRate();
    });
}

const updateFlag = (element) => {
    let curCode = element.value;
    let countrycode = countryList[curCode];
    console.log(countrycode);
    let newSrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img"); //every parent select has an unique name coming from evt
    img.src= newSrc;
}

const getExchangeRate = async (evt) => {
    
    let amtVal = amt.value;
    if(amtVal <1 || amtVal === "") {
        amtVal = 1;
        amt.value = 1;
    }
    console.log(amtVal);
    

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
    try {
        let response = await fetch(URL);

        if (!response.ok) {
            throw new error (`Failed to fetch rate: HTTP status ${response.status}`);
        }
        let data = await response.json();
        
        let rate = data[toCurr.value.toLowerCase()] // countrycode is the index
        let finalAmt = rate * amt;

        if (rate !== undefined) {
            msg.innerText = msg.innerText + `${amtVal} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`
        }
        
    }catch(error) {
        console.log("Conversion error : ", error);
        msg.innerText = "Error fetching data. Check your network or currency codes.";
        msg.style.color="red";
    }
    
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    getExchangeRate();
});

window.addEventListener("load", () => {
    getExchangeRate();
});