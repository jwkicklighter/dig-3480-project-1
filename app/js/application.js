const Utils = require('./utils.js')
const quizSettings = require('./questions.js')

const allQuestions = quizSettings.questions
const buckets = quizSettings.buckets

const SINGLE_ANSWER_TEMPLATE_ID = 'single-answer'
const ANSWER_CONTAINER_TEMPLATE_ID = 'answer-container'
const SINGLE_QUESTION_TEMPLATE_ID = 'single-question'
const QUESTION_CONTAINER_TEMPLATE_ID = 'question-container'

const NEXT_BUTTON_ID = 'next-button'
const PREV_BUTTON_ID = 'prev-button'
const RESET_BUTTON_ID = 'reset-button'
const ANSWER_CONTAINER_CLASS = ANSWER_CONTAINER_TEMPLATE_ID

// Global state storage object
window.store = {
  selected: 0,
  questionContainer: null,
  answers: {}
}

// Parse template for a single answer
function createSingleAnswer (idx, answer) {
  const answerTemplate = document.getElementById(SINGLE_ANSWER_TEMPLATE_ID).innerHTML
  return Utils.buildTemplate(answerTemplate, answer)
}

// Parse templates for an answer set of a particular question
function createAnswerSet (questionIdx, answers) {
  const answerContainerTemplate = document.getElementById(ANSWER_CONTAINER_TEMPLATE_ID).innerHTML
  const node = Utils.buildTemplate(answerContainerTemplate)

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i]
    answer.value = i
    answer.name = questionIdx
    node.appendChild(createSingleAnswer(i, answer))
  }

  return node
}

// Parse template for a single question
function createSingleQuestion (idx, question) {
  const questionTemplate = document.getElementById(SINGLE_QUESTION_TEMPLATE_ID).innerHTML
  const node = Utils.buildTemplate(questionTemplate, {
    title: `Question ${idx + 1}`,
    prompt: question.prompt
  })
  node.appendChild(createAnswerSet(idx, question.answers))

  return node
}

// Parse templates for the entire question set
function createQuestions (questions) {
  const questionContainerTemplate = document.getElementById(QUESTION_CONTAINER_TEMPLATE_ID).innerHTML
  const node = Utils.buildTemplate(questionContainerTemplate)

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    node.appendChild(createSingleQuestion(i, question))
  }

  return node
}

function setButtonStates (state, questions) {
  const nextButton = document.getElementById(NEXT_BUTTON_ID)
  const prevButton = document.getElementById(PREV_BUTTON_ID)
  const resetButton = document.getElementById(RESET_BUTTON_ID)

  // If this is the first question
  if (state.selected === 0) {
    prevButton.disabled = true
  } else {
    prevButton.disabled = false
  }

  // If this is the last question
  if (lastQuestionSelected(state, questions)) {
    nextButton.innerText = 'Score'

    // ... and if all questions have an answer
    if (allQuestionsAnswered(state, questions)) {
      nextButton.disabled = false
    } else {
      nextButton.disabled = true
    }
  } else {
    nextButton.innerText = 'Next'
    // nextButton.disabled = false
  }

  // If this is the first question and there are none answered
  if (state.selected === 0 && Object.keys(state.answers).length === 0) {
    resetButton.disabled = true
  } else {
    resetButton.disabled = false
  }
}

function setQuestionStates (state) {
  const visibleClass = 'visible'
  const questionNodes = state.questionContainer.childNodes

  for (let i = 0; i < questionNodes.length; i++) {
    if (i === state.selected) {
      questionNodes[i].classList.add(visibleClass)
    } else {
      questionNodes[i].classList.remove(visibleClass)
    }
  }
}

// Select a specific question
// Contains logic to enable/disable the prev/next buttons
// and not cause an array out of bounds error
function selectQuestionAndSetButtons (idx) {
  if (idx >= 0 && idx < allQuestions.length) {
    window.store.selected = idx
    setQuestionStates(window.store)
  } else {
    console.error(`You must select a question idx from 0-${allQuestions.length}.`, idx)
  }

  setButtonStates(window.store, allQuestions)
}

// Select the next question
function selectNextQuestion () {
  if (!lastQuestionSelected(window.store, allQuestions)) {
    selectQuestionAndSetButtons(window.store.selected + 1)
  } else {
    selectQuestionAndSetButtons(window.store.selected)
  }
}

// Listener for the next button
function nextButtonListener () {
  if (lastQuestionSelected(window.store, allQuestions) && allQuestionsAnswered(window.store, allQuestions)) {
    scoreQuiz(window.store, buckets)
  } else {
    selectNextQuestion()
  }
}

// Select the previous question
function selectPrevQuestion () {
  if (window.store.selected > 0) {
    selectQuestionAndSetButtons(window.store.selected - 1)
  } else {
    selectQuestionAndSetButtons(window.store.selected)
  }
}

// Listener for the answer radio buttons
function selectAnswer (evt) {
  if (evt.target.type && evt.target.type === 'radio') {
    const question = evt.target.name
    const answer = evt.target.value
    window.store.answers[question] = allQuestions[question].answers[answer]

    setTimeout(selectNextQuestion, 500)
  }
}

function lastQuestionSelected (state, questions) {
  return state.selected === questions.length - 1
}

function allQuestionsAnswered (state, questions) {
  return Object.keys(state.answers).length === questions.length
}

function scoreQuiz (state, buckets) {
  console.log(winningBucket(state.answers, buckets))
}

// Reduces the `answers` object into bucket totals for determing the outcome placement
function bucketTotals (answers) {
  return Object.keys(answers).reduce((totals, key) => {
    const answer = answers[key]
    const bucket = answer.bucket
    totals[bucket] ? totals[bucket]++ : totals[bucket] = 1

    return totals
  }, {})
}

function winningBucket (answers, buckets) {
  const totals = bucketTotals(answers)

  const sortedBucketIdxs = Utils.sortObjectValues(totals).reverse()
  const winningBucketIdx = sortedBucketIdxs[0]

  return buckets[winningBucketIdx]
}

function resetQuiz () {
  window.store.selected = 0
  window.store.answers = {}
  const radios = document.querySelectorAll('input[type=radio]')
  radios.forEach(radio => {
    radio.checked = false
  })
  selectQuestionAndSetButtons(0)
}

// Start the chain of template compiling to add all questions to the DOM
function initQuestions () {
  const target = document.getElementById('target')
  const questionContainer = createQuestions(allQuestions)
  target.appendChild(questionContainer)
  window.store.questionContainer = questionContainer
}

// Setup various event listeners
function initListeners () {
  const nextButton = document.getElementById(NEXT_BUTTON_ID)
  nextButton.addEventListener('click', nextButtonListener)

  const prevButton = document.getElementById(PREV_BUTTON_ID)
  prevButton.addEventListener('click', selectPrevQuestion)

  const resetButton = document.getElementById(RESET_BUTTON_ID)
  resetButton.addEventListener('click', resetQuiz)

  const answerContainers = document.querySelectorAll(`.${ANSWER_CONTAINER_CLASS}`)
  answerContainers.forEach(ac => {
    ac.addEventListener('click', selectAnswer)
  })
}

function init () {
  initQuestions()
  initListeners()
  selectQuestionAndSetButtons(0)
}

init()
