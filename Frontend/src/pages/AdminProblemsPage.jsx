import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContextState";
import { useCreateProblem, useDeleteProblem, useProblems } from "../hooks/useProblems";

const emptyProblem = {
  title: "",
  slug: "",
  difficulty: "Easy",
  category: "",
  descriptionText: "",
  notes: "",
  constraints: "",
  exampleInput: "",
  exampleOutput: "",
  exampleExplanation: "",
  starterJs: "",
  starterPy: "",
  starterJava: "",
  expectedJs: "",
  expectedPy: "",
  expectedJava: "",
};

function AdminProblemsPage() {
  const { user } = useAuth();
  const { data } = useProblems();
  const createProblem = useCreateProblem();
  const deleteProblem = useDeleteProblem();
  const [form, setForm] = useState(emptyProblem);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">Not authorized.</div>
      </div>
    );
  }

  const problems = data?.problems || [];

  const handleSubmit = () => {
    const payload = {
      title: form.title,
      slug: form.slug,
      difficulty: form.difficulty,
      category: form.category,
      description: {
        text: form.descriptionText,
        notes: form.notes
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      },
      examples: [
        {
          input: form.exampleInput,
          output: form.exampleOutput,
          explanation: form.exampleExplanation,
        },
      ],
      constraints: form.constraints
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      starterCode: {
        javascript: form.starterJs,
        python: form.starterPy,
        java: form.starterJava,
      },
      expectedOutput: {
        javascript: form.expectedJs,
        python: form.expectedPy,
        java: form.expectedJava,
      },
    };

    createProblem.mutate(payload, {
      onSuccess: () => setForm(emptyProblem),
    });
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="card bg-base-200">
          <div className="card-body space-y-4">
            <h2 className="text-2xl font-bold">Add Problem</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="input input-bordered"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                className="input input-bordered"
                placeholder="Slug (optional)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <select
                className="select select-bordered"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <input
                className="input input-bordered"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <textarea
              className="textarea textarea-bordered min-h-[100px]"
              placeholder="Description"
              value={form.descriptionText}
              onChange={(e) => setForm({ ...form, descriptionText: e.target.value })}
            />
            <textarea
              className="textarea textarea-bordered min-h-[80px]"
              placeholder="Notes (one per line)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <textarea
              className="textarea textarea-bordered min-h-[80px]"
              placeholder="Constraints (one per line)"
              value={form.constraints}
              onChange={(e) => setForm({ ...form, constraints: e.target.value })}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="input input-bordered"
                placeholder="Example Input"
                value={form.exampleInput}
                onChange={(e) => setForm({ ...form, exampleInput: e.target.value })}
              />
              <input
                className="input input-bordered"
                placeholder="Example Output"
                value={form.exampleOutput}
                onChange={(e) => setForm({ ...form, exampleOutput: e.target.value })}
              />
            </div>
            <input
              className="input input-bordered"
              placeholder="Example Explanation"
              value={form.exampleExplanation}
              onChange={(e) => setForm({ ...form, exampleExplanation: e.target.value })}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <textarea
                className="textarea textarea-bordered min-h-[120px]"
                placeholder="Starter JS"
                value={form.starterJs}
                onChange={(e) => setForm({ ...form, starterJs: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered min-h-[120px]"
                placeholder="Starter Python"
                value={form.starterPy}
                onChange={(e) => setForm({ ...form, starterPy: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered min-h-[120px]"
                placeholder="Starter Java"
                value={form.starterJava}
                onChange={(e) => setForm({ ...form, starterJava: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea
                className="textarea textarea-bordered min-h-[120px]"
                placeholder="Expected JS Output"
                value={form.expectedJs}
                onChange={(e) => setForm({ ...form, expectedJs: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered min-h-[120px]"
                placeholder="Expected Python Output"
                value={form.expectedPy}
                onChange={(e) => setForm({ ...form, expectedPy: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered min-h-[120px]"
                placeholder="Expected Java Output"
                value={form.expectedJava}
                onChange={(e) => setForm({ ...form, expectedJava: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Create
              </button>
              {createProblem.isPending && <span>Saving...</span>}
            </div>
          </div>
        </div>

        <div className="card bg-base-100">
          <div className="card-body">
            <h2 className="text-xl font-bold mb-4">Existing Problems</h2>
            <div className="space-y-2">
              {problems.map((p) => (
                <div key={p.slug} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{p.title}</span>
                    <span className="text-sm opacity-60 ml-2">{p.slug}</span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => deleteProblem.mutate(p.slug)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {problems.length === 0 && <div>No problems yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProblemsPage;
