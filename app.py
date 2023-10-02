from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
app=Flask(__name__)
app.config["SECRET_KEY"]="mookster21"
debug=DebugToolbarExtension(app)

# operation of the game board
boggle_game = Boggle()

# board=boggle_game.make_board()

@app.route('/')
def show_root():
    """ Renders the root/base.html page """
    return render_template('base.html')

@app.route('/home')
def show_home():

    """Renders the boggle game page and html necessary to play a game such as the guessform,
       makes a new board via boggle class's make_board(), saves it to session, and renders board in html"""
    
    board=boggle_game.make_board()
    session ["current_board"]=board
    return render_template('home.html',board=board)

# @app.route('/check', methods=['POST','GET'])
# def show_check_guess():
#     print(request.args)
#     return redirect('/home')


@app.route("/check")
def check_word():
    
    """Check if word is in dictionary. Each boggle guess word is taken from request obj via game's guess form in the html, 
    and is sent through this route for validation via boggle class's check_valid_word()
    response from check_valid_word is sent to front end via json"""

    word = request.args.get("word")
    print("printing the request object", request.args)
    print("printing word from request.args",word)
    board = session["current_board"]
    print('printing board from the session',board)
    response = boggle_game.check_valid_word(board, word)
    print("printing the response in python",response)
    # return redirect("/home")

    # this logic was for flash messaging the user if the word would be a success. Doesn't work because page isn't refreshed when axios makes request in js file
    # howeever it does work if we were to refresh the page each time
    
    # if response =="ok":
    #     flash(f'{word} is valid','success')
    # elif response =="not-word":
    #     flash(f'{word} is not a valid english word','error')
    # elif response == "not-on-board":
    #     flash (f'{word} is not on the board','error')

    return jsonify({'result': response}) 

@app.route("/playerdata",methods=["POST"])
def receive_playerdata():
    """ Receives player data (player's most recent game score) from app.js sendplayerData() 
     if it's a new highscore respond with new highscore data in json to front end! Saves highscore and number of games played in the session """
    data=request.json
    print(data)
    score = int(request.json["score"])
    print(score,type(score))
    highscore = session.get("highscore", 0)
    games_played=session.get("games-played",0)
    session['games-played']=games_played + 1
    session['highscore'] = max(score, highscore)
    print(session['games-played'],"......", session['highscore'])
    return jsonify(brokeRecord=score > highscore, highscore=highscore,games_played=games_played)

@app.route("/highscores")
def show_highscores():
    """ Shows highscore page with highscore and games_played player data (grabbed via the session)"""
    session['highscore'] = session.get("highscore", 0)
    session['games-played'] = session.get("games-played",0)
    print("printing highscore...", session['highscore'])
    print("printing games_played...",session['games-played'])
    return render_template("highscores.html")
