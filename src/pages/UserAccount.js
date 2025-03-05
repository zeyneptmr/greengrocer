import UserSidebar from "/Users/zeynep/greengrocer/src/components/UserSidebar.js";

const UserAccount = () => {
    return (
        <div className="flex">

            <UserSidebar />

            <div className="ml-64 p-6 w-full">
                <h1 className="text-2xl font-bold">Hesap Ayarlarım</h1>

            </div>
        </div>
    );
};

export default UserAccount;
