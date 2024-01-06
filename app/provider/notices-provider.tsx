"use client";

import { Notice } from "@/src/types/Notice";
import { PropsWithChildren, createContext, useState } from "react";

interface NoticeContextValue {
  notices: Notice[];
  addNotice: ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => void;
  deleteNotice: (_id: string) => void;
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

export const NoticeContext = createContext<NoticeContextValue>({
  notices: [],
  addNotice: ({ title, body }: { title: string; body: string }) => {},
  deleteNotice: (_id: string) => {},
  updateNotice: ({
    _id,
    title,
    body,
  }: {
    _id: string;
    title: string;
    body: string;
  }) => {},
});

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        }
      );

      const { data } = await response.json();

      if (response.status === 200) {
        setNotices((prev) => [...prev, data.notice]);
      } else {
        throw new Error("server error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* 삭제 API */
  const deleteNotice = async (_id: string) => {
    try {
      await fetch(`/api/notices?_id=${_id}`, { method: "DELETE" });

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
