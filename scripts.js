
const question = document.querySelector("#question");
const answersBox = document.querySelector("#answers-box");
const quizzContainer = document.querySelector("#quizz-container");
const scoreContainer = document.querySelector("#score-container");
const letters = ['a', 'b', 'c', 'd'];
let points = 0;
let actualQuestion = 0;


const questions = [
  {
    "question": "PHP foi desenvolvido para qual fim?",
    "answers": [
      {
        "answer": "back-end",
        "correct": true
      },
      {
        "answer": "front-end",
        "correct": false
      },
      {
        "answer": "Sistema operacional",
        "correct": false
      },
      {
        "answer": "Banco de dados",
        "correct": false
      },
    ]
  },
  {
    "question": "Uma forma de declarar variável em JavaScript:",
    "answers": [
      {
        "answer": "$var",
        "correct": false
      },
      {
        "answer": "var",
        "correct": true
      },
      {
        "answer": "@var",
        "correct": false
      },
      {
        "answer": "#let",
        "correct": false
      },
    ]
  },
  {
    "question": "Qual o seletor de id no CSS?",
    "answers": [
      {
        "answer": "#",
        "correct": true
      },
      {
        "answer": ".",
        "correct": false
      },
      {
        "answer": "@",
        "correct": false
      },
      {
        "answer": "/",
        "correct": false
      },
    ]
  },
  {
    "question" : "Em qual elemento HTML colocamos JavaScripts?",
    "answers" : [
        {
            "answer" : "js",
            "correct" : false
        },
        {
            "answer" : "java",
            "correct" : false
        },
        {
            "answer" : "Script",
            "correct" : true
        },
        {
            "answer" : "javascript",
            "correct" : false
        },
    ]
  },
  {
    "question" : "Quais são as regras para escrever variáveis em JavaScript?",
    "answers" : [
        {
            "answer" : "Devem começar com uma letra maiúscula",
            "correct" : false
        },
        {
            "answer" : "Devem começar com um número",
            "correct" : true
        },
        {
            "answer" : "Devem começar com apenas numero",
            "correct" : false
        },
        {   
            "answer" : "Devem começãr com uma letra ou um sublinhado (_)",
            "correct" : false

        },
    ]
  },
  {"question" : "Qual a dieferença principal entre const e let?",
    "answers" : [
        {
            "answer" : "const é usado para constantes imutáveis, enquanto let é usado para variáveis mutáveis.",
            "correct" : true
        },
        {
            "answer" : "const é usado para declarações de função, enquanto let é usado para loops.",
            "correct" : false
        },
        {
            "answer" : "const é usado para variáveis mutáveis, enquanto let é usado para constantes",
            "correct" : false
        },
        {   
            "answer" : "const e let são palavras-chave equivalentes em JavaScript",
            "correct" : false

        },
    ]
} 
]


function init() {
  createQuestion(0)
}


function createQuestion(i) {

  
  const oldButtons = answersBox.querySelectorAll("button");

  oldButtons.forEach(function(btn) {
    btn.remove();
  });

 
  const questionText = question.querySelector("#question-text");
  const questionNumber = question.querySelector("#question-number");

  questionText.textContent = questions[i].question;
  questionNumber.textContent = i + 1;

 
  questions[i].answers.forEach(function(answer, i) {
    
   
    const answerTemplate = document.querySelector(".answer-template").cloneNode(true);

    const letterBtn = answerTemplate.querySelector(".btn-letter");
    const answerText = answerTemplate.querySelector(".question-answer");

    letterBtn.textContent = letters[i];
    answerText.textContent = answer['answer'];

    answerTemplate.setAttribute("correct-answer", answer["correct"]);

    
    answerTemplate.classList.remove("hide");
    answerTemplate.classList.remove("answer-template");

   
    answersBox.appendChild(answerTemplate);

  });

  
  const buttons = answersBox.querySelectorAll("button");

  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      checkAnswer(this, buttons);
    });
  });

  
  actualQuestion++;

}


function checkAnswer(btn, buttons) {
  
  
  buttons.forEach(function(button) {

    if(button.getAttribute("correct-answer") === "true") {
      button.classList.add("correct-answer");
     
      if(btn === button) {
        
        points++;
      }
    } else {
      button.classList.add("wrong-answer");
    }

  });

  nextQuestion();

}


function nextQuestion() {

  
  setTimeout(function() {

    
    if(actualQuestion >= questions.length) {
      
      showSuccessMessage();
      return;
    }

    createQuestion(actualQuestion)

  }, 1000);

}


function showSuccessMessage() {

  hideOrShowQuizz();

  
  const score = ((points / questions.length) * 100).toFixed(2);
  const scoreDisplay = document.querySelector("#display-score span");

  scoreDisplay.textContent = score.toString();

 
  const correctAnswers = document.querySelector("#correct-answers");
  correctAnswers.textContent = points;


  const totalQuestions = document.querySelector("#questions-qty");
  totalQuestions.textContent = questions.length;

}


const restartBtn = document.querySelector("#restart");

restartBtn.addEventListener("click", function() {
  actualQuestion = 0;
  points = 0;
  hideOrShowQuizz();
  init();
});


function hideOrShowQuizz() {
  quizzContainer.classList.toggle("hide");
  scoreContainer.classList.toggle("hide");
}


init();
