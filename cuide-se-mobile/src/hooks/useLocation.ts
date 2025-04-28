import { useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    // Placeholder logic for getting location
    setLocation({ latitude: 0, longitude: 0 });
  };

  return { location, getLocation };
};

export default useLocation;