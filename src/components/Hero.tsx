import HeroContent, { type Props } from './HeroContent';

// Weather already on screen fades while the next place loads.
const Hero = ({ candidates, data, error, geo, loading }: Props) => (
    <div
        className={`transition-opacity duration-300 ${
            loading && data ? 'opacity-60' : ''
        }`}
    >
        <HeroContent
            candidates={candidates}
            data={data}
            error={error}
            geo={geo}
            loading={loading}
        />
    </div>
);

Hero.displayName = 'Hero';

export default Hero;
