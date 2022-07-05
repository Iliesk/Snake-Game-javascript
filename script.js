window.onload = function()
{
    var canvasWidth = 900; // largeur de mon cadre
    var canvasHeight = 600; // hauteur de mon cadre
    var blockSize = 30;// taiille d'un carré de mon serpent
    var ctx;
    var delay = 100;// temps de regeneratrion 10eme de seconde = 1sec
    var snakee;
    var applee;
    var widthInblocks = canvasWidth/blockSize;
    var heightInbloks = canvasHeight/blockSize;
    var score;
    var timeout;
    
 
    init();
 
    function init()
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;// taille cadre
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray"; // bordure canvas
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        document.body.appendChild(canvas);
        canvas.style.backgroundColor = "#ddd";
        ctx = canvas.getContext('2d');// dessin canvas
        snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();// appel de la fonction 
    }
 
    function refreshCanvas()// la fonction 
    {
        console.log("refreshCanvas");
        snakee.advance();// on appel la fonction advance pour qu'il avance
        if(snakee.checkCollision())
        {
            gameOver();
        }
        else
        {
            if(snakee.isEatingApple(applee))
            {
                score++;
                snakee.ateApple = true;
                do
                {
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee))
                
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();// on appel la methode de snakee qui est draw
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);// execute telle fonction a partir de telle delais 
        }
     
       
    }
        
    function gameOver()
    {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centerY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX, centerY - 180);
        ctx.fillText("Game Over", centreX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyez sur la touche espace pour rejouer", centreX, centerY - 120);
        ctx.fillText("Appuyez sur la touche espace pour rejouer", centreX, centerY - 120);
        ctx.restore();
    }
        
    function restart()
    {
        snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    
    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth/2;
        var centerY = canvasHeight/2;
        ctx.fillText(score.toString(), centreX, centerY);
        ctx.restore(); 
    }
        
    function drawBlock(ctx, position)
    {
      var x = position[0] * blockSize;
      var y = position[1] * blockSize;
      ctx.fillRect(x ,y , blockSize, blockSize);// repli un rectange qui aura la h et la largeur de blockSize donc 30px
    }
 
    function snake(body,direction)// protocole du serpent
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()// permet de dessiner le corps du serpent
         {
            ctx.save();// sauvegarde le contenue comme il était avant 
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice();// permet de crée un nex elem en format copie
            switch(this.direction)// de base le serpent pars de la gauche vers la droite et du haut vers le bas 
            {
                case "left":
                     nextPosition[0] -= 1; // la ou il es moins 1 retour en arriere
                     break;
                case "right":
                     nextPosition[0] += 1; // avance vers l'avant de 1
                     break;
                case "down":
                     nextPosition[1] += 1; // decsend de 1
                     break;
                case "up":
                    nextPosition[1] -= 1; // rebrousse chemin de 1 il remonte de 1
                     break;
                default:
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);//permet de rajouter le ce qui est entre parenthese a la premiere place
            if(!this.ateApple)
                this.body.pop();// efface le dernier element
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection)// function setDirection a pour arg newDirection
      
        {
            var allowedDirections//direction permise
            switch(this.direction)
            {
                case "left": //si diection actuel son gauche ou droite 
                case "right":
                    allowedDirections = ["up","down"];// il n'y a que haut et bas qui met permis 
                    break;
                case "down": //si diection actuel son bas et haut
                case "up":
                    allowedDirections = ["left","right"];// il n'y a que gauche et droite qui met permis 
                    break;
                    default:
                        throw("invalid direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1)//si mon index de ma nvl direction  mes allowDirection est sup a -1 sa veut dire quel es permise  verifier si la nouvelle redection est permime on peut up down ou left right
            {
                this.direction = newDirection;// donc je veut la mettre en nouvelle direction 
            }
        };
        this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];// la tete c'est le 1er elem du corps
            var rest = this.body.slice(1);// tout le corps sauf la tete il passe la valeur 0 et met l'array dans la var rest
            var snakeX = head[0];// doit etre compris entre 0 et 19 (taille total de la grille 0-19)
            var snakeY = head[1];//doit etre compris entre 0 et 39
            var minX = 0;
            var minY = 0;
            var maxX = widthInblocks -1;
            var maxY = heightInbloks -1;
            var isNotBetweenHorizontalwalls = snakeX < minX || snakeX > maxX ;// a se moment la tete a depasser la val min ou max elle c prise a gauche ou a droit dans le mur 
            var isNotBetweenVerticalwalls  = snakeY < minY || snakeY > maxY;
 
            if(isNotBetweenHorizontalwalls || isNotBetweenVerticalwalls)
            {
                wallCollision = true;
            }
            for(var i = 0; i < rest.length ; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                } 
 
            }
                return wallCollision || snakeCollision;
            
        };
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1 ] === appleToEat.position[1])
            {  
                return true;
            }
                 
            else
                return false;
        };
    }
 
    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();// sert a enregister mes ancienne config
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;// x pour rayon de la pomme 
            var y = this.position[1]*blockSize + radius;// y pour rayon de la pomme
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
 
        };
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random() * (widthInblocks - 1));
            var newY = Math.round(Math.random() * (heightInbloks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(sankeToCheck)
        {
            var isOnSnake = false;
            
            for(var i =0 ; i < sankeToCheck.body.length; i++)
            {
                if(this.position[0] === sankeToCheck.body[i] [0] && this.position[1] === sankeToCheck.body[i] [1])
                    {
                        isOnSnake = true;
                    }
            }
            return isOnSnake;
        };
        
    }
    
    document.onkeydown = function handleKeyDown(e) 
     {
        var key = e.keyCode; // donne le code de la touche qui a été appuié
        var newDirection; // crea de la var d'une potentielle nouvelle direction
        switch(key) // direction au toucher fleche   
        {
                case 37: //
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break;
                case 40:
                    newDirection = "down";
                    break;
                case 32:
                    restart();
                    return;
                default:
                    return;
            }
            snakee.setDirection(newDirection);
        }
 
}










