import classNames from 'classnames';

const MainLayout: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div
            className={classNames(
                'min-h-screen min-w-[100vw] flex-col',
                className
            )}>
            {children}
        </div>
    );
};

export default MainLayout;
