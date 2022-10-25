import Heart from '../../components/assets/heart';
import MainLayout from '../../components/layouts/mainLayout';
import { NextPageWithLayout } from '../_app';

const wall: NextPageWithLayout = () => {
    return (
        <>
            <div className="flex-1 p-20">
                <div className="w-full h-full bg-slate-700 shadow-2xl rounded-2xl wallContainer overflow-hidden">
                    <div className="flex mt-6 flex-1">
                        <div className="text-4xl m-auto text-shadow-xl shadow-red text-black font-bold text-center ">
                            The 80s90s00s Twitter Feed
                        </div>
                    </div>
                    <div className="flex justify-center align-middle flex-1">
                        <div className="m-auto text-5xl text-white pl-32 pr-32 select-none">
                            I am a tweet!
                        </div>
                    </div>
                    <div className="overflow-hidden bg-black absolute bottom-[10vh] w-full">
                        <div className="h-32 align-middle relative top-[-10vh]">
                            <div className="movingGridConfig animatedGrid m-auto"></div>
                        </div>
                        <div className="text-white text-2xl">
                            hi
                        </div>
                    </div>
                    
                </div>
            </div>
            <span className="mt-auto text-center m-4 text-3xl">
                Made with <Heart className="h-8 inline-block" /> by Compsoc
            </span>
        </>
    );
};

wall.getLayout = (page) => (
    <MainLayout className="flex h-screen w-screen bg-slate-900">{page}</MainLayout>
);

export default wall;
