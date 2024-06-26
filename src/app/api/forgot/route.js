import connectToDB from "@/database";
import User from "@/models/user";
import { NextResponse } from "next/server";
import crypto from 'crypto';

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { email } = await req.json();

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return new NextResponse("Email doesn't exists.", { status: 400 });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const passwordResetExpires = Date.now()+3600000;

  existingUser.resetToken= passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;
  const resetURL =`localhost:3000/reset-password/${resetToken}`;

  console.log(resetUrl);



  // if (error) {
  //   return NextResponse.json({
  //     success: false,
  //     message: error.details[0].message,
  //   });
  // }

  // try {
  //   const findUser = await User.findOne({ email });
  //   if (!findUser) {
  //     return NextResponse.json({
  //       success: false,
  //       message: "Account not found with this email",
  //     });
  //   }

  //   const token = jwt.sign(
  //     {
  //       id: findUser._id,
  //       email: findUser?.email,
  //       role: findUser?.role,
  //     },
  //     "default_secret_key",
  //     { expiresIn: "1d" }
  //   );

  //   const finalData = {
  //     token,
  //     user: {
  //       email: findUser.email,
  //       name: findUser.name,
  //       _id: findUser._id,
  //       role: findUser.role,
  //     },
  //   };

  //   return NextResponse.json({
  //     success: true,
  //     message: "User Found successfull!",
  //     finalData,
  //   });
  // } catch (e) {
  //   console.log("Error while finding user. Please try again");

  //   return NextResponse.json({
  //     success: false,
  //     message: "Something went wrong ! Please try again later",
  //   });
  // }
}
