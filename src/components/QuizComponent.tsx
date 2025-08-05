import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  X,
  Trophy,
  Star
} from "lucide-react";
import { Quiz, QuizQuestion } from "@/types/learning";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onBack: () => void;
  mascot: {
    emoji: string;
    name: string;
    greeting: string;
  };
}

const QuizComponent = ({ quiz, onComplete, onBack, mascot }: QuizComponentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState<Record<string, boolean>>({});

  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const question = quiz.questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const feedback: Record<string, boolean> = {};
    let correctAnswers = 0;
    let totalPoints = 0;

    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      feedback[q.id] = isCorrect;
      
      if (isCorrect) {
        correctAnswers++;
        totalPoints += q.points;
      }
    });

    setQuestionFeedback(feedback);
    setShowResults(true);

    const score = (correctAnswers / totalQuestions) * 100;
    
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  const getScoreMessage = () => {
    const correctAnswers = Object.values(questionFeedback).filter(Boolean).length;
    const score = (correctAnswers / totalQuestions) * 100;

    if (score >= 90) {
      return {
        message: "🌟 Amazing! You're a garden genius!",
        emoji: "🏆",
        color: "text-yellow-600"
      };
    } else if (score >= 70) {
      return {
        message: "😊 Great job! You're learning so much!",
        emoji: "⭐",
        color: "text-green-600"
      };
    } else if (score >= 50) {
      return {
        message: "🌱 Good try! Keep learning and growing!",
        emoji: "🌿",
        color: "text-blue-600"
      };
    } else {
      return {
        message: "🌱 That's okay! Every gardener learns by trying!",
        emoji: "💪",
        color: "text-purple-600"
      };
    }
  };

  if (showResults) {
    const correctAnswers = Object.values(questionFeedback).filter(Boolean).length;
    const score = (correctAnswers / totalQuestions) * 100;
    const scoreMessage = getScoreMessage();

    return (
      <Card className="shadow-soft border-2 border-child-primary/20">
        <CardHeader className="bg-gradient-child text-white">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="text-3xl animate-bounce-gentle">{mascot.emoji}</div>
            <span>Quiz Results!</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="text-center space-y-6">
            <div className="text-6xl">{scoreMessage.emoji}</div>
            <h3 className={`text-2xl font-bold ${scoreMessage.color}`}>
              {scoreMessage.message}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{score.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {Object.values(questionFeedback).filter(Boolean).reduce((sum, _) => sum + 10, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold">Review Your Answers:</h4>
              {quiz.questions.map((q, index) => (
                <Card 
                  key={q.id}
                  className={`border-2 ${
                    questionFeedback[q.id] 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {questionFeedback[q.id] ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">{q.question}</p>
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Your answer:</strong> 
                            <span className={questionFeedback[q.id] ? 'text-green-700' : 'text-red-700'}>
                              {answers[q.id] || 'No answer'}
                            </span>
                          </p>
                          {!questionFeedback[q.id] && (
                            <p>
                              <strong>Correct answer:</strong> 
                              <span className="text-green-700">{q.correctAnswer}</span>
                            </p>
                          )}
                          <p className="text-muted-foreground italic">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="child"
              size="lg"
              onClick={onBack}
              className="px-8"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Continue Learning!
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border-2 border-child-primary/20">
      <CardHeader className="bg-gradient-child text-white">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lesson
          </Button>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Question {currentQuestion + 1} of {totalQuestions}
          </Badge>
        </div>
        
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="text-3xl animate-bounce-gentle">{mascot.emoji}</div>
          <span>Quiz Time!</span>
        </CardTitle>
        
        <div className="mt-4">
          <Progress value={progress} className="bg-white/20" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-child-primary mb-4">
              {question.question}
            </h3>
          </div>

          {question.type === 'multiple-choice' && question.options && (
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="text-base cursor-pointer flex-1 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'true-false' && (
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label 
                  htmlFor="true"
                  className="text-base cursor-pointer flex-1 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  ✅ True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label 
                  htmlFor="false"
                  className="text-base cursor-pointer flex-1 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  ❌ False
                </Label>
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= currentQuestion ? 'bg-child-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <Button
            variant="child"
            onClick={handleNext}
            disabled={!answers[question.id]}
          >
            {currentQuestion === totalQuestions - 1 ? (
              <>
                Finish Quiz! <Star className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
