import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState("5000");
  const [expectedReturn, setExpectedReturn] = useState("12");
  const [timePeriod, setTimePeriod] = useState("10");

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(expectedReturn) / 100 / 12; 
    const n = parseFloat(timePeriod) * 12; 

    if (P <= 0 || r <= 0 || n <= 0)
      return { maturityAmount: 0, totalInvestment: 0, totalReturns: 0 };

    // SIP Formula: M = P × [{(1 + r)^n - 1} / r] × (1 + r)
    const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const totalInvestment = P * n;
    const totalReturns = maturityAmount - totalInvestment;

    return {
      maturityAmount: Math.round(maturityAmount),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
    };
  };

  const results = calculateSIP();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            SIP Investment Details
          </CardTitle>
          <CardDescription>
            Enter your systematic investment plan details to calculate returns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
            <Input
              id="monthly-investment"
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              placeholder="5000"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
            <Input
              id="expected-return"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="12"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-period">Time Period (Years)</Label>
            <Input
              id="time-period"
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              placeholder="10"
              className="bg-background"
            />
          </div>

          <Button className="w-full bg-gradient-primary hover:bg-primary/90">
            Calculate SIP Returns
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Investment Results
          </CardTitle>
          <CardDescription>Your SIP investment projection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Investment
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  ₹{results.totalInvestment.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Returns
                  </span>
                </div>
                <span className="text-lg font-bold text-accent">
                  ₹{results.totalReturns.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-success border border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                  <span className="text-sm font-medium text-accent-foreground">
                    Maturity Amount
                  </span>
                </div>
                <span className="text-xl font-bold text-accent-foreground">
                  ₹{results.maturityAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {results.totalInvestment > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Wealth Multiplier
                </p>
                <p className="text-2xl font-bold text-primary">
                  {(results.maturityAmount / results.totalInvestment).toFixed(
                    1
                  )}
                  x
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your money will grow{" "}
                  {(
                    results.maturityAmount / results.totalInvestment -
                    1
                  ).toFixed(1)}{" "}
                  times
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SIPCalculator;
