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
import { PiggyBank, DollarSign, Calendar, TrendingDown } from "lucide-react";

const SWPCalculator = () => {
  const [initialAmount, setInitialAmount] = useState < string > "1000000";
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState < string > "8000";
  const [expectedReturn, setExpectedReturn] = useState < string > "10";
  const [timePeriod, setTimePeriod] = useState < string > "15";

  const calculateSWP = () => {
    const P = parseFloat(initialAmount);
    const W = parseFloat(monthlyWithdrawal);
    const r = parseFloat(expectedReturn) / 100 / 12; // Monthly return rate
    const n = parseFloat(timePeriod) * 12; // Number of months

    if (P <= 0 || W <= 0 || r <= 0 || n <= 0)
      return {
        remainingAmount: 0,
        totalWithdrawal: 0,
        monthsLastsFor: 0,
        willLastFullTerm: false,
      };

    let currentAmount = P;
    let totalWithdrawn = 0;
    let monthsCompleted = 0;

    // Simulate month by month
    for (let month = 1; month <= n; month++) {
      // Add monthly returns
      currentAmount = currentAmount * (1 + r);

      // Check if we can withdraw
      if (currentAmount >= W) {
        currentAmount -= W;
        totalWithdrawn += W;
        monthsCompleted = month;
      } else {
        // Can't withdraw full amount, portfolio depleted
        break;
      }
    }

    return {
      remainingAmount: Math.round(currentAmount),
      totalWithdrawal: Math.round(totalWithdrawn),
      monthsLastsFor: monthsCompleted,
      willLastFullTerm: monthsCompleted >= n,
    };
  };

  const results = calculateSWP();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            SWP Withdrawal Plan
          </CardTitle>
          <CardDescription>
            Plan your systematic withdrawal from your investment corpus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="initial-amount">Initial Investment (₹)</Label>
            <Input
              id="initial-amount"
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="1000000"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-withdrawal">Monthly Withdrawal (₹)</Label>
            <Input
              id="monthly-withdrawal"
              type="number"
              value={monthlyWithdrawal}
              onChange={(e) => setMonthlyWithdrawal(e.target.value)}
              placeholder="8000"
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
              placeholder="10"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-period">Withdrawal Period (Years)</Label>
            <Input
              id="time-period"
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              placeholder="15"
              className="bg-background"
            />
          </div>

          <Button className="w-full bg-gradient-primary hover:bg-primary/90">
            Calculate SWP Plan
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-warning" />
            Withdrawal Analysis
          </CardTitle>
          <CardDescription>
            Your systematic withdrawal projection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Withdrawn
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  ₹{results.totalWithdrawal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Remaining Amount
                  </span>
                </div>
                <span className="text-lg font-bold text-accent">
                  ₹{results.remainingAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                results.willLastFullTerm
                  ? "bg-accent/10 border-accent/20"
                  : "bg-destructive/10 border-destructive/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar
                    className={`h-4 w-4 ${
                      results.willLastFullTerm
                        ? "text-accent"
                        : "text-destructive"
                    }`}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    Duration
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    results.willLastFullTerm
                      ? "text-accent"
                      : "text-destructive"
                  }`}
                >
                  {Math.floor(results.monthsLastsFor / 12)} years{" "}
                  {results.monthsLastsFor % 12} months
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            {results.willLastFullTerm ? (
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium text-accent mb-1">
                  ✅ Sustainable Plan
                </p>
                <p className="text-xs text-muted-foreground">
                  Your corpus will last the full {timePeriod} years with ₹
                  {results.remainingAmount.toLocaleString("en-IN")} remaining
                </p>
              </div>
            ) : (
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm font-medium text-destructive mb-1">
                  ⚠️ Plan Not Sustainable
                </p>
                <p className="text-xs text-muted-foreground">
                  Your corpus will be depleted in{" "}
                  {Math.floor(results.monthsLastsFor / 12)} years. Consider
                  reducing monthly withdrawal.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SWPCalculator;
