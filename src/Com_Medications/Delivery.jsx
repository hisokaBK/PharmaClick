import React, { useState, useEffect } from 'react';
import '../css/TrackingPage.css';
import Footer from '../components/Footer';
import MoroccoBranchMap from './MoroccoBranchMap';

const TrackingPage = () => {
  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        setDelivery({
          orderId: "RX-789456",
          status: "out_for_delivery",
          steps: [
            { id: 1, name: "Order Confirmed", completed: true, time: "2023-05-20T10:00" },
            { id: 2, name: "Preparing", completed: true, time: "2023-05-20T11:30" },
            { id: 3, name: "Out for Delivery", completed: true, time: "2023-05-20T14:15" },
            { id: 4, name: "Delivered", completed: false },
          ],
          courier: { name: "John D.", phone: "+1 (555) 123-4567" },
          eta: "2023-05-20T16:30",
        });
        setIsLoading(false);
      }, 1000);
    };
    fetchData();
  }, []);

  if (isLoading) return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p>Tracking your medication...</p>
    </div>
  );

  return (
    <div>
    <div className="tracking-container">
      <header className="tracking-header">
        <div className="header-content">
          
            <h1>Welcome to the Delivery Zone – HiSoKa PharmaCy</h1>
            <p >Here, you will find all the information related to our communication and contact services.</p>
        </div>
      </header>

      <div className="tracking-body">
       
        <div className="timeline-section">
          <h2 className="section-title">Delivery Progress</h2>
          <div className="timeline">
            {delivery.steps.map((step, index) => (
              <div key={step.id} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                <div className="timeline-marker">
                  {step.completed ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="timeline-content">
                  <h3>{step.name}</h3>
                  {step.time && (
                    <p className="timeline-time">
                       .
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
             
    

   
        <div className="courier-section">
          <h2 className="section-title">Your Delivery Specialist</h2>
          <div className="courier67">
            <div className="courier-video">
              <video
                src="/images_marque/hello1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="courier-video-element"
              />
            </div>
            <div className="courier-details">
              <h3>Delivery Contact</h3>
              <p className="courier-contact">{delivery.courier.phone}</p>
              <button className="contact-button">
                <svg viewBox="0 0 24 24" className="phone-icon">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                Contact Courier
              </button>
            </div>
          </div>
        </div>
           
           <div className="map-section">
          <div className="map-visual">
            {/* Replace the placeholder image with a local geographic map while keeping the existing delivery summary below it. */}
            <MoroccoBranchMap />
            <div className="map-overlay">
              <div className="eta-bubble">
                <span>Estimated Delivery</span>
                <p>Local in Oued Zem </p>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
        <Footer/>
    </div>
  );
};

export default TrackingPage;