// javascript

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue, remove, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
   databaseURL: "https://playground-bc43e-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const publishBtn = document.getElementById("publish-btn")
const inputEl = document.getElementById("input-el")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
const listEl = document.getElementById("list-el")

// Add input value to DB
publishBtn.addEventListener("click", function()
{
    let inputValue = inputEl.value
    let fromValue = fromEl.value
    let toValue = toEl.value
    push(endorsementsInDB, `${inputValue}, ${fromValue}, ${toValue}`)
    clearInputfield()
})

// Whenever DB changes
onValue(endorsementsInDB, function (snapshot)
{
    // if there is an item in DB
    if (snapshot.exists())
    {
        // transform snapshot object to array
        let endorsementsArray = Object.entries(snapshot.val())
        
        // clear list before showing
        clearListItems()
        
        // loop through endorsements, render in list
        for (let i = 0; i < endorsementsArray.length; i++)
        {
            let currentEndorsement = endorsementsArray[i]
            renderListItems(currentEndorsement)
        }
    }
    else
    {
        listEl.innerHTML = "No endorsements yet.."
    }
})

function renderListItems(item)
{
    let currentEndorsementValue = item[1]
    let currentEndorsementID = item[0]
    
    let newEl = document.createElement("li")
    
    let endorsementArray = currentEndorsementValue.split(",")
    
    let endorsementValue = endorsementArray[0]
    let endorsementFrom = endorsementArray[1]
    let endorsementTo = endorsementArray[2]
    
    for (let i = 0; i < endorsementArray.length; i++)
    {
        newEl.textContent +=  endorsementArray[i]
    }
    newEl.innerText = `To:${endorsementTo}
    
    ${endorsementValue}
    
    From:${endorsementFrom}`
    
    newEl.addEventListener("dblclick", function()
    {
         let exactLocationOfEndorsementinDB = ref(database, `endorsements/${currentEndorsementID}`)
         remove(exactLocationOfEndorsementinDB)
    })
    listEl.append(newEl)
}

function clearInputfield()
{
    inputEl.value = ""
}

function clearListItems()
{
    listEl.innerHTML = ""
}

function clearFromTo()
{
    fromEl.value = ""
    toEl.value = ""
}