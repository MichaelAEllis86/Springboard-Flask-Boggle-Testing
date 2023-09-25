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
    return render_template('base.html')

@app.route('/home')
def show_home():
    board=boggle_game.make_board()
    session ["current_board"]=board
    return render_template('home.html',board=board)

# @app.route('/check', methods=['POST','GET'])
# def show_check_guess():
#     print(request.args)
#     return redirect('/home')


@app.route("/check")
def check_word():
    """Check if word is in dictionary."""
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
    data=request.json
    print(data)
    score = int(request.json["score"])
    print(score,type(score))
    
    return redirect('/home')
    # highscore = session.get("highscore", 0)
    # nplays = session.get("nplays", 0)
    # session['nplays'] = nplays + 1
    # session['highscore'] = max(score, highscore)
    # print(session['nplays'], session['highscore'])
    
    # return jsonify(brokeRecord=score > highscore)