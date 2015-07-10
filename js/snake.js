/*jslint browser:true, plusplus: true */
/*global $, jQuery, alert, console, game_loop, paint */

$(document).ready(function () {
    // Variable declarations
    var width, height, canvas, canvas2d,
        cWidth, dir, newDir, food, score, snake_array,
        newX, newY, i, j, isGameOver = false, score_text,
        tail, paused = false, rWall, botWall;
    canvas = $("#canvas")[0];
    canvas2d = canvas.getContext("2d");
    width = $("#canvas").width();
    height = $("#canvas").height();
    cWidth = 10; // cell width variable
    rWall = width / cWidth;
    botWall = height / cWidth;

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

    function game_over() {
        console.log("inGameOver func");
        canvas2d.fillStyle = "#141414";
        canvas2d.fillRect(0, 0, width, height);
        canvas2d.fillStyle = "#FFF";
        canvas2d.fillText("Game Over", 50, height - 50);
        return false;
    } // END: game_over() func

    function paint() {
        console.log("in paint func");
        if (newDir.length) {
            dir = newDir.shift();
        }

        canvas2d.fillStyle = "#FFFFFF";
        canvas2d.fillRect(0, 0, width, height);

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
//        if (newX === -1 || newX === width / cWidth || newY === -1 || newY === height / cWidth || check_collision(newX, newY, snake_array)) {
//            //restart game
//            isGameOver = true;
//            game_over();
//            return;
//        }
       if (newX === -1 || newX === rWall || newY === -1 || newY === botWall) {
           alert("passed wall");
           console.log("hit wall");
           /// wrap around to the opposite side of the wall.
       }
        if (check_collision(newX,newY,snake_array)) {
            game_over();
            return false;
        }

        //Lets write the code to make the snake eat the food
        //The logic is simple
        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if (newX === food.x && newY === food.y) {
            tail = {
                x: newX,
                y: newY
            };
            score++;
            //Create new food
            create_food();
        } else {
            tail = snake_array.pop(); //pops out the last cell
            tail.x = newX;
            tail.y = newY;
        }
        //The snake can now eat the food.

        snake_array.unshift(tail); //puts back the tail as the first cell

        for (i = 0; i < snake_array.length; i++) {
            var cell = snake_array[i];
            //Lets paint 10px wide cells
            paint_cell(cell.x, cell.y);
        }

        //Lets paint the food
        paint_cell(food.x, food.y);
        //Lets paint the score
        score_text = "Score: " + score;
        canvas2d.fillText(score_text, 5, height - 5);
    } // END: paint() func

    function start() {
        // set direction
        dir = "right";
        newDir = []; // new dir array
        create_snake();
        create_food();
        score = 0;

        // move snake using timer
        if (typeof game_loop != "undefined") {
            clearInterval(game_loop);
        }
        game_loop = window.setInterval(paint, 65);
        $("#startGame").html("Restart");
    } // end function start()

    function paint_cell(x, y) {
        canvas2d.fillStyle = "#ff0001";
        canvas2d.fillRect(x * cWidth, y * cWidth, cWidth, cWidth);
        canvas2d.strokeStyle = "#FFFFFF";
        canvas2d.strokeRect(x * cWidth, y * cWidth, cWidth, cWidth);
    } // end function paint_cell(x,y)


    function check_collision(x, y, arr) {
        for (j = 0; j < arr.length; j++) {
            if (arr[j].x === x && arr[j].y === y) {
                return true;
            }
        }
        return false;
    } // end function check_collision(x,y,arr)


    //Lets add the keyboard controls now
    $(document).keydown(function (e) {
        var key = e.which, td;
        if (newDir.length) {
            td = newDir[newDir.length - 1];
        } else {
            td = dir;
        }
        //We will add another clause to prevent reverse gear
        if (key == "37" && td !== "right") {
            newDir.push("left");
        } else if (key == "38" && td !== "down") {
            newDir.push("up");
        } else if (key == "39" && td !== "left") {
            newDir.push("right");
        } else if (key == "40" && td !== "up") {
            newDir.push("down");
        }
        // console output on keydown
        console.log("key pushed = " + dir);
    });


    // Clicking #startGame will execute start func
    $("#startGame").on("click", start);
    // Will add a Pause button to pause the game
        // Once paused, button will be replaced by a Resume button
        // Resume will continue where player left off
        // Once Resume is clicked, button will change back to the initial Pause button
    $("#PauseResume").on("click", function () {
        if (!paused) {
            window.clearInterval(game_loop);
            paused = true;
            $("#PauseResume").html("Resume");
            canvas2d.fillStyle = "rgba(0, 0, 0, .8)";
            canvas2d.fillRect(0, 0, width, height);

        } else if (paused) {
            window.clearInterval(game_loop);
            game_loop = window.setInterval(paint, 65);
            paused = false;
            $("#PauseResume").html("Pause");
        }
    });

}); // END: document.ready
