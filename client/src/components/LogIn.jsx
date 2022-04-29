

const LogIn = () => {

    

return(
        
<div className="relative flex min-h-screen flex-col justify-center w-full max-w-md px-4 py-0 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10 mx-auto">
    <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
        Login To Your Account
    </div>
    <div className="flex gap-4 item-center">
        <button type="button" className="gap-2 py-2 px-4 flex justify-center items-center  bg-[#9146ff] hover:bg-[#9046ffa4] focus:ring-[#9146ffa4] focus:ring-[#9146ff] text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="25" height="25"
            viewBox="0 0 24 24"
            style={{fill:"#fff"}}><path d="M 5.3632812 2 L 2 6.6367188 L 2 20 L 7 20 L 7 23 L 10 23 L 13 20 L 17 20 L 22 15 L 22 2 L 5.3632812 2 z M 6 4 L 20 4 L 20 13 L 17 16 L 12 16 L 9 19 L 9 16 L 6 16 L 6 4 z M 11 7 L 11 12 L 13 12 L 13 7 L 11 7 z M 16 7 L 16 12 L 18 12 L 18 7 L 16 7 z"></path></svg>
            Log in with Metamask
        </button>
    </div>
</div>

)
}

export default LogIn;