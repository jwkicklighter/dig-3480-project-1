const Utils = require('./utils.js')
const allQuestions = require('./questions.js')

const NEXT_BUTTON_ID = 'next-button'
const PREV_BUTTON_ID = 'prev-button'

const store = {
  selected: 0,
  questionContainer: null
}

function createSingleAnswer (label, name) {
  const answerTemplate = document.getElementById('single-answer').innerHTML
  const template = answerTemplate.replace('#LABEL', label).replace('#NAME', name)

  return Utils.htmlToElement(template)
}

function createAnswerSet (answers) {
  const answerContainerTemplate = document.getElementById('answer-container').innerHTML
  const node = Utils.htmlToElement(answerContainerTemplate)

  for (let answer of answers) {
    node.appendChild(createSingleAnswer(answer.label, answer.name))
  }

  return node
}

function createSingleQuestion (question) {
  const questionTemplate = document.getElementById('question').innerHTML
  const template = questionTemplate.replace('#PROMPT', question.prompt)
  const node = Utils.htmlToElement(template)
  node.appendChild(createAnswerSet(question.answers))

  return node
}

function createQuestions (questions) {
  const questionContainerTemplate = document.getElementById('question-container').innerHTML
  const node = Utils.htmlToElement(questionContainerTemplate)

  for (let question of questions) {
    node.appendChild(createSingleQuestion(question))
  }

  return node
}

function selectQuestion (idx) {
  const visibleClass = 'visible'
  const questionNodes = store.questionContainer.childNodes

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

    store.selected = idx
  } else {
    console.error(`You must select a question idx from 0-${questionNodes.length}.`, idx)
  }
}

function selectNextQuestion () {
  if (store.selected < allQuestions.length - 1) {
    selectQuestion(store.selected + 1)
  }
}

function selectPrevQuestion () {
  if (store.selected > 0) {
    selectQuestion(store.selected - 1)
  }
}

function initQuestions () {
  const target = document.getElementById('target')
  const questionContainer = createQuestions(allQuestions)
  target.appendChild(questionContainer)
  store.questionContainer = questionContainer
}

function initListeners () {
  const nextButton = document.getElementById(NEXT_BUTTON_ID)
  nextButton.addEventListener('click', selectNextQuestion)

  const prevButton = document.getElementById(PREV_BUTTON_ID)
  prevButton.addEventListener('click', selectPrevQuestion)
}

function init () {
  initQuestions()
  initListeners()
  selectQuestion(0)
}

init()
