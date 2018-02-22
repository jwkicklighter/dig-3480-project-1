const Utils = require('./utils.js')
const allQuestions = require('./questions.js')

const NEXT_BUTTON_ID = 'next-button'
const PREV_BUTTON_ID = 'prev-button'

window.store = {
  selected: 0,
  questionContainer: null,
  answers: {}
}

function createSingleAnswer (idx, answer) {
  const answerTemplate = document.getElementById('single-answer').innerHTML
  answer.value = idx
  return Utils.buildTemplate(answerTemplate, answer)
}

function createAnswerSet (answers) {
  const answerContainerTemplate = document.getElementById('answer-container').innerHTML
  const node = Utils.buildTemplate(answerContainerTemplate)

  for (let i = 0; i < answers.length; i++) {
    node.appendChild(createSingleAnswer(i, answers[i]))
  }

  return node
}

function createSingleQuestion (idx, question) {
  const questionTemplate = document.getElementById('single-question').innerHTML
  const node = Utils.buildTemplate(questionTemplate, {
    title: `Question ${idx + 1}`,
    prompt: question.prompt
  })
  node.appendChild(createAnswerSet(question.answers))

  return node
}

function createQuestions (questions) {
  const questionContainerTemplate = document.getElementById('question-container').innerHTML
  const node = Utils.buildTemplate(questionContainerTemplate)

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    node.appendChild(createSingleQuestion(i, question))
  }

  return node
}

function selectQuestion (idx) {
  const visibleClass = 'visible'
  const questionNodes = window.store.questionContainer.childNodes

  if (idx >= 0 && idx < questionNodes.length) {
    for (let i = 0; i < questionNodes.length; i++) {
      if (i === idx) {
        questionNodes[i].classList.add(visibleClass)
      } else {
        questionNodes[i].classList.remove(visibleClass)
      }
    }

    const nextButton = document.getElementById(NEXT_BUTTON_ID)
    const prevButton = document.getElementById(PREV_BUTTON_ID)

    if (idx === 0) {
      prevButton.disabled = true
    } else {
      prevButton.disabled = false
    }

    if (idx === questionNodes.length - 1) {
      nextButton.disabled = true
    } else {
      nextButton.disabled = false
    }

    window.store.selected = idx
  } else {
    console.error(`You must select a question idx from 0-${questionNodes.length}.`, idx)
  }
}

function selectNextQuestion () {
  if (window.store.selected < allQuestions.length - 1) {
    selectQuestion(window.store.selected + 1)
  }
}

function selectPrevQuestion () {
  if (window.store.selected > 0) {
    selectQuestion(window.store.selected - 1)
  }
}

function selectAnswer (evt) {
  if (evt.target.type && evt.target.type === 'radio') {
    const question = evt.target.name
    const answer = evt.target.value
    window.store.answers[question] = answer

    setTimeout(selectNextQuestion, 500)
  }
}

function initQuestions () {
  const target = document.getElementById('target')
  const questionContainer = createQuestions(allQuestions)
  target.appendChild(questionContainer)
  window.store.questionContainer = questionContainer
}

function initListeners () {
  const nextButton = document.getElementById(NEXT_BUTTON_ID)
  nextButton.addEventListener('click', selectNextQuestion)

  const prevButton = document.getElementById(PREV_BUTTON_ID)
  prevButton.addEventListener('click', selectPrevQuestion)

  const answerContainers = document.querySelectorAll('.answer-container')
  answerContainers.forEach(ac => {
    ac.addEventListener('click', selectAnswer)
  })
}

function init () {
  initQuestions()
  initListeners()
  selectQuestion(0)
}

init()
