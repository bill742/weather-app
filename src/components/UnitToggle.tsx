import type { Unit } from '../types/weather';

interface Props {
    onChange: (unit: Unit) => void;
    unit: Unit;
}

const OPTIONS: Array<{ label: string; name: string; value: Unit }> = [
    { label: '°C', name: 'Celsius', value: 'metric' },
    { label: '°F', name: 'Fahrenheit', value: 'imperial' },
];

const UnitToggle = ({ onChange, unit }: Props) => (
    <div
        aria-label="Temperature unit"
        className="flex rounded-full bg-black/25 p-1 backdrop-blur-md"
        role="group"
    >
        {OPTIONS.map((option) => (
            <button
                aria-label={option.name}
                aria-pressed={unit === option.value}
                className="cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium text-white/75 transition-colors hover:text-white aria-pressed:bg-(--accent) aria-pressed:text-slate-900"
                key={option.value}
                onClick={() => onChange(option.value)}
                type="button"
            >
                {option.label}
            </button>
        ))}
    </div>
);

UnitToggle.displayName = 'UnitToggle';

export default UnitToggle;
