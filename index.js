const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.post('/signup', function(req, res) {
  const { email, password } = req.body;
  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(400).send('User with this email already exists!');
  }
  USERS.push({ email, password });
  res.status(200).send('User created successfully!');
})

app.post('/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }
  const token = generateToken(user);
  res.status(200).json({ token });
});
const USERS = [  { email: 'user1@example.com', password: 'password1' },  { email: 'user2@example.com', password: 'password2' }];

function generateToken(user) {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


app.get('/questions', function(req, res) {
  res.status(200).json({ questions: QUESTIONS });
});
const QUESTIONS = [  { id: 1, question: 'What is your favorite color?', options: ['Red', 'Green', 'Blue'] },
  { id: 2, question: 'What is your favorite animal?', options: ['Dog', 'Cat', 'Bird'] },
  { id: 3, question: 'What is your favorite food?', options: ['Pizza', 'Burger', 'Tacos'] }
];


app.get("/submissions/:problemId", function(req, res) {
  const problemId = req.params.problemId;
  const userSubmissions = getUserSubmissions(req.user.id, problemId);
  res.status(200).json({ submissions: userSubmissions });
});

function getUserSubmissions(userId, problemId) {
  return [
    { id: 1, userId, problemId, language: 'JavaScript', code: 'console.log("Hello World!");' },
    { id: 2, userId, problemId, language: 'Python', code: 'print("Hello World!")' }
  ].filter(submission => submission.userId === userId && submission.problemId === problemId);
}



app.post("/submissions", function(req, res) {
  const { userId, problemId, language, code } = req.body;
  const isAccepted = Math.random() < 0.5;
  const newSubmission = {
    id: SUBMISSIONS.length + 1,
    userId,
    problemId,
    language,
    code,
    isAccepted
  };
    
  SUBMISSIONS.push(newSubmission);
  const response = isAccepted ? "Solution accepted!" : "Solution rejected.";
  res.status(200).send(response);
});

const SUBMISSIONS = [
  { id: 1, userId: 1, problemId: 1, language: 'JavaScript', code: 'console.log("Hello World!");', isAccepted: true },
  { id: 2, userId: 1, problemId: 2, language: 'Python', code: 'print("Hello World!")', isAccepted: false }
];

const USERS = [
  { id: 1, name: 'Alice', email: 'alice@example.com', password: 'password', isAdmin: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', password: 'password', isAdmin: false }
];

const PROBLEMS = [
  { id: 1, title: 'Hello World', description: 'Print "Hello World!" to the console', difficulty: 'Easy' },
  { id: 2, title: 'Add Two Numbers', description: 'Add two numbers and return their sum', difficulty: 'Medium' }
];

app.post('/problems', function(req, res) {
  const adminToken = req.headers.authorization;
  const adminUser = USERS.find(user => user.isAdmin && user.token === adminToken);
    
  if (!adminUser) {
    return res.status(401).send('Unauthorized');
  }

  const { title, description, difficulty } = req.body;

  const newProblem = {
    id: PROBLEMS.length + 1,
    title,
    description,
    difficulty
  };
  PROBLEMS.push(newProblem);
  res.status(200).send('Problem added successfully');
});


app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
