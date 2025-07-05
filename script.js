// Variáveis globais
const calculator = {
  display: "0",
  previousValue: null,
  operation: null,
  waitingForOperand: false,
}

const stopwatch = {
  time: 0,
  isRunning: false,
  interval: null,
}

const question = document.querySelector("#question")
const answersBox = document.querySelector("#answers-box")
const quizzContainer = document.querySelector("#quizz-container")
const scoreContainer = document.querySelector("#score-container")

const letters = ["a", "b", "c", "d"]
let points = 0
let actualQuestion = 0

const questions = [
  {
    question: "PHP foi desenvolvido para qual fim?",
    answers: [
      { answer: "back-end", correct: true },
      { answer: "front-end", correct: false },
      { answer: "Sistema operacional", correct: false },
      { answer: "Banco de dados", correct: false },
    ],
  },
  {
    question: "Uma forma de declarar variável em JavaScript:",
    answers: [
      { answer: "$var", correct: false },
      { answer: "var", correct: true },
      { answer: "@var", correct: false },
      { answer: "#let", correct: false },
    ],
  },
  {
    question: "Qual o seletor de id no CSS?",
    answers: [
      { answer: "#", correct: true },
      { answer: ".", correct: false },
      { answer: "@", correct: false },
      { answer: "/", correct: false },
    ],
  },
  {
    question: "Em qual elemento HTML colocamos JavaScripts?",
    answers: [
      { answer: "js", correct: false },
      { answer: "java", correct: false },
      { answer: "script", correct: true },
      { answer: "javascript", correct: false },
    ],
  },
  {
    question: "Quais são as regras para escrever variáveis em JavaScript?",
    answers: [
      { answer: "Devem começar com uma letra maiúscula", correct: false },
      { answer: "Devem começar com um número", correct: false },
      { answer: "Devem começar com apenas numero", correct: false },
      { answer: "Devem começar com uma letra ou um sublinhado (_)", correct: true },
    ],
  },
  {
    question: "Qual a diferença principal entre const e let?",
    answers: [
      {
        answer: "const é usado para constantes imutáveis, enquanto let é usado para variáveis mutáveis.",
        correct: true,
      },
      { answer: "const é usado para declarações de função, enquanto let é usado para loops.", correct: false },
      { answer: "const é usado para variáveis mutáveis, enquanto let é usado para constantes", correct: false },
      { answer: "const e let são palavras-chave equivalentes em JavaScript", correct: false },
    ],
  },
]

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  setupEventListeners()
  startTypingAnimation()
  animateStats()
  updateClock()
  initializeQuiz()
  setupFormValidation()
  loadSavedTheme()
  setInterval(updateClock, 1000)
}

// Event Listeners
function setupEventListeners() {
  const menuToggle = document.getElementById("menuToggle")
  const navMobile = document.getElementById("navMobile")
  const themeToggle = document.getElementById("themeToggle")

  if (menuToggle && navMobile) {
    menuToggle.addEventListener("click", () => {
      navMobile.classList.toggle("show")
      const icon = menuToggle.querySelector("i")
      icon.classList.toggle("fa-bars")
      icon.classList.toggle("fa-times")
    })
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }

  window.addEventListener("scroll", handleScroll)

  const colorPicker = document.getElementById("colorPicker")
  if (colorPicker) {
    colorPicker.addEventListener("input", updateColorPreview)
    updateColorPreview()
  }

  const stopwatchToggle = document.getElementById("stopwatchToggle")
  const stopwatchReset = document.getElementById("stopwatchReset")

  if (stopwatchToggle) {
    stopwatchToggle.addEventListener("click", toggleStopwatch)
  }

  if (stopwatchReset) {
    stopwatchReset.addEventListener("click", resetStopwatch)
  }

  setupPasswordToggles()

  const registerPassword = document.getElementById("registerPassword")
  if (registerPassword) {
    registerPassword.addEventListener("input", checkPasswordRequirements)
  }

  setupSmoothScrolling()
  setupPhoneFormatting()
}

// Animação de digitação
function startTypingAnimation() {
  const typedTextElement = document.getElementById("typedText")
  if (!typedTextElement) return

  const fullText = "Teste seus conhecimentos em programação!"
  let index = 0

  function typeText() {
    if (index < fullText.length) {
      typedTextElement.textContent = fullText.slice(0, index + 1)
      index++
      setTimeout(typeText, 100)
    }
  }

  typeText()
}

// Animação das estatísticas
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number.parseInt(entry.target.dataset.target)
        animateNumber(entry.target, target)
        observer.unobserve(entry.target)
      }
    })
  })

  statNumbers.forEach((stat) => observer.observe(stat))
}

function animateNumber(element, target) {
  let current = 0
  const increment = target / 100
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString()
  }, 20)
}

