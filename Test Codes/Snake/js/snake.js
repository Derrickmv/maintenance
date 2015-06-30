$(document).ready(function(){
      //Canvas init
      var canvas = $("#canvas")[0];
      var ctx = canvas.getContext("2d");
      var width = $("#canvas").width();
      var height = $("#canvas").height();

      //Save cell width in variable for easy control
      var cw = 10;
      var d;
      var food;
      var score;

      //Create Snake Array
      var snake_array; // array of cells make up the snake

      create_snake();
      //function to create snake
      function create_snake()
      {
            var length = 4; // Length of snake at start
            snake_array = []; // start with empty snake array

            for(var i = length - 1; i >= 0; i--)
            {
                  snake_array.push({x:i,y:0});
            }
      }

      // paint the snake onto canvas
      function paint()
      {
            //movement code for snake
            //pop out tail cell and place it in front of head cell

            for(var i=0;i<snake_array.length; i++)
            {
                  var snake = snake_array[i];

                  //paint 10px wide cells
                  ctx.fillStyle = '#ff0001';
                  ctx.fillRect(snake.x*cw,snake.y*cw,cw,cw);
                  ctx.strokeStyle="white";
                  ctx.strokeRect(snake.x*cw,snake.y*cw,cw,cw);
            }
      }
      // Move snake using timer

      paint();

})
