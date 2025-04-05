import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/user/bulk?filter=${filter}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setUsers(response.data.user);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [filter]);

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <div className="relative">
                <input 
                    onChange={(e) => setFilter(e.target.value)}
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             transition-all duration-200 placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div className="space-y-4">
                {users.map(user => <User key={user._id} user={user} />)}
            </div>
        </div>
    );
};

function User({user}) {
    const navigate = useNavigate();
    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
                <div className={`${randomColor} h-12 w-12 rounded-full flex items-center justify-center text-white text-xl font-semibold`}>
                    {user.firstName[0].toUpperCase()}
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-500">{user.username}</p>
                </div>
            </div>
            <button
                onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
                         bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
                Send Money
            </button>
        </div>
    );
}