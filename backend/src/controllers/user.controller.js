import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`);

const createUserOrUpdateUserData = asyncHandler(async (req, res) => {
  //   console.log(req.body);

  try {
    const idToken = req.body.idToken;
    const examArray = req.body.examArray;
    // console.log(examArray, Array.isArray(examArray));

    if (!idToken) {
      return res
        .status(200)
        .json(new apiResponse(400, {}, "idToken doesnot exists!"));
    }

    let payload;

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
      // console.log(ticket);

      payload = ticket.getPayload();
    } catch (error) {
      console.log("Ticket error", error);
      return res
        .status(200)
        .json(new apiResponse(400, {}, "idToken is invalid!"));
    }

    console.log(payload);
    const { email, name, picture, sub, email_verified } = payload;

    const doesUserExists = await User.findOne({ email });
    if (doesUserExists) {
      if (!Array.isArray(examArray)) {
        return res
          .status(200)
          .json(new apiResponse(400, {}, "Invalid examArray format!"));
      }

      await User.findByIdAndUpdate(
        doesUserExists._id,
        {
          $set: { examArray },
        },
        { new: true }
      );

      return res
        .status(200)
        .json(new apiResponse(200, {}, "Exam list updated successfully!"));
    }

    const newUser = await User.create({
      email,
      fullName: name,
      avatar: picture,
      googleId: sub,
      email_verified,
      examArray: Array.isArray(examArray) ? examArray : [],
    });

    return res
      .status(201)
      .json(new apiResponse(201, newUser, "User created successfully!"));
  } catch (error) {
    console.log(error);
  }
});

const sendUserData = asyncHandler(async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res
      .status(200)
      .json(new apiResponse(400, {}, "idToken doesnot exists!"));
  }

  let payload;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: `${process.env.GOOGLE_CLIENT_ID}`,
    });
    // console.log(ticket);

    payload = ticket.getPayload();
  } catch (error) {
    // console.log("Ticket error", error);
    return res
      .status(200)
      .json(new apiResponse(400, {}, "idToken is invalid!"));
  }

  const { email } = payload;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json(new apiResponse(404, {}, "No user found!"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "User data recieved successfully!"));
});

export { createUserOrUpdateUserData, sendUserData };
