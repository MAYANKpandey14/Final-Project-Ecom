import connectToDB from "@/database";
import User from "@/models/user";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const schema = Joi.object({
  password: Joi.string().password().required(),
  email: Joi.string().email().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { password, email } = await req.json();

  const { error } = schema.validate({ password, email });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Account not found with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    existingUser.password=hashedPassword;
    await existingUser.save();

    const token = jwt.sign(
      {
        id: findUser._id,
        email: findUser?.email,
        role: findUser?.role,
      },
      "default_secret_key",
      { expiresIn: "1d" }
    );

    const finalData = {
      token,
      user: {
        email: existingUser.email,
        name: existingUser.name,
        _id: existingUser._id,
        role: existingUser.role,
      },
    };

    return NextResponse.json({
      success: true,
      message: "Password updated successfully !",
      finalData,
    });
  } catch (e) {
    console.log("Error while updating password. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
