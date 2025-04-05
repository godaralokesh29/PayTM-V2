import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Dashboard = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signin");
                return;
            }

            const response = await axios.get(`${BACKEND_URL}/account/balance`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
            if (error.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/signin");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <Balance value={balance} onBalanceUpdate={fetchBalance} />
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <Users onTransferSuccess={fetchBalance} />
                </div>
            </div>
        </div>
    );
};