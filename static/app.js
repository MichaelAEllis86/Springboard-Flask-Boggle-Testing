// alert("js is running")

//TODO ADD timer for game restricting length of game to 60 seconds and disabling guesses past 60 seconds
// Timer is added and linked to a start button, for disabling guesses we should just code to the seconds being at zero

//TODO ADD a check that an existing word has not already been used
// Done



const $guessForm=$('#guessform')
const $guessFormInput=$('#guessforminput')
const $guessbutton=$("#guessbutton")

const $ulMessageContainer=$("#messagecontainer")
const $ulScoreContainer=$('#scorecontainer')
const $liMessages=$(".message")

const $startButton=$("#startbutton")
const $timerContainer=$('#timercontainer')


//event listener to get form to grab input value

let score=0

const guessedWords=[]

let intervalID;

let seconds=10

//Displays the timer in DOM
function showTimer(){
    $timerContainer.empty()
    $timerContainer.append(`<li class="timer"> ${seconds} seconds remain  </li>`)
}

//handles decrem of seconds, runs timer in the DOM, handles DOM events tied to seconds running out/gameover
async function tickVersion2(){
    seconds-=1
    showTimer();
    if (seconds===0) {
        clearInterval(intervalID)
        gameOver()
    }
}
//Runs all associated game timers and dom events as a package with tickV2,showTimer,and 
function runTimer(){
    intervalID=setInterval(tickVersion2,1000)
}

//handles gameOver DOM Events
function gameOver(){
    $guessForm.remove()
    $timerContainer.empty()
    $ulMessageContainer.append("<li class='invalidmessage'>Game Over! You're Amazing! </li>")
    
}

function displayValidWordMessage(pointValue){
    $ulMessageContainer.empty()
    $ulMessageContainer.append(`<li class="validmessage">your word is valid and is worth ${pointValue} points </li>`)
}

function displayDuplicateWordMessage(){
    $ulMessageContainer.empty()
    $ulMessageContainer.append('<li class="invalidmessage">your word has already been used}</li>')
}

function displayInvalidWordMessage(result){
    $ulMessageContainer.empty()
    $ulMessageContainer.append(`<li class="invalidmessage">your message is invalid error= ${result}</li>`)
}

function displayScore(){
    $ulScoreContainer.empty()
    $ulScoreContainer.append(`<li id="score">Current Score:${score}</li>`)
}

$('#guessform').on('submit',function (evt){
    evt.preventDefault();
    const word=$('#guessforminput').val()
    console.log('clicked',"the evt listener is working", "inside evt listener")
    console.log(".....................................")
    console.log("this is what word the form will send....",`the word is... ${word}`)
    $guessFormInput.val("")
    console.log(".....................................")
    checkGuess(word)
    console.log(checkGuess(word)) 
})

$startButton.on("click", function(evt){
    evt.preventDefault();
    console.log('clicked',"the evt listener is working", "inside evt listener")
    runTimer()
    $startButton.remove()
})


async function checkGuess(word){
    //getting the response from the server
    const response= await axios.get("/check", {params: {"word":word}})
    // console.log("you are now inside of checkGuess")
    // console.log(".....................................")
    // console.log("printing the response...", response)
    // console.log(".....................................")
    // console.log("printing response.data...", response.data)
    // console.log(".....................................")
    const result=response.data.result
    // console.log("printing response.data.result...",response.data.result)
    // console.log(".....................................")
    // console.log("printing result variable...",result)
    //using the response to dictate score and validity
    const pointValue=word.length
    if(result==="ok" && guessedWords.indexOf(word)===-1){
        score+=pointValue
        console.log(" Valid word! Now printing the updated score....",`your score is... ${score}`)
        displayValidWordMessage(pointValue)
        displayScore()
        guessedWords.push(word)
    }
    // else if(result==="ok" && guessedWords.indexOf(word)!==-1){
    //     console.log('duplicate word')
    //     return
    // }
    else if(result==="not-on-board"){
        console.log("word not on board")
        displayInvalidWordMessage(result)
    }
    else if(result==="not-word"){
        console.log('not a word')
        displayInvalidWordMessage(result)
    }
    else{
        console.log("duplicate word")
        return
    }

}

async function sendPlayerData(){
    const response=await axios.post('/playerdata',{score:`${score}`})
    console.log(response)
    if (response.data.brokeRecord){
        $ulScoreContainer.append(`<li id="record">Current Score:${score} is the new highscore</li>`)
    }
}

    // console.log(result)

//form data to reference

// {/* <form id="guessform" action="/check" method=" GET, POST">
// <input type="text" id="guessforminput" placeholder="type a guess here" name="guess">
// <button>Submit guess!</button>
// </form> */}


// async function appendGiphySearch(search){
//     const apiKey='api_key=AWBZs1dP8ZgYEkvyf7Oku6ehe6aKit83'
//     const response= await axios.get (`https://api.giphy.com/v1/gifs/search?api_key=AWBZs1dP8ZgYEkvyf7Oku6ehe6aKit83&q=${search}&limit=1&offset=0&rating=g&lang=en`)
//     console.log(response)
//     const gifURL=response.data.data[0].images.original.url //what a horrendously long address to find!7 layers nested
//     console.log(gifURL)
//     let newGIF=document.createElement('img')
//     newGIF.src=gifURL
//     let imageDiv=document.getElementById('imagediv')
//     imageDiv.append(newGIF)
//     }
