import Image from 'next/image';
import styles from './page.module.css';
import { Form } from './components/Form';
import dynamic from 'next/dynamic';

export default function Home() {
    return (
        <>
            {' '}
            <Form />
        </>
    );
}
