import AuthorizationBlock from "@/components/AuthorizationBlock";
import Profile from "@/components/Profile";
import Protected from "@/components/Protected";
import Search from "@/components/Search";

const Aside = () => {
    return (
        <>
            <div className="mb-6">
                <Search />
            </div>
            <div className="mb-6">
                <Protected>
                    <Profile />
                </Protected>
                <Protected mode="guest">
                    <AuthorizationBlock />
                </Protected>
            </div>
            <div className="mb-6">
                <div className="flex flex-col p-4 rounded-xl border border-slate-800">
                    <h3 className="font-black mb-4 text-xl">Popular today</h3>
                    <ul className="flex flex-col">
                        <li className="truncate mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Quisquam,
                            quod.
                        </li>
                        <li className="truncate mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Quisquam,
                            quod.
                        </li>
                        <li className="truncate mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Quisquam,
                            quod.
                        </li>
                        <li className="truncate mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Quisquam,
                            quod.
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Aside;
