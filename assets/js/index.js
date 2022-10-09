const candyGrid = document.querySelector('.candy-grid')
const scoreElement = document.getElementById('score')
const numberOfSquareRow = 8;//squares per row
const squares = []
let score = 0
const candy = [
    "url(assets/img/blue-candy.png)",
    "url(assets/img/green-candy.png)",
    "url(assets/img/orange-candy.png)",
    "url(assets/img/purple-candy.png)",
    "url(assets/img/red-candy.png)",
    "url(assets/img/yellow-candy.png)"
]


console.log(candy)
function populateBoard() {
    for (let index = 0; index < numberOfSquareRow * numberOfSquareRow; index++) {
        const square = document.createElement('div');
        const randomCandy = Math.floor(Math.random() * candy.length)
        square.style.backgroundImage = candy[randomCandy]
        square.style.backgroundPosition = 'center, center'

        square.setAttribute('draggable', true)
        square.setAttribute('id', index)
        //attach each square to the candygrid 
        candyGrid.appendChild(square)
        //push square into squares array
        squares.push(square)

    }

}

populateBoard()

//this varaibles are declared so we can fetch the id and color of candy been dragged and dropped.
let candyBeingDragged;
let candyIdBeingDragged;
let candyBeingDropped;
let candyIdBeingDropped;


squares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
})

squares.forEach(square => {
    square.addEventListener('dragend', dragEnd)
})

squares.forEach(square => {
    square.addEventListener('dragover', dragOver)
})

squares.forEach(square => {
    square.addEventListener('dragenter', dragEnter)
})

squares.forEach(square => {
    square.addEventListener('dragleave', dragLeave)
})

squares.forEach(square => {
    square.addEventListener('drop', dragDrop)
})

function dragStart(event) {
    console.log(this.id, 'drag started')
    // this.classList.add('dragging')
    event.target.classList.add('dragging')

    candyBeingDragged = this.style.backgroundImage
    candyIdBeingDragged = +this.id
    // candyIdBeingDragged =parseInt(this.id)
}



function dragOver(event) {
    console.log(this.id, 'drag over')
    this.style.border = '1px solid black'
    event.preventDefault()  //allows drop to work as well as changed the cursor pointer.
}

function dragEnter(event) {
    console.log(this.id, 'drag entered')
    event.preventDefault()
}

function dragLeave(event) {
    console.log(this.id, 'drag left')
    this.style.border = 'none'
}

// Swap occured here.
function dragDrop(event) {
    console.log(this.id, 'dropped')
    this.style.border = 'none'


    candyBeingDropped = this.style.backgroundImage;
    candyIdBeingDropped = +this.id;
    // candyIdBeingDropped =parseInt(this.id)

    this.style.backgroundImage = candyBeingDragged

    squares[candyIdBeingDragged].style.backgroundImage = candyBeingDropped
}