// Tema
function toggleTheme() {
  const body = document.body
  const themeToggle = document.getElementById("themeToggle")
  const icon = themeToggle.querySelector("i")

  body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark"

  if (body.dataset.theme === "dark") {
    icon.classList.remove("fa-moon")
    icon.classList.add("fa-sun")
  } else {
    icon.classList.remove("fa-sun")
    icon.classList.add("fa-moon")
  }

  localStorage.setItem("theme", body.dataset.theme)
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.body.dataset.theme = savedTheme
    const themeToggle = document.getElementById("themeToggle")
    const icon = themeToggle?.querySelector("i")

    if (savedTheme === "dark" && icon) {
      icon.classList.remove("fa-moon")
      icon.classList.add("fa-sun")
    }
  }
}

// Scroll
function handleScroll() {
  const header = document.getElementById("header")
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
}

// Navegação
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Quiz
function initializeQuiz() {
  if (question && answersBox && quizzContainer && scoreContainer) {
    createQuestion(0)

    const restartBtn = document.getElementById("restart")
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        actualQuestion = 0
        points = 0
        hideOrShowQuizz()
        createQuestion(0)
      })
    }
  }
}

function createQuestion(i) {
  if (!question || !answersBox) return

  const oldButtons = answersBox.querySelectorAll("button:not(.answer-template)")
  oldButtons.forEach((btn) => {
    btn.remove()
  })

  const questionText = question.querySelector("#question-text")
  const questionNumber = question.querySelector("#question-number")

  if (questionText) questionText.textContent = questions[i].question
  if (questionNumber) questionNumber.textContent = i + 1

  questions[i].answers.forEach((answer, index) => {
    const answerTemplate = document.querySelector(".answer-template")
    if (!answerTemplate) return

    const answerButton = answerTemplate.cloneNode(true)
    const letterBtn = answerButton.querySelector(".btn-letter")
    const answerText = answerButton.querySelector(".question-answer")

    if (letterBtn) letterBtn.textContent = letters[index]
    if (answerText) answerText.textContent = answer["answer"]

    answerButton.setAttribute("correct-answer", answer["correct"])
    answerButton.classList.remove("hide")
    answerButton.classList.remove("answer-template")

    answersBox.appendChild(answerButton)
  })

  const buttons = answersBox.querySelectorAll("button:not(.answer-template)")
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      checkAnswer(this, buttons)
    })
  })

  actualQuestion++
}

function checkAnswer(btn, buttons) {
  buttons.forEach((button) => {
    if (button.getAttribute("correct-answer") === "true") {
      button.classList.add("correct-answer")
      if (btn === button) {
        points++
      }
    } else {
      button.classList.add("wrong-answer")
    }
  })

  nextQuestion()
}

function nextQuestion() {
  setTimeout(() => {
    if (actualQuestion >= questions.length) {
      showSuccessMessage()
      return
    }
    createQuestion(actualQuestion)
  }, 1500)
}

function showSuccessMessage() {
  hideOrShowQuizz()
  const score = ((points / questions.length) * 100).toFixed(2)
  const scoreDisplay = document.querySelector("#display-score")
  if (scoreDisplay) scoreDisplay.textContent = score + "%"

  const correctAnswers = document.querySelector("#correct-answers")
  if (correctAnswers) correctAnswers.textContent = points

  const totalQuestions = document.querySelector("#questions-qty")
  if (totalQuestions) totalQuestions.textContent = questions.length
}

function hideOrShowQuizz() {
  if (quizzContainer) quizzContainer.classList.toggle("hide")
  if (scoreContainer) scoreContainer.classList.toggle("hide")
}

// Calculadora
function inputNumber(num) {
  const display = document.getElementById("calculatorDisplay")
  if (!display) return

  if (calculator.waitingForOperand) {
    calculator.display = num
    calculator.waitingForOperand = false
  } else {
    calculator.display = calculator.display === "0" ? num : calculator.display + num
  }

  display.textContent = calculator.display
}

function inputOperation(nextOperation) {
  const display = document.getElementById("calculatorDisplay")
  if (!display) return

  const inputValue = Number.parseFloat(calculator.display)

  if (calculator.previousValue === null) {
    calculator.previousValue = inputValue
  } else if (calculator.operation) {
    const currentValue = calculator.previousValue || 0
    const newValue = calculate(currentValue, inputValue, calculator.operation)

    calculator.display = String(newValue)
    calculator.previousValue = newValue
    display.textContent = calculator.display
  }

  calculator.waitingForOperand = true
  calculator.operation = nextOperation
}

function calculate(firstValue, secondValue, operation) {
  switch (operation) {
    case "+":
      return firstValue + secondValue
    case "-":
      return firstValue - secondValue
    case "*":
      return firstValue * secondValue
    case "/":
      return firstValue / secondValue
    case "=":
      return secondValue
    default:
      return secondValue
  }
}

