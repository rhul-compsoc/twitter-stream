import Heart from './assets/heart';

const Footer = () => {
    return (
        <span className="fixed bottom-2 z-50 flex w-screen justify-center">
            <span>
                Made with <Heart className="inline-block h-4" /> by Compsoc
            </span>
        </span>
    );
};

export default Footer;
