import Heart from '../../components/assets/heart';
import MainLayout from '../../components/layouts/mainLayout';
import { NextPageWithLayout } from '../_app';
import VaporWave from './themes/VaporWave';

const wall: NextPageWithLayout = () => (
  <>
    <div className="flex-1 p-20 flex justify-center align-middle">
      <div className="w-full h-full bg-slate-700 shadow-2xl rounded-2xl overflow-hidden m-auto relative">
        <VaporWave tweet="I am a tweet!" topBanner="The 80s90s00s Twitter Feed!" />
      </div>
    </div>

    <span className="mt-auto text-center m-4 text-3xl">
      Made with
      {' '}
      <Heart className="h-8 inline-block" />
      {' '}
      by Compsoc
    </span>
  </>
);

wall.getLayout = (page) => (
  <MainLayout className="flex h-screen w-screen bg-slate-900">{page}</MainLayout>
);

export default wall;
