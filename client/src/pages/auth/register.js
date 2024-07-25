import React from 'react';
import RegisterForm from '../../components/user/RegistrationForm';  // Import the RegisterForm component
import Navigation from '@/components/common/navigation';
import Newnav from '@/components/common/newnav';

export default function Register() {

  return (
    <div>
      {/* <Navigation/> */}
      <Newnav />
      <h1 className='text-white'>Register</h1>
      <RegisterForm/>
    </div>
  );
}