function dragEnd(event) {
    console.log(this.id, 'drag ended')
    event.target.classList.remove('dragging')

    // dragend is where the movement occurs thus;
    const validMoves = [
        candyIdBeingDragged - 1, //left
        candyIdBeingDragged - numberOfSquareRow, //above
        candyIdBeingDragged + numberOfSquareRow, //below
        candyIdBeingDragged + 1, //right
    ];
    const isValidMove = validMoves.includes(candyIdBeingDropped);

    //run this at drag end.
    if (candyIdBeingDropped && isValidMove) {
        const isColumnOfFourMatched = checkColumnForFour();
        const isRowOfFourMatched = checkRowForFour();
        const isColumnOfThreeMatched = checkColumnForThree();
        const isRowOfThreeMatched = checkRowForThree();

        if (!isRowOfThreeMatched && !isColumnOfThreeMatched && !isColumnOfFourMatched && !isRowOfFourMatched) {
            //  return original state
            squares[candyIdBeingDropped].style.backgroundImage = candyBeingDropped;
            squares[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
        }
    } else if (candyBeingDropped && !isValidMove) {
        //Return to original satate
        squares[candyIdBeingDropped].style.backgroundImage = candyBeingDropped
        squares[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
    }


}

// function for row matches
function checkRowForThree() {
    for (let index = 0; index <= 61; index++) {
        //GETS THE FIRST THREE NUMBER IN A ROW
        const rowOfThree = [index, index + 1, index + 2];
        //stores the index backgroundImages
        const decidingCandy = squares[index].style.backgroundImage;
        //is the index box blank
        const isBlank = squares[index].style.backgroundImage === "";

        // shouldn't run when this number appears.
        const notValidAreas = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
        // skip  notvalidareas
        if (notValidAreas.includes(index)) {
            continue;
        }
        // if number 1,2,3 backgroundImage is strickly equal to decidingCandy backgroundImage and the decidingCandy  box/color is not blank
        if (rowOfThree.every((item) => squares[item].style.backgroundImage === decidingCandy && !isBlank)) {
            score += 3;
            scoreElement.textContent = score;
            // then make it blank
            rowOfThree.forEach((val) => (squares[val].style.backgroundImage = ""))
            return true;
        }
    }

    return false;
}



function checkColumnForThree() {
    for (let index = 0; index <= 47; index++) {

        const columnOfThree = [index, index + numberOfSquareRow, index + numberOfSquareRow * 2];

        const decidingCandy = squares[index].style.backgroundImage;

        const isBlank = squares[index].style.backgroundImage === "";


        // The every() method checks if all elements in an array pass a test (provided as a function).
        const isMatched = columnOfThree.every((item) => squares[item].style.backgroundImage === decidingCandy && !isBlank)
        if (isMatched) {
            score += 3;
            scoreElement.textContent = score;
            columnOfThree.forEach((val) => (squares[val].style.backgroundImage = ""))
            return true;
        }
    }
    return false;
}



function checkRowForFour() {
    for (let index = 0; index <= 60; index++) {
        //GETS THE FIRST THREE NUMBER IN THE ROW
        const rowOfFour = [index, index + 1, index + 2, index + 3];
        //stores the index background-color
        const decidingCandy = squares[index].style.backgroundImage;
        //is the index box blank
        const isBlank = squares[index].style.backgroundImage === "";

        // shouldn't run when this indices/number appears
        const notValidAreas = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
        // skip this  if not valid
        if (notValidAreas.includes(index)) {
            continue;
        }
        // if number 1,2,3 backgroundImage is strickly equal to decidingCandy backgroundImage and the decidingCandy  box/color is not blank
        const isMatched = rowOfFour.every((item) => squares[item].style.backgroundImage === decidingCandy && !isBlank)
        if (isMatched) {
            score += 4;
            scoreElement.textContent = score;
            rowOfFour.forEach((val) => (squares[val].style.backgroundImage = ""))
            return true;
        }
    }

    return false;
}

function checkColumnForFour() {
    for (let index = 0; index <= 39; index++) {

        const columnOfFour = [index, index + numberOfSquareRow, index + numberOfSquareRow * 2, index + numberOfSquareRow * 3];

        const decidingCandy = squares[index].style.backgroundImage;

        const isBlank = squares[index].style.backgroundImage === "";

        const isMatched = columnOfFour.every((item) => squares[item].style.backgroundImage === decidingCandy && !isBlank)
        if (isMatched) {
            score += 4;
            scoreElement.textContent = score;
            columnOfFour.forEach((val) => (squares[val].style.backgroundImage = ""))
            return true;
        }
    }
    return false;
}


function moveCandiesDown() {
    for (let index = 0; index <= 55; index++) {
        const isSquareBlankBelow = squares[index + numberOfSquareRow].style.backgroundImage === "";

        // populate first row with candies if blank
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        firstRow.forEach(val => {
            if (squares[val].style.backgroundImage === "") {
                const randomCandy = Math.floor(Math.random() * candy.length);
                squares[val].style.backgroundImage = candy[randomCandy]
            }
        })

        if (isSquareBlankBelow) {
            squares[index + numberOfSquareRow].style.backgroundImage = squares[index].style.backgroundImage;

            squares[index].style.backgroundImage = ""
        }
    }


}
setInterval(() => {
    moveCandiesDown();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
}, 100)







