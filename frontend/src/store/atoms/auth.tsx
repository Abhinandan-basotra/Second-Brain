import { atom } from "recoil";
import {recoilPersist } from 'recoil-persist'

const {persistAtom} = recoilPersist()

export const authSlice = atom({
    key: "auth",
    default: {username: ''},
    effects_UNSTABLE: [persistAtom]
})