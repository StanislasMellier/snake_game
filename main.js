const canva = document.getElementById('game_canva')
const ctx = canva.getContext('2d')

const GAME_SIZE = 500
const GRID_SIZE = 20
const CELL_SIZE = GAME_SIZE / GRID_SIZE

canva.height = GAME_SIZE
canva.width = GAME_SIZE

let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }]
let snake_direction = { x: 1, y: 0 }
let apple = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
let game_state = 'RUNNING'
let score = 0

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft':
            snake_direction.x = -1
            snake_direction.y = 0
            break;
        case 'ArrowRight':
            snake_direction.x = 1
            snake_direction.y = 0
            break;
        case 'ArrowUp':
            snake_direction.x = 0
            snake_direction.y = -1
            break;
        case 'ArrowDown':
            snake_direction.x = 0
            snake_direction.y = 1
            break;
    }
})

function handle_restart(e) {
    if (e.code === 'Space') {
        snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }]
        snake_direction = { x: 1, y: 0 }
        apple = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
        game_state = 'RUNNING'
        score = 0

        window.removeEventListener('keydown', handle_restart)
    }
}

var fps = 10;
var last = 0;
var interval = 1000 / fps;
var delta = 0;
function animate(timestamp) {
    delta = timestamp - last
    if (delta > interval) {
        console.log(snake.length);
        switch (game_state) {
            case 'RUNNING':
                ctx.fillStyle = 'rgb(0,0,0)'
                ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE)

                ctx.fillStyle = 'rgb(255,0,0)'
                ctx.fillRect(CELL_SIZE * apple.x, CELL_SIZE * apple.y, CELL_SIZE, CELL_SIZE)

                let new_snake = []
                new_snake[0] = { x: snake[0].x + snake_direction.x, y: snake[0].y + snake_direction.y }
                if (new_snake[0].x >= GRID_SIZE || new_snake[0].x < 0 || new_snake[0].y >= GRID_SIZE || new_snake[0].y < 0) {
                    window.addEventListener('keydown', handle_restart)
                    game_state = 'LOST'
                }

                for (let i = 1; i < snake.length; i++) {


                    new_snake[i] = snake[i - 1]

                    if (new_snake[i].x === new_snake[0].x && new_snake[i].y === new_snake[0].y) {
                        window.addEventListener('keydown', handle_restart)
                        game_state = 'LOST'
                    }

                }

                if (new_snake[0].x === apple.x && new_snake[0].y === apple.y) {
                    new_snake[snake.length] = snake[snake.length - 1]
                    apple = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
                    score++
                }

                for (let i = 0; i < snake.length; i++) {
                    ctx.fillStyle = 'rgb(0,255,0)'
                    ctx.fillRect(CELL_SIZE * snake[i].x, CELL_SIZE * snake[i].y, CELL_SIZE, CELL_SIZE)
                }

                snake = new_snake
                break
            case 'LOST':
                ctx.fillStyle = 'rgb(150,0,0)'
                ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE)

                let font_size = GAME_SIZE / 15
                ctx.font = `bold ${font_size}px Arial`;
                ctx.fillStyle = 'rgb(255,255,255)'
                ctx.textAlign = 'center'
                ctx.fillText(`YOU LOST`, GAME_SIZE / 2, GAME_SIZE * 0.4)
                ctx.fillText(`YOUR SCORE : ${score}`, GAME_SIZE / 2, GAME_SIZE * 0.4 + font_size)
                ctx.fillText(`PRESS SPACE TO RESTART`, GAME_SIZE / 2, GAME_SIZE - 1 * font_size)
                break
        }

        last = timestamp - (delta % interval);
    }
    requestAnimationFrame(animate)
}
animate()