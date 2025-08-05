import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Star, 
  Target,
  BookOpen,
  Trophy,
  Flame,
  Clock
} from "lucide-react";
import { LearningProgress, LearningCategory } from "@/types/learning";

interface ProgressTrackerProps {
  progress: LearningProgress;
  categories: LearningCategory[];
}

const ProgressTracker = ({ progress, categories }: ProgressTrackerProps) => {
  const totalLessons = categories.reduce((sum, cat) => sum + cat.totalLessons, 0);
  const completedLessons = progress.completedLessons.length;
  const overallProgress = (completedLessons / totalLessons) * 100;

  const averageQuizScore = Object.keys(progress.quizScores).length > 0
    ? Object.values(progress.quizScores).reduce((sum, score) => sum + score, 0) / Object.keys(progress.quizScores).length
    : 0;

  const getProgressLevel = () => {
    if (overallProgress >= 90) return { level: "Garden Master", emoji: "🏆", color: "text-yellow-600" };
    if (overallProgress >= 70) return { level: "Plant Expert", emoji: "🌟", color: "text-green-600" };
    if (overallProgress >= 50) return { level: "Growing Gardener", emoji: "🌱", color: "text-blue-600" };
    if (overallProgress >= 25) return { level: "Seedling Learner", emoji: "🌿", color: "text-emerald-600" };
    return { level: "New Sprout", emoji: "🌱", color: "text-gray-600" };
  };

  const progressLevel = getProgressLevel();

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-r from-child-primary/10 to-child-accent/10 border-2 border-child-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="text-3xl">{progressLevel.emoji}</div>
            <div>
              <div className={`text-2xl font-bold ${progressLevel.color}`}>
                {progressLevel.level}
              </div>
              <div className="text-sm text-muted-foreground">
                Your current learning level
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{completedLessons}/{totalLessons} lessons</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="text-center mt-2 text-lg font-bold text-child-primary">
                {overallProgress.toFixed(0)}% Complete!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{completedLessons}</div>
            <div className="text-sm text-muted-foreground">Lessons Completed</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">{progress.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{progress.earnedBadges.length}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{progress.streakDays}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-child-primary" />
            <span>Progress by Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryProgress = (category.completedLessons / category.totalLessons) * 100;
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${category.color} text-white text-lg`}>
                        {category.emoji}
                      </div>
                      <div>
                        <h4 className="font-semibold">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {category.completedLessons}/{category.totalLessons}
                      </div>
                      <Badge 
                        variant={categoryProgress === 100 ? 'success' : categoryProgress > 0 ? 'warning' : 'outline'}
                        className="text-xs"
                      >
                        {categoryProgress.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={categoryProgress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Performance */}
      {Object.keys(progress.quizScores).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span>Quiz Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {averageQuizScore.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Average Quiz Score</div>
                <div className="mt-2">
                  {averageQuizScore >= 90 && <Badge variant="success">Excellent! 🌟</Badge>}
                  {averageQuizScore >= 70 && averageQuizScore < 90 && <Badge variant="warning">Great! 👍</Badge>}
                  {averageQuizScore >= 50 && averageQuizScore < 70 && <Badge variant="outline">Good! 👌</Badge>}
                  {averageQuizScore < 50 && <Badge variant="outline">Keep Learning! 📚</Badge>}
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-semibold text-sm">Recent Quiz Scores:</h5>
                {Object.entries(progress.quizScores).slice(-5).map(([lessonId, score]) => (
                  <div key={lessonId} className="flex justify-between items-center text-sm">
                    <span className="truncate">{lessonId.replace('-', ' ')}</span>
                    <Badge 
                      variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'outline'}
                      className="text-xs"
                    >
                      {score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span>Learning Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Last Activity:</span>
              </div>
              <span className="text-sm font-medium">
                {progress.lastActivityDate.toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-sm">Current Streak:</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{progress.streakDays} days</span>
                {progress.streakDays > 0 && <span className="text-orange-500">🔥</span>}
              </div>
            </div>

            {progress.streakDays === 0 && (
              <div className="bg-child-primary/10 p-3 rounded-lg text-center">
                <p className="text-sm text-child-primary font-medium">
                  🌱 Start your learning streak today! Complete a lesson to begin!
                </p>
              </div>
            )}

            {progress.streakDays >= 7 && (
              <div className="bg-yellow-100 p-3 rounded-lg text-center">
                <p className="text-sm text-yellow-800 font-medium">
                  🏆 Amazing! You've been learning for a whole week! Keep it up!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300">
        <CardContent className="p-4 text-center">
          <div className="text-3xl mb-2">🌟</div>
          <h4 className="font-bold text-green-800 mb-2">Keep Growing!</h4>
          <p className="text-green-700 text-sm">
            {overallProgress < 25 && "Every expert was once a beginner. You're doing great!"}
            {overallProgress >= 25 && overallProgress < 50 && "You're making wonderful progress! Keep learning!"}
            {overallProgress >= 50 && overallProgress < 75 && "Wow! You're becoming a real garden expert!"}
            {overallProgress >= 75 && overallProgress < 100 && "Almost there! You're so close to mastering everything!"}
            {overallProgress === 100 && "Congratulations! You're a true Garden Master! 🏆"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
