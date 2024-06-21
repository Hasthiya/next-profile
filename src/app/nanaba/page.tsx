"use client"

import {Parallax, ParallaxLayer} from '@react-spring/parallax'

const Page = () => {
    return (
        <main>
            <Parallax pages={2}>
                <ParallaxLayer
                    factor={10}
                    offset={0}
                    speed={0.3}
                    style={{
                        backgroundColor: '#fdf9f2',
                        opacity: 1,
                        backgroundImage: 'radial-gradient(#ff9900 0.8500000000000001px, transparent 0.8500000000000001px), radial-gradient(#ff9900 0.8500000000000001px, #fdf9f2 0.8500000000000001px)',
                        backgroundSize: '34px 34px',
                        backgroundPosition: '0 0, 17px 17px',
                        backgroundRepeat: 'repeat'
                    }}/>
                <ParallaxLayer
                    offset={0}
                    speed={1}
                >
                    <div className="min-h-screen flex flex-col justify-center items-center">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-6">Story of Nanaba</h2>
                            <p className="text-lg">
                                Nanaba, the big, huggable plushy banana, has an extraordinary story to tell.
                                His life is woven with threads of warmth, comfort, and the deep emotional bond he shares with a young girl named Genma.
                                Nanaba isn’t just a toy, he’s a steadfast companion and a beacon of support in Genma’s life.
                            </p>
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer
                    offset={0.3}
                    speed={1}
                >
                    <div className="min-h-screen flex flex-col justify-center items-center">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-6">Origins of Nanaba</h2>
                            <p className="text-lg">
                                Nanaba was created in a small, cozy toy workshop nestled in a bustling city. Crafted from the softest, most durable materials, he was designed to be the perfect bedtime companion. His vibrant yellow color and big, gentle eyes made him instantly lovable. The workshop owner, an old woman with a knack for creating comforting toys, imbued Nanaba with a special charm—a sense of warmth and security that would resonate with anyone who held him close.
                            </p>
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer
                    offset={0.6}
                    speed={1}
                >
                    <div className="min-h-screen flex flex-col justify-center items-center">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-6">Meeting Genpa and Genma</h2>
                            <p className="text-lg">
                                Nanaba’s life truly began when he was packaged and shipped off to his new home. A boy named Genpa from Sri Lanka, who had a kind heart and loved making others happy, ordered Nanaba online. Genpa was in a long-distance relationship with his girlfriend Genma, who lived in another country. He wanted to send her something special, something that would comfort her in his absence. When Nanaba arrived at Genma`s doorstep, she was overjoyed.
                            </p>
                        </div>
                    </div>
                </ParallaxLayer>

            </Parallax>
        </main>
    );
};

export default Page;