import Heart from '../components/assets/heart';
import MainLayout from '../components/layouts/mainLayout';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
    return (
        <>
            <div className="flex-1 p-20">
                <div className="w-full h-full bg-slate-600 shadow-2xl p-4 rounded-2xl">
                    <h3 className="font-bold text-center text-2xl">
                        Twitter Feed
                    </h3>
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
