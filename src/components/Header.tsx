import type { ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

const Header = ({ children }: Props) => (
    <header className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold tracking-tight text-white">
            City Weather
        </h1>
        {children}
    </header>
);

Header.displayName = 'Header';

export default Header;
