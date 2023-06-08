import Image from 'next/image';
import styles from './page.module.css';
import { Form } from './components/Form';

export default function Home() {
    return (
        <div className={styles.main}>
            <Form />
        </div>
    );
}
