
/**
 * Create a 2 Diemensional Array that will serve as the map or Maze
 * for Breadth first Search Algorithm
 * @param {number} gridSize - Size scale of the grid gridSize x gridSize
 * @param {Array} wallCoordinates Coordinates of each Walls must be represented in Numbers
 * @param {string} path You can put an Emoji for a Path
 * @param {string} wall You can put an Emoji for a Wall
 * @returns 
 */
export const create2DGrid = (gridSize,startCoordinates, endCoordinates, wallCoordinates, pathSymbol = 0, wallSymbol = 1) => {
    // Without Walls
    const grid = Array.from({length: gridSize},() => Array(gridSize).fill(pathSymbol));

    // With Walls And Starting Position and Ending Postion on the map
    grid[startCoordinates[0]][startCoordinates[1]] = '🔴';
    grid[endCoordinates[0]][endCoordinates[1]] = '🟢';

    for (let [x,y] of wallCoordinates) {
        grid[x][y] = wallSymbol;
    }

    return {
        gridMap: grid,
        path: pathSymbol,
        wall: wallSymbol,
        start: startCoordinates,
        end: endCoordinates
    };
}

/**
 * set ` create2DGrid ` as a argument
 * @param {*} grid A Map that contains paths or either walls
 * @returns 
 */
export const breadthFirstSearch = (grid) => {
    let queue = [grid.start];

    // Movementss
    let directions = [
        [-1, 0], // Up
        [1,0], // Down
        [0,-1], // Left
        [0,1] // Right
    ]

    let gridRows = grid.gridMap.length;
    let gridColumns = grid.gridMap[0].length;
    const gridEndSymbol = grid.gridMap[grid.end[0]][grid.end[1]];

    //Grid map dummies for Flood filling algorithm
    // trying to avoid quadratic approach on filling new arrays , same approach on tabular form too on levenshtein
    let visited = Array.from({length: gridRows}, () => Array(gridColumns).fill(false))
    let previous = Array.from({length: gridRows}, () => Array(gridColumns).fill(null))
    
    visited[grid.start[0]][grid.start[1]] = true;

    // same approach on tims YT, binary queue and dequeue representation
    // Time complexity: Quadratic?
    while (queue.length !== 0) {
        let [x,y] = queue.shift();

        if (x === grid.end[0] && y === grid.end[1]) {
            return reconstructPath(previous, grid);
        }

        //FloodFillingss but the coordinates of flood fills will be on previous array 
        for (let [dx,dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;

          
            /** 
             * Checks the following:
             * if out of bounds or not out of the map, 
             * checks the node if its not visited
             */
            if (newX >= 0 && newX < gridRows && 
                newY >= 0 && newY < gridColumns && 
                (grid.gridMap[newX][newY] === grid.path || grid.gridMap[newX][newY] === gridEndSymbol) &&
                 !visited[newX][newY]) {
                
                visited[newX][newY] = true;
                previous[newX][newY] = [x,y];
                queue.push([newX,newY]);
            }   
        }
    }
    return null;
}

/**
 * 
 * @param {*} previous grid contains the coordinates of visited paths
 * @param {*} grid 
 * @returns 
 */
const reconstructPath = (previous, grid) => {
    let path = []
    let current = grid.end

    // This was btw explanation on grid size 5
    // First push is [4,4] since its the end then loop through prev -> [3,4] push -> [2,4] push -> [2,3] push -> [2,2] push -> [2,1] push -> [2,0] push -> [1,0] push -> [0,0] push -> break
    // Break since it reaches the start, then we will reverse the array so the first index will be the startCoordinates
    while (current) {
        path.push(current)

        if (current[0] === grid.start[0] && current[1] === grid.start[1]) break;
        current = previous[current[0]][current[1]];
    }

    return path.reverse()
}

// if (require.main === module) {
//     const gridSize = 5;
//     const wallCoordinates = [
//         [1,1],[1,2],
//         [3,0],[3,1],
//         [3,2],[3,4],
//     ];

//     const path = '🌝';
//     const wall = '🏔️';
//     const start = [0,0];
//     const end = [4,4];

//     let grid = create2DGrid(gridSize, start, end, wallCoordinates, path, wall);

//     let shortestPath = breadthFirstSearch(grid);
//     console.log(shortestPath)
// }

/** Breadth first Search Algorithm
 *  ? Reference:
 *  * https://youtu.be/KiCBXu4P-2Y?si=E1sOWwOI5hwQyntH - BFS with pseudocodes on graphs
 *  * https://youtu.be/hettiSrJjM4?si=sdcxcIbLfv8R6hGC - understanding BFS
 *  * https://youtu.be/oDqjPvD54Ss?si=DaaL9QfgEwWGK_9a - reconstructPath function
 *  * https://www.geeksforgeeks.org/shortest-path-in-grid-with-obstacles/
 *  * Levenshtein Algorithm Tabular Form analgor
 */