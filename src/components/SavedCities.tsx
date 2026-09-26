import { X } from "lucide-react";

interface SavedCitiesProps {
  cities: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

export function SavedCities({ cities, onSelect, onRemove }: SavedCitiesProps) {
  if (cities.length === 0) return null;

  return (
    <div className="saved-cities">
      {cities.map((c) => (
        <div key={c} className="saved-cities_chip-wrapper">
          <button className="saved-cities_chip" onClick={() => onSelect(c)}>
            {c}
          </button>
          <button
            className="saved-cities_remove"
            onClick={(e) => {
              e.stopPropagation(); // To prevent the outer button click
              onRemove(c);
            }}
            aria-label={`Remove ${c}`}
          >
            <X/>
          </button>
        </div>
      ))}
    </div>
  );
}