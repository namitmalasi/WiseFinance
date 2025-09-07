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
import { CreditCard, DollarSign, Calendar, Percent } from "lucide-react";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState < string > "1000000";
  const [interestRate, setInterestRate] = useState < string > "9.5";
  const [tenure, setTenure] = useState < string > "20";

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(tenure) * 12; // Number of months

    if (P <= 0 || r <= 0 || n <= 0)
      return {
        emi: 0,
        totalAmount: 0,
        totalInterest: 0,
        monthlyRate: 0,
      };

    // EMI Formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n – 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      monthlyRate: r * 100,
    };
  };

  const results = calculateEMI();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Loan Details
          </CardTitle>
          <CardDescription>
            Enter your loan parameters to calculate EMI and total interest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
            <Input
              id="loan-amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="1000000"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="9.5"
              step="0.1"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenure">Loan Tenure (Years)</Label>
            <Input
              id="tenure"
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="20"
              className="bg-background"
            />
          </div>

          <Button className="w-full bg-gradient-primary hover:bg-primary/90">
            Calculate EMI
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-warning" />
            EMI Breakdown
          </CardTitle>
          <CardDescription>Your loan EMI and payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Monthly EMI
                  </span>
                </div>
                <span className="text-xl font-bold text-warning">
                  ₹{results.emi.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Principal Amount
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  ₹{parseFloat(loanAmount || "0").toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Interest
                  </span>
                </div>
                <span className="text-lg font-bold text-destructive">
                  ₹{results.totalInterest.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/10 border border-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  ₹{results.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {results.emi > 0 && (
            <div className="mt-6 pt-4 border-t border-border space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Interest vs Principal Ratio
                </span>
                <span className="font-medium">
                  {(
                    results.totalInterest / parseFloat(loanAmount || "1")
                  ).toFixed(2)}
                  :1
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Payments</span>
                <span className="font-medium">
                  {parseFloat(tenure || "0") * 12} months
                </span>
              </div>

              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <p className="text-sm font-medium text-warning mb-1">
                  Monthly Payment Breakdown
                </p>
                <p className="text-xs text-muted-foreground">
                  You'll pay ₹{results.emi.toLocaleString("en-IN")} monthly for{" "}
                  {tenure} years
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EMICalculator;
