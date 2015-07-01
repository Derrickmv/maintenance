/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var width = $("#canvas").width();
    var height = $("#canvas").height();

    //Lets save the cell width in a variable for easy control
    var cWidth = 10;
    var dir;
    var newDir;
    var food;
    var score;

    //Lets create the snake now
    var snake_array; //an array of cells to make up the snake

    //Lets create the food now
    function create_food() {
        food = {
            x: Math.round(Math.random() * (width - cWidth) / cWidth),
            y: Math.round(Math.random() * (height - cWidth) / cWidth),
        };
        //This will create a cell with x/y between 0-44
        //Because there are 45(450/10) positions accross the rows and columns
    }

    function create_snake() {
        var length = 5; //Length of the snake
        snake_array = []; //Empty array to start with
        for (var i = length - 1; i >= 0; i--) {
            //This will create a horizontal snake starting from the top left
            snake_array.push({
                x: i,
                y: 0
            });
        }
    }

    function init() {
        dir = "right"; //default direction
        newDir = [];
        create_snake();
        create_food(); //Now we can see the food particle
        //finally lets display the score
        score = 0;

        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 60);
    }

    //Lets first create a generic function to paint cells
    function paint_cell(x, y) {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * cWidth, y * cWidth, cWidth, cWidth);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cWidth, y * cWidth, cWidth, cWidth);
    }

    function check_collision(x, y, array) {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    //Lets paint the snake now
    function paint() {
        if (newDir.length) {
            dir = newDir.shift();
        }
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, width, height);

        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        var newX = snake_array[0].x;
        var newY = snake_array[0].y;
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if (dir == "right") {
            newX++;
        } else if (dir == "left") {
            newX--;
        } else if (dir == "up") {
            newY--;
        } else if (dir == "down") {
            newY++;
        }

        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if (newX == -1 || newX == width / cWidth || newY == -1 || newY == height / cWidth || check_collision(newX, newY, snake_array)) {
            //restart game
            init();
            //Lets organize the code a bit now.
            return;
        }

        //Lets write the code to make the snake eat the food
        //The logic is simple
        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if (newX === food.x && newY === food.y) {
            var tail = {
                x: newX,
                y: newY
            };
            score++;
            //Create new food
            create_food();
        } else {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = newX;
            tail.y = newY;
        }
        //The snake can now eat the food.

        snake_array.unshift(tail); //puts back the tail as the first cell

        for (var i = 0; i < snake_array.length; i++) {
            var cell = snake_array[i];
            //Lets paint 10px wide cells
            paint_cell(cell.x, cell.y);
        }

        //Lets paint the food
        paint_cell(food.x, food.y);
        //Lets paint the score
        var score_text = "Score: " + score;
        ctx.fillText(score_text, 5, height - 5);
    }

    //Lets add the keyboard controls now
    $(document).keydown(function (e) {
        var key = e.which;
        var td;
        if (newDir.length) {
            var td = newDir[newDir.length - 1];
        } else {
            td = dir;
        }
        //We will add another clause to prevent reverse gear
        if (key == "37" && td != "right") newDir.push("left");
        else if (key == "38" && td != "down") newDir.push("up");
        else if (key == "39" && td != "left") newDir.push("right");
        else if (key == "40" && td != "up") newDir.push("down");
        //The snake is now keyboard controllable
    });

    init();





});
