const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7860";

// ── Health Ping ──
export async function healthPing(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Analyze Document ──
export async function analyzeDocument(
  file: File,
  docType: string,
  token: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("doc_type", docType);

  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail || "Analysis failed");
  }

  return res.json();
}

// ── Get All Analyses ──
export async function getAnalyses(token: string) {
  const res = await fetch(`${API_URL}/analyses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch analyses");
  return res.json();
}

// ── Get Single Analysis ──
export async function getAnalysis(id: string, token: string) {
  const res = await fetch(`${API_URL}/analyses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Analysis not found");
  return res.json();
}

// ── Delete Analysis ──
export async function deleteAnalysis(id: string, token: string) {
  const res = await fetch(`${API_URL}/analyses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete analysis");
  return res.json();
}
