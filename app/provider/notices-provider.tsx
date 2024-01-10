"use client";

import { clientApi } from "@/src/lib/client-api/notices";
import { Notice } from "@/src/types/Notice";
import { PropsWithChildren, createContext, useState } from "react";

interface NoticeContextValue {
  notices: Notice[];
  addNotice: (props: {
    title: string;
    body: string;
  }) => Promise<void>;
  deleteNotice: (_id: string) => Promise<void>;
  updateNotice: ({
    _id,
    title,
    body,
  }: {
    _id: string;
    title: string;
    body: string;
  }) => void;
}

const defaultNoticeContextValue = {
  notices: [],
  addNotice: (props: { title: string; body: string }) =>
    Promise.resolve(),
  deleteNotice: (_id: string) => Promise.resolve(),
  updateNotice: (props: {
    _id: string;
    title: string;
    body: string;
  }) => Promise.resolve(),
};

export const NoticeContext = createContext<NoticeContextValue>(
  defaultNoticeContextValue
);
interface Props extends PropsWithChildren {
  initialNotices: Notice[];
}

export default function NoticesProvider({
  children,
  initialNotices,
}: Props) {
  const [notices, setNotices] = useState(initialNotices);

  /* 추가 API */
  const addNotice = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    try {
      const { response, data } = await clientApi.postNotice({
        title,
        body,
      });
      if (response.status !== 200) {
        throw new Error("server error");
      }
      setNotices((prev) => [...prev, data.notice]);
    } catch (error) {
      console.error(error);
    }
  };

  /* 삭제 API */
  const deleteNotice = async (_id: string) => {
    try {
      const { response } = await clientApi.deleteNotice(_id);

      if (response.status !== 200) {
        throw new Error("server error");
      }
      setNotices((prev) =>
        prev.filter((notice) => notice._id !== _id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* 수정 API */
  const updateNotice = async ({
    _id,
    title,
    body,
  }: {
    _id: string;
    title: string;
    body: string;
  }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notices?_id=${_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        }
      );
      const { data } = await response.json();

      if (data.status === 200) {
        setNotices((prev) => {
          return prev.map((notice) => {
            if (notice._id === _id) {
              return { ...notice, title, body };
            }

            return notice;
          });
        });
      } else {
        throw new Error("server error");
      }
    } catch (error) {}
  };

  return (
    <NoticeContext.Provider
      value={{ notices, addNotice, deleteNotice, updateNotice }}
    >
      {children}
    </NoticeContext.Provider>
  );
}
