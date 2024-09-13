import { breadthFirstSearch, create2DGrid } from './breadthFirstSearch.js'

// ! Not Permanent :)
const convertGridNum = (gridSize) => {
    if (gridSize === '10x10') {
        return 10
    } else if (gridSize === '8x8') {
        return 8
    } else if (gridSize === '5x5') {
        return 5
    } else if (gridSize === '7x7') {
        return 7
    }
}

let currentMode = 'end'; // Your holding block to place 

let startCoordinates;
let endCoordinates;
let wallCoordinates = [];

let animationInProgress = false;

/**
 * handle place, destroy behavior's
 * @param {*} event handles player behavior like destroying and placing blocks on a map or grid
 */
const handleGridItemClick = (event) => {
    // Players will be unable to place if the bfs illustration is on run
    if (animationInProgress) return;

    const gridItem = event.target;
    const row = gridItem.dataset.row;
    const column = gridItem.dataset.column;

    // ? Dont mind the floods of if else 💀👌
    if (currentMode === 'start') {
        const previousStart = document.querySelector('.start');
        if (previousStart) {
            previousStart.classList.remove('start');
           
            previousStart.classList.add('path');
        }

        gridItem.classList.add('start')
        gridItem.classList.remove('path')

        if (gridItem.classList.contains('end')) {
            gridItem.classList.remove('end')
            console.log('Removing end point coordinates')
            endCoordinates = null;
        }
        
        startCoordinates = [parseInt(row),parseInt(column)]

    } else if (currentMode === 'end') {
        const previousEnd = document.querySelector('.end')
        if (previousEnd) {
            previousEnd.classList.remove('end')

            previousEnd.classList.add('path')
        }

        gridItem.classList.add('end')
        gridItem.classList.remove('path')

        if (gridItem.classList.contains('start')) {
            gridItem.classList.remove('start')
            console.log('Removing starting point coordinates')
            startCoordinates = null;
        }
       
        endCoordinates = [parseInt(row),parseInt(column)]

    } else if (currentMode === 'wall') {
       // Check if the clicked grid item already has the .wall class
        if (gridItem.classList.contains('wall')) {
            
            gridItem.classList.remove('wall');
            gridItem.classList.add('path'); // Turn it back to a path to make an effect of destroying a block ^-^

            // Remove the wall coordinates from wallCoordinates array
            wallCoordinates = wallCoordinates.filter(coord => !(coord[0] === parseInt(row) && coord[1] === parseInt(column)));
        } else {
            // Add a wall if it's currently a path and exhange for a wall
            gridItem.classList.add('wall');
            gridItem.classList.remove('path'); 
            
            // Add the new wall coordinates to wallCoordinates array
            wallCoordinates.push([parseInt(row), parseInt(column)]);
        }
    }
}


//Creates a grid from the main menu dropdown options and loads the data again from it
const gridSize = convertGridNum(localStorage.getItem('gridSize'));
const gridSizeTextDisplay = document.getElementById('grid-size-text')

gridSizeTextDisplay.textContent = `${gridSize}x${gridSize}`;

const gridContainer = document.querySelector('.grid-container')

gridContainer.innerHTML = '';

gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.classList.add('path');
        gridItem.dataset.row = row;
        gridItem.dataset.column = column;

        gridItem.addEventListener('click',handleGridItemClick)
        gridContainer.appendChild(gridItem);
    }
}


document.querySelector('#start-btn').addEventListener('click', () => {
    currentMode = 'start';
});

document.querySelector('#end-btn').addEventListener('click', () => {
    currentMode = 'end';
});

document.querySelector('#wall-btn').addEventListener('click', () => {
    currentMode = 'wall';
});


/**
 * !Fixing error of this func
 */
const removePreviousTrails = () => {
    const trails = document.querySelectorAll('trail')

    trails.forEach(trail => {
        trail.classList.remove('trail')
        trail.classList.add('path')
    })
}

const count = document.getElementById('step-count')

document.querySelector('#letsgo').addEventListener('click', () => {
    animationInProgress = true

    let stepCount = 1;

    //removePreviousTrails()
    try {
        let grid2DCreated = create2DGrid(gridSize, startCoordinates, endCoordinates, wallCoordinates, '🟡','🟠');

        const shortestPath = breadthFirstSearch(grid2DCreated)

        let delay = 300

        
        if (!shortestPath || (startCoordinates === endCoordinates)) {
            animationInProgress = false
            console.log('Bruh no path find :<')
            return
        }
    
        shortestPath.forEach((pathCoordinates, index) => {
            
            
            

            // Skip the first step to avoid duplications of the head
            if (index === 0) {
                return;
            }
    
            setTimeout(() => {
                let currentGridCell = document.querySelector(`[data-row='${pathCoordinates[0]}'][data-column='${pathCoordinates[1]}']`);
                stepCount++
                count.textContent = stepCount
                // this will act as a trail
                let previousGridCell = shortestPath[index - 1];
    
                let previousGridCellCoordinates = document.querySelector(`[data-row='${previousGridCell[0]}'][data-column='${previousGridCell[1]}']`);
    
                previousGridCellCoordinates.classList.remove('start');
                previousGridCellCoordinates.classList.remove('path')
                previousGridCellCoordinates.classList.add('trail')
    
                currentGridCell.classList.add('start');
    
                //Last step 
                if (pathCoordinates[0] === endCoordinates[0] && pathCoordinates[1] === endCoordinates[1]) {
                    currentGridCell.classList.remove('end')
                    animationInProgress = false
                    console.log(animationInProgress)
                    startCoordinates = pathCoordinates;
                }
            },index * delay)
        })
        console.log(animationInProgress, startCoordinates, endCoordinates)
    } catch(e) {
        animationInProgress = false
        console.log('Bruh no path find :<')
        return
    }    
})

/**
 * TODO:
 * !Fix nested if else
 * !Seperate long syntax into smaller functions to avoid long function()
 */





