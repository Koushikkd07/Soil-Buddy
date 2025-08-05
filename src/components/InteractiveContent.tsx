import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, X, RotateCcw } from "lucide-react";
import { LessonContent } from "@/types/learning";

interface InteractiveContentProps {
  content: LessonContent;
  onComplete: () => void;
}

const InteractiveContent = ({ content, onComplete }: InteractiveContentProps) => {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!content.interactive) return null;

  const { type, data, feedback } = content.interactive;

  const checkAnswer = (answer: any) => {
    setUserAnswer(answer);
    setAttempts(attempts + 1);
    
    let correct = false;
    
    switch (type) {
      case 'matching':
        correct = data.items.every((item: any) => 
          answer[item.id] === item.match
        );
        break;
      case 'drag-drop':
        correct = JSON.stringify(answer) === JSON.stringify(data.correctOrder || data.ingredients);
        break;
      case 'slider':
        const value = answer[0];
        correct = value >= data.optimal[0] && value <= data.optimal[1];
        break;
      default:
        correct = answer === data.correctAnswer;
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const resetActivity = () => {
    setUserAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const renderMatchingGame = () => {
    const [matches, setMatches] = useState<Record<string, string>>({});
    
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-center">{content.title}</h4>
        <p className="text-center text-muted-foreground">{content.content}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h5 className="font-semibold">Match these:</h5>
            {data.items.map((item: any) => (
              <Card 
                key={item.id}
                className={`p-3 cursor-pointer transition-colors ${
                  matches[item.id] ? 'bg-child-primary/20 border-child-primary' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {matches[item.id] && (
                    <Badge variant="child">{data.matches.find((m: any) => m.id === matches[item.id])?.text}</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="space-y-2">
            <h5 className="font-semibold">With these:</h5>
            {data.matches.map((match: any) => (
              <Button
                key={match.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const selectedItem = data.items.find((item: any) => 
                    !Object.values(matches).includes(match.id)
                  );
                  if (selectedItem) {
                    const newMatches = { ...matches, [selectedItem.id]: match.id };
                    setMatches(newMatches);
                    
                    if (Object.keys(newMatches).length === data.items.length) {
                      checkAnswer(newMatches);
                    }
                  }
                }}
                disabled={Object.values(matches).includes(match.id)}
              >
                {match.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDragDropGame = () => {
    const [orderedItems, setOrderedItems] = useState<string[]>([]);
    const [availableItems] = useState<string[]>(data.ingredients || []);
    
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-center">{content.title}</h4>
        <p className="text-center text-muted-foreground">{content.content}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h5 className="font-semibold">Available Items:</h5>
            <div className="space-y-2">
              {availableItems.filter(item => !orderedItems.includes(item)).map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const newOrder = [...orderedItems, item];
                    setOrderedItems(newOrder);
                    
                    if (newOrder.length === availableItems.length) {
                      checkAnswer(newOrder);
                    }
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-semibold">Your Recipe:</h5>
            <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4">
              {orderedItems.length === 0 ? (
                <p className="text-gray-500 text-center">Drag items here!</p>
              ) : (
                <div className="space-y-2">
                  {orderedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-child-primary/10 p-2 rounded">
                      <span>{index + 1}. {item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setOrderedItems(orderedItems.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {orderedItems.length === availableItems.length && (
                    <div className="text-center mt-4 p-3 bg-green-100 rounded">
                      <span className="text-2xl">✨</span>
                      <p className="font-bold text-green-800">{data.result}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSliderGame = () => {
    const [value, setValue] = useState([7]);
    
    return (
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-center">{content.title}</h4>
        <p className="text-center text-muted-foreground">{content.content}</p>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {value[0] <= 3 ? '😠' : value[0] <= 5 ? '😐' : value[0] <= 8 ? '😊' : '😤'}
            </div>
            <div className="text-2xl font-bold">pH: {value[0]}</div>
          </div>
          
          <div className="px-4">
            <Slider
              value={value}
              onValueChange={setValue}
              max={data.max}
              min={data.min}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{data.labels[data.min]}</span>
              <span>{data.labels[7]}</span>
              <span>{data.labels[data.max]}</span>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              variant="child"
              onClick={() => checkAnswer(value)}
              disabled={showFeedback}
            >
              Check Answer!
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-2 border-child-primary/30">
      <CardContent className="p-6">
        {type === 'matching' && renderMatchingGame()}
        {type === 'drag-drop' && renderDragDropGame()}
        {type === 'slider' && renderSliderGame()}
        
        {showFeedback && (
          <Card className={`mt-6 ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-orange-100 border-orange-300'}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <X className="h-6 w-6 text-orange-600" />
                )}
                <div>
                  <p className={`font-bold ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                    {isCorrect ? feedback.correct : feedback.incorrect}
                  </p>
                  {!isCorrect && attempts < 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetActivity}
                      className="mt-2"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveContent;
