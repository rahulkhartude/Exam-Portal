import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API from "../../services/api";

function AdminResults() {
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Try the common fallback first to avoid an initial 404
        let res;
        try {
          res = await API.get("/result/all");
        } catch (err) {
          // fallback to /admin/results if available
          res = await API.get("/admin/results");
        }
        setResults(res.data || []);
      } catch (err) {
        console.error("AdminResults fetch error:", err);
        const status = err?.response?.status;
        const bodyMsg = err?.response?.data?.message || err?.response?.data || err?.message;
        const msg = `${bodyMsg || "Could not load results. Please make sure the backend result API is available."}${status ? ` (status: ${status})` : ""}`;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("AdminUsers fetch error:", err);
        setUserError(err?.response?.data?.message || err?.message || "Could not load users.");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchResults();
    fetchUsers();
  }, []);

  const handleToggleBypass = async (userId, currentValue) => {
    try {
      const res = await API.put(`/admin/users/${userId}/retake-bypass`, {
        retakeBypass: !currentValue,
      });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, retakeBypass: res.data.retakeBypass } : u)));
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Could not update bypass setting.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Student Results</h1>
            <p className="text-gray-600">View exam results and scores for completed students.</p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Retake Bypass Management</h2>
              <p className="text-sm text-gray-600">Grant individual students explicit bypass access so they can retake without cooldown.</p>
            </div>
            {usersLoading && <span className="text-sm text-gray-500">Loading users...</span>}
          </div>
          {userError ? (
            <div className="text-sm text-red-600">{userError}</div>
          ) : (
            <div className="grid gap-4">
              {users.map((user) => (
                <div key={user._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded border border-gray-200">
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-sm text-gray-500">Role: {user.role}</div>
                  </div>
                  <button
                    onClick={() => handleToggleBypass(user._id, user.retakeBypass)}
                    className={`px-4 py-2 rounded text-white ${user.retakeBypass ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}`}
                  >
                    {user.retakeBypass ? "Bypass Enabled" : "Enable Bypass"}
                  </button>
                </div>
              ))}
              {users.length === 0 && !usersLoading && (
                <div className="text-sm text-gray-500">No users found.</div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded shadow text-center">Loading results...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-6 rounded shadow">
            <div>{error}</div>
            <div className="mt-3">
              <button onClick={() => { setLoading(true); setError(""); (async () => { try { const res = await API.get('/result/all'); setResults(res.data || []); } catch (e) { console.error(e); setError(e?.response?.data?.message || e?.message); } finally { setLoading(false); } })(); }} className="bg-blue-500 text-white px-3 py-1 rounded">Retry</button>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center">No results available yet.</div>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answers</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id || result.id || `${result.user?._id}-${result.score}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.user?.name || result.name || "Unknown"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.user?.email || result.email || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{result.score ?? "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(result.createdAt || result.attemptedAt || Date.now()).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.answers ? result.answers.length : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminResults;
