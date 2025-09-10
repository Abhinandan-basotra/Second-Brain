import { Request, Response } from "express"
import bcrypt from 'bcrypt-ts'
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/getJwtSecret";
enum StatusResponse {
  SUCCESS = 200,
  ERROR_IN_INPUTS = 400,
  USER_EXISTS = 403,
  SERVER_ERROR = 500
}
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const hashedPass = await bcrypt.hash(password, 10);
    if (!username || !password) {
      res.status(StatusResponse.ERROR_IN_INPUTS).json({ message: "missing username or password" })
    }
    const existingUser = await User.findOne({ username: username })
    if (existingUser) res.status(StatusResponse.USER_EXISTS).json({ message: "user exists already" })
    await User.create({
      username: username,
      password: hashedPass
    })

    res.status(StatusResponse.SUCCESS).json({ message: 'User Signed Up' })
  } catch (error) {
    console.log(error);

    res.status(StatusResponse.SERVER_ERROR).json({ message: "Internal Server Error" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Fill all the details" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(StatusResponse.ERROR_IN_INPUTS)
        .json({ message: "Invalid Username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusResponse.ERROR_IN_INPUTS)
        .json({ message: "Invalid Username or password" });
    }

    const token = jwt.sign(
      { id: user.id },
      getJwtSecret(),
      { expiresIn: "4h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000
    });

    return res
      .status(StatusResponse.SUCCESS)
      .json({ message: `Welcome back! ${user.username}`, user, token });
  } catch (error) {
    console.error(error);
    res
      .status(StatusResponse.SERVER_ERROR)
      .json({ message: "Server Error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId }).select('username')
    if (user) {
      return res.status(StatusResponse.SUCCESS).json({ user })
    } else {
      return res.status(StatusResponse.ERROR_IN_INPUTS).json({ message: "Login Again" })
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusResponse.SERVER_ERROR).json({ message: "Internal Server Error" })
  }
}

export const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    res.status(StatusResponse.SUCCESS).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(StatusResponse.SERVER_ERROR).json({ message: error.message })
  }
}
export default { signup, login, getProfile, logOut }