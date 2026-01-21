import AuthorizationBlock from "@/src/components/auth/AuthorizationBlock";
import Logo from "@/src/components/ui/Logo";

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
