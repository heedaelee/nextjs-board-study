import { Notice } from "../models/notice.sheme";
import { connectDb } from "./connect-db";

connectDb();

/* 전체조회 */
export const getNotices = async () => {
  try {
    const notices = await Notice.find();

    return { notices };
  } catch (error) {
    return { error, status: 500 };
  }
};

/* 상세조회 */
export const getNotice = async (_id: string) => {
  try {
    const notice = await Notice.findOne({ _id });

    return { notice };
  } catch (error) {
    return { error, status: 500 };
  }
};

type noticeType = { title: string; body: string };

/* 등록 */
export const postNotice = async ({ title, body }: noticeType) => {
  try {
    const notice = new Notice({ title, body, date: Date.now() });
    await notice.save();

    return { newNotice };
  } catch (error) {
    return { error, status: 500 };
  }
};
