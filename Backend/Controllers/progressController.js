import Roadmap from "../Models/roadmap.js";

export const updateProgress = async (req, res) => {
  try {
    const { id: roadmapId } = req.params;
    const { stepId, stepOrder, status, pointsEarned } = req.body;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const allowedStatuses = ["pending", "in-progress", "completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    let updatedStep = null;

    if (stepId) {
      const step = roadmap.steps.find((s) => String(s.id) === String(stepId));
      if (!step) {
        return res.status(404).json({ message: "Step not found" });
      }
      if (status) step.status = status;
      if (typeof stepOrder === "number") step.order = stepOrder;
      updatedStep = step;
    } else {
      if (typeof stepOrder === "number") {
        const step = roadmap.steps.find((s) => s.order === stepOrder);
        if (!step) {
          return res.status(404).json({ message: "Step not found" });
        }
        if (status) step.status = status;
        updatedStep = step;
      }
    }

    if (typeof pointsEarned === "number") {
      roadmap.pointsEarned += pointsEarned;
    }

    await roadmap.save();

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: updatedStep ? { step: updatedStep, roadmapId: roadmap._id } : roadmap,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    res.json({ steps: roadmap.steps, pointsEarned: roadmap.pointsEarned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
