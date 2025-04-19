import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/CreateRoom.css';
import { useEmail } from "../context/EmailContext";

const CreateRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const navigate = useNavigate();
    const { emailInContext, setEmailInContext } = useEmail();

    function create() {
        console.log("emailincontext: ", emailInContext);

        if (roomName.trim() && inputEmail.trim()) {
            navigate(`/room/${roomName}`);
        } else {
            alert("Please enter valid details!");
        }
    }

    useEffect(() => {
        let myEmail = window.localStorage.getItem("myEmail");
        window.localStorage.clear();
        window.localStorage.setItem("myEmail", myEmail);
        console.log("Restored myEmail:", window.localStorage.getItem("myEmail"));

        setEmailInContext(myEmail);
    }, []);

    return (
        <div className="create-room-container">
            <h1 className="project-title">Rural Girls' Digital Empowerment Platform</h1>
            <p className="description">
                Welcome to a safe digital space for rural girls to connect, collaborate, and learn. This platform enables real-time communication and group discussions to foster community-driven growth and empowerment.
            </p>

            <div className="form-container">
                <input
                    className="room-input"
                    type="text"
                    placeholder="Enter Space Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <input
                    className="room-input"
                    type="text"
                    placeholder="Enter your email"
                    value={inputEmail}
                    onChange={(e) => {
                        setEmailInContext(e.target.value);
                        setInputEmail(e.target.value);
                    }}
                />
                <div className="button-group">
                    <button className="action-button" onClick={create}>Create Space</button>
                    <button className="action-button" onClick={create}>Join Space</button>
                </div>
            </div>

            <div className="features-container">
                <h2 className="features-title">Core Communication Features</h2>
                <ul className="features-list">
                    <li>📹 Real-time video collaboration</li>
                    <li>💬 Group chat for interactive discussions</li>
                    <li>👥 Safe and private virtual spaces for peer interaction</li>
                </ul>
            </div>
        </div>
    );
};

export default CreateRoom;
