import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Play,
  Lock,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from "lucide-react";
import { learningCategories, learningLessons, learningBadges, funFacts } from "@/data/learningContent";
import { LearningProgress, LearningCategory, FunFact } from "@/types/learning";
import LessonViewer from "./LessonViewer";
import ProgressTracker from "./ProgressTracker";

interface LearningDashboardProps {
  soilData: {
    moisture: number;
    ph: number;
    temperature: number;
    nutrients: number;
  };
}

const LearningDashboard = ({ soilData }: LearningDashboardProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [progress, setProgress] = useState<LearningProgress>({
    userId: 'child-user',
    completedLessons: [],
    totalPoints: 0,
    earnedBadges: [],
    quizScores: {},
    streakDays: 0,
    lastActivityDate: new Date()
  });

  const [categories, setCategories] = useState<LearningCategory[]>(learningCategories);
  const [dailyFact, setDailyFact] = useState<FunFact | null>(null);

  useEffect(() => {
    // Set a random daily fun fact
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setDailyFact(randomFact);
  }, []);

  const totalLessons = learningLessons.length;
  const completedLessons = progress.completedLessons.length;
  const overallProgress = (completedLessons / totalLessons) * 100;

  const getRelevantFacts = () => {
    return funFacts.filter(fact => {
      if (fact.soilDataTrigger) {
        const { metric, condition } = fact.soilDataTrigger;
        const value = soilData[metric];
        
        switch (condition) {
          case 'low':
            return value < 50;
          case 'high':
            return value > 80;
          case 'optimal':
            return value >= 50 && value <= 80;
          default:
            return false;
        }
      }
      return true;
    }).slice(0, 3);
  };

  const handleLessonComplete = (lessonId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      totalPoints: prev.totalPoints + (score * 10),
      quizScores: { ...prev.quizScores, [lessonId]: score },
      lastActivityDate: new Date()
    }));

    // Update category progress
    setCategories(prev => prev.map(cat => {
      const categoryLessons = learningLessons.filter(lesson => lesson.category === cat.id);
      const completed = categoryLessons.filter(lesson => 
        progress.completedLessons.includes(lesson.id) || lesson.id === lessonId
      ).length;
      
      return {
        ...cat,
        completedLessons: completed
      };
    }));
  };

  if (selectedLesson) {
    const lesson = learningLessons.find(l => l.id === selectedLesson);
    if (lesson) {
      return (
        <LessonViewer
          lesson={lesson}
          soilData={soilData}
          onComplete={handleLessonComplete}
          onBack={() => setSelectedLesson(null)}
          isCompleted={progress.completedLessons.includes(selectedLesson)}
        />
      );
    }
  }

  return (
    <Card className="shadow-soft border-2 border-child-primary/20">
      <CardHeader className="bg-gradient-child text-white">
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <div className="text-3xl animate-bounce-gentle">📚</div>
          <span>Garden Learning Adventure!</span>
        </CardTitle>
        <p className="text-child-secondary text-lg">
          Learn amazing things about plants and soil with Dewey and Soily!
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="text-sm">
              <BookOpen className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-sm">
              <Play className="h-4 w-4 mr-1" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-sm">
              <Trophy className="h-4 w-4 mr-1" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-child-primary/10 to-child-accent/10">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-child-primary">
                    {completedLessons}
                  </div>
                  <div className="text-sm text-muted-foreground">Lessons Completed</div>
                  <Progress value={overallProgress} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-yellow-100 to-orange-100">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {progress.totalPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">Learning Points</div>
                  <div className="flex justify-center mt-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {progress.earnedBadges.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                  <div className="flex justify-center mt-2">
                    <Award className="h-5 w-5 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Fun Fact */}
            {dailyFact && (
              <Card className="bg-gradient-to-r from-child-accent/10 to-child-primary/10 border-2 border-child-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl animate-bounce-gentle">{dailyFact.emoji}</div>
                    <div>
                      <h4 className="font-bold text-child-primary text-lg mb-2">
                        🌟 Daily Fun Fact! 🌟
                      </h4>
                      <p className="text-base">{dailyFact.fact}</p>
                      {dailyFact.relatedLesson && (
                        <Button
                          variant="child"
                          size="sm"
                          className="mt-2"
                          onClick={() => setSelectedLesson(dailyFact.relatedLesson!)}
                        >
                          Learn More! 📖
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className="hover:shadow-lg transition-shadow duration-300 cursor-pointer border-2 border-transparent hover:border-child-primary/30"
                  onClick={() => setActiveTab("lessons")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-3 rounded-full ${category.color} text-white text-2xl`}>
                        {category.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{category.completedLessons}/{category.totalLessons}</span>
                      </div>
                      <Progress 
                        value={(category.completedLessons / category.totalLessons) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Soil Data Connections */}
            <Card className="bg-blue-50 border-2 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-blue-800 text-lg mb-3 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Your Garden's Learning Connections!
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💧</span>
                    <span className="text-sm">
                      Your soil moisture ({soilData.moisture}%) is perfect for learning about plant roots!
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🧪</span>
                    <span className="text-sm">
                      Your pH level ({soilData.ph}) shows how soil chemistry works!
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id} className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${category.color} text-white text-xl`}>
                      {category.emoji}
                    </div>
                    <span>{category.name}</span>
                    <Badge variant="outline">
                      {category.completedLessons}/{category.totalLessons}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learningLessons
                      .filter(lesson => lesson.category === category.id)
                      .map((lesson) => {
                        const isCompleted = progress.completedLessons.includes(lesson.id);
                        const isLocked = lesson.prerequisites && 
                          !lesson.prerequisites.every(prereq => progress.completedLessons.includes(prereq));
                        
                        return (
                          <Card 
                            key={lesson.id}
                            className={`cursor-pointer transition-all duration-300 ${
                              isLocked 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:shadow-lg hover:scale-105'
                            } ${isCompleted ? 'border-green-300 bg-green-50' : ''}`}
                            onClick={() => !isLocked && setSelectedLesson(lesson.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-base">{lesson.title}</h4>
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : isLocked ? (
                                  <Lock className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Play className="h-5 w-5 text-child-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {lesson.description}
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center">
                                  <Target className="h-3 w-3 mr-1" />
                                  {lesson.estimatedTime} min
                                </span>
                                <Badge variant={lesson.difficulty === 'beginner' ? 'success' : 'warning'}>
                                  {lesson.difficulty}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTracker progress={progress} categories={categories} />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {learningBadges.map((badge) => {
                const isEarned = progress.earnedBadges.some(earned => earned.id === badge.id);
                return (
                  <Card 
                    key={badge.id}
                    className={`text-center ${
                      isEarned 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : 'opacity-50 border-gray-200'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="text-4xl mb-2">{badge.emoji}</div>
                      <h4 className="font-bold text-lg">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      <Badge 
                        variant={badge.rarity === 'legendary' ? 'destructive' : 
                                badge.rarity === 'epic' ? 'warning' : 'success'}
                      >
                        {badge.rarity}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LearningDashboard;
