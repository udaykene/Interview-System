const DEFAULT_PISTON_API = process.env.PISTON_API || "http://localhost:20000/api/v2";

const REQUIRED_PACKAGES = [
  { language: "node", version: "18.15.0", label: "javascript" },
  { language: "python", version: "3.10.0", label: "python" },
  { language: "java", version: "15.0.2", label: "java" },
];

async function request(path, options = {}) {
  const response = await fetch(`${DEFAULT_PISTON_API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      message = data?.message || data?.error || message;
    } catch {
      // Ignore JSON parsing failures and keep the HTTP message.
    }
    throw new Error(message);
  }

  return response.json();
}

async function main() {
  console.log(`Using Piston API: ${DEFAULT_PISTON_API}`);

  const packages = await request("/packages");
  const installed = new Map(
    packages
      .filter((pkg) => pkg.installed)
      .map((pkg) => [`${pkg.language}@${pkg.language_version}`, true])
  );

  for (const pkg of REQUIRED_PACKAGES) {
    const key = `${pkg.language}@${pkg.version}`;
    if (installed.has(key)) {
      console.log(`Already installed: ${pkg.label} -> ${pkg.language}-${pkg.version}`);
      continue;
    }

    console.log(`Installing: ${pkg.label} -> ${pkg.language}-${pkg.version}`);
    await request("/packages", {
      method: "POST",
      body: JSON.stringify({
        language: pkg.language,
        version: pkg.version,
      }),
    });
    console.log(`Installed: ${pkg.label} -> ${pkg.language}-${pkg.version}`);
  }

  const runtimes = await request("/runtimes");
  console.log("Active runtimes:");
  for (const runtime of runtimes) {
    console.log(`- ${runtime.language} ${runtime.version}`);
  }
}

main().catch((error) => {
  console.error("Failed to install Piston runtimes:", error.message);
  process.exitCode = 1;
});
