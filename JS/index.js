//set global variable
let totalcorrects = 0
let wronganswers = []
let totalquestions = 5
let usersoption = []
let btnsubmitquiz 
let countdown = 60;
let limitedtime = 1
let  myModal
//hide submit quiz at the first time 
$(document).ready(function(){
     btnsubmitquiz = document.getElementById("containersubmitquiz")
    // console.log(btnsubmitquiz)
    btnsubmitquiz.style.display = "none"
    // say hello user
    let user = getCookie("username");
    if(user){
        document.getElementById("welcome").innerText = "Welcome " + user + "to knowledge test"
    }
})

// login function 
function login(){
    let username = document.getElementById("useremail")
    let userpassword = document.getElementById("userpassword")
    username.classList.remove("is-invalid")
    userpassword.classList.remove("is-invalid")
    if(username.value.length >0 && userpassword.value.length >0){
        var checkresult = check_email(username.value)
        if(checkresult){
        username.classList.add("is-valid")
        userpassword.classList.add("is-valid")
        if(username.value === "admin@gmail.com" && userpassword.value === "admin"){
            setCookie("username", username.value, 365);
            window.location.href = "index.html"
        }else{
            username.classList.add("is-valid")
            userpassword.classList.add("is-invalid")
        }
        }else{
        username.classList.add("is-invalid")
        }
    }else{
  username.classList.add("is-invalid")
  userpassword.classList.add("is-invalid")
    }
}

//check user email is valid or not
function check_email(useremail){
    return useremail.includes('@');
}

//set cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }


  //get cookie
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function shownumberquestions(numquestions){
    let tagresult = document.getElementById("usertotalquestions")
    tagresult.innerText = numquestions + " questions"
    totalquestions = numquestions
}


function startquiz(){
    document.getElementById("menusetting").style.display = "none"
    btnsubmitquiz.style.display = "block"
    let leftmenu = document.getElementById("leftboard")
    //create button for left menu 
    for(let i=0;i< totalquestions;i++){
        var btnquestion = document.createElement("button");
        let count = i+1;
        btnquestion.appendChild(document.createTextNode(count)); 
       //set class name for each button
       btnquestion.setAttribute("class", "btn btn-info mr-1 btnfixed");
       btnquestion.setAttribute("data-question", count);
        console.log(btnquestion)
        // Add buton into cell 
        leftmenu.appendChild(btnquestion)
       
    }
     //create question 
     create_Questions()
}

function showConfirmModal() {
     myModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
      keyboard: false
    });
    myModal.show();
}
function cancelAction(){
    myModal.hide()
}
function confirmAction() {
    console.log('Decided to submit quiz!');
    // Close the modal after action;
    myModal.hide()
    // Calculate grade
    showgrade()

}

var GetFileBlobUsingURL = function (url, convertBlob) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function() {
        convertBlob(xhr.response);
    });
    xhr.send();
};

var blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
};

var GetFileObjectFromURL = function(filePathOrUrl, convertBlob) {
   GetFileBlobUsingURL(filePathOrUrl, function (blob) {
      convertBlob(blobToFile(blob, 'questiondata.csv'));
   });
};

function create_Questions(){
 var fileURL = "questiondata.csv"
    GetFileObjectFromURL(fileURL, function (fileObject) {
        console.log(fileObject);
        let file = fileObject
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
    
                // Assuming the first sheet is the one we want
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
    
                // Parse the sheet into JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
                // Process the JSON data
                processExcelData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
   });

    //start countdown
    countdowntime()
}

