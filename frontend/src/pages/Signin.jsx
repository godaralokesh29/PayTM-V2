import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <Heading label={"Welcome Back!"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                </div>
                
                <div className="space-y-4">
                    <InputBox 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe@example.com" 
                        label={"Email"} 
                        type="email"
                    />
                    <InputBox 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        label={"Password"} 
                        type="password"
                    />
                </div>

                <div className="space-y-4">
                    <Button 
                        onClick={async () => {
                            try {
                                const response = await axios.post(`${BACKEND_URL}/user/signin`, {
                                    username,
                                    password
                                });
                                localStorage.setItem("token", response.data.token);
                                navigate("/dashboard");
                            } catch (error) {
                                console.error("Signin error:", error);
                                alert(error.response?.data?.message || "Error during signin. Please try again.");
                            }
                        }} 
                        label={"Sign in"} 
                    />
                    <BottomWarning 
                        label={"Don't have an account?"} 
                        buttonText={"Sign up"} 
                        to={"/signup"} 
                    />
                </div>
            </div>
        </div>
    )
}