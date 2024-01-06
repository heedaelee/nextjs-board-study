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

    return { status: 200, notice };
  } catch (error) {
    return { error, status: 500 };
  }
};

/* 삭제 */
export const deleteNotice = async (_id: string) => {
  try {
    const { deletedCount } = await Notice.deleteOne({ _id });

    if (deletedCount === 0) {
      throw new Error("삭제할 데이터가 없습니다.");
    }

    return { status: 200 };
  } catch (error) {
    return { error, status: 500 };
  }
};

/* 수정 */
export const updateNotice = async (
  _id: string,
  title: noticeType["title"],
  body: noticeType["body"]
) => {
  try {
    const { matchedCount } = await Notice.updateOne(
      { _id },
      { title, body }
    );

    if (matchedCount === 0)
      throw new Error("수정할 데이터가 없습니다.");

    return { status: 200 };
  } catch (error) {
    return { error, status: 500 };
  }
};
