import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [minThresholdLength, setMinThresholdLength] = useState(25);
    const [longPercentage, setLongPercentage] = useState(null);
    const [brokenPercentage, setBrokenPercentage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleThresholdChange = (e) => {
        setMinThresholdLength(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('min_threshold_length', minThresholdLength);

        setLoading(true); // Set loading to true when the request starts

        try {
            const response = await axios.post('https://elegant-tangent-422918-m1.de.r.appspot.com/process_image/', formData);

            setLongPercentage(response.data.long_percentage);
            setBrokenPercentage(response.data.broken_percentage);
            setProcessedImage(`data:image/png;base64,${response.data.image}`);
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };

    return (
        <div className="App">
            <h1>Guru's Grain Analyzer</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} required />
                <input
                    type="number"
                    value={minThresholdLength}
                    onChange={handleThresholdChange}
                    min="1"
                    required
                />
                <button type="submit">Upload and Analyze</button>
            </form>
            {loading && <p>Loading...</p>}
            {longPercentage !== null && (
                <div>
                    <p style={{fontWeight:800}}>Long Grains: {longPercentage.toFixed(2)}%</p>
                    <p style={{fontWeight:800}}>Broken Grains: {brokenPercentage.toFixed(2)}%</p>
                    {processedImage && <img src={processedImage} alt="Processed" />}
                </div>
            )}
        </div>
    );
}

export default App;
