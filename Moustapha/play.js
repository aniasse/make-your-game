function work(){
    function ResumeGame(){
        alert("RESUME")
        }
        function QuitGame(){
        alert("QUIT GAME")
        }
        let resume = document.getElementById("resume")
        let quit = document.getElementById("quit")
        resume.addEventListener('click', ResumeGame)
        quit.addEventListener("click", QuitGame)
}

document.addEventListener('DOMContentLoaded',work)