function performCalculation() {
  const display = document.getElementById("calculatorDisplay")
  if (!display) return

  const inputValue = Number.parseFloat(calculator.display)

  if (calculator.previousValue !== null && calculator.operation) {
    const newValue = calculate(calculator.previousValue, inputValue, calculator.operation)
    calculator.display = String(newValue)
    calculator.previousValue = null
    calculator.operation = null
    calculator.waitingForOperand = true
    display.textContent = calculator.display
  }
}

function clearCalculator() {
  const display = document.getElementById("calculatorDisplay")
  if (!display) return

  calculator.display = "0"
  calculator.previousValue = null
  calculator.operation = null
  calculator.waitingForOperand = false

  display.textContent = calculator.display
}

// Seletor de cores
function updateColorPreview() {
  const colorPicker = document.getElementById("colorPicker")
  const colorPreview = document.getElementById("colorPreview")
  const hexValue = document.getElementById("hexValue")
  const rgbValue = document.getElementById("rgbValue")

  if (!colorPicker || !colorPreview || !hexValue || !rgbValue) return

  const color = colorPicker.value
  colorPreview.style.backgroundColor = color
  hexValue.textContent = color
  rgbValue.textContent = hexToRgb(color)
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    const r = Number.parseInt(result[1], 16)
    const g = Number.parseInt(result[2], 16)
    const b = Number.parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
  }
  return "rgb(0, 0, 0)"
}

// Relógio
function updateClock() {
  const currentTime = document.getElementById("currentTime")
  const currentDate = document.getElementById("currentDate")

  if (currentTime && currentDate) {
    const now = new Date()
    currentTime.textContent = now.toLocaleTimeString()
    currentDate.textContent = now.toLocaleDateString()
  }
}

// Cronômetro
function toggleStopwatch() {
  const toggleBtn = document.getElementById("stopwatchToggle")
  const icon = toggleBtn.querySelector("i")

  if (stopwatch.isRunning) {
    clearInterval(stopwatch.interval)
    stopwatch.isRunning = false
    icon.classList.remove("fa-pause")
    icon.classList.add("fa-play")
    toggleBtn.classList.remove("btn-primary")
    toggleBtn.classList.add("btn-outline")
  } else {
    stopwatch.interval = setInterval(() => {
      stopwatch.time++
      updateStopwatchDisplay()
    }, 10)
    stopwatch.isRunning = true
    icon.classList.remove("fa-play")
    icon.classList.add("fa-pause")
    toggleBtn.classList.remove("btn-outline")
    toggleBtn.classList.add("btn-primary")
  }
}

function resetStopwatch() {
  clearInterval(stopwatch.interval)
  stopwatch.time = 0
  stopwatch.isRunning = false

  const toggleBtn = document.getElementById("stopwatchToggle")
  const icon = toggleBtn.querySelector("i")

  icon.classList.remove("fa-pause")
  icon.classList.add("fa-play")
  toggleBtn.classList.remove("btn-primary")
  toggleBtn.classList.add("btn-outline")

  updateStopwatchDisplay()
}

function updateStopwatchDisplay() {
  const display = document.getElementById("stopwatchDisplay")
  if (display) {
    display.textContent = formatStopwatchTime(stopwatch.time)
  }
}

