import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from 'react';
import { BACKEND_URL } from "../config";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(null);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/account/balance`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setCurrentBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
            if (error.response?.status === 403) {
                navigate("/signin");
            }
        }
    };

    const handleTransfer = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            showAlert("Please enter a valid amount", "error");
            return;
        }

        const transferAmount = parseFloat(amount);
        if (transferAmount > currentBalance) {
            showAlert("Insufficient balance for this transfer", "error");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${BACKEND_URL}/account/transfer`, {
                to: id,
                amount: transferAmount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            showAlert(`Successfully transferred ₹${amount} to ${name}`, "success");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            console.error("Transfer error:", error);
            showAlert(error.response?.data?.message || "Transfer failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, type) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transform transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        alertDiv.style.zIndex = '1000';
        alertDiv.textContent = message;

        document.body.appendChild(alertDiv);

        // Animate in
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 300);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Send Money</h2>
                    <p className="text-gray-500">Transfer money to {name}</p>
                    {currentBalance !== null && (
                        <p className="text-sm text-gray-600">
                            Available Balance: ₹{currentBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                        {name[0].toUpperCase()}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Amount (in ₹)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!value || value >= 0) {
                                        setAmount(value);
                                    }
                                }}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                         transition-all duration-200 text-gray-900"
                                max={currentBalance}
                            />
                        </div>
                        {parseFloat(amount) > currentBalance && (
                            <p className="text-red-500 text-sm">Amount exceeds available balance</p>
                        )}
                    </div>

                    <button
                        onClick={handleTransfer}
                        disabled={loading || !amount || parseFloat(amount) > currentBalance}
                        className="w-full px-6 py-3 text-white text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg 
                                 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                                 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span className="ml-2">Processing...</span>
                            </div>
                        ) : (
                            "Initiate Transfer"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};