import AuthorizationBlock from "@/components/AuthorizationBlock";
import Logo from "@/components/Logo";

const AuthorizationPage = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-6">
            <Logo />
            <div className="flex justify-center w-full">
                <AuthorizationBlock classes="mt-6 md: w-96" />
            </div>
        </div>
    );
};

export default AuthorizationPage;
