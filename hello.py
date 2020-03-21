from flask import Flask, render_template,jsonify,request,abort
from flask_cors import CORS
import numpy

app=Flask(__name__)
CORS(app)

BOARD_SIZE_X = 7
BOARD_SIZE_Y = 6
SEARCH_DEPTH = 4

COMPUTER_PLAYER = 1
HUMAN_PLAYER = -1


@app.route('/checkwin',methods=['POST'])
def checkWin():
    gameState = request.get_json()['gameState']
    gameState = gameState.split(',')
    temp = []

    for i in range(42):
        if(i%7 ==0):
            temp.append([])
        temp[-1].append(int(gameState[i]))

    gameState = temp

    current = 0
    currentCount = 0
    computer_wins = 0
    opponent_wins = 0

    # Check horizontal wins
    for i in range(0, BOARD_SIZE_Y):
        for j in range(0, BOARD_SIZE_X):
            if currentCount == 0:
                if gameState[i][j] != 0:
                    currentCount += 1
                    current = gameState[i][j]
            elif currentCount == 4:
                if current == COMPUTER_PLAYER:
                    computer_wins += 1
                else:
                    opponent_wins += 1
                currentCount = 0
                break
            elif gameState[i][j] != current:
                if gameState[i][j] != 0:
                    current = gameState[i][j]
                    currentCount = 1
                else:
                    current = 0
                    currentCount = 0
            else:
                currentCount += 1

        if currentCount == 4:
            if current == COMPUTER_PLAYER:
                computer_wins += 1
            else:
                opponent_wins += 1
        current = 0
        currentCount = 0

    # Check vertical wins
    for j in range(0, BOARD_SIZE_X):
        for i in range(0, BOARD_SIZE_Y):
            if currentCount == 0:
                if gameState[i][j] != 0:
                    current = gameState[i][j]
                    currentCount += 1
            elif currentCount == 4:
                if current == COMPUTER_PLAYER:
                    computer_wins += 1
                else:
                    opponent_wins += 1
                currentCount = 0
                break
            elif gameState[i][j] != current:
                if gameState[i][j] != 0:
                    current = gameState[i][j]
                    currentCount = 1
                else:
                    current = 0
                    currentCount = 0
            else:
                currentCount += 1

        if currentCount == 4:
            if current == COMPUTER_PLAYER:
                computer_wins += 1
            else:
                opponent_wins += 1
        current = 0
        currentCount = 0

    # Check diagonal wins
    np_matrix = numpy.array(gameState)
    diags = [np_matrix[::-1,:].diagonal(i) for i in range(-np_matrix.shape[0]+1,np_matrix.shape[1])]
    diags.extend(np_matrix.diagonal(i) for i in range(np_matrix.shape[1]-1,-np_matrix.shape[0],-1))
    diags_list = [n.tolist() for n in diags]

    for i in range(0, len(diags_list)):
        if len(diags_list[i]) >= 4:
            for j in range(0, len(diags_list[i])):
                if currentCount == 0:
                    if diags_list[i][j] != 0:
                        current = diags_list[i][j]
                        currentCount += 1
                elif currentCount == 4:
                    if current == COMPUTER_PLAYER:
                        computer_wins += 1
                    else:
                        opponent_wins += 1
                    currentCount = 0
                    break
                elif diags_list[i][j] != current:
                    if diags_list[i][j] != 0:
                        current = diags_list[i][j]
                        currentCount = 1
                    else:
                        current = 0
                        currentCount = 0
                else:
                    currentCount += 1

            if currentCount == 4:
                if current == COMPUTER_PLAYER:
                    computer_wins += 1
                else:
                    opponent_wins += 1
            current = 0
            currentCount = 0

    if opponent_wins > 0:
        print(opponent_wins)
        return str(HUMAN_PLAYER)
    elif computer_wins > 0:
        return str(COMPUTER_PLAYER)
    else:
        return str(0)

@app.route(@app.route('/getmove',methods=['POST']))
def minimax():
    gameState = request.get_json()['gameState']
    depth = request.get_json()['depth']
    player = request.get_json()['player']
    opponent = request.get_json()['opponent']

    availableMoves = BOARD_SIZE_X
    for i in range(0, BOARD_SIZE_X):
        if gameState[0][i] != 0:
            availableMoves -= 1

    if depth == 0 or availableMoves == 0:
        score = evaluateScore(gameState, player, opponent)
        return None, score

    bestScore = None
    bestMove = None

    for i in range(0, BOARD_SIZE_X):
        # If moves cannot be made on column, skip it
        if gameState[0][i] != 0:
            continue

        currentMove = [0, i]

        for j in range(0, BOARD_SIZE_Y - 1):
            if gameState[j + 1][i] != 0:
                gameState[j][i] = player
                currentMove[0] = j
                break
            elif j == BOARD_SIZE_Y - 2:
                gameState[j+1][i] = player
                currentMove[0] = j+1

        # Recursive minimax call, with reduced depth)
        move, score = minimax(gameState, depth - 1, opponent, player)

        gameState[currentMove[0]][currentMove[1]] = 0

        if player == COMPUTER_PLAYER:
            if bestScore == None or score > bestScore:
                bestScore = score
                bestMove = currentMove
        else:
            if bestScore == None or score < bestScore:
                bestScore = score
                bestMove = currentMove
    return bestMove, bestScore


if __name__ == '__main__':
    app.debug=True
    app.run()
