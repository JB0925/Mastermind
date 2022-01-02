# Mastermind

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# About Mastermind

Mastermind is a game where, in this case, the computer picks four random numbers.
The user has ten chances to guess the computer's number. Each time the user guesses,
they are give hints as to how many of the numbers in their guess are in the computer's
numbers, and how many in their guess, if any, are in the correct place. The game ends
when either the user wins the game, or the user runs out of guesses.

# How To Install and/or View Mastermind

The easiest way to view Mastermind is to head over to
[Mastermind on Heroku](https://powerful-taiga-58336.herokuapp.com/) Please allow 15-20 seconds for the
page to load, as it is running on a free dyno.

Alternatively, to clone this project, you can paste the following line in your terminal:
`git clone git@github.com:JB0925/Mastermind.git`

Following that, use `npm install` to install all dependencies in both repos separately.

If you'd like, you can view this app via Docker by running `docker-compose up` and 
heading over to http://localhost:3000 in your browser. 


Below are some available scripts that you can use to run Mastermind in 
development mode if neither of the above appeal to you, as well as run 
the tests I wrote for Mastermind: 

In the project's root directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### `npm test`

Launches the test runner in the interactive watch mode.\
This will allow you to run the tests that I wrote for this
application using React Testing Library / Jest.

Thank you for taking the time to check out Mastermind!