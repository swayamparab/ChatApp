import { Request, Response } from "express";
import { ZodError } from "zod";

import { acceptChatRequestSchema, sendChatRequestSchema } from "./chat-request.validation";
import { acceptChatRequest, sendChatRequest } from "./chat-request.service";

export async function sendChatRequestController(
  req: Request,
  res: Response
) {
  try {
    const data = sendChatRequestSchema.parse(req.body);

    const chatRequest = await sendChatRequest(req.userId, data);

    return res.status(201).json({
      success: true,
      message: "Chat request sent successfully",
      chatRequest,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      switch (error.message) {
        case "You cannot send a chat request to yourself":
          return res.status(400).json({
            success: false,
            message: error.message,
          });

        case "User not found":
          return res.status(404).json({
            success: false,
            message: error.message,
          });

        case "Chat request already sent":
          return res.status(409).json({
            success: false,
            message: error.message,
          });
        case "You already have a conversation with this user":
          return res.status(409).json({
            success: false,
            message: error.message,
          });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function acceptChatRequestController(
  req: Request,
  res: Response
) {
  try {
    const data = acceptChatRequestSchema.parse(req.params);

    const conversation = await acceptChatRequest(req.userId, data);

    return res.status(200).json({
      success: true,
      message: "Chat request accepted successfully",
      conversation,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      switch (error.message) {
        case "Chat request not found":
          return res.status(404).json({
            success: false,
            message: error.message,
          });

        case "You are not authorized to accept this request":
          return res.status(403).json({
            success: false,
            message: error.message,
          });

        case "Chat request already handled":
          return res.status(409).json({
            success: false,
            message: error.message,
          });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}