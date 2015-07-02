/*jslint browser:true, plusplus: true */
/*global $, jQuery, alert, console */

$(document).ready(function () {
    // Variable declarations
    var width, height, canvas, canvas2d,
        cWidth, dir, newDir, food, score, snake_array,
        newX, newY, i, j;
    canvas = $("#canvas")[0];
    canvas2d = canvas.getContext("2d");
    width = $("#canvas").width();
    height = $("#canvas").height();
    cWidth = 10; // cell width variable

    function create_food() {
        // set random coordinates for food initialization
        food = {
            x: Math.round(Math.random() * (width - cWidth) / cWidth),
            y: Math.round(Math.random() * (height - cWidth) / cWidth)
        };
    } // end function create food

    function create_snake() {
        var length = 4; // init length of snake array
        snake_array = [];
        for (i = length - 1; i >= 0; i--) {
            //create snake from top left area of canvas
            snake_array.push({
                x: i,
                y: 2
            });
        }
    } // end function create_snake()

    function start() {
        // set direction
        dir = "right";
        newDir = []; // new dir array
//        create_snake();
//        create_food();
        score = 0;

        // move snake using timer
        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 60);
    } // end function start()

    function paint_cell(x, y) {
        canvas2d.fillStyle = "#ff0001";
        canvas2d.fillRect(x * cWidth, y * cWidth, cWidth, cWidth);
        canvas2d.strokeStyle = "#FFFFFF";
        canvas2d.strokeRect(x * cWidth, y * cWidth, cWidth, cWidth);
    } // end function paint_cell(x,y)


    function check_collision(x, y, arr) {
        for (j = 0; j < arr.length; j++) {
            if (arr[j].x === x && arr[j].y === y)
                return true;
        }
        return false;
    } // end function check_collision(x,y,arr)

    function paint() {
        if (newDir.length) {
            dir = newDir.shift();
        }

        canvas2d.fillStyle = "#FFFFFF";
        canvas2d.fillRect(0, 0, width, height);
        canvas2d.strokeStyle = "#121212";
        canvas2d.strokeRect(0, 0, width, height);

        newX = snake_array[0].x;
        newY = snake_array[0].y;

        if (dir === "right") {
            newX++;
        } else if (dir === "left") {
            newX--;
        } else if (dir === "up") {
            newY--;
        } else if (dir === "down") {
            newY++;
        }

        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if (newX == -1 || newX == width / cWidth || newY == -1 || newY == height / cWidth || check_collision(newX, newY, snake_array)) {
            //restart game
            start();
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
        canvas2d.fillText(score_text, 5, height - 5);
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
    create_snake();
    create_food();
    start();
}); // END: document.ready
