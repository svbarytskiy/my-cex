import { FC, ReactNode } from "react";
import { Navbar } from "./NavBar"


interface LayoutProps {
    children: ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
    return (<>
        <Navbar />
        <main>
            {children}
        </main>
    </>)
}
export { Layout }