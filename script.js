import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings={
    databaseURL: "https://champions-bb44c-default-rtdb.asia-southeast1.firebasedatabase.app/",
}

const app=initializeApp(appSettings);
const database=getDatabase(app);
const notesListInDB=ref(database, "Notes");

const btn=document.getElementById("btn");

const from=document.getElementById("from");
const to=document.getElementById("to");
const msg=document.getElementById("input1");

const list=document.getElementById("endlist");

btn.addEventListener("click", function(){
    let fromVal=from.value;
    let toVal=to.value;
    let msgVal=msg.value;

    if(valid(fromVal) && valid(toVal) && valid(msgVal)){
        const newData={
            from: fromVal,
            to: toVal,
            msg: msgVal,
            count: 0
        };

        push(notesListInDB, newData);

        clearInputs();
    }
    else{
        alert("Enter all values!")
    }
});

list.addEventListener("click", function(element){
    const icon=element.target.closest(".endorsement-list-heart-icon");

    if(icon){
        const iconId=icon.dataset.id;
        const iconCount=icon.nextElementSibling;

        const iconRef=ref(database, `Notes/${iconId}/count`);

        console.log(iconId);
        console.log(iconCount);

        let curr=parseInt(iconCount.textContent);
        curr++;

        console.log(curr);

        set(iconRef, curr);
    }
});

onValue(notesListInDB, function(snapshot){
    if(snapshot.exists()){
        let array=Object.entries(snapshot.val());
        list.innerHTML = "";

        let string = "";

        for(let i=0; i<array.length; i++){
            let id=array[i][0];
            let value=array[i][1];

            string+=`
                <li class="endorsement-list">
                    <p class="endorsement-list-to">To ${value.to}</p>
                    <p class="endorsement-list-msg">${value.msg}</p>
                    <div>
                       <p class="endorsement-list-from">From ${value.from}</p>
                       <div>
                          <i class="bi-heart endorsement-list-heart-icon" data-id="${id}"></i>
                          <p class="endorsement-list-heart-count">${value.count}</p>
                       </div>
                    </div>
                </li> 
            `
        }
        list.innerHTML=string;
    }
    else {
        list.innerHTML = `<p class="empty-lists" style="color: white">Empty List!.</p>`;
    }
});

function valid(text){
    if(!text) return false;

    return true;
}

function clearInputs(){
    from.value="";
    to.value="";
    msg.value="";
}