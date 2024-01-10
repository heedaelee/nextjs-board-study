"use client";

import { FormEvent, useContext } from "react";
import styles from "../page.module.css";
import { NoticeContext } from "../provider/notices-provider";
import { useRouter } from "next/navigation";

export default function Write() {
  const { addNotice } = useContext(NoticeContext);
  const { push } = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // 새로고침 방지
    event.preventDefault();

    const formElement = event.currentTarget.elements;
    const titleElement = formElement.namedItem(
      "title"
    ) as HTMLInputElement;
    const bodyElement = formElement.namedItem(
      "body"
    ) as HTMLTextAreaElement;

    const title = titleElement?.value;
    const body = bodyElement?.value;

    await addNotice({ title, body });
    push("/");
  };

  return (
    <div className={styles.main}>
      <h1>write</h1>
      <form action="" onSubmit={onSubmit} className={styles.main}>
        <span>title</span>
        <input type="text" name="title" id="title" />
        <span>body</span>
        <textarea name="body" id="body" cols={30} rows={10} />
        <button className={styles.button} type="submit">
          submit
        </button>
      </form>
    </div>
  );
}
