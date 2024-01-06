import mongoose, { Schema } from "mongoose";

export const NoticeSchema = new Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
});

/* 몽고 DB Notice 모델을 만들어줌(없다면) || 있으면 모델.Notice를 get함 */
export const Notice =
  mongoose.models.Notice ?? mongoose.model("Notice", NoticeSchema);
