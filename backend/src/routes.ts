import { Router, Request, Response } from "express";
import { db } from "./db";
import { users, userInterests, interests } from "./schema";
import { eq, and } from "drizzle-orm";

const router = Router();

// Helper function to convert database user to API response format
function formatUserResponse(userData: any, interestData: any[]) {
  return {
    ...userData,
    school: userData.university,
    avatarUrl: userData.profilePhoto,
    interests: interestData.map((ui) => ui.interestName).filter(Boolean),
  };
}

// Resolve user ID (handle "me" as user ID 1)
function resolveUserId(userIdParam: string): number {
  if (userIdParam === "me") {
    return 1; // Default to user ID 1 for demo/testing
  }
  return parseInt(userIdParam, 10);
}

// Get user by ID with interests
router.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const id = resolveUserId(req.params.userId);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Get user data
    const user = await db.select().from(users).where(eq(users.userId, id)).limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user interests
    const userInterestData = await db
      .select({
        interestId: interests.interestId,
        interestName: interests.interestName,
      })
      .from(userInterests)
      .leftJoin(interests, eq(userInterests.interestId, interests.interestId))
      .where(eq(userInterests.userId, id));

    const userData = user[0];
    res.json(formatUserResponse(userData, userInterestData));
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update user profile
router.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const id = resolveUserId(req.params.userId);
    const { name, age, university, major, hometown, quote, profilePhoto, interests: selectedInterests, interestThreshold } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.userId, id)).limit(1);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data
    const updatedUser = await db
      .update(users)
      .set({
        name: name || existingUser[0].name,
        age: age !== undefined ? age : existingUser[0].age,
        university: university || existingUser[0].university,
        major: major || existingUser[0].major,
        hometown: hometown || existingUser[0].hometown,
        quote: quote || existingUser[0].quote,
        profilePhoto: profilePhoto || existingUser[0].profilePhoto,
        interestThreshold: interestThreshold !== undefined ? interestThreshold : existingUser[0].interestThreshold,
        updatedAt: new Date(),
      })
      .where(eq(users.userId, id))
      .returning();

    // Update interests if provided
    if (selectedInterests && Array.isArray(selectedInterests)) {
      // Delete existing interests
      await db.delete(userInterests).where(eq(userInterests.userId, id));

      // Insert new interests
      for (const interestName of selectedInterests) {
        // Find or create interest
        let interest = await db
          .select()
          .from(interests)
          .where(eq(interests.interestName, interestName))
          .limit(1);

        let interestId: number;
        if (interest && interest.length > 0) {
          interestId = interest[0].interestId;
        } else {
          const newInterest = await db
            .insert(interests)
            .values({ interestName })
            .returning();
          interestId = newInterest[0].interestId;
        }

        await db.insert(userInterests).values({
          userId: id,
          interestId,
        });
      }
    }

    // Fetch updated user with interests
    const userInterestData = await db
      .select({
        interestId: interests.interestId,
        interestName: interests.interestName,
      })
      .from(userInterests)
      .leftJoin(interests, eq(userInterests.interestId, interests.interestId))
      .where(eq(userInterests.userId, id));

    const userData = updatedUser[0];
    res.json(formatUserResponse(userData, userInterestData));
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
