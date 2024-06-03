import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify/${token}`, {
          method: 'GET',
        });

        if (response.ok) {
          navigate('/signin?verified=true');
        } else {
          console.error('Verification failed');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <h2>Verifying your email...</h2>
    </div>
  );
};

export default Verify;
