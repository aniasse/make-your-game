function work(){
    function ResumeGame(){
        alert("RESUME")
    }
    function RestartGame(){
        alert ("RESTART")
    }
    function ExitFame(){
        alert("QUIT GAME")
    }
    /* let resume = document.getElementById("resume")
    let quit = document.getElementById("quit")
    resume.addEventListener('click', ResumeGame)
    quit.addEventListener("click", QuitGame) */
    const CONTINUE = document.getElementById("CONTINUE")
    const RESTART = document.getElementById("RESTART")
    const EXIT = document.getElementById("EXIT")
    CONTINUE.addEventListener("click", ResumeGame)
    RESTART.addEventListener("click", RestartGame)
    EXIT.addEventListener("click", ExitFame)


    
}

document.addEventListener('DOMContentLoaded',work)
