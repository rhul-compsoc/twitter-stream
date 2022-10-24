import Heart from '../../components/assets/heart';
import MainLayout from '../../components/layouts/mainLayout';
import { NextPageWithLayout } from '../_app';

const wall: NextPageWithLayout = () => {
    return (
        <>
            <div className="flex-1 p-20">
                <div className="w-full h-full bg-slate-700 shadow-2xl p-4 rounded-2xl wallContainer">
                    <div className="font-bold text-center flex mt-6">
                        <div className="text-6xl m-auto text-shadow-xl shadow-red text-black">
                            The Twitter Feed
                        </div>
                    </div>
                    <div className="border border-2xl h-32  align-middle">overflow-hidden
                        <div className="movingGridConfig animatedGrid h-64 w-full bg-black m-auto"></div>
                    </div>
                    

                    <div className="flex justify-center align-middle h-full">
                        <div className="m-auto text-5xl text-white pl-32 pr-32 select-none">
                            Have my babies Joshua Yewman 😍😍😍😏😏
                            Super long ipsumdfsgnoifdskljnfdskhjlnafsdio;jhp asdf o;hjnulfdasljkbnfadshio;jul dfsahlou iadsfhjkl nsadfkjlbndsfkbhj
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
