import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
 
export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (!firstName.trim()) {
            showAlert("First name is required", "error");
            return false;
        }
        if (!lastName.trim()) {
            showAlert("Last name is required", "error");
            return false;
        }
        if (!username.trim()) {
            showAlert("Email is required", "error");
            return false;
        }
        if (!password.trim()) {
            showAlert("Password is required", "error");
            return false;
        }
        if (password.length < 6) {
            showAlert("Password must be at least 6 characters", "error");
            return false;
        }
        return true;
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

    const handleSignup = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError("");
        
        try {
            const response = await axios.post(`${BACKEND_URL}/user/signup`, {
                username,
                firstName,
                lastName,
                password
            });
            
            localStorage.setItem("token", response.data.token);
            showAlert("Account created successfully!", "success");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            console.error("Signup error:", error);
            const errorMessage = error.response?.data?.message || "Error during signup. Please try again.";
            showAlert(errorMessage, "error");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <Heading label={"Create Account"} />
                    <SubHeading label={"Start your financial journey with us"} />
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InputBox 
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="John" 
                            label={"First Name"}
                            type="text"
                            required
                        />
                        <InputBox 
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Doe" 
                            label={"Last Name"}
                            type="text"
                            required
                        />
                    </div>
                    <InputBox 
                        onChange={e => setUsername(e.target.value)}
                        placeholder="johndoe@example.com" 
                        label={"Email"}
                        type="email"
                        required
                    />
                    <InputBox 
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        label={"Password"}
                        type="password"
                        required
                    />
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>

                <div className="space-y-4">
                    <Button 
                        onClick={handleSignup}
                        label={loading ? "Creating Account..." : "Create Account"}
                        disabled={loading}
                    />
                    <BottomWarning 
                        label={"Already have an account?"} 
                        buttonText={"Sign in"} 
                        to={"/signin"} 
                    />
                </div>
            </div>
        </div>
    );
};