import { Notices } from "./components/Notices";
import styles from "./page.module.css";
import Link from "next/link";

export default async function Home() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notices`
  );

  const { data } = await response.json();
  console.log(data);

  return (
    <main className={styles.main}>
      <h1>notice board</h1>
      <Link className={styles.button} href="/write">
        write
      </Link>
      <Notices />
    </main>
  );
}
