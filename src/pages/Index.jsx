import {
  Calculator,
  TrendingUp,
  PiggyBank,
  Target,
  CreditCard,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SIPCalculator from "@/components/calculators/SIPCalculator";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import EMICalculator from "@/components/calculators/EMICalculator";

const Index = () => {
  const [activeCalculator, setActiveCalculator] = useState(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Overview of your financial status",
      icon: TrendingUp,
      route: "/dashboard",
    },
    {
      id: "transactions",
      title: "Transactions",
      description: "Track income and expenses",
      icon: CreditCard,
      route: "/transactions",
    },
    {
      id: "budgets",
      title: "Budgets",
      description: "Manage your spending limits",
      icon: Target,
      route: "/budgets",
    },
    {
      id: "goals",
      title: "Financial Goals",
      description: "Set and track your financial objectives",
      icon: Target,
      route: "/goals",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Visualize your spending patterns",
      icon: PiggyBank,
      route: "/analytics",
    },
  ];

  const calculators = [
    {
      id: "sip",
      title: "SIP Calculator",
      description: "Calculate returns from Systematic Investment Plan",
      icon: TrendingUp,
      component: SIPCalculator,
    },
    {
      id: "swp",
      title: "SWP Calculator",
      description: "Plan your Systematic Withdrawal Plan",
      icon: PiggyBank,
      component: SWPCalculator,
    },
    {
      id: "loan",
      title: "Loan EMI Calculator",
      description: "Calculate loan EMI and interest",
      icon: CreditCard,
      component: EMICalculator,
    },
  ];

  const ActiveComponent = activeCalculator
    ? calculators.find((calc) => calc.id === activeCalculator)?.component
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  WiseFinance
                </h1>
                <p className="text-muted-foreground">
                  Professional Financial Planning Tools
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!activeCalculator ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Complete Financial Management
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track expenses, manage budgets, set goals, and make informed
                financial decisions with our comprehensive suite of tools.
              </p>
            </section>

            {/* Financial Management Features */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={feature.id}
                    className="group hover:shadow-financial transition-all duration-300 cursor-pointer border-border bg-gradient-card"
                    onClick={() => (window.location.href = feature.route)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-card-foreground">
                          {feature.title}
                        </CardTitle>
                      </div>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Open {feature.title}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </section>

            {/* Financial Calculators */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">
                  Financial Calculators
                </h3>
                <p className="text-muted-foreground">
                  Use our specialized calculators for investment and loan
                  planning
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {calculators.map((calculator) => {
                  const IconComponent = calculator.icon;
                  return (
                    <Card
                      key={calculator.id}
                      className="group hover:shadow-financial transition-all duration-300 cursor-pointer border-border bg-gradient-card"
                      onClick={() => setActiveCalculator(calculator.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-card-foreground">
                            {calculator.title}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          {calculator.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Open Calculator
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Accurate Calculations</h3>
                <p className="text-sm text-muted-foreground">
                  Precise financial calculations using industry-standard
                  formulas
                </p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Plan for different time horizons and financial goals
                </p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-warning/10 w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Goal-Oriented</h3>
                <p className="text-sm text-muted-foreground">
                  Set and track your financial goals with clear visualizations
                </p>
              </div>
            </section>
          </>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setActiveCalculator(null)}
              >
                ← Back to Dashboard
              </Button>
              <h2 className="text-2xl font-bold">
                {
                  calculators.find((calc) => calc.id === activeCalculator)
                    ?.title
                }
              </h2>
            </div>
            {ActiveComponent && <ActiveComponent />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
