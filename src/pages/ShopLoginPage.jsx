import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopLogin from "../components/Shop/ShopLogin.jsx";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const isSeller = useSelector((state) => state.seller?.isSeller ?? false);
  const isLoading = useSelector((state) => state.seller?.isLoading ?? false);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/dashboard`);
    }
  }, [isLoading, isSeller, navigate])
  return (
    <div>
        <ShopLogin />
    </div>
  )
}

export default ShopLoginPage