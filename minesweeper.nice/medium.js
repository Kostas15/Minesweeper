document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    var seconds = 0;
    const modal_containerL = document.getElementById('modal-containerL');
    const modal_containerW = document.getElementById('modal-containerW');

    //create Board
    function createBoard() {
      flagsLeft.innerHTML = bombAmount;
  
      //get shuffled game array with random bombs
      const bombsArray = Array(bombAmount).fill('bomb');
      const emptyArray = Array(width*width - bombAmount).fill('valid');
      const gameArray = emptyArray.concat(bombsArray);
      const radomArray = gameArray.sort(() => Math.random() -0.5);
  
      for(let i = 0; i < width*width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(radomArray[i]);
        grid.appendChild(square);
        squares.push(square);
  
        //normal click
        square.addEventListener('click', function(e) {
          click(square);
        })
  
        //right click
        square.oncontextmenu = function(e) {
          e.preventDefault();
          addFlag(square);
        }
      }
  
      //add numbers
      for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width -1);
  
        if (squares[i].classList.contains('valid')) {
          if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++; //check for the left square
          if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++; //check for the top right square
          if (i >= 10 && squares[i -width].classList.contains('bomb')) total ++; //check for the top square
          if (i >= 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++;  //check for the top left square
          if (i <= 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++;  //check for the right square
          if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++;  //check for the bottom left square
          if (i <= 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++;  //check for the bottom right square
          if (i <= 89 && squares[i +width].classList.contains('bomb')) total ++; //check for the bottom square
          squares[i].setAttribute('data', total);
        }
      }


    }
  
    createBoard()
  
    //add Flag with right click
    function addFlag(square) {
      if (isGameOver) return;
      if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
          square.classList.add('flag');
          square.innerHTML = ' 🚩';
          flags ++;
          flagsLeft.innerHTML = bombAmount- flags;
          checkForWin();
        } else {
          square.classList.remove('flag');
          square.innerHTML = '';
          flags --;
          flagsLeft.innerHTML = bombAmount- flags;
        }
      }
    }
  
    //click on square actions
    function click(square) {
      let currentId = square.id;

      if (isGameOver) return;
      if (square.classList.contains('checked') || square.classList.contains('flag')) return;
      if (square.classList.contains('bomb')) {
        gameOver(square);
      } else {
        let total = square.getAttribute('data');
        if (total != 0) {
          square.classList.add('checked');
          if (total == 1) square.classList.add('one');
          if (total == 2) square.classList.add('two');
          if (total == 3) square.classList.add('three');
          if (total == 4) square.classList.add('four');
          if (total == 5) square.classList.add('five');
          if (total == 6) square.classList.add('six');
          square.innerHTML = total;
          return;
        }
        checkSquare(square, currentId);
      }
      square.classList.add('checked');
    }
  
  
    //check neighboring squares once square is clicked
    function checkSquare(square, currentId) {
      const isLeftEdge = (currentId % width === 0);
      const isRightEdge = (currentId % width === width -1);
  
      //check all the neighbours squares
      setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) { //left square
          const newId = squares[parseInt(currentId) -1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) { //top right square
          const newId = squares[parseInt(currentId) +1 -width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 10) { //top square
          const newId = squares[parseInt(currentId -width)].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 11 && !isLeftEdge) { //top left square
          const newId = squares[parseInt(currentId) -1 -width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 98 && !isRightEdge) { //right square
          const newId = squares[parseInt(currentId) +1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 90 && !isLeftEdge) { //left bottom square
          const newId = squares[parseInt(currentId) -1 +width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId <= 88 && !isRightEdge) { //right bottom square
          const newId = squares[parseInt(currentId) +1 +width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId <= 89) { //bottom square
          const newId = squares[parseInt(currentId) +width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
      }, 10);
    }
  
    //game over
    function gameOver(square) {
      Intro();
      modal_containerL.classList.add('show');
      isGameOver = true;
  
      //show ALL the bombs
      squares.forEach(square => {
        if (square.classList.contains('bomb')) {
          square.innerHTML = '💣';
          square.classList.remove('bomb');
          square.classList.add('checked'); //so that the backgroundcolor changes as valid
        }
      });
    }
  
    //check for win
    function checkForWin() {
    //simplified win argument
    let matches = 0;
  
      for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
          matches ++;
        }
        if (matches === bombAmount) {
          WinEffect();
          modal_containerW.classList.add('show');
          isGameOver = true;
        }
      }
      
    }

    function Intro(){
      var audio = new Audio("file:///C:/Users/kosta/OneDrive/Υπολογιστής/HTML/minesweeper.nice/Music/introMusic.wav");
      audio.play();
    }
    function WinEffect(){
      var audio = new Audio("file:///C:/Users/kosta/OneDrive/Υπολογιστής/HTML/minesweeper.nice/Music/winSound.mp3");
      audio.play();
    }
    
    var x = setInterval(function(){
      document.getElementById("timer").innerHTML = "Time: "+seconds;
      seconds += 1;
        if(isGameOver==true){
        seconds=seconds;
        }
    }, 1000);

    

  });

  