function processExcelData(data) {
    let totalCreatedQuestions = 0
    data.forEach((row, index) => {
        // Assuming the first row is headers and skip it
        if (index === 0) return;
        var number = row[0]
        var questioncontent = row[1]
        var option1 = row[2]
        var option2 = row[3]
        var option3 = row[4]
        var option4 = row[5]
        var img = row[6]
        var answer = row[7]
        //create question 
        if(totalCreatedQuestions < totalquestions){
            createQuestionCard(number, questioncontent, [option1, option2, option3, option4], answer, img);
            totalCreatedQuestions++
        }else{
            return;
        }
    });
}


    function createQuestionCard(questionNumber, questionText, options, answer, imagepath) {
        // Create the card div
        const card = document.createElement('div');
        card.className = 'card';
        
        // Create the card header
        const cardHeader = document.createElement('h5');
        cardHeader.className = 'card-header';
        cardHeader.textContent = `Question ${questionNumber}`;
        card.appendChild(cardHeader);
        
        // Create the card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        // Create the question title
        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = questionText;
        cardBody.appendChild(cardTitle);

        // Create and add image
        console.log("\n path:" +imagepath)
        if(imagepath){
            // Create a new img element
            let newImage = document.createElement('img');
            newImage.style.width = "120px"
            newImage.style.height = "120px"
            newImage.style.marginLeft = "35%"
            // Set the src attribute of the img element
            newImage.src = imagepath;
            let hr = document.createElement("hr")
            cardBody.appendChild(newImage);
            cardBody.appendChild(hr);
        }
        // Create the options (checkboxes)
        options.forEach((optionText, index) => {
            const optionContainer = document.createElement('div');
      
            const checkbox = document.createElement('input');
            checkbox.className = 'chkuseroption';
            checkbox.setAttribute("data-parent", questionNumber);
            checkbox.setAttribute("data-userchoice", index);

            if(index +1 === answer){
                checkbox.setAttribute("data-isanswer", "yes");
            }else{
                checkbox.setAttribute("data-isanswer", "no");
            }

            checkbox.type = 'checkbox';
            checkbox.id = `option${questionNumber}_${index}`;
            checkbox.name = `question${questionNumber}`;
            
            const label = document.createElement('label');
            label.className = 'questioncheckbox';
            label.setAttribute("data-parent", questionNumber);
            label.setAttribute("data-userchoice", index);
            if(index +1 === answer){
                label.setAttribute("data-isanswer", "yes");
            }else{
                label.setAttribute("data-isanswer", "no");
            }
            label.htmlFor = checkbox.id;
            label.textContent = optionText;
            
            // add img 
            
            optionContainer.appendChild(checkbox);
            optionContainer.appendChild(label);
            cardBody.appendChild(optionContainer);
        });
        
        
        // Append the card body to the card
        card.appendChild(cardBody);
        
        // Append the card to the container
        document.getElementById('questionsboard').appendChild(card);
    }



function updateObjectInArray(array, newObject) {
    let exists = false;

    // Use map to iterate and replace the object if it exists
    const updatedArray = array.map(obj => {
        if (obj.id === newObject.id) {
            exists = true;
            return newObject; // Replace the old object with the new one
        }
        return obj; // Keep the existing object if it's not the one to replace
    });

    // If the object did not exist, add the new one
    if (!exists) {
        updatedArray.push(newObject);
    }

    return updatedArray;
}

function calculatePercentageGrade(scoreObtained, totalScore) {
    if (totalScore === 0) {
        return 0;
    }
    
    const percentage = Math.ceil( (scoreObtained / totalScore) * 100);
    return percentage.toFixed(2) + '%';
}

function showgrade(){
     document.getElementById("timer").textContent = "Time's up!";
     btnsubmitquiz.style.display = "none"
     document.getElementById("timerdashboard").style.display = "none"
    console.log(usersoption)
    changecolor_correctanswer()

    // higlight wrong answers and show the grade
   for(let i=0;i< usersoption.length;i++){
    let questionnumber = usersoption[i].id
    let usranswer = usersoption[i].name
    let userselected = usersoption[i].userselected
    console.log(usranswer)
    if(usranswer === "yes"){
        totalcorrects++
    }else{
        wronganswers.push(questionnumber)
        changecolor_wronganswer(questionnumber, userselected)
    }
   }
    resulttxt = document.getElementById("resultofquiz")
    resulttxt.style.display = "block"
    let percentage = calculatePercentageGrade(totalcorrects, totalquestions)
    resulttxt.innerText = "Total correct answers: " + totalcorrects + "/"+ totalquestions + " (" + percentage + ")" 

}

function changecolor_wronganswer(parentID, userchoice){
    let checkoptions = document.querySelectorAll(".questioncheckbox")
    console.log(checkoptions)
    for(var k=0;k< checkoptions.length;k++){
    var curentuserchoice = checkoptions[k].getAttribute("data-userchoice");
       var currentparentid = checkoptions[k].getAttribute("data-parent");
       if(currentparentid === parentID && curentuserchoice=== userchoice){
           checkoptions[k].style.backgroundColor = "red"
           checkoptions[k].style.color = "white"
       }
    }
}


