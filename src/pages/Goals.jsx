import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Target,
  Trophy,
  Calendar,
  DollarSign,
  Edit,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    target_amount: "",
    current_amount: "",
    target_date: "",
    category: "general",
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("financial_goals").insert({
        user_id: user.id,
        name: newGoal.name,
        description: newGoal.description || null,
        target_amount: parseFloat(newGoal.target_amount),
        current_amount: parseFloat(newGoal.current_amount) || 0,
        target_date: newGoal.target_date || null,
        category: newGoal.category,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal created successfully",
      });

      setIsAddDialogOpen(false);
      setNewGoal({
        name: "",
        description: "",
        target_amount: "",
        current_amount: "",
        target_date: "",
        category: "general",
      });
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    }
  };

  const handleCompleteGoal = async (goalId) => {
    try {
      const { error } = await supabase
        .from("financial_goals")
        .update({ is_completed: true })
        .eq("id", goalId);

      if (error) throw error;

      toast({
        title: "Congratulations!",
        description: "Goal marked as completed",
      });

      fetchGoals();
    } catch (error) {
      console.error("Error completing goal:", error);
      toast({
        title: "Error",
        description: "Failed to complete goal",
        variant: "destructive",
      });
    }
  };

  const getGoalProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysUntilTarget = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "#3B82F6",
      emergency: "#EF4444",
      vacation: "#10B981",
      home: "#F59E0B",
      education: "#8B5CF6",
      retirement: "#06B6D4",
    };
    return colors[category] || "#3B82F6";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter((goal) => !goal.is_completed);
  const completedGoals = goals.filter((goal) => goal.is_completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">
            Set and track your financial objectives
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a financial target and track your progress
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal..."
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="target_amount">Target Amount</Label>
                <Input
                  id="target_amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newGoal.target_amount}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      target_amount: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="current_amount">Current Amount</Label>
                <Input
                  id="current_amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newGoal.current_amount}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      current_amount: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="target_date">Target Date (Optional)</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      target_date: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newGoal.category}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="general">General</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="vacation">Vacation</option>
                  <option value="home">Home</option>
                  <option value="education">Education</option>
                  <option value="retirement">Retirement</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Create Goal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map((goal) => {
              const progress = getGoalProgress(
                goal.current_amount,
                goal.target_amount
              );
              const daysUntilTarget = getDaysUntilTarget(goal.target_date);
              const categoryColor = getCategoryColor(goal.category);

              return (
                <Card key={goal.id} className="bg-gradient-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        {goal.description && (
                          <CardDescription className="mt-1">
                            {goal.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${categoryColor}20`,
                          color: categoryColor,
                        }}
                      >
                        {goal.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="font-semibold">
                          ${goal.current_amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="font-semibold">
                          ${goal.target_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {goal.target_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {daysUntilTarget !== null
                            ? daysUntilTarget > 0
                              ? `${daysUntilTarget} days left`
                              : daysUntilTarget === 0
                              ? "Target date is today"
                              : `${Math.abs(daysUntilTarget)} days overdue`
                            : "No target date"}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                      {progress >= 100 && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteGoal(goal.id)}
                          className="bg-accent hover:bg-accent/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Completed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map((goal) => (
              <Card
                key={goal.id}
                className="bg-gradient-card border-border opacity-75"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      {goal.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-accent/20 text-accent"
                    >
                      Completed
                    </Badge>
                  </div>
                  {goal.description && (
                    <CardDescription>{goal.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">
                        ${goal.target_amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold capitalize">
                        {goal.category}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Set your first financial goal to start tracking your progress
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Goals;
