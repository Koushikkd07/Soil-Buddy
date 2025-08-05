import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Sprout, Heart, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full p-6 shadow-glow animate-pulse-glow">
              <Leaf className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-primary mb-4">
            🌱 SoilBuddy
          </h1>
          <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Smart soil monitoring for every gardener - from curious kids to experienced growers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-lg">
            <span className="bg-success/20 px-4 py-2 rounded-full">📊 Real-time monitoring</span>
            <span className="bg-child-primary/20 px-4 py-2 rounded-full">🎮 Kid-friendly interface</span>
            <span className="bg-elder-primary/20 px-4 py-2 rounded-full">👴 Elder-friendly design</span>
            <span className="bg-primary/20 px-4 py-2 rounded-full">🤖 AI garden assistant</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:scale-105 transition-all duration-300 shadow-soft">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-6 mb-4 w-20 h-20 flex items-center justify-center">
                <Sprout className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl">Smart Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect your physical soil sensor to get real-time data on pH, moisture, temperature, and nutrients.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:scale-105 transition-all duration-300 shadow-soft">
            <CardHeader>
              <div className="mx-auto bg-child-primary/10 rounded-full p-6 mb-4 w-20 h-20 flex items-center justify-center">
                <Users className="h-10 w-10 text-child-primary" />
              </div>
              <CardTitle className="text-xl">For Everyone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Designed with both children and elderly users in mind, featuring age-appropriate interfaces and interactions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:scale-105 transition-all duration-300 shadow-soft">
            <CardHeader>
              <div className="mx-auto bg-primary-glow/10 rounded-full p-6 mb-4 w-20 h-20 flex items-center justify-center">
                <Heart className="h-10 w-10 text-primary-glow" />
              </div>
              <CardTitle className="text-xl">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get personalized recommendations from our garden chatbot to improve your soil health and plant growth.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-primary-glow/10 border-2 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Ready to Start Your Garden Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of gardeners already using SoilBuddy to grow healthier plants with data-driven insights.
              </p>
              <div className="space-y-4">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto sm:px-12"
                  onClick={() => navigate("/login")}
                >
                  Get Started Today
                </Button>
                <div className="text-sm text-muted-foreground">
                  Works with any IoT soil monitoring device
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border">
          <div className="flex justify-center space-x-8 text-muted-foreground">
            <span>🌱 Soil Health</span>
            <span>📱 Mobile Friendly</span>
            <span>🔊 Voice Support</span>
            <span>🏆 Gamified Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