function changecolor_correctanswer(){
    let checkoptions = document.querySelectorAll(".questioncheckbox")
    console.log(checkoptions)
    for(var k=0;k< checkoptions.length;k++){
    var correctChoicePostion = checkoptions[k].getAttribute("data-isanswer");
       if(correctChoicePostion === "yes"){
           checkoptions[k].style.backgroundColor = "green"
           checkoptions[k].style.color = "white"
       }
    }
}

function lockAllControl(){
    let checkoptions = document.querySelectorAll(".questioncheckbox")
    console.log(checkoptions)
    // lock all checkbox
    for(var k=0;k< checkoptions.length;k++){
        checkoptions[k].disabled = true;
    }
}




function uncheckotheroptions(parentID, userchoice){
 let checkoptions = document.querySelectorAll(".chkuseroption")
 console.log(checkoptions)
 for(var k=0;k< checkoptions.length;k++){
 var curentuserchoice = checkoptions[k].getAttribute("data-userchoice");
    var currentparentid = checkoptions[k].getAttribute("data-parent");
    if(currentparentid === parentID && curentuserchoice!== userchoice){
        checkoptions[k].checked = false;
    }
 }
}

function higlight_leftboardbutton(numbersaved){
    let leftbtns = document.querySelectorAll(".btnfixed")
    console.log(leftbtns)
    for(var k=0;k< leftbtns.length;k++){
    var questionnumber = leftbtns[k].innerText
       if(questionnumber === numbersaved){
        // Access the parent element
        leftbtns[k].style.backgroundColor = "green"
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Enables smooth scrolling
    });
}

//catch event click checkbox
window.onclick = e => {
    let targetclassname = e.target.className
    console.log(targetclassname)
    //check if player is clicking any cell on the chessboard
    if(targetclassname === "chkuseroption"){
        let clickedpostion = e.target
        //change background color
        //clickedpostion.style.backgroundColor = "red"
        clickedpostion.style.backgroundColor = "green";
        clickedpostion.style.color = "white";
        //get the cell postion (row, column) of the target 
        let questionnumber = clickedpostion.getAttribute("data-parent");
        let isanswer = clickedpostion.getAttribute("data-isanswer");
        let userschecked = clickedpostion.getAttribute("data-userchoice");
        higlight_leftboardbutton(questionnumber)
        uncheckotheroptions(questionnumber, userschecked)
        if(isanswer){
            let userchoices = {id: questionnumber, name: isanswer, userselected:userschecked}
            usersoption = updateObjectInArray(usersoption, userchoices);
        }
    }else if( targetclassname === "btn btn-info mr-1 btnfixed"){
        let ismoved = false
        let btntarget = e.target
        let questionnumber = btntarget.innerText
        console.log(questionnumber)
        //locate the button 
        let checkoptions = document.querySelectorAll(".questioncheckbox")
    for(var k=0;k< checkoptions.length;k++){
    var correctChoicePostion = checkoptions[k].getAttribute("data-parent");
       if(correctChoicePostion === questionnumber && !ismoved){
           // Get the position of the element relative to the viewport
        const rect = checkoptions[k].getBoundingClientRect();
        const topPosition = (rect.top + window.pageYOffset) - 290;
        console.log(topPosition)
        // Scroll to the element's position
        window.scrollTo({
            top: topPosition, // Use rect.top for relative scrolling
            behavior: 'smooth' // Smooth scroll
        });
        ismoved = true
       }
    }
    }
}

//countdown function 
function countdowntime(){
    const timerInterval = setInterval(function() {
        countdown--;
    
        if(countdown > 0){
            if(countdown>=10){
                document.getElementById("timer").textContent = limitedtime + ":" + countdown;
            }else{
                document.getElementById("timer").textContent = limitedtime + ":0" + countdown;
            }
            
        }else{
            if(limitedtime >0){
                limitedtime--;
                if(countdown>=10){
                    document.getElementById("timer").textContent = limitedtime + ":" + countdown;
                }else{
                    document.getElementById("timer").textContent = limitedtime + ":0" + countdown;
                }
                countdown = 60
            }else{
                if(countdown >0){
                    limitedtime--;
                    if(countdown>=10){
                        document.getElementById("timer").textContent =  countdown;
                    }else{
                        document.getElementById("timer").textContent = "0" + countdown;
                    }
                    
                }else{
                    clearInterval(timerInterval);
                   
                    showgrade()

                }
            }
            
        }
    }, 1000);
}
