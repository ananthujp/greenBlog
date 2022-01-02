import useAuth from "./hooks/userAuth"

const items= ["Get Started","ContactUs","AboutUs","Home"]
function NavBar() {
    const {user,logout}=useAuth()
    return (
        <div className="flex justify-between mx-12 mt-6">
            <div className="flex flex-row">
                {items.map((item,index)=>
                    <div className={"mx-2 font-pop "+((index===0)?"underline underline-offset-4 decoration-4 decoration-indigo-300":"")}>{item}</div>
                )}
            </div>
            <div>
                <div className="mx-2 font-pop flex flex-row">{user?user.email:<></>}<div onClick={logout} className="cursor-pointer">(Logout)</div></div>
            </div>
            
        </div>
    )
}

export default NavBar
