import { useState } from "react";
import axios from "axios";

function GenerateLogo() {
  const [prompt, setPrompt] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateLogo = async () => {
    if (!prompt) {
      setError("Please enter a prompt for logo generation.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/generate-logo", {
        prompt,
      });

      setLogoUrl(response.data.image_url);
    } catch (err) {
      setError("Failed to generate logo. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Generate AI Logo</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <input
          type="text"
          className="border p-2 mb-4 w-full"
          placeholder="Enter logo idea (e.g., 'minimalist tech logo')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generateLogo}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Logo"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {logoUrl && (
          <div className="mt-6">
            <img src={logoUrl} alt="Generated Logo" className="w-full h-auto" />
            <a href={logoUrl} download className="text-blue-600 mt-2 block">
              Download Logo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateLogo;
