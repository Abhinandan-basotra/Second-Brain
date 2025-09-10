import mongoose from "mongoose";
import { ref } from "process";

export enum ContentTypes{
    Image = 'image',
    Video = 'video',
    Article = 'article',
    Audio = 'audio'
}

const contentSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum:  Object.values(ContentTypes),
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Tags'
    }],
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

export const Content = mongoose.model('Content', contentSchema)