import Footer from '@components/footer';
import VaporWave from '@components/themes/VaporWave';
import MainLayout from '../components/layouts/mainLayout';
import Ninteens from '../components/themes/Nintees';
import { NextPageWithLayout } from './_app';

const tweet = 'Joshua Yewman, have my babies! <3';
const tweet2 = 'It’s hard to imagine the internet without the constant buzz of Twitter';
const tweet3 = 'hkbgdfilhugfdshiulgrefklhjfgdskjlhfgsdjklhfgdslkhjfgsdbkjmn,bdf,mnbvcxjn,fgdjkl;fgsdhjl;ndfgshjlk;nfgsdhjlk;dfgshjlk;dfgsl;kmdfghklj;ngdfsljn;dfgsjlk;ndfgsl;jnkfgdsl;jnfgsd;jnlksfgdjnl;ksdfg;jnldfgsjkln;dfgsjl;kndfgskl;jnsdfgkjlndfgskjlnsdfgkljnsdfgjklndsfg';
const tweet4 = '[To Buzz Aldrin] Are you upset that Michael Jackson got all the credit for inventing the moonwalk but you were the first geezer ever to acually do it? -- One time when me was high, me sold me car for like 24 chicken McNuggets.  -   The leader of the West Staines massive 🔫🥶🤑☠👾';

const Wall: NextPageWithLayout = () => (
  <>
    <div className="flex flex-1 justify-center p-20 align-middle">
      <div className="relative m-auto h-full w-full overflow-hidden rounded-2xl bg-slate-700 shadow-2xl">
        {/**
                 * This is the vaporwave theme for the wall. We should have it rotate through different themes imo.
                 * <VaporWave tweet={tweet} topBanner="The 80s90s00s Twitter Feed!" />
                 */}

        <VaporWave
          tweet={tweet3}
          topBanner="The 80s90s00s Twitter Feed!"
        />
      </div>
    </div>

    <Footer />
  </>
);

Wall.getLayout = (page) => (
  <MainLayout className="flex h-screen w-screen bg-slate-900">
    {page}
  </MainLayout>
);

export default Wall;
