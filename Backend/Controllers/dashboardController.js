import User from '../Models/User.js';
import Roadmap from '../Models/roadmap.js';

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;

    let user = null;
    if (userId) {
      user = await User.findById(userId).select('-password');
    }

    const progress = await Progress.findOne({ user: userId }) || {
      completedMilestones: 3,
      totalMilestones: 10,
      streak: 4,
    };

    const nextStep = "Learn React Basics";

    const aiTip = "Focus on small projects to strengthen your skills.";

    const dashboardData = {
      name: user ? user.name : "Demo User",
      completedMilestones: progress.completedMilestones,
      totalMilestones: progress.totalMilestones,
      nextStep,
      aiTip,
      progressPercent: Math.round((progress.completedMilestones / progress.totalMilestones) * 100),
      streak: progress.streak,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};
