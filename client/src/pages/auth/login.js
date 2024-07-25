import React, { useContext } from 'react';

import LoginForm from '../../components/user/LoginForm';
import Navigation from '@/components/common/navigation';
import UserContext from '../../context/userContext';
import Newnav from '@/components/common/newnav';

export default function Login() {
  return (
    <div>
            {/* <Navigation /> */}
            <Newnav />

      <LoginForm />
    </div>
  );
}
