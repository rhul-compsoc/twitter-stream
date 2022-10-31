import Heart from '../../components/assets/heart';
import MainLayout from '../../components/layouts/mainLayout';
import { NextPageWithLayout } from '../_app';
import Ninteens from '../../components/themes/Nintees';
import VaporWave from '../../components/themes/VaporWave-';

const tweet = 'Joshua Yewman, have my babies! <3';
const tweet2 = 'It’s hard to imagine the internet without the constant buzz of Twitter';
const tweet3 = 'hkbgdfilhugfdshiulgrefklhjfgdskjlhfgsdjklhfgdslkhjfgsdbkjmn,bdf,mnbvcxjn,fgdjkl;fgsdhjl;ndfgshjlk;nfgsdhjlk;dfgshjlk;dfgsl;kmdfghklj;ngdfsljn;dfgsjlk;ndfgsl;jnkfgdsl;jnfgsd;jnlksfgdjnl;ksdfg;jnldfgsjkln;dfgsjl;kndfgskl;jnsdfgkjlndfgskjlnsdfgkljnsdfgjklndsfg';
const tweet4 = '[To Buzz Aldrin] Are you upset that Michael Jackson got all the credit for inventing the moonwalk but you were the first geezer ever to acually do it? -- One time when me was high, me sold me car for like 24 chicken McNuggets.  -   The leader of the West Staines massive 🔫🥶🤑☠👾';

const wall: NextPageWithLayout = () => (
  <>
    <div className="flex-1 p-20 flex justify-center align-middle">
      <div className="w-full h-full bg-slate-700 shadow-2xl rounded-2xl overflow-hidden m-auto relative">
        {/**
         * This is the vaporwave theme for the wall. We should have it rotate through different themes imo.
         * <VaporWave tweet={tweet} topBanner="The 80s90s00s Twitter Feed!" />
         */}

        <Ninteens tweet={tweet4} topBanner="The 80s90s00s Twitter Feed!" />
      </div>
    </div>

    <span className="mt-auto text-center m-4 text-4xl footerCompsoc">
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

// <VaporWave tweet="It’s hard to imagine the internet without the constant buzz of Twitter, the popular social media platform on which hundreds of millions of short soundbites from politicians, celebrities, and other online users are shared out each day.As a platform known for brevity and concisionn" topBanner="The 80s90s00s Twitter Feed!" />
