import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Baby, Heart, Leaf } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Login = () => {
  const [userType, setUserType] = useState<"child" | "elder" | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === "child") {
      navigate("/child-dashboard");
    } else if (userType === "elder") {
      navigate("/elder-dashboard");
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-4 shadow-glow">
                <Leaf className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🌱 {t('app.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('app.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Children Side */}
            <Card 
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow border-2 hover:border-child-primary bg-gradient-to-br from-child-primary/10 to-child-secondary/10"
              onClick={() => setUserType("child")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-child-primary rounded-full p-6 mb-4 animate-bounce-gentle">
                  <Baby className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-child-primary">
                  {t('login.children.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center space-x-2 text-3xl mb-4">
                  <span className="animate-wiggle">🌻</span>
                  <span className="animate-bounce-gentle">🐛</span>
                  <span className="animate-wiggle">🌱</span>
                </div>
                <p className="text-lg text-muted-foreground">
                  {t('login.children.description')}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span>🏆</span>
                    <span>{t('login.children.badges')}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🎮</span>
                    <span>{t('login.children.games')}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🌈</span>
                    <span>{t('login.children.reports')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Elder Side */}
            <Card 
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-soft border-2 hover:border-elder-primary bg-gradient-to-br from-elder-primary/10 to-elder-secondary/10"
              onClick={() => setUserType("elder")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-elder-primary rounded-full p-6 mb-4">
                  <Heart className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-elder-primary">
                  {t('login.elder.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center space-x-2 text-3xl mb-4">
                  <span>🌳</span>
                  <span>📊</span>
                  <span>🔊</span>
                </div>
                <p className="text-lg text-muted-foreground">
                  {t('login.elder.description')}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span>📈</span>
                    <span>{t('login.elder.charts')}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🔊</span>
                    <span>{t('login.elder.audio')}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>📋</span>
                    <span>{t('login.elder.reports')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-muted-foreground">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <p>{t('login.chooseExperience')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {userType === "child" ? (
              <div className="bg-child-primary rounded-full p-4 animate-pulse-glow">
                <Baby className="h-8 w-8 text-white" />
              </div>
            ) : (
              <div className="bg-elder-primary rounded-full p-4">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
            )}
          </div>
          <CardTitle className={`text-2xl ${userType === "child" ? "text-child-primary" : "text-elder-primary"}`}>
            {userType === "child" ? t('login.children.login') : t('login.elder.login')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className={userType === "elder" ? "text-lg" : ""}>
                {userType === "child" ? t('login.children.username') : t('login.elder.username')}
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className={userType === "elder" ? "text-lg p-4" : ""}
                placeholder={userType === "child" ? t('login.children.usernamePlaceholder') : t('login.elder.usernamePlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className={userType === "elder" ? "text-lg" : ""}>
                {userType === "child" ? t('login.children.password') : t('login.elder.password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className={userType === "elder" ? "text-lg p-4" : ""}
                placeholder={userType === "child" ? t('login.children.passwordPlaceholder') : t('login.elder.passwordPlaceholder')}
                required
              />
            </div>
            <div className="space-y-4">
              <Button 
                type="submit" 
                variant={userType === "child" ? "child" : "elder"}
                size={userType === "elder" ? "xl" : "lg"}
                className="w-full"
              >
                {userType === "child" ? t('login.children.loginButton') : t('login.elder.loginButton')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setUserType(null)}
                className="w-full"
              >
                {t('login.goBack')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;