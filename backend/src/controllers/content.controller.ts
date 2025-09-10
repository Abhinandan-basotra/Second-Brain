import { Request, Response } from "express";
import { Content, ContentTypes } from "../models/content.model";
import { Links } from "../models/link.model";
import { randomBytes } from "crypto";
import { User } from "../models/user.model";


export const addContent = async (req: Request, res: Response) => {
    try {
        const { title, type, link } = req.body;
        const userId = req.userId
        if (!Object.values(ContentTypes).includes(type)) {
            return res.status(404).json({ message: `${type} not supported, must be in ${Object.values(ContentTypes)}` })
        }
        await Content.create({
            userId: userId,
            title: title,
            type: type,
            link: link,
            tags: []
        })
        res.status(200).json({ message: "Content Added" })
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Server Error" })
    }
}

export const getUserContent = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const content = await Content.find({ userId: userId }).populate('userId', 'username')
        res.json({content});
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Server Error:" })
    }
}

export const deleteContent = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.body;
        if (!contentId) {
            return res.status(400).json({ message: "Content ID is required" });
        }
        const result = await Content.deleteMany({ _id: contentId, userId: req.userId })
        if (!result) {
            return res.status(404).json({ message: "Content not found or already deleted" });
        }
        res.status(202).json({ message: "Deleted" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error: " })
    }
}

export const shareLink = async (req: Request, res: Response) => {
    try {
        const { share } = req.body;
        if (share) {
            const existingLink = await Links.findOne({ userId: req.userId })
            if (existingLink) {
                return res.status(200).json({ message: "Data stored", hash: existingLink.hash })
            }
            const hash = randomBytes(10).toString("hex");
            const linkCreated = await Links.create({ userId: req.userId, hash });

            return res.status(200).json({ hash , linkCreated})
        }else {
        await Links.deleteOne({ userId: req.userId });
        return res.json({ message: "Removed link" });
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "internal server Error"})
    }
}

export const getSharedContent = async (req: Request, res: Response) => {
    try {
        const hash = req.params.shareLink;

        const link = await Links.findOne({hash});
        if(!link){
            res.status(404).json({ message: "Invalid share link" });
            return;
        }

        const content = await Content.find({userId: req.userId})
        const user = await User.findOne({_id: link.userId});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            username: user.username,
            content
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error"})
    }
}



export default { addContent, getUserContent, deleteContent }