import FooterComponent from './FooterComponent';
import NavComponent from './NavComponent';
import { useSystem } from "@/contexts/System";

export default function Layout({ children, options = {} }) {
    const { theme, setTheme } = useSystem();
    return (
        <div>
            <NavComponent theme={theme} setTheme={setTheme} options={options.nav}></NavComponent>
            <main>{children}</main>
            <FooterComponent options={options.footer} />
        </div>
    )
}