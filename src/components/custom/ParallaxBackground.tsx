const ParallaxBackground = () => {
    return (
        <div
            className="bg-fixed bg-center bg-cover h-screen"
            style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}
        >
            <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-white text-5xl font-bold">Welcome to My Parallax Page</h1>
            </div>
        </div>
    );
};

export default ParallaxBackground;