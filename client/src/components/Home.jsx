const Home = () => {
    return(
        <div className=" hero min-h-[90%] bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse content-center">
                <img src="https://c.tenor.com/kTRUwJEYLu8AAAAC/polygon-matic.gif" alt="banner" className="max-w-2xl min-w-sm rounded-lg shadow-2xl" />
                <div className="mx-auto px-8 text-center lg:text-left">
                <h1 className=" text-6xl md:text-9xl font-bold">Donate MATIC!</h1>
                <p className="py-6">
                    Log in with metamask and create your own link to share. Share it to your people and get donations with alerts.
                    <br/>
                    More features later, stay tuned to <a className="link" target="_blank" rel="noreferrer" href="https://discord.gg/t4yHh59MK5">Discord</a>.
                    <br/>
                    Donations to us: 0xfc5D38CD00752947fff4278DdeE971e685b00A16.
                </p>  
                </div>
            </div>

        </div>
    );
}

export default Home;