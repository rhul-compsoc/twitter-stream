import Footer from '@components/footer';
import Link from 'next/link';
import MainLayout from '../components/layouts/mainLayout';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
    return (
        <>
            <div className="flex flex-1 items-center justify-center p-20">
                <div className="rounded-2xl bg-primary p-4 shadow-2xl">
                    <h1 className="text-2xl font-bold text-primary-content">
                        This is the Compsoc Twitter Wall!
                    </h1>
                    <Link href="/wall">
                        <button className="btn-secondary btn-wide btn m-4 mx-auto block">
                            Wall
                        </button>
                    </Link>
                    <Link href="/login">
                        <button className="btn-secondary btn-wide btn m-4 mx-auto block">
                            Admin view
                        </button>
                    </Link>
                </div>
            </div>

            <Footer />
        </>
    );
};

IndexPage.getLayout = (page) => (
    <MainLayout className="flex h-screen w-screen">{page}</MainLayout>
);

export default IndexPage;