function formatStopwatchTime(time) {
  const minutes = Math.floor(time / 6000)
  const seconds = Math.floor((time % 6000) / 100)
  const centiseconds = time % 100
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`
}

// Validação de formulários
function setupFormValidation() {
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit)

    const inputs = form.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input))
      input.addEventListener("input", () => clearFieldError(input))
    })
  })
}

function handleFormSubmit(e) {
  e.preventDefault()
  const form = e.target

  if (validateForm(form)) {
    showLoading()

    setTimeout(() => {
      hideLoading()
      showToast("success", "Formulário enviado com sucesso!", "fas fa-check-circle")
      form.reset()

      const inputs = form.querySelectorAll("input, textarea, select")
      inputs.forEach((input) => clearFieldError(input))
    }, 2000)
  }
}

function validateForm(form) {
  let isValid = true
  const inputs = form.querySelectorAll("input[required], textarea[required], select[required]")

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false
    }
  })

  if (form.id === "contactForm") {
    isValid = validateContactForm(form) && isValid
  } else if (form.id === "newsletterForm") {
    isValid = validateNewsletterForm(form) && isValid
  } else if (form.id === "registerForm") {
    isValid = validateRegisterForm(form) && isValid
  }

  return isValid
}

function validateField(input) {
  const value = input.value.trim()
  let isValid = true
  let errorMessage = ""

  if (input.hasAttribute("required") && !value) {
    errorMessage = "Este campo é obrigatório"
    isValid = false
  } else if (input.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errorMessage = "Email inválido"
      isValid = false
    }
  } else if (input.name === "phone" && value) {
    const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
    if (!phoneRegex.test(value)) {
      errorMessage = "Formato: (11) 99999-9999"
      isValid = false
    }
  } else if (input.name === "username" && value) {
    if (value.length < 3) {
      errorMessage = "Nome de usuário deve ter pelo menos 3 caracteres"
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      errorMessage = "Nome de usuário pode conter apenas letras, números e underscore"
      isValid = false
    }
  } else if (input.name === "password" && value) {
    if (!isPasswordValid(value)) {
      errorMessage = "Senha não atende aos requisitos"
      isValid = false
    }
  } else if (input.name === "birthDate" && value) {
    const birthDate = new Date(value)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 13) {
      errorMessage = "Você deve ter pelo menos 13 anos"
      isValid = false
    }
  }

  showFieldError(input, errorMessage)
  return isValid
}

function validateContactForm(form) {
  const messageInput = form.querySelector('textarea[name="message"]')
  let isValid = true

  if (messageInput && messageInput.value.trim().length < 10) {
    showFieldError(messageInput, "Mensagem deve ter pelo menos 10 caracteres")
    isValid = false
  }

  return isValid
}

function validateNewsletterForm(form) {
  const interests = form.querySelectorAll('input[name="interests"]:checked')
  let isValid = true

  if (interests.length === 0) {
    const checkboxGroup = form.querySelector(".checkbox-grid")
    const errorElement = checkboxGroup.parentNode.querySelector(".error-message")
    if (errorElement) {
      errorElement.textContent = "Selecione pelo menos um interesse"
    }
    isValid = false
  }

  return isValid
}

function validateRegisterForm(form) {
  const acceptTerms = form.querySelector('input[name="acceptTerms"]')
  let isValid = true

  if (acceptTerms && !acceptTerms.checked) {
    showFieldError(acceptTerms, "Você deve aceitar os termos de uso")
    isValid = false
  }

  return isValid
}

function showFieldError(input, message) {
  const errorElement = input.parentNode.querySelector(".error-message")
  if (errorElement) {
    errorElement.textContent = message
  }

  if (message) {
    input.classList.add("error")
  } else {
    input.classList.remove("error")
  }
}

function clearFieldError(input) {
  const errorElement = input.parentNode.querySelector(".error-message")
  if (errorElement) {
    errorElement.textContent = ""
  }
  input.classList.remove("error")
}

// Senha
function setupPasswordToggles() {
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.parentNode.querySelector("input")
      const icon = this.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        input.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })
}

function checkPasswordRequirements() {
  const passwordInput = document.getElementById("registerPassword")
  const requirements = document.querySelectorAll(".requirement")

  if (!passwordInput || !requirements.length) return

  const password = passwordInput.value

  requirements.forEach((req) => {
    const type = req.dataset.requirement
    const icon = req.querySelector("i")
    let isValid = false

    switch (type) {
      case "length":
        isValid = password.length >= 8
        break
      case "uppercase":
        isValid = /[A-Z]/.test(password)
        break
      case "lowercase":
        isValid = /[a-z]/.test(password)
        break
      case "number":
        isValid = /\d/.test(password)
        break
      case "special":
        isValid = /[!@#$%^&*]/.test(password)
        break
    }

    if (isValid) {
      req.classList.add("valid")
      icon.classList.remove("fa-times")
      icon.classList.add("fa-check")
    } else {
      req.classList.remove("valid")
      icon.classList.remove("fa-check")
      icon.classList.add("fa-times")
    }
  })
}

function isPasswordValid(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*]/.test(password)
  )
}

// Formatação de telefone
function formatPhone(input) {
  let value = input.value.replace(/\D/g, "")
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
    input.value = value
  }
}

function setupPhoneFormatting() {
  const phoneInputs = document.querySelectorAll('input[name="phone"]')
  phoneInputs.forEach((input) => {
    input.addEventListener("input", () => formatPhone(input))
  })
}

// Toast
function showToast(type, message, icon) {
  const toast = document.getElementById("toast")
  const toastIcon = toast.querySelector(".toast-icon")
  const toastMessage = toast.querySelector(".toast-message")

  toast.className = `toast ${type}`
  toastIcon.className = `toast-icon ${icon}`
  toastMessage.textContent = message

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 5000)
}

function hideToast() {
  const toast = document.getElementById("toast")
  toast.classList.remove("show")
}

// Loading
function showLoading() {
  const overlay = document.getElementById("loadingOverlay")
  overlay.classList.add("show")
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay")
  overlay.classList.remove("show")
}

// Animações
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fade-in-up")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".tool-card, .form-card")
  animateElements.forEach((el) => observer.observe(el))
})
