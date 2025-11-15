import { useState } from "react"
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the recommended percentage of your income to save?",
    options: [
      "5-10%",
      "10-20%",
      "20-30%",
      "30-40%"
    ],
    correctAnswer: 1,
    explanation: "Financial experts typically recommend saving 10-20% of your income. This helps build an emergency fund and work toward long-term goals."
  },
  {
    id: 2,
    question: "What is an emergency fund?",
    options: [
      "Money for vacations",
      "Savings for unexpected expenses",
      "Investment portfolio",
      "Retirement account"
    ],
    correctAnswer: 1,
    explanation: "An emergency fund is money set aside to cover unexpected expenses like medical bills, car repairs, or job loss. Experts recommend 3-6 months of expenses."
  },
  {
    id: 3,
    question: "What does APR stand for?",
    options: [
      "Annual Payment Rate",
      "Annual Percentage Rate",
      "Average Payment Return",
      "Annual Profit Ratio"
    ],
    correctAnswer: 1,
    explanation: "APR stands for Annual Percentage Rate. It represents the yearly interest rate charged on loans or credit cards, including fees."
  },
  {
    id: 4,
    question: "What is compound interest?",
    options: [
      "Interest on loans only",
      "Interest earned on both principal and previously earned interest",
      "Fixed interest rate",
      "Interest paid monthly"
    ],
    correctAnswer: 1,
    explanation: "Compound interest is interest calculated on the initial principal and accumulated interest from previous periods. It's often called 'interest on interest' and helps savings grow faster."
  },
  {
    id: 5,
    question: "What is the 50/30/20 rule?",
    options: [
      "50% savings, 30% needs, 20% wants",
      "50% needs, 30% wants, 20% savings",
      "50% wants, 30% needs, 20% savings",
      "50% investment, 30% savings, 20% spending"
    ],
    correctAnswer: 1,
    explanation: "The 50/30/20 rule is a budgeting guideline: 50% for needs (housing, food, utilities), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment."
  },
  {
    id: 6,
    question: "What is a credit score used for?",
    options: [
      "Determining your income",
      "Assessing your creditworthiness",
      "Calculating taxes",
      "Setting savings goals"
    ],
    correctAnswer: 1,
    explanation: "A credit score is a number that represents your creditworthiness. Lenders use it to decide whether to approve loans and what interest rates to offer."
  },
  {
    id: 7,
    question: "What is diversification in investing?",
    options: [
      "Putting all money in one stock",
      "Spreading investments across different assets",
      "Only investing in bonds",
      "Avoiding all investments"
    ],
    correctAnswer: 1,
    explanation: "Diversification means spreading your investments across different asset types, industries, and geographic regions to reduce risk."
  },
  {
    id: 8,
    question: "What is the difference between needs and wants?",
    options: [
      "There is no difference",
      "Needs are essential for survival, wants are desires",
      "Wants are more important than needs",
      "Needs are optional expenses"
    ],
    correctAnswer: 1,
    explanation: "Needs are essential items required for survival and basic living (food, shelter, healthcare). Wants are things you desire but can live without (entertainment, luxury items)."
  },
  {
    id: 9,
    question: "What should you do first when creating a budget?",
    options: [
      "Set savings goals",
      "Track your income and expenses",
      "Cut all spending",
      "Open a new bank account"
    ],
    correctAnswer: 1,
    explanation: "The first step in creating a budget is to track your income and expenses. This helps you understand where your money is going and identify areas for improvement."
  },
  {
    id: 10,
    question: "What is the purpose of a budget?",
    options: [
      "To restrict all spending",
      "To plan and control your finances",
      "To earn more money",
      "To avoid paying taxes"
    ],
    correctAnswer: 1,
    explanation: "A budget helps you plan and control your finances by tracking income and expenses, ensuring you can meet your financial goals and avoid overspending."
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [isFinished, setIsFinished] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions.has(currentQuestion)) return
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setAnsweredQuestions(new Set())
    setIsFinished(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]
  const isCorrect = selectedAnswer === currentQ.correctAnswer

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="p-6 space-y-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${percentage >= 70 ? "bg-green-100" : percentage >= 50 ? "bg-yellow-100" : "bg-red-100"}`}>
                <Trophy className={`h-12 w-12 ${percentage >= 70 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-600"}`} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Quiz Complete!</h1>
            <p className="text-muted-foreground mb-6">You scored {score} out of {questions.length}</p>
            <div className="text-4xl font-bold mb-6 text-foreground">{percentage}%</div>
            <div className="space-y-4 mb-6">
              {percentage >= 70 && (
                <p className="text-green-600 font-semibold">Excellent! You have a strong understanding of financial literacy! 🎉</p>
              )}
              {percentage >= 50 && percentage < 70 && (
                <p className="text-yellow-600 font-semibold">Good job! Keep learning to improve your financial knowledge! 📚</p>
              )}
              {percentage < 50 && (
                <p className="text-red-600 font-semibold">Keep practicing! Financial literacy is a journey. 💪</p>
              )}
            </div>
            <Button onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Take Quiz Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Financial Literacy Quiz</h1>
        <p className="text-muted-foreground">Test your knowledge about personal finance and money management</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Score: {score} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            {currentQ.question}
          </h2>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === currentQ.correctAnswer
              const isAnswered = answeredQuestions.has(currentQuestion)
              
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all "
              
              if (isAnswered) {
                if (isCorrectAnswer) {
                  buttonClass += "bg-green-50 border-green-500 text-green-900"
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "bg-red-50 border-red-500 text-red-900"
                } else {
                  buttonClass += "bg-gray-50 border-gray-200 text-muted-foreground"
                }
              } else {
                buttonClass += isSelected 
                  ? "bg-blue-50 border-blue-500 text-blue-900" 
                  : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isAnswered && isCorrectAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {isAnswered && isSelected && !isCorrectAnswer && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-lg mb-4 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold mb-1 ${isCorrect ? "text-green-900" : "text-red-900"}`}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className={`text-sm ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end">
              <Button onClick={handleNext} className="gap-2">
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Finish Quiz
                    <Trophy className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

