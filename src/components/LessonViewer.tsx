import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Volume2,
  Lightbulb,
  Target
} from "lucide-react";
import { LearningLesson, LessonContent } from "@/types/learning";
import InteractiveContent from "./InteractiveContent";
import QuizComponent from "./QuizComponent";

interface LessonViewerProps {
  lesson: LearningLesson;
  soilData: {
    moisture: number;
    ph: number;
    temperature: number;
    nutrients: number;
  };
  onComplete: (lessonId: string, score: number) => void;
  onBack: () => void;
  isCompleted: boolean;
}

const LessonViewer = ({ lesson, soilData, onComplete, onBack, isCompleted }: LessonViewerProps) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(isCompleted);

  const totalSteps = lesson.content.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getMascotGreeting = () => {
    switch (lesson.mascot) {
      case 'dewey':
        return { emoji: '💧', name: 'Dewey', greeting: 'Hi there! I\'m Dewey the Drop!' };
      case 'soily':
        return { emoji: '🪱', name: 'Soily', greeting: 'Hey! I\'m Soily the Worm!' };
      case 'both':
        return { emoji: '💧🪱', name: 'Dewey & Soily', greeting: 'Hi! We\'re here to help you learn!' };
      default:
        return { emoji: '🌱', name: 'Garden Friend', greeting: 'Let\'s learn together!' };
    }
  };

  const mascot = getMascotGreeting();
  const currentContent = lesson.content[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else if (lesson.quiz && !showQuiz) {
      setShowQuiz(true);
    } else {
      handleLessonComplete(100);
    }
  };

  const handlePrevious = () => {
    if (showQuiz) {
      setShowQuiz(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizComplete = (score: number) => {
    handleLessonComplete(score);
  };

  const handleLessonComplete = (score: number) => {
    setLessonCompleted(true);
    onComplete(lesson.id, score);
  };

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="space-y-4">
            {content.title && (
              <h3 className="text-xl font-bold text-child-primary">{content.title}</h3>
            )}
            <div className="text-base leading-relaxed whitespace-pre-line">
              {content.content}
            </div>
          </div>
        );

      case 'fact':
        return (
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">🤓 Did You Know?</h4>
                  <p className="text-yellow-700">{content.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'connection':
        if (content.soilDataConnection) {
          const { metric, explanation } = content.soilDataConnection;
          const value = soilData[metric];
          
          return (
            <Card className="bg-gradient-to-r from-blue-100 to-green-100 border-2 border-blue-300">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">
                      🔗 Your Garden Connection!
                    </h4>
                    <p className="text-blue-700 mb-2">{content.content}</p>
                    <div className="bg-white/50 p-2 rounded text-sm">
                      <strong>Current {metric}:</strong> {value}
                      {metric === 'ph' ? '' : metric === 'temperature' ? '°C' : '%'}
                    </div>
                    <p className="text-blue-600 text-sm mt-2">{explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;

      case 'interactive':
        return (
          <InteractiveContent 
            content={content}
            onComplete={() => {}}
          />
        );

      default:
        return <div>{content.content}</div>;
    }
  };

  if (showQuiz && lesson.quiz) {
    return (
      <QuizComponent
        quiz={lesson.quiz}
        onComplete={handleQuizComplete}
        onBack={handlePrevious}
        mascot={mascot}
      />
    );
  }

  return (
    <Card className="shadow-soft border-2 border-child-primary/20 min-h-[600px]">
      <CardHeader className="bg-gradient-child text-white">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lessons
          </Button>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {lesson.difficulty}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {lesson.estimatedTime} min
            </Badge>
          </div>
        </div>
        
        <CardTitle className="flex items-center space-x-3 text-2xl mt-4">
          <div className="text-3xl animate-bounce-gentle">{mascot.emoji}</div>
          <div>
            <div>{lesson.title}</div>
            <div className="text-lg text-child-secondary font-normal">
              {mascot.greeting}
            </div>
          </div>
        </CardTitle>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{currentStep + 1} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="bg-white/20" />
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1">
        <div className="min-h-[300px] flex flex-col justify-center">
          {renderContent(currentContent)}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 && !showQuiz}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= currentStep ? 'bg-child-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <Button
            variant="child"
            onClick={handleNext}
            disabled={lessonCompleted && !lesson.quiz}
          >
            {currentStep === totalSteps - 1 ? (
              lesson.quiz ? (
                <>
                  Take Quiz! <Star className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Complete! <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {lessonCompleted && (
          <Card className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300">
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Lesson Completed!
              </h3>
              <p className="text-green-700">
                Great job! You earned {lesson.rewards.points} points!
              </p>
              {lesson.rewards.badges.length > 0 && (
                <div className="mt-2">
                  <Badge variant="success">
                    New Badge: {lesson.rewards.badges[0]}! 🏆
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonViewer;
