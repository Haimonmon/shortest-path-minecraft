const { breadthFirstSearch, create2DGrid } = require('./breadthFirstSearch')

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Display how it finds the path through animation
 * @param {*} shortestPathCoordinates Coordinates of the Path through start to finish using ` breadthFirstSearch `
 * @param {*} grid grid map using ` create2DGrid `
 */
const illustrateGridShortestPath = async (shortestPathCoordinates, grid) => {
    console.clear()
    let map = grid.gridMap;
    let stepCount = 0;

    if (!shortestPathCoordinates) {
        console.log('No Path Find')
        await displayGrid(map)
        return 
    }

    const gridStartSymbol = map[grid.start[0]][grid.start[1]];
    const gridEndSymbol = map[grid.end[0]][grid.end[1]];

    for ( [x,y] of shortestPathCoordinates) {
        if (map[x][y] === gridStartSymbol || map[x][y] === gridEndSymbol) continue;
        stepCount++;
        await displayGrid(map,stepCount)
        map[x][y] = '🟣'
        
    }
    await displayGrid(map,stepCount)
}

/**
 * This will display the 2d grid without brackets and single qoutes on each paths, walls or any inside of the grid
 * @param {*} map 
 */
const displayGrid = async (map,stepCount) => {
    map.forEach(row => {
        console.log(row.join('  '))
    });
    await delay(100)
    console.clear()
    console.log(`Steps: ${stepCount}`)
}

if (require.main === module) {

    const gridSize = 10;
    const wallCoordinates = [
        [9,4],[8,4],
        [7,4],[6,4],
        [5,4],[4,4],
        [4,5],[5,0],
        [5,1],[5,2],
        [7,1],[7,2],
        [7,3],[3,3],
        [2,2],[1,1],
        [5,7],[7,7],
        [8,7],[9,7],
        [6,6],[5,8],
        [8,9],[4,8],
        [3,8],[2,8],
        [1,8],[0,5],
        [1,5],[2,5],
        [1,6]
    ];

    const path = '🟡';
    const wall = '🟠';
    const start = [9,3];
    const end = [9,9];

    const grid = create2DGrid(gridSize, start, end, wallCoordinates, path, wall);

    const shortestPath = breadthFirstSearch(grid)

    const illustration = illustrateGridShortestPath(shortestPath, grid)
}

// this is for Terminal only, it will result to an error if it run because of imports in the bfs.js file

