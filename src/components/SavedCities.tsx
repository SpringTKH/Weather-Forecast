interface SavedCitiesProps {
  cities: string[];
  onSelect: (city: string) => void; // function to handle city selection
}

export function SavedCities({ cities, onSelect }: SavedCitiesProps) {
  if (cities.length === 0) return null;

  return (
    <div className="saved-cities">
      {cities.map((c) => (
        <button
          key={c}
          className="saved-cities__chip"
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}