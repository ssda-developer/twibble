import Aside from "@/components/Aside";
import Header from "@/components/Header";
import NavLinks from "@/components/NavLinks";

export default function MainLayout({ children }) {
    return (
        <div className="flex flex-col lg:flex-row max-w-6xl m-auto">
            <div
                className="w-full bg-black/10 backdrop-blur-md lg:backdrop-blur-none lg:w-62 sticky top-0 lg:h-screen lg:shrink-0 z-10">
                <Header />
            </div>
            <main className="flex-1 lg:border-l lg:border-r border-slate-800">
                {children}
            </main>
            <div className="w-78 sticky top-0 h-screen shrink-0 p-6 hidden lg:block">
                <Aside />
            </div>
            <div
                className="block lg:hidden fixed bottom-0 w-full bg-black/10 backdrop-blur-md lg-backdrop-blur-none z-10">
                <NavLinks />
            </div>
        </div>
    );
}
