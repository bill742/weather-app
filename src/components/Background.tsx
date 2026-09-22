import { useState } from 'react';

interface Props {
    image: string;
}

// Full-viewport photo for the current conditions. The previous photo stays
// underneath while the new one fades in, so a change of scene never flashes.
const Background = ({ image }: Props) => {
    const [layers, setLayers] = useState([image]);
    const top = layers[layers.length - 1];
    if (top !== image) setLayers([top, image]);

    return (
        <div aria-hidden="true" className="fixed inset-0 -z-10 bg-[#1b2530]">
            {layers.map((src, i) => (
                <img
                    alt=""
                    className={`absolute inset-0 size-full object-cover ${
                        i === layers.length - 1 ? 'scene-enter' : ''
                    }`}
                    decoding="async"
                    key={src}
                    src={src}
                />
            ))}
            {/* Scrim: keeps the hero type legible on bright photos. */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/35" />
        </div>
    );
};

Background.displayName = 'Background';

export default Background;
