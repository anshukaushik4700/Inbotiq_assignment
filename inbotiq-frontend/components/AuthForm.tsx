"use client";
import React from "react";

type Props = {
  title: string;
  fields: Array<{ name: string; label: string; type?: string }>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitLabel?: string;
};

export default function AuthForm({ title, fields, onSubmit, submitLabel = "Submit" }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const form = e.target as HTMLFormElement;
    const data: Record<string, any> = {};
    fields.forEach(f => {
      const el = (form.elements.namedItem(f.name) as HTMLInputElement | null);
      data[f.name] = el?.value;
    });
    try {
      setLoading(true);
      await onSubmit(data);
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            <input name={f.name} type={f.type || "text"} className="w-full border px-3 py-2 rounded" required />
          </div>
        ))}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
          {loading ? "Please wait..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
