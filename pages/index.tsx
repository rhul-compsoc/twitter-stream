import Heart from '../components/assets/heart';
import MainLayout from '../components/layouts/mainLayout';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';


const IndexPage: NextPageWithLayout = () => {
    return (
        <>
            <div className="flex-1 p-20">
                <div className="bg-slate-600 shadow-2xl p-4 rounded-2xl text-3xl">
                    <div className="text-center p-3">
                        This is the Compsoc Twitter Wall!
                    </div>
                    <div className="flex justify-center align-middle">
                        <div className="m-auto flex gap-5">
                            { /* Here should be buttons with links to the wall, the login page and the admin page */ }
                            <Link href="/wall"><button className="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded">Wall</button></Link>
                            <Link href="/login"><button className="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded">Login</button></Link>
                            <Link href="/admin"><button className="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded">Admin</button></Link>
                        </div>
                    </div>
                </div>
            </div>
            <span className="mt-auto text-center m-4">
                Made with <Heart className="h-4 inline-block" /> by Compsoc
            </span>
        </>
    );
};

IndexPage.getLayout = (page) => (
    <MainLayout className="flex h-screen w-screen">{page}</MainLayout>
);

export default IndexPage;
