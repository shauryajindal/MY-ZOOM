import { Router } from "express";
import {
  create,
  getMeeting,
  update,
  start,
  end,
  joinMeetingController,
  leaveMeetingController
} from "../controllers/meeting.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, create);

router.get("/:roomId", authMiddleware, getMeeting);

router.patch("/:roomId", authMiddleware, update);

router.post("/:roomId/start", authMiddleware, start);

router.post("/:roomId/end", authMiddleware, end);

router.post(
  "/:roomId/join",
  authMiddleware,
  joinMeetingController
);

router.post(
  "/:roomId/leave",
  authMiddleware,
  leaveMeetingController
);

export default router;