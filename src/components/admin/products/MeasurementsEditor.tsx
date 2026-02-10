"use client";

interface MeasurementsEditorProps {
  measurements: Record<string, string> | null;
  onChange: (measurements: Record<string, string> | null) => void;
}

export function MeasurementsEditor({
  measurements,
  onChange,
}: MeasurementsEditorProps) {
  const entries = measurements ? Object.entries(measurements) : [];

  function addEntry() {
    onChange({ ...(measurements ?? {}), "": "" });
  }

  function removeEntry(key: string) {
    if (!measurements) return;
    const { [key]: _, ...rest } = measurements;
    onChange(Object.keys(rest).length > 0 ? rest : null);
  }

  function updateEntry(oldKey: string, newKey: string, value: string) {
    if (!measurements) return;
    const updated: Record<string, string> = {};
    for (const [k, v] of Object.entries(measurements)) {
      if (k === oldKey) {
        updated[newKey] = value;
      } else {
        updated[k] = v;
      }
    }
    onChange(updated);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">
          Measurements
        </label>
        <button
          type="button"
          onClick={addEntry}
          className="text-sm font-medium text-brand-purple hover:underline"
        >
          + Add Measurement
        </button>
      </div>

      {entries.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-400">
          No measurements added.
        </p>
      )}

      <div className="space-y-2">
        {entries.map(([key, value], index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={key}
              onChange={(e) => updateEntry(key, e.target.value, value)}
              placeholder="Key (e.g. Bust (S))"
              className="flex-1 rounded border border-neutral-200 px-3 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateEntry(key, key, e.target.value)}
              placeholder="Value (e.g. 86cm)"
              className="flex-1 rounded border border-neutral-200 px-3 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeEntry(key)}
              className="shrink-0 rounded p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
